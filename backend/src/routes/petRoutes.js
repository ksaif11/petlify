import express from "express";
import {
  submitPet,
  getAllPets,
  getPetById,
  getPendingPetSubmissions,
  updatePetStatus,
  getFeaturedPets,
} from "../Controllers/petController.js";
import { authenticate, requireOrganization } from "../middleware/authMiddleware.js";
import { uploadMultiple } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllPets);
router.get("/featured", getFeaturedPets);
router.get("/pending/submissions", authenticate, requireOrganization, getPendingPetSubmissions);
router.post("/", authenticate, uploadMultiple.array('images', 5), submitPet);
router.put("/update-status", authenticate, requireOrganization, updatePetStatus);
router.get("/:id", getPetById);

export default router;