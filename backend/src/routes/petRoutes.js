import express from "express";
import { addPet, getAllPets, getPetById, getPetsByUser, searchPets } from "../Controllers/petController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const petRouter = express.Router();

petRouter.post("/", authenticate, upload.single("image"), addPet);
petRouter.get("/search", searchPets); // New route for filtering
petRouter.get("/all", getAllPets);
petRouter.get("/:id", getPetById);
petRouter.get("/my-pets", authenticate, getPetsByUser);


export default petRouter;


