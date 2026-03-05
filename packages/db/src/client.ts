import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import dotenv from "dotenv";
import path from "path";



import * as schema from "./schema";




dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const db = drizzle(pool, { schema });