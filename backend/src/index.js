import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import ConnectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import petRouter from "./routes/petRoutes.js";
import adoptionRouter from "./routes/adoptionRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Enable compression middleware for faster responses
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: true, // Allow requests from everywhere
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Optimize JSON parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api/auth", authRouter);
app.use("/api/pets", petRouter);
app.use("/api/adoptions", adoptionRouter);

app.get("/", (req, res) => {
  res.json({ message: "PetLify API is running" });
});


ConnectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
});

