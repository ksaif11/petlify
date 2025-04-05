import React, { useEffect, useState } from "react";
import { getUserAdoptionRequests } from "../../api";
import "./MyAdoptions.css";

const MyAdoptions = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your adoption requests.");
          setRequests([]);
          return;
        }

        const data = await getUserAdoptionRequests(token);

        if (!data || data.length === 0) {
          setRequests([]);
          setError("No adoption requests found.");
        } else {
          setRequests(data);
        }
      } catch (err) {
        console.error("Error fetching adoption requests:", err);
        setError("Failed to load adoption requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="my-adoptions-page">
      <h1>My Adoption Requests</h1>

      {loading ? (
        <p className="loading-text">Loading your requests...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <img
                src={request.pet?.image || "data:image/jpeg;base64,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"}
                alt={request.pet?.name || "Pet"}
                className="pet-image"
              />
              <div className="request-info">
                <h2>{request.pet?.name || "Unknown"}</h2>
                <p><strong>Species:</strong> {request.pet?.species || "N/A"}</p>
                <p><strong>Breed:</strong> {request.pet?.breed || "N/A"}</p>
                <p><strong>Age:</strong> {request.pet?.age ? `${request.pet.age} years` : "N/A"}</p>
                <p><strong>Status:</strong> <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdoptions;
