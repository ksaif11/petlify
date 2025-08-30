import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return conn;
  } catch (error) {
    process.exit(1);
  }
};

export default ConnectDB;
