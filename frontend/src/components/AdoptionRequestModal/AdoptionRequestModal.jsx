import React, { useState } from "react";
import { submitAdoptionRequest } from "../../api";
import "./AdoptionRequestModal.css";

const AdoptionRequestModal = ({ petId, onClose, onRequestSubmit }) => {
  const [formData, setFormData] = useState({
    experience: "",
    livingSituation: "",
    hasOutdoorSpace: "",
    petAloneHours: "",
    travelFrequency: "",
    commitmentLevel: "",
    familyDetails: "",
    adoptionReason: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = Object.values(formData).some(
      (field) => field === ""
    );
    if (requiredFields) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await submitAdoptionRequest(petId, token);

      // Show API response message
      alert(response.message || "Adoption request submitted successfully!");
      onRequestSubmit();
    } catch (error) {
      console.error("Adoption request failed:", error);
      setError(
        error.response?.data?.message ||
          "Failed to submit adoption request. Please try again."
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adoption Request</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Scrollable form content */}
        <div className="modal-form">
          <form onSubmit={handleSubmit}>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Have you had pets before?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <select
              name="livingSituation"
              value={formData.livingSituation}
              onChange={handleChange}
              required
            >
              <option value="">What type of home do you live in?</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="hasOutdoorSpace"
              value={formData.hasOutdoorSpace}
              onChange={handleChange}
              required
            >
              <option value="">Do you have a backyard or outdoor space?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <input
              type="number"
              name="petAloneHours"
              placeholder="How many hours per day will the pet be alone?"
              value={formData.petAloneHours}
              onChange={handleChange}
              required
            />

            <select
              name="travelFrequency"
              value={formData.travelFrequency}
              onChange={handleChange}
              required
            >
              <option value="">Do you travel frequently?</option>
              <option value="Often">Often</option>
              <option value="Sometimes">Sometimes</option>
              <option value="Rarely">Rarely</option>
            </select>

            <textarea
              name="commitmentLevel"
              placeholder="Are you willing to commit to training and vet checkups?"
              value={formData.commitmentLevel}
              onChange={handleChange}
              required
            />

            <textarea
              name="familyDetails"
              placeholder="Do you have children or household members with pet allergies?"
              value={formData.familyDetails}
              onChange={handleChange}
              required
            />

            <textarea
              name="adoptionReason"
              placeholder="Why do you want to adopt this pet?"
              value={formData.adoptionReason}
              onChange={handleChange}
              required
            />
          </form>
        </div>

        <div className="modal-buttons">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptionRequestModal;
