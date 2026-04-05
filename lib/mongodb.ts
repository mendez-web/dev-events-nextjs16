import "server-only";

import mongoose, { type Mongoose } from "mongoose";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const MONGODB_URI = mongodbUri;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var __mongooseCache: MongooseCache | undefined;
}

// Reuse the same cache across hot reloads in development.
const cached = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.__mongooseCache = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection immediately when it is already open.
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Store the in-flight promise so concurrent requests share one connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
