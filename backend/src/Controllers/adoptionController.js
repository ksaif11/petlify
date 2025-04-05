import AdoptionRequest from "../models/AdoptionRequest.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

export const submitAdoptionRequest = async (req, res) => {
  const { petId } = req.body;

  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const existingRequest = await AdoptionRequest.findOne({
      pet: petId,
      user: req.user.id,
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already requested adoption for this pet." });
    }

    const request = new AdoptionRequest({ pet: petId, user: req.user.id });
    await request.save();
    res
      .status(201)
      .json({ message: "Adoption request submitted successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getUserAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ user: req?.user?.id })
      .populate("pet")
      .populate("user");
    res.json(requests);
  } catch (error) {
    res.json({ message: "Server Error" });
  }
};

export const updateAdoptionRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  try {
    const request = await AdoptionRequest.findById(requestId).populate(
      "user pet"
    );
    if (!request) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    request.status = status;
    await request.save();

    const user = await User.findById(request.user._id);
    res.json({
      message: "Adoption request status updated successfully",
      status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
