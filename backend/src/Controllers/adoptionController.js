import AdoptionRequest from "../models/AdoptionRequest.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const submitAdoptionRequest = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const {
      petId,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge,
      applicantOccupation,
      applicantAddress,
      applicantCity,
      applicantState,
      applicantZipCode,
      livingSituation,
      housingType,
      landlordApproval,
      landlordContact,
      householdMembers,
      childrenAges,
      otherPets,
      otherPetsDetails,
      petExperience,
      petAloneHours,
      petExercisePlan,
      petTrainingPlan,
      financialCommitment,
      timeCommitment,
      adoptionMotivation,
      petExpectations,
      additionalInfo
    } = req.body;

    if (!petId || !applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate petId format
    if (!petId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid pet ID format" });
    }

    const pet = await Pet.findById(petId).lean();
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const existingRequest = await AdoptionRequest.findOne({
      pet: petId,
      user: req.user.id
    }).lean();

    if (existingRequest) {
      return res.status(400).json({ message: "You have already submitted a request for this pet" });
    }

    const adoptionRequest = new AdoptionRequest({
      pet: petId,
      user: req.user.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge: parseInt(applicantAge) || 18,
      applicantOccupation,
      applicantAddress,
      applicantCity,
      applicantState,
      applicantZipCode,
      livingSituation,
      housingType,
      landlordApproval: landlordApproval === 'yes' || landlordApproval === true,
      landlordContact,
      householdMembers: parseInt(householdMembers) || 1,
      childrenAges,
      otherPets: otherPets === 'yes' || otherPets === true,
      otherPetsDetails,
      petExperience,
      petAloneHours: parseInt(petAloneHours) || 0,
      petExercisePlan,
      petTrainingPlan,
      financialCommitment,
      timeCommitment,
      adoptionMotivation,
      petExpectations,
      additionalInfo,
      status: "pending"
    });

    await adoptionRequest.save();
    res.status(201).json({ message: "Adoption request submitted successfully", adoptionRequest });
  } catch (error) {
    res.status(500).json({ message: "Error submitting adoption request", error: error.message });
  }
};

export const getUserAdoptionRequests = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    // Run count and find queries in parallel for better performance
    const [total, requests] = await Promise.all([
      AdoptionRequest.countDocuments({ user: req.user.id }),
      AdoptionRequest.find({ user: req.user.id })
        .populate('pet', '-__v')
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.json({
      requests,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message });
  }
};

export const getAllAdoptionRequests = async (req, res) => {
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
    const [total, requests] = await Promise.all([
      AdoptionRequest.countDocuments(),
      AdoptionRequest.find()
        .populate('pet', '-__v -submittedBy') // Exclude unnecessary fields
        .populate('user', 'name email -_id') // Select only needed fields
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.json({
      requests,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message });
  }
};

export const getPendingAdoptionRequests = async (req, res) => {
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
    const [total, requests] = await Promise.all([
      AdoptionRequest.countDocuments({ status: "pending" }),
      AdoptionRequest.find({ status: "pending" })
        .populate('pet', '-__v -submittedBy') // Exclude unnecessary fields
        .populate('user', 'name email -_id') // Select only needed fields
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.json({
      requests,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error: error.message });
  }
};

export const updateAdoptionRequestStatus = async (req, res) => {
  try {
    // Ensure user is authenticated and is admin
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { requestId, status } = req.body;
    
    if (!requestId || !status) {
      return res.status(400).json({ message: "Request ID and status are required" });
    }
    
    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    
    // Validate requestId format
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid request ID format" });
    }
    
    const request = await AdoptionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    )
      .populate('pet', '-__v -submittedBy') // Exclude unnecessary fields
      .populate('user', 'name email -_id') // Select only needed fields
      .select('-__v')
      .lean();
    
    if (!request) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error: error.message });
  }
};
