import Pet from "../models/Pet.js";

export const addPet = async (req, res) => {
  try {
    const { name, age, breed, species, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image upload failed!" });
    }

    const image = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const pet = new Pet({
      name,
      species,
      breed,
      age,
      description,
      owner: req.user.id,
      image,
    });

    await pet.save();
    res.status(201).json({ message: "Pet submitted for approval", pet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

export const getPetsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from token
    const pets = await Pet.find({ owner: userId });

    if (!pets.length) {
      return res.status(404).json({ message: "No pets found for this user." });
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching user pets:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

export const getAllPets = async (req, res) => {
  try {
    const { type } = req.query;

    const allPets = await Pet.find({ status: "approved" });

    res.json(allPets);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const searchPets = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Please provide a pet type." });
    }

    // Case-insensitive search
    const pets = await Pet.find({
      species: { $regex: type, $options: "i" },
    }).populate("owner", "name email");

    if (pets.length === 0) {
      return res
        .status(404)
        .json({ message: "No pets found matching this category." });
    }

    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!pet) {
      return res.status(404).json({ message: "Pet not found!" });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Server Error! " + error.message });
  }
};
