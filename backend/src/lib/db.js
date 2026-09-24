import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // using google's dns because my airtel ISP dns was refusing to perform DNS Lookup for SRV records to find the cluster address
import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB", conn.connection.host);
  } catch (error) {
    console.log("❌ Error connecting to MongoDB ", error);
    process.exit(1); //1 = failure , 0 = success
  }
};
