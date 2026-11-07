import { MongoClient, Db } from "mongodb";
import { setServers } from "node:dns";
import dotenv from "dotenv";

dotenv.config();

// Use reliable public DNS resolvers for MongoDB SRV lookup.
setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME || "kindora";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

const client = new MongoClient(MONGODB_URI);

let database: Db;

export const connectDB = async (): Promise<Db> => {
  if (database) return database;

  await client.connect();

  database = client.db(DATABASE_NAME);

  await database.command({ ping: 1 });

  console.log("MongoDB connected successfully!");
  console.log(`Database: ${DATABASE_NAME}`);

  return database;
};

export const getDB = (): Db => {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
};

export default client;
