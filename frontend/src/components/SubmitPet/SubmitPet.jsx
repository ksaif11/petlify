import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitPet } from "../../api"
import { showError, showSuccess } from "../../utils/toast";
import {
  validateRequired,
  validateAge,
  validateWeight,
  validatePhone,
  validateZipCode,
  validateMultipleFiles
} from "../../utils/validation";
import "./SubmitPet.css";

const SubmitPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    gender: "",
    size: "",
    color: "",
    weight: "",
    isVaccinated: "",
    isNeutered: "",
    isHouseTrained: "",
    healthIssues: "",
    specialNeeds: "",
    temperament: "",
    goodWith: [],
    energyLevel: "",

    ownerMobile: "",
    ownerAddress: "",
    ownerCity: "",
    ownerState: "",
    ownerZipCode: "",
    reasonForRehoming: "",
    rehomingUrgency: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleGoodWithChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      goodWith: checked
        ? [...prev.goodWith, value]
        : prev.goodWith.filter(item => item !== value)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Clear previous validation errors
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ""
      }));
    }

    const validation = validateMultipleFiles(files);
    if (!validation.isValid) {
      showError(validation.message);
      // Clear the file input
      e.target.value = '';
      return;
    }

    setImages(files);

    const previews = files.map(file => {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating preview URL:', error);
        return null;
      }
    }).filter(preview => preview !== null);
    
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const isStepValid = (step) => {
    const stepErrors = {};

    switch (step) {
      case 1:
        if (!formData.name?.trim()) stepErrors.name = "Pet name is required";
        if (!formData.species?.trim()) stepErrors.species = "Species is required";
        if (!formData.breed?.trim()) stepErrors.breed = "Breed is required";
        if (!formData.age || parseFloat(formData.age) <= 0) stepErrors.age = "Valid age is required";
        if (!formData.description?.trim()) stepErrors.description = "Description is required";
        break;

      case 2:
        if (!formData.gender?.trim()) stepErrors.gender = "Gender is required";
        if (!formData.size?.trim()) stepErrors.size = "Size is required";
        if (!formData.color?.trim()) stepErrors.color = "Color is required";
        if (!formData.isVaccinated?.trim()) stepErrors.isVaccinated = "Vaccination status is required";
        if (!formData.isNeutered?.trim()) stepErrors.isNeutered = "Neutering status is required";
        if (!formData.isHouseTrained?.trim()) stepErrors.isHouseTrained = "House training status is required";
        break;

      case 3:
        if (!formData.temperament?.trim()) stepErrors.temperament = "Temperament is required";
        if (!formData.energyLevel?.trim()) stepErrors.energyLevel = "Energy level is required";
        break;

      case 4:
        if (!formData.ownerMobile?.trim()) stepErrors.ownerMobile = "Phone number is required";
        if (!formData.ownerAddress?.trim()) stepErrors.ownerAddress = "Address is required";
        if (!formData.ownerCity?.trim()) stepErrors.ownerCity = "City is required";
        if (!formData.ownerState?.trim()) stepErrors.ownerState = "State is required";
        if (!formData.ownerZipCode?.trim()) stepErrors.ownerZipCode = "ZIP code is required";
        if (!formData.reasonForRehoming?.trim()) stepErrors.reasonForRehoming = "Reason for rehoming is required";
        if (!formData.rehomingUrgency?.trim()) stepErrors.rehomingUrgency = "Rehoming urgency is required";
        if (images.length === 0) stepErrors.images = "At least one image is required";
        break;
    }

    return Object.keys(stepErrors).length === 0;
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Clear all errors first
    setErrors({});

    switch (step) {
      case 1:
        const nameValidation = validateRequired(formData.name, 'Pet name');
        if (!nameValidation.isValid) {
          newErrors.name = nameValidation.message;
        }
        const speciesValidation = validateRequired(formData.species, 'Species');
        if (!speciesValidation.isValid) {
          newErrors.species = speciesValidation.message;
        }
        const breedValidation = validateRequired(formData.breed, 'Breed');
        if (!breedValidation.isValid) {
          newErrors.breed = breedValidation.message;
        }
        const ageValidation = validateAge(formData.age);
        if (!ageValidation.isValid) {
          newErrors.age = ageValidation.message;
        }
        const descriptionValidation = validateRequired(formData.description, 'Description');
        if (!descriptionValidation.isValid) {
          newErrors.description = descriptionValidation.message;
        }
        break;

      case 2:
        const genderValidation = validateRequired(formData.gender, 'Gender');
        if (!genderValidation.isValid) {
          newErrors.gender = genderValidation.message;
        }
        const sizeValidation = validateRequired(formData.size, 'Size');
        if (!sizeValidation.isValid) {
          newErrors.size = sizeValidation.message;
        }
        const colorValidation = validateRequired(formData.color, 'Color');
        if (!colorValidation.isValid) {
          newErrors.color = colorValidation.message;
        }
        const weightValidation = validateWeight(formData.weight);
        if (!weightValidation.isValid) {
          newErrors.weight = weightValidation.message;
        }
        const vaccinatedValidation = validateRequired(formData.isVaccinated, 'Vaccination status');
        if (!vaccinatedValidation.isValid) {
          newErrors.isVaccinated = vaccinatedValidation.message;
        }
        const neuteredValidation = validateRequired(formData.isNeutered, 'Neutering status');
        if (!neuteredValidation.isValid) {
          newErrors.isNeutered = neuteredValidation.message;
        }
        const houseTrainedValidation = validateRequired(formData.isHouseTrained, 'House training status');
        if (!houseTrainedValidation.isValid) {
          newErrors.isHouseTrained = houseTrainedValidation.message;
        }
        break;

      case 3:
        const temperamentValidation = validateRequired(formData.temperament, 'Temperament');
        if (!temperamentValidation.isValid) {
          newErrors.temperament = temperamentValidation.message;
        }
        const energyLevelValidation = validateRequired(formData.energyLevel, 'Energy level');
        if (!energyLevelValidation.isValid) {
          newErrors.energyLevel = energyLevelValidation.message;
        }
        break;

      case 4:
        const phoneValidation = validatePhone(formData.ownerMobile);
        if (!phoneValidation.isValid) {
          newErrors.ownerMobile = phoneValidation.message;
        }
        const addressValidation = validateRequired(formData.ownerAddress, 'Address');
        if (!addressValidation.isValid) {
          newErrors.ownerAddress = addressValidation.message;
        }
        const cityValidation = validateRequired(formData.ownerCity, 'City');
        if (!cityValidation.isValid) {
          newErrors.ownerCity = cityValidation.message;
        }
        const stateValidation = validateRequired(formData.ownerState, 'State');
        if (!stateValidation.isValid) {
          newErrors.ownerState = stateValidation.message;
        }
        const zipCodeValidation = validateZipCode(formData.ownerZipCode);
        if (!zipCodeValidation.isValid) {
          newErrors.ownerZipCode = zipCodeValidation.message;
        }
        const reasonValidation = validateRequired(formData.reasonForRehoming, 'Reason for rehoming');
        if (!reasonValidation.isValid) {
          newErrors.reasonForRehoming = reasonValidation.message;
        }
        const urgencyValidation = validateRequired(formData.rehomingUrgency, 'Rehoming urgency');
        if (!urgencyValidation.isValid) {
          newErrors.rehomingUrgency = urgencyValidation.message;
        }
        
        // Validate images
        if (images.length === 0) {
          newErrors.images = "At least one image is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps before submission
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return;
      }
    }

    if (images.length === 0) {
      setErrors(prev => ({ ...prev, images: "Please upload at least one image of your pet" }));
      setCurrentStep(4);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'goodWith') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await submitPet(formDataToSend);

      showSuccess("Pet submitted successfully! It will be reviewed by our team.");
      navigate("/pets");
    } catch (error) {
      showError(error.userMessage || "Failed to submit pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-pet-page">
      <div className="container">
        <div className="submit-header">
          <h1>Submit a Pet for Adoption</h1>
          <p>Help find a loving home for a pet in need, Submit pet for adoption today.</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1-</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2-</span>
            <span className="step-label">Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3-</span>
            <span className="step-label">Behavior</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4-</span>
            <span className="step-label">Contact</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>

              <div className="form-group">
                <label htmlFor="name">Pet Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your pet's name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="species">Species *</label>
                  <select
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className={errors.species ? 'error' : ''}
                  >
                    <option value="">Select species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.species && <span className="error-message">{errors.species}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="breed">Breed *</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Enter the breed (e.g., Golden Retriever, Persian, Mixed)"
                    className={errors.breed ? 'error' : ''}
                  />
                  {errors.breed && <span className="error-message">{errors.breed}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age (years) *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="30"
                    step="0.1"
                    className={errors.age ? 'error' : ''}
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    max="200"
                    step="0.1"
                    className={errors.weight ? 'error' : ''}
                  />
                  {errors.weight && <span className="error-message">{errors.weight}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your pet's personality, behavior, likes, dislikes, and any special characteristics"
                  rows="4"
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h2>Physical Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="size">Size *</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={errors.size ? 'error' : ''}
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  {errors.size && <span className="error-message">{errors.size}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="color">Color/Markings *</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Describe the pet's color and markings (e.g., Black and white, Golden brown, Tabby)"
                  className={errors.color ? 'error' : ''}
                />
                {errors.color && <span className="error-message">{errors.color}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="isVaccinated">Vaccinated? *</label>
                  <select
                    id="isVaccinated"
                    name="isVaccinated"
                    value={formData.isVaccinated}
                    onChange={handleChange}
                    className={errors.isVaccinated ? 'error' : ''}
                  >
                    <option value="">Select answer</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  {errors.isVaccinated && <span className="error-message">{errors.isVaccinated}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="isNeutered">Neutered/Spayed? *</label>
                  <select
                    id="isNeutered"
                    name="isNeutered"
                    value={formData.isNeutered}
                    onChange={handleChange}
                    className={errors.isNeutered ? 'error' : ''}
                  >
                    <option value="">Select answer</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  {errors.isNeutered && <span className="error-message">{errors.isNeutered}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="isHouseTrained">House Trained? *</label>
                <select
                  id="isHouseTrained"
                  name="isHouseTrained"
                  value={formData.isHouseTrained}
                  onChange={handleChange}
                  className={errors.isHouseTrained ? 'error' : ''}
                >
                  <option value="">Select answer</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Partially">Partially</option>
                </select>
                {errors.isHouseTrained && <span className="error-message">{errors.isHouseTrained}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="healthIssues">Health Issues (if any)</label>
                <textarea
                  id="healthIssues"
                  name="healthIssues"
                  value={formData.healthIssues}
                  onChange={handleChange}
                  placeholder="List any health issues, medical conditions, or medications (leave blank if none)"
                  rows="3"
                  className={errors.healthIssues ? 'error' : ''}
                />
                {errors.healthIssues && <span className="error-message">{errors.healthIssues}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="specialNeeds">Special Needs (if any)</label>
                <textarea
                  id="specialNeeds"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  placeholder="Describe any special needs, dietary requirements, or accommodations needed (leave blank if none)"
                  rows="3"
                  className={errors.specialNeeds ? 'error' : ''}
                />
                {errors.specialNeeds && <span className="error-message">{errors.specialNeeds}</span>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h2>Behavior & Compatibility</h2>

              <div className="form-group">
                <label htmlFor="temperament">Temperament *</label>
                <select
                  id="temperament"
                  name="temperament"
                  value={formData.temperament}
                  onChange={handleChange}
                  className={errors.temperament ? 'error' : ''}
                >
                  <option value="">Select temperament</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Shy">Shy</option>
                  <option value="Playful">Playful</option>
                  <option value="Calm">Calm</option>
                  <option value="Energetic">Energetic</option>
                  <option value="Independent">Independent</option>
                </select>
                {errors.temperament && <span className="error-message">{errors.temperament}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="energyLevel">Energy Level *</label>
                <select
                  id="energyLevel"
                  name="energyLevel"
                  value={formData.energyLevel}
                  onChange={handleChange}
                  className={errors.energyLevel ? 'error' : ''}
                >
                  <option value="">Select energy level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                {errors.energyLevel && <span className="error-message">{errors.energyLevel}</span>}
              </div>

              <div className="form-group">
                <label>Good With (Select all that apply) <span className="optional">(Optional)</span></label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="goodWith"
                      value="Children"
                      checked={formData.goodWith.includes('Children')}
                      onChange={handleGoodWithChange}
                    />
                    Children
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="goodWith"
                      value="Dogs"
                      checked={formData.goodWith.includes('Dogs')}
                      onChange={handleGoodWithChange}
                    />
                    Dogs
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="goodWith"
                      value="Cats"
                      checked={formData.goodWith.includes('Cats')}
                      onChange={handleGoodWithChange}
                    />
                    Cats
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="goodWith"
                      value="Other Pets"
                      checked={formData.goodWith.includes('Other Pets')}
                      onChange={handleGoodWithChange}
                    />
                    Other Pets
                  </label>
                </div>
              </div>

            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h2>Contact Information & Rehoming Details</h2>

              <div className="form-group">
                <label htmlFor="ownerMobile">Your Phone Number *</label>
                <input
                  type="tel"
                  id="ownerMobile"
                  name="ownerMobile"
                  value={formData.ownerMobile}
                  onChange={handleChange}
                  placeholder="Enter your phone number (e.g., (555) 123-4567)"
                  className={errors.ownerMobile ? 'error' : ''}
                />
                {errors.ownerMobile && <span className="error-message">{errors.ownerMobile}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ownerAddress">Your Address *</label>
                <input
                  type="text"
                  id="ownerAddress"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  placeholder="Enter your complete street address"
                  className={errors.ownerAddress ? 'error' : ''}
                />
                {errors.ownerAddress && <span className="error-message">{errors.ownerAddress}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ownerCity">City *</label>
                  <input
                    type="text"
                    id="ownerCity"
                    name="ownerCity"
                    value={formData.ownerCity}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className={errors.ownerCity ? 'error' : ''}
                  />
                  {errors.ownerCity && <span className="error-message">{errors.ownerCity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ownerState">State *</label>
                  <input
                    type="text"
                    id="ownerState"
                    name="ownerState"
                    value={formData.ownerState}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className={errors.ownerState ? 'error' : ''}
                  />
                  {errors.ownerState && <span className="error-message">{errors.ownerState}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="ownerZipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="ownerZipCode"
                    name="ownerZipCode"
                    value={formData.ownerZipCode}
                    onChange={handleChange}
                    placeholder="Enter your postal/ZIP code (e.g., 12345, A1A 1A1, SW1A 1AA)"
                    className={errors.ownerZipCode ? 'error' : ''}
                    maxLength="10"
                  />
                  {errors.ownerZipCode && <span className="error-message">{errors.ownerZipCode}</span>}
                  <small className="field-help">Supports US, Canadian, UK, and international postal codes</small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reasonForRehoming">Reason for Rehoming *</label>
                <textarea
                  id="reasonForRehoming"
                  name="reasonForRehoming"
                  value={formData.reasonForRehoming}
                  onChange={handleChange}
                  placeholder="Please explain why you need to rehome this pet (e.g., moving, allergies, time constraints)"
                  rows="3"
                  className={errors.reasonForRehoming ? 'error' : ''}
                />
                {errors.reasonForRehoming && <span className="error-message">{errors.reasonForRehoming}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rehomingUrgency">How Urgent is the Rehoming? *</label>
                <select
                  id="rehomingUrgency"
                  name="rehomingUrgency"
                  value={formData.rehomingUrgency}
                  onChange={handleChange}
                  className={errors.rehomingUrgency ? 'error' : ''}
                >
                  <option value="">Select urgency level</option>
                  <option value="Not Urgent">Not Urgent</option>
                  <option value="Somewhat Urgent">Somewhat Urgent</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Very Urgent">Very Urgent</option>
                </select>
                {errors.rehomingUrgency && <span className="error-message">{errors.rehomingUrgency}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="images">Pet Images *</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`file-input ${errors.images ? 'error' : ''}`}
                  />
                  <label htmlFor="images" className={`file-input-label ${errors.images ? 'error' : ''}`}>
                    <span className="file-input-icon">📷</span>
                    <span className="file-input-text">
                      {imagePreviews.length > 0 
                        ? `${imagePreviews.length} image(s) selected` 
                        : 'Choose images to upload'
                      }
                    </span>
                  </label>
                </div>
                <p className="file-help">Upload 1-5 images (max 5MB each). Supported formats: JPEG, PNG, GIF, WebP</p>
                {errors.images && <span className="error-message">{errors.images}</span>}

                {imagePreviews.length > 0 && (
                  <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img 
                          src={preview || null} 
                          alt={`Preview ${index + 1}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load image preview:', preview);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {imagePreviews.length === 0 && (
                  <p className="no-images-message">No images selected. Please upload at least one image of your pet.</p>
                )}
              </div>
            </div>
          )}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev-btn">
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className={`nav-btn next-btn ${!isStepValid(currentStep) ? 'disabled' : ''}`}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading || !isStepValid(currentStep)} 
                className={`submit-btn ${!isStepValid(currentStep) ? 'disabled' : ''}`}
              >
                {loading ? "Submitting..." : "Submit Pet"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitPet;
