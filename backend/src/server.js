import express from "express";
import { ENV } from "./lib/env.js";
import path from "path"; // study why this is even required

const app = express();
const __dirname = path.resolve(); // what does path.resolve() do

app.get("/", (req, res) => {
  res.status(200).json({ msg: "success from api!" });
});

//make ready for production
if (ENV.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); //converting the frontend app into static asset ( study whats a static asset )

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // run this everytime when any undefined route is run
  });
}

app.listen(ENV.PORT, () => console.log("server is running on 3000"));
