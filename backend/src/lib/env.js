import dotenv from "dotenv";
dotenv.config({ quiet: true }); // use {quiet:true}
// to prevent the following warning displaying the number of env variables in console : ◇ injected env (3) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
};
