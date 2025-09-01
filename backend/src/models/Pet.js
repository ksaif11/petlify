import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  
  gender: { type: String, enum: ["Male", "Female"], required: true },
  size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
  color: { type: String, required: true },
  weight: { type: Number, required: true },
  isVaccinated: { type: Boolean, default: false },
  isNeutered: { type: Boolean, default: false },
  isHouseTrained: { type: Boolean, default: false },
  healthIssues: { type: String, default: "" },
  specialNeeds: { type: String, default: "" },
  temperament: { type: String, required: true },
  energyLevel: { type: String, enum: ["Low", "Moderate", "High"], required: true },
  
  ownerMobile: { type: String, required: true },
  ownerAddress: { type: String, required: true },
  ownerCity: { type: String, required: true },
  ownerState: { type: String, required: true },
  ownerZipCode: { type: String, required: true },
  reasonForRehoming: { type: String, required: true },
  rehomingUrgency: { type: String, required: true },
  
  images: [{ type: String }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true
});

export default mongoose.model("Pet", petSchema);
