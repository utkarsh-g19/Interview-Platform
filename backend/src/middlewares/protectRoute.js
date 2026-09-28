import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  getAuth({ signInUrl: "/sign-in" }),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({ msg: "Unauthorized - invalid token" });
      }
      //find user in db by clerk id
      const user = User.findOne({ clerkId });
      if (!user) {
        return res.status(401).json({ msg: "User not found" });
      }
      //attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // the 2nd middleware is used to reduce a lot of work whenever we need use details from mongodb , we know that we may have more info stored about the user in our databse ( mongodb ) than clerk which is mainly used for auth , hence we might need to access user from Mongodb again and again to use that data and everytime we require user from mongodb we have to find the user using clerk id again and again , so this 2nd middleware finds that user using clerk id from mongodb and saves that user in req object , reducing the work to be done in whenever we need user from mongodb , we just call req.user
];
