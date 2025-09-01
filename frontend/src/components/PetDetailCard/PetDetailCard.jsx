import React from 'react';
import { getResponsiveImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import './PetDetailCard.css';

const PetDetailCard = ({ pet, onAdoptClick, hasAlreadyRequested }) => {
  const getAgeText = (age) => {
    if (age === 1) return '1 year old';
    return `${age} years old`;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'high-urgency';
      case 'medium': return 'medium-urgency';
      case 'low': return 'low-urgency';
      default: return 'standard-urgency';
    }
  };

  const getSizeText = (size) => {
    if (!size) return 'N/A';
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  const getGenderText = (gender) => {
    if (!gender) return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Get the first image or fallback
  const petImages = pet.images || [];
  const firstImage = petImages.length > 0 ? petImages[0] : null;
  const imageUrl = firstImage ? 
    (typeof firstImage === 'string' ? firstImage : firstImage.url || firstImage) : 
    getFallbackImageUrl('large');

  const handleImageError = (e) => {
    e.target.src = getFallbackImageUrl('large');
    e.target.onerror = null;
  };

  return (
    <div className="pet-detail-container">
      {/* Header Section */}
      <div className="pet-header">
        <div className="pet-image-section">
          <img
            src={getResponsiveImageUrl(imageUrl, 'large')}
            alt={`${pet.name} - Pet image`}
            className="pet-main-image"
            onError={handleImageError}
            loading="eager"
          />
        </div>
        
        <div className="pet-basic-info">
          <h1 className="pet-name">{pet.name}</h1>
          <div className="pet-key-details">
            <span className="detail-tag species">{pet.species}</span>
            {pet.breed && <span className="detail-tag breed">{pet.breed}</span>}
            <span className="detail-tag age">{getAgeText(pet.age)}</span>
            <span className="detail-tag gender">{getGenderText(pet.gender)}</span>
            {pet.size && <span className="detail-tag size">{getSizeText(pet.size)}</span>}
            {pet.color && <span className="detail-tag color">{pet.color}</span>}
          </div>
          
          {pet.description && (
            <div className="pet-description">
              <p>{pet.description}</p>
            </div>
          )}

          {/* Adoption Button in Header */}
          <div className="adoption-button-section">
            <button 
              className={`adopt-button ${hasAlreadyRequested ? 'disabled' : ''}`}
              onClick={onAdoptClick}
              disabled={hasAlreadyRequested}
            >
              {hasAlreadyRequested ? 'Already Requested' : `Adopt ${pet.name}`}
            </button>
            {hasAlreadyRequested && (
              <p className="already-requested-message">
                You have already submitted an adoption request for this pet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* All Pet Information in One Section */}
      <div className="pet-info-section">
        <h2 className="section-title">Pet Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Species</span>
            <span className="info-value">{pet.species}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Breed</span>
            <span className="info-value">{pet.breed || 'Mixed Breed'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age</span>
            <span className="info-value">{getAgeText(pet.age)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gender</span>
            <span className="info-value">{getGenderText(pet.gender)}</span>
          </div>
          {pet.size && (
            <div className="info-item">
              <span className="info-label">Size</span>
              <span className="info-value">{getSizeText(pet.size)}</span>
            </div>
          )}
          {pet.color && (
            <div className="info-item">
              <span className="info-label">Color</span>
              <span className="info-value">{pet.color}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Health Status</span>
            <span className="info-value">{pet.healthStatus || 'Good'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Vaccinated</span>
            <span className={`info-value ${pet.vaccinated ? 'positive' : 'negative'}`}>
              {pet.vaccinated ? 'Yes' : 'No'}
            </span>
          </div>
          {pet.spayedNeutered !== undefined && (
            <div className="info-item">
              <span className="info-label">Spayed/Neutered</span>
              <span className={`info-value ${pet.spayedNeutered ? 'positive' : 'negative'}`}>
                {pet.spayedNeutered ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.microchipped !== undefined && (
            <div className="info-item">
              <span className="info-label">Microchipped</span>
              <span className={`info-value ${pet.microchipped ? 'positive' : 'negative'}`}>
                {pet.microchipped ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.temperament && (
            <div className="info-item">
              <span className="info-label">Temperament</span>
              <span className="info-value">{pet.temperament}</span>
            </div>
          )}
          {pet.goodWithChildren !== undefined && (
            <div className="info-item">
              <span className="info-label">Good with Children</span>
              <span className={`info-value ${pet.goodWithChildren ? 'positive' : 'negative'}`}>
                {pet.goodWithChildren ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.goodWithDogs !== undefined && (
            <div className="info-item">
              <span className="info-label">Good with Dogs</span>
              <span className={`info-value ${pet.goodWithDogs ? 'positive' : 'negative'}`}>
                {pet.goodWithDogs ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.goodWithCats !== undefined && (
            <div className="info-item">
              <span className="info-label">Good with Cats</span>
              <span className={`info-value ${pet.goodWithCats ? 'positive' : 'negative'}`}>
                {pet.goodWithCats ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.houseTrained !== undefined && (
            <div className="info-item">
              <span className="info-label">House Trained</span>
              <span className={`info-value ${pet.houseTrained ? 'positive' : 'negative'}`}>
                {pet.houseTrained ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          {pet.urgency && (
            <div className="info-item">
              <span className="info-label">Adoption Urgency</span>
              <span className={`info-value urgency ${getUrgencyColor(pet.urgency)}`}>
                {pet.urgency}
              </span>
            </div>
          )}
          {pet.adoptionFee && (
            <div className="info-item">
              <span className="info-label">Adoption Fee</span>
              <span className="info-value">${pet.adoptionFee}</span>
            </div>
          )}
          {pet.location && (
            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{pet.location}</span>
            </div>
          )}
          {pet.organization && (
            <div className="info-item">
              <span className="info-label">Organization</span>
              <span className="info-value">{pet.organization}</span>
            </div>
          )}
          {pet.arrivalDate && (
            <div className="info-item">
              <span className="info-label">Arrival Date</span>
              <span className="info-value">{new Date(pet.arrivalDate).toLocaleDateString()}</span>
            </div>
          )}
          {pet.medicalNotes && (
            <div className="info-item full-width">
              <span className="info-label">Medical Notes</span>
              <span className="info-value">{pet.medicalNotes}</span>
            </div>
          )}
          {pet.specialNeeds && (
            <div className="info-item full-width">
              <span className="info-label">Special Needs</span>
              <span className="info-value">{pet.specialNeeds}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetailCard;
