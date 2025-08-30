import React, { useEffect, useState } from 'react';
import { getAllPets } from '../../api';
import UnifiedPetCard from '../../components/UnifiedPetCard/UnifiedPetCard';
import './PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllPets();
        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        setError('Failed to load pets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter((pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecies !== "all") {
      filtered = filtered.filter((pet) => pet.species.toLowerCase() === selectedSpecies.toLowerCase());
    }

    if (selectedAge !== "all") {
      const ageRanges = {
        "young": (age) => age <= 2,
        "adult": (age) => age > 2 && age <= 7,
        "senior": (age) => age > 7
      };
      
      if (ageRanges[selectedAge]) {
        filtered = filtered.filter((pet) => ageRanges[selectedAge](pet.age));
      }
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, selectedSpecies, selectedAge]);

  const speciesOptions = [...new Set(pets.map(pet => pet.species))];

  if (loading) {
    return (
      <div className="pet-list-page">
        <div className="container">
          <div className="loading-container">
            <p className="loading-text">Loading pets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-list-page">
        <div className="container">
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-list-page">
      <div className="container">
        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Species</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
            
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ages</option>
              <option value="young">Young (0-2 years)</option>
              <option value="adult">Adult (3-7 years)</option>
              <option value="senior">Senior (8+ years)</option>
            </select>
          </div>
        </div>

        <div className="pets-grid">
          {filteredPets.length === 0 ? (
            <div className="no-pets">
              <p>No pets found matching your criteria.</p>
            </div>
          ) : (
            filteredPets.map((pet) => (
              <UnifiedPetCard
                key={pet._id}
                pet={pet}
                mode="pet"
                showAdoptButton={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PetList;