import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, submitAdoptionRequest, getUserAdoptionRequests } from "../../api";
import "./PetDetail.css";
import AdoptionRequestModal from "../../components/AdoptionRequestModal/AdoptionRequestModal";

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState("");
  const loggedIn = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petData = await getPetById(id);
        setPet(petData);

        if (loggedIn) {
          const token = sessionStorage.getItem("token");
          const requests = await getUserAdoptionRequests(token);
          setUserRequests(requests);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load pet details.");
      }
    };
    fetchData();
  }, [id, loggedIn]);

  const hasAlreadyRequested = userRequests.some((req) => req.pet?._id === id);

  const handleAdopt = () => {
    if (!loggedIn) {
      alert("Please login to adopt a pet.");
      return;
    }

    if (hasAlreadyRequested) {
      alert("You have already submitted an adoption request for this pet.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleRequestSubmit = () => {
    alert("Adoption request submitted.");
    setIsModalOpen(false);
    navigate("/pets/all");
  };

  if (!pet) {
    return <div className="loading-container"><p className="loading-text">Loading pet details...</p></div>;
  }

  return (
    <div className="pet-detail-page">
      <div className="pet-detail-container">
        <img src={pet.image || "default-placeholder.jpg"} alt={pet.name} className="pet-detail-image" />
        <div className="pet-detail-info">
          <h1>{pet.name}</h1>
          <p><strong>Species:</strong> {pet.species}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} years</p>
          <p><strong>Description:</strong> {pet.description}</p>
          <button className="adopt-btn" onClick={handleAdopt}>Adopt {pet.name}</button>
        </div>
      </div>

      {isModalOpen && loggedIn && (
        <AdoptionRequestModal
          petId={pet._id}
          onClose={() => setIsModalOpen(false)}
          onRequestSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
};

export default PetDetail;
