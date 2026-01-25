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
        setError("");
        const petData = await getPetById(id);
        setPet(petData);

        if (loggedIn) {
          try {
            const requests = await getUserAdoptionRequests();
            // Handle both array and pagination object format
            const requestsArray = Array.isArray(requests) ? requests : (requests.requests || []);
            setUserRequests(requestsArray);
          } catch (requestError) {
            console.error('Error fetching user requests:', requestError);
            // Don't fail the whole component if user requests fail
          }
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError(err.userMessage || "Failed to load pet details.");
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, loggedIn]);

  const hasAlreadyRequested = userRequests.some((req) => req.pet?._id === id);

  const handleAdopt = () => {
    if (!loggedIn) {
      showError("Please login to adopt a pet.");
      navigate("/login");
      return;
    }

    if (hasAlreadyRequested) {
      showWarning("You have already submitted an adoption request for this pet.");
      return;
    }

    if (!id) {
      showError("Pet ID is missing. Please try again.");
      return;
    }

    navigate(`/adopt/${id}`);
  };

  if (error) {
    return (
      <div className="pet-detail-page">
        <div className="container">
          <div className="error-container">
            <p className="error-text">{error}</p>
            <button onClick={() => navigate('/pets')} className="back-btn">
              Back to Pets
            </button>
          </div>
        </div>
      </div>
    );
  }

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
