import mysql from "mysql2/promise";
import { configrvfleet, configrvsecurity } from "./config";

export const connectrvfleet = async () => {
  return await mysql.createConnection(configrvfleet);
};

export const connectrvseguridad = async () => {
  return await mysql.createConnection(configrvsecurity);
};
