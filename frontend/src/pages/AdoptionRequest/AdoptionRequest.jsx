import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, submitAdoptionRequest } from "../../api";
import { showError, showSuccess, showWarning } from "../../utils/toast";
import { 
  validateRequired, 
  validateEmail, 
  validatePhone, 
  validateNumber,
  validateYesNo
} from "../../utils/validation";
import "./AdoptionRequest.css";

const AdoptionRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantAge: "",
    applicantOccupation: "",
    applicantAddress: "",
    applicantCity: "",
    applicantState: "",
    applicantZipCode: "",
    
    livingSituation: "",
    housingType: "",
    landlordApproval: "",
    landlordContact: "",
    
    householdMembers: "",
    childrenAges: "",
    otherPets: "",
    otherPetsDetails: "",
    
    petExperience: "",
    petAloneHours: "",
    petExercisePlan: "",
    petTrainingPlan: "",
    
    financialCommitment: "",
    timeCommitment: "",
    
    adoptionMotivation: "",
    petExpectations: "",
    
    additionalInfo: ""
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const petData = await getPetById(id);
        setPet(petData);
      } catch (err) {
        showError("Failed to load pet details");
        navigate("/pets");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!validateRequired(formData.applicantName)) {
          newErrors.applicantName = "Name is required";
        }
        if (!validateEmail(formData.applicantEmail)) {
          newErrors.applicantEmail = "Valid email is required";
        }
        if (!validatePhone(formData.applicantPhone)) {
          newErrors.applicantPhone = "Valid phone number is required";
        }
        if (!validateRequired(formData.applicantAge)) {
          newErrors.applicantAge = "Age is required";
        }
        if (!validateRequired(formData.applicantOccupation)) {
          newErrors.applicantOccupation = "Occupation is required";
        }
        if (!validateRequired(formData.applicantAddress)) {
          newErrors.applicantAddress = "Address is required";
        }
        if (!validateRequired(formData.applicantCity)) {
          newErrors.applicantCity = "City is required";
        }
        if (!validateRequired(formData.applicantState)) {
          newErrors.applicantState = "State is required";
        }
        if (!validateRequired(formData.applicantZipCode)) {
          newErrors.applicantZipCode = "Zip code is required";
        }
        break;

      case 2:
        if (!validateRequired(formData.livingSituation)) {
          newErrors.livingSituation = "Living situation is required";
        }
        if (!validateRequired(formData.housingType)) {
          newErrors.housingType = "Housing type is required";
        }
        if (formData.livingSituation === "renting" && !validateYesNo(formData.landlordApproval)) {
          newErrors.landlordApproval = "Landlord approval is required";
        }
        if (formData.livingSituation === "renting" && formData.landlordApproval === "yes" && !validateRequired(formData.landlordContact)) {
          newErrors.landlordContact = "Landlord contact is required";
        }
        break;

      case 3:
        if (!validateRequired(formData.householdMembers)) {
          newErrors.householdMembers = "Number of household members is required";
        }
        if (!validateRequired(formData.childrenAges)) {
          newErrors.childrenAges = "Children ages information is required";
        }
        if (!validateYesNo(formData.otherPets)) {
          newErrors.otherPets = "Other pets information is required";
        }
        if (formData.otherPets === "yes" && !validateRequired(formData.otherPetsDetails)) {
          newErrors.otherPetsDetails = "Other pets details are required";
        }
        break;

      case 4:
        if (!validateRequired(formData.petExperience)) {
          newErrors.petExperience = "Pet experience is required";
        }
        if (!validateNumber(formData.petAloneHours)) {
          newErrors.petAloneHours = "Hours pet will be alone is required";
        }
        if (!validateRequired(formData.petExercisePlan)) {
          newErrors.petExercisePlan = "Exercise plan is required";
        }
        if (!validateRequired(formData.petTrainingPlan)) {
          newErrors.petTrainingPlan = "Training plan is required";
        }
        break;

      case 5:
        if (!validateRequired(formData.financialCommitment)) {
          newErrors.financialCommitment = "Financial commitment is required";
        }
        if (!validateRequired(formData.timeCommitment)) {
          newErrors.timeCommitment = "Time commitment is required";
        }
        if (!validateRequired(formData.adoptionMotivation)) {
          newErrors.adoptionMotivation = "Adoption motivation is required";
        }
        if (!validateRequired(formData.petExpectations)) {
          newErrors.petExpectations = "Pet expectations are required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setSubmitting(true);
    
    try {
      await submitAdoptionRequest({
        petId: id,
        ...formData
      });
      
      showSuccess("Adoption request submitted successfully!");
      navigate("/my-adoptions");
    } catch (error) {
      showError(error.userMessage || "Failed to submit adoption request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="adoption-request-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading pet details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="adoption-request-page">
        <div className="container">
          <div className="error-container">
            <p>Pet not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adoption-request-page">
      <div className="container">
        <div className="request-header">
          <h1>Adoption Request</h1>
          <p>Please fill out the form below to request adoption of {pet.name}</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Personal Info</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Living Situation</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Household</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Experience</span>
          </div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
            <span className="step-number">5</span>
            <span className="step-label">Commitment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="adoption-form">
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              
              <div className="form-group">
                <label htmlFor="applicantName">Full Name *</label>
                <input
                  type="text"
                  id="applicantName"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  className={errors.applicantName ? 'error' : ''}
                />
                {errors.applicantName && <span className="error-message">{errors.applicantName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="applicantEmail">Email Address *</label>
                <input
                  type="email"
                  id="applicantEmail"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleChange}
                  className={errors.applicantEmail ? 'error' : ''}
                />
                {errors.applicantEmail && <span className="error-message">{errors.applicantEmail}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="applicantPhone">Phone Number *</label>
                <input
                  type="tel"
                  id="applicantPhone"
                  name="applicantPhone"
                  value={formData.applicantPhone}
                  onChange={handleChange}
                  className={errors.applicantPhone ? 'error' : ''}
                />
                {errors.applicantPhone && <span className="error-message">{errors.applicantPhone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="applicantAge">Age *</label>
                <input
                  type="number"
                  id="applicantAge"
                  name="applicantAge"
                  value={formData.applicantAge}
                  onChange={handleChange}
                  min="18"
                  className={errors.applicantAge ? 'error' : ''}
                />
                {errors.applicantAge && <span className="error-message">{errors.applicantAge}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="applicantOccupation">Occupation *</label>
                <input
                  type="text"
                  id="applicantOccupation"
                  name="applicantOccupation"
                  value={formData.applicantOccupation}
                  onChange={handleChange}
                  className={errors.applicantOccupation ? 'error' : ''}
                />
                {errors.applicantOccupation && <span className="error-message">{errors.applicantOccupation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="applicantAddress">Address *</label>
                <input
                  type="text"
                  id="applicantAddress"
                  name="applicantAddress"
                  value={formData.applicantAddress}
                  onChange={handleChange}
                  className={errors.applicantAddress ? 'error' : ''}
                />
                {errors.applicantAddress && <span className="error-message">{errors.applicantAddress}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="applicantCity">City *</label>
                  <input
                    type="text"
                    id="applicantCity"
                    name="applicantCity"
                    value={formData.applicantCity}
                    onChange={handleChange}
                    className={errors.applicantCity ? 'error' : ''}
                  />
                  {errors.applicantCity && <span className="error-message">{errors.applicantCity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="applicantState">State *</label>
                  <input
                    type="text"
                    id="applicantState"
                    name="applicantState"
                    value={formData.applicantState}
                    onChange={handleChange}
                    className={errors.applicantState ? 'error' : ''}
                  />
                  {errors.applicantState && <span className="error-message">{errors.applicantState}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="applicantZipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="applicantZipCode"
                    name="applicantZipCode"
                    value={formData.applicantZipCode}
                    onChange={handleChange}
                    className={errors.applicantZipCode ? 'error' : ''}
                  />
                  {errors.applicantZipCode && <span className="error-message">{errors.applicantZipCode}</span>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h2>Living Situation</h2>
              
              <div className="form-group">
                <label htmlFor="livingSituation">Living Situation *</label>
                <select
                  id="livingSituation"
                  name="livingSituation"
                  value={formData.livingSituation}
                  onChange={handleChange}
                  className={errors.livingSituation ? 'error' : ''}
                >
                  <option value="">Select living situation</option>
                  <option value="owning">I own my home</option>
                  <option value="renting">I rent my home</option>
                  <option value="family">Living with family</option>
                  <option value="other">Other</option>
                </select>
                {errors.livingSituation && <span className="error-message">{errors.livingSituation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="housingType">Type of Housing *</label>
                <select
                  id="housingType"
                  name="housingType"
                  value={formData.housingType}
                  onChange={handleChange}
                  className={errors.housingType ? 'error' : ''}
                >
                  <option value="">Select housing type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="other">Other</option>
                </select>
                {errors.housingType && <span className="error-message">{errors.housingType}</span>}
              </div>

              {formData.livingSituation === "renting" && (
                <>
                  <div className="form-group">
                    <label htmlFor="landlordApproval">Do you have landlord approval for pets? *</label>
                    <select
                      id="landlordApproval"
                      name="landlordApproval"
                      value={formData.landlordApproval}
                      onChange={handleChange}
                      className={errors.landlordApproval ? 'error' : ''}
                    >
                      <option value="">Select answer</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.landlordApproval && <span className="error-message">{errors.landlordApproval}</span>}
                  </div>

                  {formData.landlordApproval === "yes" && (
                    <div className="form-group">
                      <label htmlFor="landlordContact">Landlord Contact Information *</label>
                      <input
                        type="text"
                        id="landlordContact"
                        name="landlordContact"
                        value={formData.landlordContact}
                        onChange={handleChange}
                        placeholder="Name and phone number"
                        className={errors.landlordContact ? 'error' : ''}
                      />
                      {errors.landlordContact && <span className="error-message">{errors.landlordContact}</span>}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h2>Household Information</h2>
              
              <div className="form-group">
                <label htmlFor="householdMembers">Number of people in household *</label>
                <input
                  type="number"
                  id="householdMembers"
                  name="householdMembers"
                  value={formData.householdMembers}
                  onChange={handleChange}
                  min="1"
                  className={errors.householdMembers ? 'error' : ''}
                />
                {errors.householdMembers && <span className="error-message">{errors.householdMembers}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="childrenAges">Ages of children (if any) *</label>
                <input
                  type="text"
                  id="childrenAges"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  placeholder="e.g., 5, 8, 12 or 'No children'"
                  className={errors.childrenAges ? 'error' : ''}
                />
                {errors.childrenAges && <span className="error-message">{errors.childrenAges}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="otherPets">Do you have other pets? *</label>
                <select
                  id="otherPets"
                  name="otherPets"
                  value={formData.otherPets}
                  onChange={handleChange}
                  className={errors.otherPets ? 'error' : ''}
                >
                  <option value="">Select answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {errors.otherPets && <span className="error-message">{errors.otherPets}</span>}
              </div>

              {formData.otherPets === "yes" && (
                <div className="form-group">
                  <label htmlFor="otherPetsDetails">Please describe your other pets *</label>
                  <textarea
                    id="otherPetsDetails"
                    name="otherPetsDetails"
                    value={formData.otherPetsDetails}
                    onChange={handleChange}
                    placeholder="Species, breeds, ages, and temperaments"
                    className={errors.otherPetsDetails ? 'error' : ''}
                  />
                  {errors.otherPetsDetails && <span className="error-message">{errors.otherPetsDetails}</span>}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h2>Pet Experience & Care Plans</h2>
              
              <div className="form-group">
                <label htmlFor="petExperience">Previous pet experience *</label>
                <select
                  id="petExperience"
                  name="petExperience"
                  value={formData.petExperience}
                  onChange={handleChange}
                  className={errors.petExperience ? 'error' : ''}
                >
                  <option value="">Select experience level</option>
                  <option value="none">No previous experience</option>
                  <option value="some">Some experience</option>
                  <option value="extensive">Extensive experience</option>
                </select>
                {errors.petExperience && <span className="error-message">{errors.petExperience}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="petAloneHours">How many hours per day will the pet be alone? *</label>
                <input
                  type="number"
                  id="petAloneHours"
                  name="petAloneHours"
                  value={formData.petAloneHours}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  className={errors.petAloneHours ? 'error' : ''}
                />
                {errors.petAloneHours && <span className="error-message">{errors.petAloneHours}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="petExercisePlan">How will you provide exercise for the pet? *</label>
                <textarea
                  id="petExercisePlan"
                  name="petExercisePlan"
                  value={formData.petExercisePlan}
                  onChange={handleChange}
                  placeholder="Describe your exercise plan (walks, playtime, etc.)"
                  className={errors.petExercisePlan ? 'error' : ''}
                />
                {errors.petExercisePlan && <span className="error-message">{errors.petExercisePlan}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="petTrainingPlan">What is your plan for training the pet? *</label>
                <textarea
                  id="petTrainingPlan"
                  name="petTrainingPlan"
                  value={formData.petTrainingPlan}
                  onChange={handleChange}
                  placeholder="Describe your training approach"
                  className={errors.petTrainingPlan ? 'error' : ''}
                />
                {errors.petTrainingPlan && <span className="error-message">{errors.petTrainingPlan}</span>}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-step">
              <h2>Commitment & Motivation</h2>
              
              <div className="form-group">
                <label htmlFor="financialCommitment">Are you prepared for the financial commitment of pet ownership? *</label>
                <select
                  id="financialCommitment"
                  name="financialCommitment"
                  value={formData.financialCommitment}
                  onChange={handleChange}
                  className={errors.financialCommitment ? 'error' : ''}
                >
                  <option value="">Select answer</option>
                  <option value="yes">Yes, I understand the costs</option>
                  <option value="somewhat">Somewhat, I'm learning</option>
                  <option value="no">No, I need more information</option>
                </select>
                {errors.financialCommitment && <span className="error-message">{errors.financialCommitment}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="timeCommitment">Are you prepared for the time commitment of pet ownership? *</label>
                <select
                  id="timeCommitment"
                  name="timeCommitment"
                  value={formData.timeCommitment}
                  onChange={handleChange}
                  className={errors.timeCommitment ? 'error' : ''}
                >
                  <option value="">Select answer</option>
                  <option value="yes">Yes, I have plenty of time</option>
                  <option value="somewhat">Somewhat, I can make time</option>
                  <option value="no">No, I'm concerned about time</option>
                </select>
                {errors.timeCommitment && <span className="error-message">{errors.timeCommitment}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="adoptionMotivation">What motivates you to adopt this pet? *</label>
                <textarea
                  id="adoptionMotivation"
                  name="adoptionMotivation"
                  value={formData.adoptionMotivation}
                  onChange={handleChange}
                  placeholder="Tell us why you want to adopt this specific pet"
                  className={errors.adoptionMotivation ? 'error' : ''}
                />
                {errors.adoptionMotivation && <span className="error-message">{errors.adoptionMotivation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="petExpectations">What are your expectations for this pet? *</label>
                <textarea
                  id="petExpectations"
                  name="petExpectations"
                  value={formData.petExpectations}
                  onChange={handleChange}
                  placeholder="What do you hope this pet will bring to your life?"
                  className={errors.petExpectations ? 'error' : ''}
                />
                {errors.petExpectations && <span className="error-message">{errors.petExpectations}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any other information you'd like to share"
                />
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button type="button" onClick={nextStep} className="nav-btn next-btn">
                Next
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionRequest;
