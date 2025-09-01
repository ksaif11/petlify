import React from 'react';
import { Link } from 'react-router-dom';
import { getResponsiveImageUrl, getFallbackImageUrl } from '../../utils/imageUtils';
import './UnifiedPetCard.css';

const UnifiedPetCard = ({ pet, variant = 'default', onAdoptClick }) => {
  const handleImageError = (e) => {
    e.target.src = getFallbackImageUrl('medium');
    e.target.onerror = null;
  };

  // Get the first image or fallback
  const petImages = pet.images || [];
  const firstImage = petImages.length > 0 ? petImages[0] : null;
  const imageUrl = firstImage ? 
    (typeof firstImage === 'string' ? firstImage : firstImage.url || firstImage) : 
    getFallbackImageUrl('medium');

  // Format age with proper text
  const formatAge = (age) => {
    if (age === 1) return '1 year old';
    return `${age} years old`;
  };

  // Format size with proper text
  const formatSize = (size) => {
    if (!size) return 'Unknown';
    return size.charAt(0).toUpperCase() + size.slice(1).toLowerCase();
  };

  // Format gender with proper text
  const formatGender = (gender) => {
    if (!gender) return 'Unknown';
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  return (
    <div className={`unified-pet-card ${variant}`}>
      <div className="pet-image-wrapper">
        <img
          src={getResponsiveImageUrl(imageUrl, 'medium')}
          alt={`${pet.name} - Pet image`}
          className="pet-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="pet-image-overlay">
          <div className="pet-basic-info">
            <span className="pet-species-badge">{pet.species}</span>
            {pet.breed && <span className="pet-breed-badge">{pet.breed}</span>}
          </div>
        </div>
      </div>
      
      <div className="pet-content">
        <div className="pet-header">
          <h3 className="pet-name">{pet.name}</h3>
          <div className="pet-age-badge">{formatAge(pet.age)}</div>
        </div>
        
        <div className="pet-details-grid">
          <div className="detail-item">
            <span className="detail-label">Species</span>
            <span className="detail-value">{pet.species}</span>
          </div>
          
          {pet.breed && (
            <div className="detail-item">
              <span className="detail-label">Breed</span>
              <span className="detail-value">{pet.breed}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{formatGender(pet.gender)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Size</span>
            <span className="detail-value">{formatSize(pet.size)}</span>
          </div>
        </div>

        {variant === 'detailed' && pet.description && (
          <div className="pet-description">
            <p className="description-text">{pet.description}</p>
          </div>
        )}
        
        <div className="pet-actions">
          <Link to={`/pets/${pet._id}`} className="view-details-btn">
            View Details
          </Link>
          
          {variant === 'detailed' && onAdoptClick && (
            <button 
              className="adopt-btn" 
              onClick={() => onAdoptClick(pet._id)}
            >
              Adopt {pet.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedPetCard;
