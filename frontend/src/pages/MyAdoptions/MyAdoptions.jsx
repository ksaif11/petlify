import React, { useEffect, useState } from "react";
import { getUserAdoptionRequests } from "../../api";
import UnifiedPetCard from "../../components/UnifiedPetCard/UnifiedPetCard";
import "./MyAdoptions.css";

const MyAdoptions = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const data = await getUserAdoptionRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to load adoption requests");
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptionRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  };

  if (loading) {
    return (
      <div className="my-adoptions-page">
        <div className="container">
          <div className="loading-container">
            <p>Loading your adoption requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-adoptions-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-adoptions-page">
      <div className="container">
        <div className="page-header">
          <h1>My Adoption Requests</h1>
          <p>Track the status of your pet adoption applications</p>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests">
            <p>You haven't submitted any adoption requests yet.</p>
            <a href="/pets" className="browse-pets-btn">
              Browse Available Pets
            </a>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <UnifiedPetCard
                  request={request}
                  mode="adoption-request"
                  showStatus={true}
                  showRequestDate={true}
                />
                <div className="request-status">
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {request.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdoptions;
