import express from "express";
import {
  submitPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  getPendingPetSubmissions,
  updatePetStatus,
  getFeaturedPets,
} from "../Controllers/petController.js";
import { authenticate, requireOrganization } from "../middleware/authMiddleware.js";
import { uploadMultiple } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/submit", authenticate, uploadMultiple, submitPet);
router.get("/", getAllPets);
router.get("/featured", getFeaturedPets);
router.get("/:id", getPetById);
router.put("/:id", authenticate, updatePet);
router.delete("/:id", authenticate, deletePet);

router.get("/admin/pending", authenticate, requireOrganization, getPendingPetSubmissions);
router.put("/admin/:id/status", authenticate, requireOrganization, updatePetStatus);

export default router;


