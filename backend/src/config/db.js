import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in environment variables");
      process.exit(1);
    }
    // Optimize MongoDB connection settings for better performance
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
