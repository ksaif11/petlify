import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
