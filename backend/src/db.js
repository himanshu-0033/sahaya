import mongoose from "mongoose";

let memoryServer;

// Cached on `global` so warm serverless invocations reuse the same
// connection instead of reconnecting (and exhausting Atlas's connection
// limit) on every request.
const cached = globalThis._sahayaMongoose || (globalThis._sahayaMongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log(`MongoDB connected: ${uri}`);
        return m;
      })
      .catch(async (err) => {
        // The in-memory fallback downloads a Mongo binary at runtime, which
        // doesn't work in a serverless function — only fall back locally.
        if (process.env.VERCEL) throw err;

        console.warn(`Could not reach MongoDB at ${uri} (${err.message}).`);
        console.warn("Falling back to an in-memory MongoDB instance for local development.");

        const { MongoMemoryServer } = await import("mongodb-memory-server");
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri("sahaya");
        const m = await mongoose.connect(memUri);
        console.log(`MongoDB (in-memory) connected: ${memUri}`);
        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
  cached.conn = null;
  cached.promise = null;
}
