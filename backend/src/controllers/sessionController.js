import Session from "../models/Session.js";
import { streamClient, chatClient } from "../lib/stream.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id; // for mongodb
    const clerkId = req.user.clerkId; // for stream
    if (!problem || !difficulty) {
      // why check whether they exist when we already received it above from frontend -> because someone can simply make a direct request to backend without using frontend
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" }); // json already returns a value , the above return is mainly used to stop the function ,json's return doesn't stop the function
    }
    //generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    //create session in db
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });
    //connect stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });
    //chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });
    await channel.create();
    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getActiveSessions(_, res) {
  //when we dont need an argument , we write _ instead
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImg email clerkId")
      .sort({ createdAt: -1 }) //descending order sorting with respect to the time at which session was created
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    //get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller : ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getSessionById(req, res) {
  try {
    const { id } = req.params; // we specifically use "id" instead of any other variable as we have /:id as our route
    const session = await Session.findById(id)
      .populate("host", "name email clerkId profileImg")
      .populate("participant", "name email clerkId profileImg");
    if (!session) return res.status(404).json({ message: "Session not found" }); // when invalid id is received in params
    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId; // why we need clerk id? because we will join the session and the session's chat/video channel which is provided by streamio to which we are connected using clerk , not mongodb
    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" }); // when invalid session id is received
    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Host cannnot join their own session!" });
    }

    // if session is already full , at max only 2 members within a session -> owner , 1 participant
    if (session.participant)
      return res.status(404).json({ message: "Session is full" });
    // if session is not full
    session.participant = userId;
    await session.save();

    //connecting to chat
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);
    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session)
      return res.status(404).json({ message: "Session not found!" });

    //check if user is host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only host can end the session" });
    }

    //check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed!" });
    }

    //delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });
    //delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    //end session -> perform resource cleanup ( deleting stream chats/video etc ) before ending the session to ensure smoother process , for eg. if deletion of video call or stream chat fails the session is still marked completed without proper cleanup of resources
    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller : ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
