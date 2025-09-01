import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllPets } from '../../api';
import { showError } from '../../utils/toast';
import UnifiedPetCard from '../../components/UnifiedPetCard/UnifiedPetCard';
import './PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
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

  const handleAdoptClick = (petId) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      showError("Please login to adopt a pet.");
      navigate("/login");
      return;
    }
    navigate(`/adopt/${petId}`);
  };

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
          <h2 className="filters-title">Find Your Perfect Companion</h2>
          <p className="filters-subtitle">Search and filter through our available pets to find your ideal match</p>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by pet name, breed, or species..."
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
              <option value="all">All Species - Choose a pet type</option>
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
              <option value="all">All Ages (Select from the dropdown)</option>
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
                variant="detailed"
                onAdoptClick={handleAdoptClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PetList;