import { useState, useEffect } from "react";
import { getAllAdoptionRequests, updateAdoptionRequestStatus } from "../../api";
import { showError, showSuccess } from "../../utils/toast";
import UnifiedPetCard from "../../components/UnifiedPetCard/UnifiedPetCard";
import "./OnlyAdmin.css";

const OnlyAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({}); 

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      const data = await getAllAdoptionRequests();
      setRequests(data);
      setLoading(false);
    } catch {
      setError("Failed to load requests");
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId) => {
    try {
      const newStatus = selectedStatus[requestId] || "pending";
      await updateAdoptionRequestStatus(requestId, newStatus);
      fetchAdoptionRequests();
      showSuccess("Adoption request status successfully updated");
    } catch (err) {
      const errorMessage = err.userMessage || "Error updating status";
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleAction = (action, requestId) => {
    if (action === 'update') {
      handleStatusChange(requestId);
    }
  };

  if (loading) return (
    <div className="admin-page">
      <div className="container">
        <p className="loading-text">Loading adoption requests...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="admin-page">
      <div className="container">
        <p className="error-text">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel - Manage Adoption Requests</h1>
          <p>Review and update the status of adoption requests</p>
        </div>

        <div className="admin-content">
          {requests.length > 0 ? (
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request._id} className="admin-request-wrapper">
                  <UnifiedPetCard
                    request={request}
                    mode="admin"
                    showStatus={true}
                    showUserInfo={true}
                    showRequestDate={true}
                    showDescription={false}
                  />
                  <div className="admin-controls">
                    <select
                      value={selectedStatus[request._id] || request.status}
                      onChange={(e) =>
                        setSelectedStatus({
                          ...selectedStatus,
                          [request._id]: e.target.value,
                        })
                      }
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      onClick={() => handleAction('update', request._id)}
                      className="update-btn"
                      disabled={selectedStatus[request._id] === request.status}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-requests">
              <p>No adoption requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlyAdmin;
