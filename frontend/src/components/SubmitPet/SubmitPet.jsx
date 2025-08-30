import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPet } from "../../api"
import { showError, showSuccess, showWarning } from "../../utils/toast";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    
    if (!validateMultipleFiles(files)) {
      showError("Please select 1-5 images, each under 5MB");
      return;
    }

    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!validateRequired(formData.name)) {
          newErrors.name = "Pet name is required";
        }
        if (!validateRequired(formData.species)) {
          newErrors.species = "Species is required";
        }
        if (!validateRequired(formData.breed)) {
          newErrors.breed = "Breed is required";
        }
        if (!validateAge(formData.age)) {
          newErrors.age = "Valid age is required";
        }
        if (!validateRequired(formData.description)) {
          newErrors.description = "Description is required";
        }
        break;

      case 2:
        if (!validateRequired(formData.gender)) {
          newErrors.gender = "Gender is required";
        }
        if (!validateRequired(formData.size)) {
          newErrors.size = "Size is required";
        }
        if (!validateRequired(formData.color)) {
          newErrors.color = "Color is required";
        }
        if (!validateWeight(formData.weight)) {
          newErrors.weight = "Valid weight is required";
        }
        if (!validateRequired(formData.isVaccinated)) {
          newErrors.isVaccinated = "Vaccination status is required";
        }
        if (!validateRequired(formData.isNeutered)) {
          newErrors.isNeutered = "Neutering status is required";
        }
        if (!validateRequired(formData.isHouseTrained)) {
          newErrors.isHouseTrained = "House training status is required";
        }
        break;

      case 3:
        if (!validateRequired(formData.temperament)) {
          newErrors.temperament = "Temperament is required";
        }
        if (!validateRequired(formData.energyLevel)) {
          newErrors.energyLevel = "Energy level is required";
        }
        if (formData.healthIssues && formData.healthIssues.trim().length < 10) {
          newErrors.healthIssues = "Health issues description should be at least 10 characters";
        }
        if (formData.specialNeeds && formData.specialNeeds.trim().length < 10) {
          newErrors.specialNeeds = "Special needs description should be at least 10 characters";
        }
        break;

      case 4:
        if (!validatePhone(formData.ownerMobile)) {
          newErrors.ownerMobile = "Valid phone number is required";
        }
        if (!validateRequired(formData.ownerAddress)) {
          newErrors.ownerAddress = "Address is required";
        }
        if (!validateRequired(formData.ownerCity)) {
          newErrors.ownerCity = "City is required";
        }
        if (!validateRequired(formData.ownerState)) {
          newErrors.ownerState = "State is required";
        }
        if (!validateZipCode(formData.ownerZipCode)) {
          newErrors.ownerZipCode = "Valid zip code is required";
        }
        if (!validateRequired(formData.reasonForRehoming)) {
          newErrors.reasonForRehoming = "Reason for rehoming is required";
        }
        if (!validateRequired(formData.rehomingUrgency)) {
          newErrors.rehomingUrgency = "Rehoming urgency is required";
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
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (images.length === 0) {
      showError("Please upload at least one image of your pet");
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
          <p>Help find a loving home for a pet in need</p>
        </div>

        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Behavior</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
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
                    placeholder="e.g., Golden Retriever, Persian"
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
                  <label htmlFor="weight">Weight (kg) *</label>
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
                  placeholder="Tell us about your pet's personality, likes, dislikes, etc."
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
                  placeholder="e.g., Black and white, Golden brown"
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
                  placeholder="Describe any health issues or medical conditions"
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
                  placeholder="Describe any special needs or accommodations required"
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
                <label>Good with: (select all that apply)</label>
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      value="Children"
                      checked={formData.goodWith.includes("Children")}
                      onChange={handleGoodWithChange}
                    />
                    Children
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Dogs"
                      checked={formData.goodWith.includes("Dogs")}
                      onChange={handleGoodWithChange}
                    />
                    Dogs
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Cats"
                      checked={formData.goodWith.includes("Cats")}
                      onChange={handleGoodWithChange}
                    />
                    Cats
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Other Pets"
                      checked={formData.goodWith.includes("Other Pets")}
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
                  placeholder="e.g., (555) 123-4567"
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
                  placeholder="Street address"
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
                    placeholder="e.g., 12345"
                    className={errors.ownerZipCode ? 'error' : ''}
                  />
                  {errors.ownerZipCode && <span className="error-message">{errors.ownerZipCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reasonForRehoming">Reason for Rehoming *</label>
                <textarea
                  id="reasonForRehoming"
                  name="reasonForRehoming"
                  value={formData.reasonForRehoming}
                  onChange={handleChange}
                  placeholder="Why are you looking to rehome this pet?"
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
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <p className="file-help">Upload 1-5 images (max 5MB each)</p>
                
                {imagePreviews.length > 0 && (
                  <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
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
              <button type="button" onClick={nextStep} className="nav-btn next-btn">
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading} className="submit-btn">
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
