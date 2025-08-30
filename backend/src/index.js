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
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://petlify.onrender.com',
    'https://petlify-frontend.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/pets", petRouter);
app.use("/api/adoptions", adoptionRouter);

app.get("/", (req, res) => {
  res.json({ message: "PetLify API is running" });
});

ConnectDB().then(() => {
  app.listen(PORT, () => {
  });
});
