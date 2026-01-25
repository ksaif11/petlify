import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  applicantPhone: { type: String, required: true },
  applicantAge: { type: Number, required: true },
  applicantOccupation: { type: String, required: true },
  applicantAddress: { type: String, required: true },
  applicantCity: { type: String, required: true },
  applicantState: { type: String, required: true },
  applicantZipCode: { type: String, required: true },
  
  livingSituation: { type: String, required: true },
  housingType: { type: String, required: true },
  landlordApproval: { type: Boolean, default: false },
  landlordContact: { type: String, default: "" },
  
  householdMembers: { type: Number, required: true },
  childrenAges: { type: String, required: true },
  otherPets: { type: Boolean, default: false },
  otherPetsDetails: { type: String, default: "" },
  
  petExperience: { type: String, required: true },
  petAloneHours: { type: Number, required: true },
  petExercisePlan: { type: String, required: true },
  petTrainingPlan: { type: String, required: true },
  
  financialCommitment: { type: String, required: true },
  timeCommitment: { type: String, required: true },
  
  adoptionMotivation: { type: String, required: true },
  petExpectations: { type: String, required: true },
  
  additionalInfo: { type: String, default: "" },
  
  status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
adoptionRequestSchema.index({ user: 1, createdAt: -1 }); // For getUserAdoptionRequests (compound index)
adoptionRequestSchema.index({ status: 1, createdAt: -1 }); // For getPendingAdoptionRequests (compound index)
adoptionRequestSchema.index({ pet: 1, user: 1 }); // For checking existing requests (compound index - unique constraint)
adoptionRequestSchema.index({ status: 1 }); // For status queries
adoptionRequestSchema.index({ _id: 1 }); // Ensure _id is indexed (usually automatic, but explicit)

export default mongoose.model("AdoptionRequest", adoptionRequestSchema);