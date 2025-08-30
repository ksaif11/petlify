import React from 'react';
import SimpleImageNav from '../SimpleImageNav/SimpleImageNav';
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

  return (
    <div className="pet-detail-container">
      {/* Main Pet Card */}
      <div className="pet-card">
        {/* Image Section */}
        <div className="pet-image-section">
          <SimpleImageNav 
            images={pet.images || []} 
            petName={pet.name}
          />
        </div>

        {/* Info Section */}
        <div className="pet-info-section">
          {/* Header */}
          <div className="pet-header">
            <h1 className="pet-name">{pet.name}</h1>
            <div className="pet-basic-info">
              <span className="pet-breed">{pet.breed || 'Mixed Breed'}</span>
              <span className="pet-age">{getAgeText(pet.age)}</span>
              <span className="pet-gender">{getGenderText(pet.gender)}</span>
              {pet.size && <span className="pet-size">{getSizeText(pet.size)}</span>}
            </div>
          </div>

          {/* Description */}
          {pet.description && (
            <div className="pet-description">
              <p>{pet.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="pet-details">
            <h3>Pet Details</h3>
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Species</span>
                <span className="detail-value">{pet.species}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Breed</span>
                <span className="detail-value">{pet.breed || 'Mixed'}</span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Age</span>
                <span className="detail-value">{getAgeText(pet.age)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Gender</span>
                <span className="detail-value">{getGenderText(pet.gender)}</span>
              </div>
            </div>
            {pet.size && (
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Size</span>
                  <span className="detail-value">{getSizeText(pet.size)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Color</span>
                  <span className="detail-value">{pet.color || 'N/A'}</span>
                </div>
              </div>
            )}
            {pet.healthStatus && (
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Health Status</span>
                  <span className="detail-value">{pet.healthStatus}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Vaccinated</span>
                  <span className="detail-value">{pet.vaccinated ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
            {pet.urgency && (
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Adoption Urgency</span>
                  <span className={`detail-value urgency ${getUrgencyColor(pet.urgency)}`}>
                    {pet.urgency}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Adoption Button */}
          <div className="adoption-section">
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
    </div>
  );
};

export default PetDetailCard;
