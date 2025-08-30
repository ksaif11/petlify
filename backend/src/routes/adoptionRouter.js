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

router.post("/submit", authenticate, submitAdoptionRequest);
router.get("/user", authenticate, getUserAdoptionRequests);

router.get("/admin/all", authenticate, requireOrganization, getAllAdoptionRequests);
router.get("/admin/pending", authenticate, requireOrganization, getPendingAdoptionRequests);
router.put("/admin/:id/status", authenticate, requireOrganization, updateAdoptionRequestStatus);

export default router;