"use server";

import mongoose from "mongoose";

export async function connectMongoDb() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
}
