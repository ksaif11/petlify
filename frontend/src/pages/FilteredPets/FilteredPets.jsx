import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PetCard from "../../components/PetCard/PetCard";

const FilteredPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const petType = searchParams.get("type") || "";

  useEffect(() => {
    const fetchFilteredPets = async () => {
      if (!petType) {
        setError("Please select a pet type.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`https://petlify.onrender.com/api/pets/search?type=${petType}`);
        const updatedPets = response?.data.map(pet => ({
          ...pet,
          image: pet.image?.startsWith("http") ? pet.image : `https://petlify.onrender.com${pet.image}`
        }));
        setPets(updatedPets);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("No pets found in this category.");
        } else {
          setError("Error fetching pets.");
        }
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPets();
  }, [petType]);

  return (
    <div 
      className="filtered-pets-page" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "80vh", // Ensures vertical centering
        textAlign: "center" // Centers text inside
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "20px" }}>
        Available {petType ? `${petType.charAt(0).toUpperCase()}${petType.slice(1)}s` : "Pets"}
      </h2>
  
      {loading ? (
        <p style={{ fontSize: "1.2rem", color: "#555" }}>Loading pets...</p>
      ) : error ? (
        <p style={{ fontSize: "1.2rem", color: "red", fontWeight: "bold" }}>{error}</p>
      ) : (
        <div className="pet-list">
          {pets.map((pet) => (
            <PetCard pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
  
  
};

export default FilteredPets;
