import mongoose from "mongoose";

let memoryServer;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`MongoDB connected: ${uri}`);
    return;
  } catch (err) {
    console.warn(`Could not reach MongoDB at ${uri} (${err.message}).`);
    console.warn("Falling back to an in-memory MongoDB instance for local development.");
  }

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri("sahaya");
  await mongoose.connect(memUri);
  console.log(`MongoDB (in-memory) connected: ${memUri}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
