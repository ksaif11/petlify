// Validation utility functions

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate age (must be positive number)
 * @param {string|number} age - Age to validate
 * @returns {Object} Validation result
 */
export const validateAge = (age) => {
  if (!age) {
    return { isValid: false, message: 'Age is required' };
  }
  
  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge <= 0) {
    return { isValid: false, message: 'Age must be a positive number' };
  }
  
  if (numAge > 30) {
    return { isValid: false, message: 'Age seems too high for a pet' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate weight (must be positive number)
 * @param {string|number} weight - Weight to validate
 * @returns {Object} Validation result
 */
export const validateWeight = (weight) => {
  if (!weight) {
    return { isValid: false, message: 'Weight is required' };
  }
  
  const numWeight = parseFloat(weight);
  if (isNaN(numWeight) || numWeight <= 0) {
    return { isValid: false, message: 'Weight must be a positive number' };
  }
  
  if (numWeight > 200) {
    return { isValid: false, message: 'Weight seems too high for a pet' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate ZIP code
 * @param {string} zipCode - ZIP code to validate
 * @returns {Object} Validation result
 */
export const validateZipCode = (zipCode) => {
  if (!zipCode) {
    return { isValid: false, message: 'ZIP code is required' };
  }
  
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return { isValid: false, message: 'Please enter a valid ZIP code' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in MB
 * @returns {Object} Validation result
 */
export const validateFile = (file, maxSize = 5) => {
  if (!file) {
    return { isValid: false, message: 'File is required' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed' };
  }
  
  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, message: `File size must be less than ${maxSize}MB` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate multiple files
 * @param {FileList|Array} files - Files to validate
 * @param {number} maxFiles - Maximum number of files
 * @param {number} maxSize - Maximum file size in MB
 * @returns {Object} Validation result
 */
export const validateMultipleFiles = (files, maxFiles = 5, maxSize = 5) => {
  if (!files || files.length === 0) {
    return { isValid: false, message: 'At least one image is required' };
  }
  
  if (files.length > maxFiles) {
    return { isValid: false, message: `Maximum ${maxFiles} images allowed` };
  }
  
  for (let i = 0; i < files.length; i++) {
    const validation = validateFile(files[i], maxSize);
    if (!validation.isValid) {
      return validation;
    }
  }
  
  return { isValid: true, message: '' };
};
