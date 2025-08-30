import AdoptionRequest from "../models/AdoptionRequest.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const submitAdoptionRequest = async (req, res) => {
  try {
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

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const existingRequest = await AdoptionRequest.findOne({
      pet: petId,
      user: req.user.id
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You have already submitted a request for this pet" });
    }

    const adoptionRequest = new AdoptionRequest({
      pet: petId,
      user: req.user.id,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge: parseInt(applicantAge),
      applicantOccupation,
      applicantAddress,
      applicantCity,
      applicantState,
      applicantZipCode,
      livingSituation,
      housingType,
      landlordApproval: landlordApproval === 'yes',
      landlordContact,
      householdMembers: parseInt(householdMembers),
      childrenAges,
      otherPets: otherPets === 'yes',
      otherPetsDetails,
      petExperience,
      petAloneHours: parseInt(petAloneHours),
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
    const requests = await AdoptionRequest.find({ user: req.user.id })
      .populate('pet')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message });
  }
};

export const getAllAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate('pet')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message });
  }
};

export const getPendingAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ status: "pending" })
      .populate('pet')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error: error.message });
  }
};

export const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('pet').populate('user', 'name email');
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error: error.message });
  }
};
