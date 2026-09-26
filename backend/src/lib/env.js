import dotenv from "dotenv";
dotenv.config({ quiet: true }); // use {quiet:true}
// to prevent the following warning displaying the number of env variables in console : ◇ injected env (3) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};
