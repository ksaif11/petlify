import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import petRouter from "./routes/petRoutes.js";
import adoptionRouter from "./routes/adoptionRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/pets", petRouter);
app.use("/api/adoptions", adoptionRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
});
