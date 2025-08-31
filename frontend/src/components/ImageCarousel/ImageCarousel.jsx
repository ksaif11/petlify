import React, { useState } from 'react';
import { getFallbackImageUrl } from '../../utils/imageUtils';
import './ImageCarousel.css';

const ImageCarousel = ({ images, petName, className = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`image-carousel ${className}`}>
        <img
          src={getFallbackImageUrl('medium')}
          alt={`${petName || 'Pet'} - No image available`}
          className="carousel-image"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentImage = images[currentImageIndex];
  const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.url || currentImage;

  return (
    <div className={`image-carousel ${className}`}>
      <img
        src={imageUrl || getFallbackImageUrl('medium')}
        alt={`${petName || 'Pet'} - Image ${currentImageIndex + 1}`}
        className="carousel-image"
        onError={(e) => {
          e.target.src = getFallbackImageUrl('medium');
          e.target.onerror = null;
        }}
      />
      
      {images.length > 1 && (
        <>
          <button 
            className="carousel-button carousel-button-prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button 
            className="carousel-button carousel-button-next"
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
          
          <div className="carousel-indicators">
            <span className="carousel-counter">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
