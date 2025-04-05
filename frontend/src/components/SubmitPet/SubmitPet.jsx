import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPet } from "../../api"
import "./SubmitPet.css";

const SubmitPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to list a pet.");
      navigate("/login");
      return;
    }
  
    // Convert formData to FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("species", formData.species);
    formDataToSend.append("breed", formData.breed);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image); // Append image file
  
    try {
      await submitPet(formDataToSend, token);
      alert("Pet listed successfully!");
      navigate("/pets/all");
    } catch (error) {
      console.error("Error submitting pet:", error);
      alert(error.response?.data?.message || "Failed to list pet. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="submit-pet-container">
      <h1>List a Pet for Adoption</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Pet Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="species"
          placeholder="Species (e.g., Dog, Cat)"
          value={formData.species}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="breed"
          placeholder="Breed"
          value={formData.breed}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age (in years)"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Brief description about the pet"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SubmitPet;
