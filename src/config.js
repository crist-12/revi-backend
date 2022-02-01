import { config as dotenv } from "dotenv";
dotenv();

export const configrvfleet = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "desarrollo",
  database: process.env.DB_DATABASE || "rvfleet",
};


export const configrvsecurity = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "desarrollo",
  database: process.env.DB_DATABASE || "rvseguridad",
};
