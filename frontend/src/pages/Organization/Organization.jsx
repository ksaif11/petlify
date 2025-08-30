import React, { useState, useEffect } from 'react';
import { 
  getAllAdoptionRequests, 
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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsData, submissionsData] = await Promise.all([
        getPendingAdoptionRequests(),
        getPendingPetSubmissions()
      ]);
      setAdoptionRequests(requestsData);
      setPetSubmissions(submissionsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
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
      day: 'numeric'
    });
  };

  const handleAction = (action, requestId) => {
    if (action === 'approve') {
      handleAdoptionStatusUpdate(requestId, 'approved');
    } else if (action === 'reject') {
      handleAdoptionStatusUpdate(requestId, 'rejected');
    }
  };

  if (loading) {
    return (
      <div className="organization-page">
        <div className="container">
          <p className="loading-text">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organization-page">
        <div className="container">
          <p className="error-text">Error: {error}</p>
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
            Adoption Requests
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pet-submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('pet-submissions')}
          >
            Pet Submissions
          </button>
        </div>

        <div className="content-section">
          {activeTab === 'adoption-requests' && (
            <div className="adoption-requests-section">
              <h2>Pending Adoption Requests</h2>
              {adoptionRequests.length === 0 ? (
                <div className="no-data">No pending adoption requests</div>
              ) : (
                <div className="requests-grid">
                  {adoptionRequests.map((request) => (
                    <UnifiedPetCard
                      key={request._id}
                      request={request}
                      mode="organization"
                      showActions={true}
                      onAction={handleAction}
                      actionButtons={[
                        { label: 'Approve', action: 'approve', className: 'approve' },
                        { label: 'Reject', action: 'reject', className: 'reject' }
                      ]}
                      showUserInfo={true}
                      showRequestDate={true}
                      showStatus={true}
                      showDescription={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pet-submissions' && (
            <div className="pet-submissions-section">
              <h2>Pending Pet Submissions</h2>
              {petSubmissions.length === 0 ? (
                <div className="no-data">No pending pet submissions</div>
              ) : (
                <div className="submissions-grid">
                  {petSubmissions.map((pet) => (
                    <div key={pet._id} className="submission-card">
                      <div className="submission-header">
                        <h3>{pet.name}</h3>
                        <span className={`status-badge ${pet.status}`}>
                          {pet.status}
                        </span>
                      </div>
                      
                      <div className="submission-images">
                        {pet.images && pet.images.length > 0 && (
                          <img 
                            src={pet.images[0].url} 
                            alt={pet.name}
                            className="pet-image"
                          />
                        )}
                      </div>
                      
                      <div className="submission-details">
                        <div className="pet-info">
                          <p><strong>Pet Details:</strong></p>
                          <p>Species: {pet.species}</p>
                          <p>Breed: {pet.breed}</p>
                          <p>Age: {pet.age} years</p>
                          <p>Description: {pet.description}</p>
                        </div>
                        
                        <div className="owner-info">
                          <p><strong>Submitted By:</strong></p>
                          <p>Name: {pet.owner?.name}</p>
                          <p>Email: {pet.owner?.email}</p>
                        </div>
                        
                        <div className="submission-date">
                          <p><strong>Submitted on:</strong> {formatDate(pet.createdAt)}</p>
                        </div>
                      </div>

                      <div className="submission-actions">
                        <button 
                          className="action-btn approve"
                          onClick={() => handlePetStatusUpdate(pet._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => handlePetStatusUpdate(pet._id, 'rejected')}
                        >
                          Reject
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
