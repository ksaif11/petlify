import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPendingAdoptionRequests, 
  getPendingPetSubmissions, 
  updateAdoptionRequestStatus, 
  updatePetStatus 
} from '../../api';
import { showError, showSuccess } from '../../utils/toast';
import UnifiedPetCard from '../../components/UnifiedPetCard/UnifiedPetCard';
import './Organization.css';

const Organization = () => {
  const [activeTab, setActiveTab] = useState('adoption-requests');
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [petSubmissions, setPetSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [requestsData, submissionsData] = await Promise.all([
        getPendingAdoptionRequests(),
        getPendingPetSubmissions()
      ]);
      setAdoptionRequests(requestsData);
      setPetSubmissions(submissionsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.userMessage || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionStatusUpdate = async (requestId, status) => {
    try {
      await updateAdoptionRequestStatus(requestId, status);
      fetchData(); // Refresh data
      showSuccess('Adoption request status updated successfully');
    } catch (err) {
      showError(err.userMessage || 'Error updating adoption request status');
    }
  };

  const handlePetStatusUpdate = async (petId, status) => {
    try {
      await updatePetStatus(petId, status);
      fetchData(); // Refresh data
      showSuccess('Pet submission status updated successfully');
    } catch (err) {
      showError(err.userMessage || 'Error updating pet submission status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAction = (action, requestId) => {
    if (action === 'approve') {
      handleAdoptionStatusUpdate(requestId, 'approved');
    } else if (action === 'reject') {
      handleAdoptionStatusUpdate(requestId, 'rejected');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="organization-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading organization data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organization-page">
        <div className="container">
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <p className="error-text">Error: {error}</p>
            <button 
              className="retry-btn"
              onClick={fetchData}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-page">
      <div className="container">
        <div className="organization-header">
          <h1>Organization Dashboard</h1>
          <p>Manage adoption requests and pet submissions</p>
        </div>

        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'adoption-requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('adoption-requests')}
          >
            <span className="tab-icon">🐾</span>
            Adoption Requests ({adoptionRequests.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pet-submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('pet-submissions')}
          >
            <span className="tab-icon">🏠</span>
            Pet Submissions ({petSubmissions.length})
          </button>
        </div>

        <div className="content-section">
          {activeTab === 'adoption-requests' && (
            <div className="adoption-requests-section">
              <h2>Pending Adoption Requests</h2>
              {adoptionRequests.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📭</div>
                  <p>No pending adoption requests</p>
                  <span>All adoption requests have been processed</span>
                </div>
              ) : (
                <div className="requests-grid">
                  {adoptionRequests.map((request) => (
                    <div key={request._id} className="adoption-request-card">
                      <div className="request-header">
                        <h3>Adoption Request</h3>
                        <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="request-content">
                        <div className="pet-section">
                          <h4>Pet Information</h4>
                          <div className="pet-details">
                            <div className="pet-image-container">
                              {request.pet?.images && request.pet.images.length > 0 ? (
                                <img 
                                  src={request.pet.images[0]} 
                                  alt={request.pet.name}
                                  className="pet-image"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-pet.jpg';
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <div className="no-image-placeholder">
                                  <span>📷</span>
                                  <p>No image available</p>
                                </div>
                              )}
                            </div>
                            <div className="pet-info">
                              <p><strong>Name:</strong> {request.pet?.name || 'N/A'}</p>
                              <p><strong>Species:</strong> {request.pet?.species || 'N/A'}</p>
                              <p><strong>Breed:</strong> {request.pet?.breed || 'N/A'}</p>
                              <p><strong>Age:</strong> {request.pet?.age ? `${request.pet.age} years` : 'N/A'}</p>
                              <p><strong>Gender:</strong> {request.pet?.gender || 'N/A'}</p>
                              <p><strong>Size:</strong> {request.pet?.size || 'N/A'}</p>
                              {request.pet?.description && (
                                <p><strong>Description:</strong> {request.pet.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="applicant-section">
                          <h4>Applicant Information</h4>
                          <div className="applicant-details">
                            <p><strong>Name:</strong> {request.user?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {request.user?.email || 'N/A'}</p>
                            <p><strong>Request Date:</strong> {formatDate(request.createdAt)}</p>
                            {request.reason && (
                              <div className="reason-section">
                                <p><strong>Reason for Adoption:</strong></p>
                                <p className="reason-text">{request.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="request-actions">
                        <button 
                          className="action-btn approve"
                          onClick={() => handleAdoptionStatusUpdate(request._id, 'approved')}
                        >
                          <span className="btn-icon">✅</span>
                          Approve Request
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handleAdoptionStatusUpdate(request._id, 'rejected')}
                        >
                          <span className="btn-icon">❌</span>
                          Reject Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pet-submissions' && (
            <div className="pet-submissions-section">
              <h2>Pending Pet Submissions</h2>
              {petSubmissions.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📭</div>
                  <p>No pending pet submissions</p>
                  <span>All pet submissions have been processed</span>
                </div>
              ) : (
                <div className="submissions-grid">
                  {petSubmissions.map((pet) => (
                    <div key={pet._id} className="submission-card">
                      <div className="submission-header">
                        <h3>Pet Submission</h3>
                        <span className={`status-badge ${getStatusBadgeClass(pet.status)}`}>
                          {pet.status}
                        </span>
                      </div>
                      
                      <div className="submission-content">
                        <div className="pet-images-section">
                          <h4>Pet Images</h4>
                          <div className="pet-images">
                            {pet.images && pet.images.length > 0 ? (
                              <div className="image-gallery">
                                {pet.images.slice(0, 3).map((image, index) => (
                                  <img 
                                    key={index}
                                    src={image} 
                                    alt={`${pet.name} - Image ${index + 1}`}
                                    className="pet-gallery-image"
                                    onError={(e) => {
                                      e.target.src = '/placeholder-pet.jpg';
                                      e.target.onerror = null;
                                    }}
                                  />
                                ))}
                                {pet.images.length > 3 && (
                                  <div className="more-images">
                                    <span>+{pet.images.length - 3} more</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="no-images-placeholder">
                                <span>📷</span>
                                <p>No images provided</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="pet-details-section">
                          <h4>Pet Details</h4>
                          <div className="pet-details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Name:</span>
                              <span className="detail-value">{pet.name || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Species:</span>
                              <span className="detail-value">{pet.species || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Breed:</span>
                              <span className="detail-value">{pet.breed || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Age:</span>
                              <span className="detail-value">{pet.age ? `${pet.age} years` : 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Gender:</span>
                              <span className="detail-value">{pet.gender || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Size:</span>
                              <span className="detail-value">{pet.size || 'N/A'}</span>
                            </div>
                            <div className="detail-item full-width">
                              <span className="detail-label">Description:</span>
                              <span className="detail-value">{pet.description || 'No description provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="submitter-section">
                          <h4>Submitted By</h4>
                          <div className="submitter-details">
                            <p><strong>Name:</strong> {pet.submittedBy?.name || 'N/A'}</p>
                            <p><strong>Email:</strong> {pet.submittedBy?.email || 'N/A'}</p>
                            <p><strong>Submission Date:</strong> {formatDate(pet.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="submission-actions">
                        <button 
                          className="action-btn approve"
                          onClick={() => handlePetStatusUpdate(pet._id, 'approved')}
                        >
                          <span className="btn-icon">✅</span>
                          Approve Submission
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handlePetStatusUpdate(pet._id, 'rejected')}
                        >
                          <span className="btn-icon">❌</span>
                          Reject Submission
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;
