import React, { useEffect, useState } from 'react';
import { getAllPets } from '../../api';
import PetCard from '../../components/PetCard/PetCard';
import Navbar from '../../components/Navbar/Navbar';
import './PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const data = await getAllPets();
      // Ensure the image URL is absolute
      const updatedPets = data.map(pet => ({
        ...pet,
        image: pet.image?.startsWith("http") ? pet.image : `https://petlify.onrender.com${pet.image}`
      }));
      setPets(updatedPets); 
    };
    fetchPets();
  }, []);
  return (
    <div className="pet-list-page">
      <h1>Available Pets</h1>
      <div className="pet-list">
        {pets.map((pet) => (
          <PetCard key={pet._id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetList;