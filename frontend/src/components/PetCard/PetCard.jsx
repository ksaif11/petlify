import React from "react";
import { Link } from "react-router-dom";
import "./PetCard.css";

const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <div className="pet-info">
        <img src={pet?.image} alt={pet.name} className="pet-image" />
        <h3>{pet.name}</h3>
        <p>{pet.species} - {pet.breed}</p>
      </div>
      <div className="pet-buttons">
        <Link to={`/pets/${pet._id}`} className="details-btn">
          Know more about {pet.name}
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
