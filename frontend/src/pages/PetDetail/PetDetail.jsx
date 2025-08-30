import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPetById, getUserAdoptionRequests } from "../../api";
import { showError, showWarning } from "../../utils/toast";
import PetDetailCard from "../../components/PetDetailCard/PetDetailCard";
import "./PetDetail.css";

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
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
          const requests = await getUserAdoptionRequests();
          setUserRequests(requests);
        }
      } catch (err) {
        setError("Failed to load pet details.");
      }
    };
    fetchData();
  }, [id, loggedIn]);

  const hasAlreadyRequested = userRequests.some((req) => req.pet?._id === id);

  const handleAdopt = () => {
    if (!loggedIn) {
      showError("Please login to adopt a pet.");
      return;
    }

    if (hasAlreadyRequested) {
      showWarning("You have already submitted an adoption request for this pet.");
      return;
    }

    navigate(`/adopt/${id}`);
  };

  if (!pet) {
    return (
      <div className="pet-detail-page">
        <div className="container">
          <div className="loading-container">
            <p className="loading-text">Loading pet details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-detail-page">
      <div className="container">
        <PetDetailCard
          pet={pet}
          onAdoptClick={handleAdopt}
          hasAlreadyRequested={hasAlreadyRequested}
        />
      </div>
    </div>
  );
};

export default PetDetail;
