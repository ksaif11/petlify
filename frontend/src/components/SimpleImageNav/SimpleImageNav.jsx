import React, { useState } from 'react';
import { getFallbackImageUrl, getResponsiveImageUrl } from '../../utils/imageUtils';
import './SimpleImageNav.css';

const SimpleImageNav = ({ images, petName = "Pet" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const processImages = () => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [getFallbackImageUrl('large')];
    }

    const validImages = images
      .map(image => {
        const url = typeof image === 'string' ? image : image.url;
        return url || null;
      })
      .filter(url => url !== null);

    return validImages.length > 0 ? validImages : [getFallbackImageUrl('large')];
  };

  const processedImages = processImages();

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === processedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? processedImages.length - 1 : prevIndex - 1
    );
  };

  const handleImageError = (e) => {
    e.target.src = getFallbackImageUrl('large');
    e.target.onerror = null;
    setImageError(true);
  };

  const currentImage = processedImages[currentIndex];
  const imageUrl = getResponsiveImageUrl(currentImage, 'large');

  return (
    <div className="simple-image-nav">
      <div className="image-container">
        <img 
          src={imageUrl}
          alt={`${petName} - Image ${currentIndex + 1}`}
          className={`main-image ${imageError ? 'error' : ''}`}
          onError={handleImageError}
          loading="eager"
        />

        {processedImages.length > 1 && (
          <>
            <button 
              className="nav-arrow prev-arrow" 
              onClick={prevImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button 
              className="nav-arrow next-arrow" 
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {processedImages.length > 1 && (
        <div className="image-counter">
          <span>{currentIndex + 1} / {processedImages.length}</span>
        </div>
      )}

      {imageError && (
        <div className="error-indicator">
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default SimpleImageNav;
