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
    const { search, species, age, status, page = 1, limit = 20 } = req.query;
    let query = { status: status || "approved" };

    // Use text search if available, otherwise use regex (slower but works)
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

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination metadata
    const total = await Pet.countDocuments(query);

    // Use lean() for better performance and select only needed fields
    const pets = await Pet.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      pets,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
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
    
    // Use lean() for better performance
    const pet = await Pet.findById(id).select('-__v').lean();
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
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    const total = await Pet.countDocuments({ status: "pending" });

    const pets = await Pet.find({ status: "pending" })
      .populate('submittedBy', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      pets,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
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
    
    let pet = await Pet.findByIdAndUpdate(petId, { status }, { new: true }).select('-__v');
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    // Convert to plain object for better performance
    pet = pet.toObject();
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Error updating pet status", error: error.message });
  }
};

export const getFeaturedPets = async (req, res) => {
  try {
    // Use lean() and select() for better performance
    const pets = await Pet.find({ status: "approved" })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured pets", error: error.message });
  }
};
