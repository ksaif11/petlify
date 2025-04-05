import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import petRouter from "./routes/petRoutes.js";
import adoptionRouter from "./routes/adoptionRouter.js";

dotenv.config();
ConnectDB();

const app = express();
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRouter);
app.use("/api/pets", petRouter);
app.use("/api/adoptions", adoptionRouter);

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
