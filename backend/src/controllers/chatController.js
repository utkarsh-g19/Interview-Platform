import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = chatClient.createToken(req.user.clerkId); // using clerk Id instead of mongodb _id because we have stored clerk id within stream's user
    res.status(200).json({
      //res.json() sets the response body as JSON and sends it
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
