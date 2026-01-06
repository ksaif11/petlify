import axios from 'axios';

const API_URL ="https://petlify.onrender.com/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Enhance error object with better error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    error.userMessage = errorMessage;
    
    // Log error for debugging
    console.error('API Error:', error);
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// Pet API functions
export const getAllPets = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  // Add filter parameters if provided
  if (filters.search) params.append('search', filters.search);
  if (filters.species) params.append('species', filters.species);
  if (filters.age) params.append('age', filters.age);
  if (filters.status) params.append('status', filters.status);
  
  const response = await api.get(`/pets?${params}`);
  // Handle both old format (array) and new format (object with pets and pagination)
  return response.data.pets || response.data;
};

export const getFeaturedPets = async () => {
  const response = await api.get('/pets/featured');
  return response.data;
};

export const getPetById = async (petId) => {
  const response = await api.get(`/pets/${petId}`);
  return response.data;
};

export const submitPet = async (petData) => {
  const response = await api.post('/pets', petData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Adoption API functions
export const submitAdoptionRequest = async (adoptionData) => {
  const response = await api.post('/adoptions', adoptionData);
  return response.data;
};

export const getUserAdoptionRequests = async (page = 1, limit = 20) => {
  const response = await api.get(`/adoptions/my-requests?page=${page}&limit=${limit}`);
  // Handle both old format (array) and new format (object with requests and pagination)
  return response.data.requests || response.data;
};

export const getAllAdoptionRequests = async (page = 1, limit = 20) => {
  const response = await api.get(`/adoptions/all?page=${page}&limit=${limit}`);
  // Handle both old format (array) and new format (object with requests and pagination)
  return response.data.requests || response.data;
};

export const updateAdoptionRequestStatus = async (requestId, status) => {
  const response = await api.put('/adoptions/update-status', { requestId, status });
  return response.data;
};

// Organization API functions


export const getPendingAdoptionRequests = async (page = 1, limit = 20) => {
  const response = await api.get(`/adoptions/pending?page=${page}&limit=${limit}`);
  // Handle both old format (array) and new format (object with requests and pagination)
  return response.data.requests || response.data;
};

export const getPendingPetSubmissions = async (page = 1, limit = 20) => {
  const response = await api.get(`/pets/pending/submissions?page=${page}&limit=${limit}`);
  // Handle both old format (array) and new format (object with pets and pagination)
  return response.data.pets || response.data;
};

export const updatePetStatus = async (petId, status) => {
  const response = await api.put('/pets/update-status', { petId, status });
  return response.data;
};

// Export the api instance for custom requests
export default api;
