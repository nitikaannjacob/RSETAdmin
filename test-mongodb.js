import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  console.log("✅ MongoDB connection successful!");
} catch (error) {
  console.log("❌ MongoDB connection failed:");
  console.log(error);
} finally {
  await client.close();
}