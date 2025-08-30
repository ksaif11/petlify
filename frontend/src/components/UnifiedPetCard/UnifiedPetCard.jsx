import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPetImageUrl, getFallbackImageUrl, getResponsiveImageUrl, preloadImage } from "../../utils/imageUtils";
import "./UnifiedPetCard.css";

const UnifiedPetCard = ({ 
  pet, 
  request, 
  mode = "pet",
  showActions = false,
  onAction = null,
  actionButtons = [],
  showUserInfo = false,
  showRequestDate = false,
  showStatus = false,
  showDescription = true,
  showAdoptButton = false,
  onAdoptClick = null,
  hasAlreadyRequested = false
}) => {
  const petData = request?.pet || pet;
  
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSize, setCurrentImageSize] = useState('medium');

  useEffect(() => {
    const updateImageSize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setCurrentImageSize('small');
      } else if (width < 768) {
        setCurrentImageSize('medium');
      } else {
        setCurrentImageSize('large');
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      if (!petData) {
        setImageUrl(getFallbackImageUrl(currentImageSize));
        setImageLoading(false);
        return;
      }

      try {
        setImageLoading(true);
        setImageError(false);
        
        const baseUrl = getPetImageUrl(petData);
        const responsiveUrl = getResponsiveImageUrl(baseUrl, currentImageSize);
        
        await preloadImage(responsiveUrl);
        setImageUrl(responsiveUrl);
        setImageLoading(false);
      } catch (error) {
        setImageUrl(getFallbackImageUrl(currentImageSize));
        setImageError(true);
        setImageLoading(false);
      }
    };

    loadImage();
  }, [petData, currentImageSize]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    return status.toLowerCase();
  };

  const handleImageError = (e) => {
    e.target.src = getFallbackImageUrl(currentImageSize);
    e.target.onerror = null;
    setImageError(true);
  };

  return (
    <div className={`unified-pet-card ${mode}`}>
      <div className="card-image-section">
        {imageLoading && (
          <div className="image-loading">
            <div className="loading-spinner"></div>
            <span>Loading...</span>
          </div>
        )}
        
        <img 
          src={imageUrl} 
          alt={petData?.name || "Pet"} 
          className={`pet-image ${imageLoading ? 'loading' : ''} ${imageError ? 'error' : ''}`}
          onLoad={() => setImageLoading(false)}
          onError={handleImageError}
          loading="lazy"
        />
        
        {showStatus && request?.status && (
          <div className="status-overlay">
            <span className={`status-badge ${getStatusClass(request.status)}`}>
              {request.status}
            </span>
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{petData?.name || "Unknown Pet"}</h3>
          {showStatus && request?.status && (
            <span className={`status-badge ${getStatusClass(request.status)}`}>
              {request.status}
            </span>
          )}
        </div>

        <div className="pet-details">
          <p><strong>Species:</strong> {petData?.species || "N/A"}</p>
          <p><strong>Breed:</strong> {petData?.breed || "N/A"}</p>
          <p><strong>Age:</strong> {petData?.age ? `${petData.age} years` : "N/A"}</p>
          <p><strong>Gender:</strong> {petData?.gender ? petData.gender.charAt(0).toUpperCase() + petData.gender.slice(1) : "N/A"}</p>
          <p><strong>Size:</strong> {petData?.size || "N/A"}</p>
          {showDescription && petData?.description && (
            <p><strong>Description:</strong> {petData.description}</p>
          )}
        </div>

        {showUserInfo && request?.user && (
          <div className="user-info">
            <p><strong>Requested By:</strong></p>
            <p>Name: {request.user.name || "N/A"}</p>
            <p>Email: {request.user.email || "N/A"}</p>
          </div>
        )}

        {showRequestDate && request?.createdAt && (
          <div className="request-date">
            <p><strong>Requested on:</strong> {formatDate(request.createdAt)}</p>
          </div>
        )}

        <div className="card-actions">
          {mode === "pet" && (
            <Link to={`/pets/${petData._id}`} className="details-btn">
              Know more about {petData.name}
            </Link>
          )}

          {showAdoptButton && (
            <button 
              className="adopt-btn" 
              onClick={onAdoptClick}
              disabled={hasAlreadyRequested}
            >
              {hasAlreadyRequested ? "Already Requested" : `Adopt ${petData.name}`}
            </button>
          )}

          {showActions && actionButtons.map((button, index) => (
            <button
              key={index}
              className={`action-btn ${button.className || ""}`}
              onClick={() => onAction && onAction(button.action, request?._id)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnifiedPetCard;
