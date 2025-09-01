import express from "express";
import {
  submitAdoptionRequest,
  getUserAdoptionRequests,
  getAllAdoptionRequests,
  getPendingAdoptionRequests,
  updateAdoptionRequestStatus,
} from "../Controllers/adoptionController.js";
import { authenticate, requireOrganization } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, submitAdoptionRequest);
router.get("/my-requests", authenticate, getUserAdoptionRequests);

router.get("/all", authenticate, requireOrganization, getAllAdoptionRequests);
router.get("/pending", authenticate, requireOrganization, getPendingAdoptionRequests);
router.put("/update-status", authenticate, requireOrganization, updateAdoptionRequestStatus);

export default router;