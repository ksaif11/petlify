import { useState, useEffect } from "react";
import { getUserAdoptionRequests, updateAdoptionRequestStatus } from "../../api";

const OnlyAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const token = sessionStorage.getItem("token"); 

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      const data = await getUserAdoptionRequests(token);
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load requests");
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId) => {
    try {
      const newStatus = selectedStatus[requestId] || "pending";
      await updateAdoptionRequestStatus(requestId, newStatus, token);
      fetchAdoptionRequests();
      alert("adoption request status successfully updated")
    } catch (err) {
      setError("Error updating status");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Admin Panel - Manage Adoption Requests</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req.pet?.name || "Unknown"}</td>
                <td>{req.user?.email || "Unknown"}</td>
                <td>
                  <select
                    value={selectedStatus[req._id] || req.status}
                    onChange={(e) =>
                      setSelectedStatus({
                        ...selectedStatus,
                        [req._id]: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleStatusChange(req._id)}>
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No adoption requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OnlyAdmin;
