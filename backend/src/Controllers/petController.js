import Pet from "../models/Pet.js";
import cloudinary from "../config/cloudinary.js";

export const submitPet = async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      description,
      gender,
      size,
      color,
      weight,
      isVaccinated,
      isNeutered,
      isHouseTrained,
      healthIssues,
      specialNeeds,
      temperament,
      goodWith,
      energyLevel,
      ownerMobile,
      ownerAddress,
      ownerCity,
      ownerState,
      ownerZipCode,
      reasonForRehoming,
      rehomingUrgency,
    } = req.body;

    if (!name || !species || !breed || !age || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const images = req.files ? req.files.map(file => file.path || file.url) : [];

    let goodWithArray = [];
    if (goodWith) {
      try {
        goodWithArray = typeof goodWith === 'string' ? JSON.parse(goodWith) : goodWith;
        if (!Array.isArray(goodWithArray)) {
          goodWithArray = [];
        }
      } catch (error) {
        goodWithArray = [];
      }
    }

    const pet = new Pet({
      name,
      species,
      breed,
      age: parseFloat(age),
      description,
      gender,
      size,
      color,
      weight: parseFloat(weight),
      isVaccinated: isVaccinated === 'Yes' || isVaccinated === true,
      isNeutered: isNeutered === 'Yes' || isNeutered === true,
      isHouseTrained: isHouseTrained === 'Yes' || isHouseTrained === true,
      healthIssues,
      specialNeeds,
      temperament,
      goodWith: goodWithArray,
      energyLevel,
      ownerMobile,
      ownerAddress,
      ownerCity,
      ownerState,
      ownerZipCode,
      reasonForRehoming,
      rehomingUrgency,
      images,
      status: "pending",
      submittedBy: req.user.id,
    });

    await pet.save();
    res.status(201).json({ message: "Pet submitted successfully", pet });
  } catch (error) {
    res.status(500).json({ message: "Error submitting pet", error: error.message });
  }
};

export const getAllPets = async (req, res) => {
  try {
    const { search, species, age, status } = req.query;
    let query = { status: "approved" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (species) {
      query.species = { $regex: species, $options: 'i' };
    }

    if (age) {
      const ageRanges = {
        young: { $lte: 2 },
        adult: { $gt: 2, $lte: 7 },
        senior: { $gt: 7 }
      };
      if (ageRanges[age]) {
        query.age = ageRanges[age];
      }
    }

    if (status) {
      query.status = status;
    }

    const pets = await Pet.find(query).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pets", error: error.message });
  }
};

export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate petId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }
    
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    res.json(pet);
  } catch (error) {
    console.error('Error in getPetById:', error);
    res.status(500).json({ message: "Error fetching pet", error: error.message });
  }
};



export const getPendingPetSubmissions = async (req, res) => {
  try {
    const pets = await Pet.find({ status: "pending" }).populate('submittedBy', 'name email');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending pets", error: error.message });
  }
};

export const updatePetStatus = async (req, res) => {
  try {
    const { petId, status } = req.body;
    
    if (!petId || !status) {
      return res.status(400).json({ message: "Pet ID and status are required" });
    }
    
    const pet = await Pet.findByIdAndUpdate(petId, { status }, { new: true });
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Error updating pet status", error: error.message });
  }
};

export const getFeaturedPets = async (req, res) => {
  try {
    const pets = await Pet.find({ status: "approved" }).sort({ createdAt: -1 }).limit(3);
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured pets", error: error.message });
  }
};
