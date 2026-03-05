import "dotenv/config";
import { defineConfig } from "drizzle-kit";



export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_gPJSv8QbEsX0@ep-lingering-haze-aem5iym9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  }, 
});
