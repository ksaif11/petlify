import express from "express";
import { submitAdoptionRequest, getUserAdoptionRequests, updateAdoptionRequestStatus } from "../Controllers/adoptionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const adoptionRouter = express.Router();

adoptionRouter.post("/", authenticate, submitAdoptionRequest);
adoptionRouter.get("/my-requests", authenticate, getUserAdoptionRequests);
adoptionRouter.put("/update-status", authenticate, updateAdoptionRequestStatus);

export default adoptionRouter;