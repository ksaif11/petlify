import Pet from "../models/Pet.js";
import cloudinary from "../config/cloudinary.js";

export const submitPet = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

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

    // Use regex search (text index requires special query syntax and may not always be available)
    // For better performance, ensure text index is created in the database
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

    // Run count and find queries in parallel for better performance
    const [total, pets] = await Promise.all([
      Pet.countDocuments(query),
      Pet.find(query)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

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
    // Ensure user is authenticated and is admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    // Run count and find queries in parallel for better performance
    const [total, pets] = await Promise.all([
      Pet.countDocuments({ status: "pending" }),
      Pet.find({ status: "pending" })
        .populate('submittedBy', 'name email -_id') // Select only needed fields, exclude _id
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

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
    // Ensure user is authenticated and is admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { petId, status } = req.body;
    
    if (!petId || !status) {
      return res.status(400).json({ message: "Pet ID and status are required" });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected', 'adopted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    
    // Validate petId format
    if (!petId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }
    
    const pet = await Pet.findByIdAndUpdate(petId, { status }, { new: true })
      .select('-__v')
      .lean();
    
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
