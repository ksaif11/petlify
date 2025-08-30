const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  const imageDomains = [
    'cloudinary.com',
    'unsplash.com',
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com'
  ];
  
  const hasImageDomain = imageDomains.some(domain => 
    url.includes(domain)
  );
  
  return hasImageExtension || hasImageDomain;
};

export const getPetImageUrl = (pet) => {
  if (!pet) return null;
  
  try {
    if (pet.images && Array.isArray(pet.images) && pet.images.length > 0) {
      const firstImage = pet.images[0];
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }
    
    if (pet.image) {
      return pet.image;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export const getPetImages = (pet) => {
  if (!pet) return [];
  
  try {
    if (pet.images && Array.isArray(pet.images)) {
      return pet.images.map(image => {
        if (typeof image === 'string') {
          return image;
        } else if (image && image.url) {
          return image.url;
        }
        return null;
      }).filter(url => url !== null);
    }
    
    if (pet.image) {
      return [pet.image];
    }
    
    return [];
  } catch (error) {
    return [];
  }
};

export const getFallbackImageUrl = (size = 'medium') => {
  const sizes = {
    small: 'w=300&h=200',
    medium: 'w=600&h=400',
    large: 'w=800&h=600'
  };
  
  const sizeParam = sizes[size] || sizes.medium;
  return `https://images.unsplash.com/photo-1450778869180-41d0601e046e?${sizeParam}&fit=crop&crop=center&auto=format&q=80`;
};

export const getResponsiveImageUrl = (imageUrl, size = 'medium') => {
  if (!imageUrl) return getFallbackImageUrl(size);
  
  if (imageUrl.includes('unsplash.com')) {
    const sizes = {
      small: 'w=300&h=200',
      medium: 'w=600&h=400',
      large: 'w=800&h=600'
    };
    
    const sizeParam = sizes[size] || sizes.medium;
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}${sizeParam}&fit=crop&crop=center&auto=format&q=80`;
  }
  
  if (imageUrl.includes('cloudinary.com')) {
    const sizes = {
      small: 'c_scale,w_300,h_200',
      medium: 'c_scale,w_600,h_400',
      large: 'c_scale,w_800,h_600'
    };
    
    const sizeParam = sizes[size] || sizes.medium;
    return imageUrl.replace('/upload/', `/upload/${sizeParam}/`);
  }
  
  return imageUrl;
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const extractImageDimensions = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    img.onerror = () => reject(new Error(`Failed to extract dimensions: ${imageUrl}`));
    img.src = imageUrl;
  });
};
