import axios from 'axios';

const API_URL = 'https://petlify.onrender.com/api';

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

export const getAllPets = async () => {
  const response = await axios.get(`${API_URL}/pets/all`);
  return response.data;
};

export const getPetById = async (petId) => {
  const response = await axios.get(`${API_URL}/pets/${petId}`);
  return response.data;
};

export const submitAdoptionRequest = async (petId, token) => {
  const response = await axios.post(
    `${API_URL}/adoptions`,
    { petId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getUserAdoptionRequests = async (token) => {
  const response = await axios.get(`${API_URL}/adoptions/my-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAdoptionRequestStatus = async (requestId, status, token) => {
  const response = await axios.put(
    `${API_URL}/adoptions/update-status`,
    { requestId, status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const submitPet = async (petData, token) => {
  const response = await axios.post(`${API_URL}/pets`, petData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserPets = async (token) => {
  return axios.get("/pets/my-pets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
