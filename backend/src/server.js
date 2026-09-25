import express from "express";
import { ENV } from "./lib/env.js";
import path from "path"; // study why this is even required
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { inngest } from "./lib/inngest.js";

const app = express();
const __dirname = path.resolve(); // what does path.resolve() do

//middlewares
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); //credentials true means allowing browser to send cookies on req
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "success from api! Good health" });
});

//make ready for production
if (ENV.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); //converting the frontend app into static asset ( study whats a static asset )

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // run this everytime when any undefined route is run
  });
}

const startServer = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in env variables!");
    }
    await connectDB();
    app.listen(ENV.PORT, () => console.log("server is running on ", ENV.PORT));
  } catch (error) {
    console.log("Error starting the server");
  }
};
startServer();
