import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get("http://localhost:9000/api/pets/all");
        const updatedPets = response?.data.map((pet) => ({
          ...pet,
          image: pet.image?.startsWith("http")
            ? pet.image
            : `http://localhost:9000${pet.image}`,
        }));
        setFeaturedPets(updatedPets?.slice(0, 3)); // Show only 3 featured pets
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError("Failed to load featured pets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Find Your New Best Friend</h1>
        <p>
          Thousands of pets are waiting for a loving home. Start your journey
          today!
        </p>
        <Link to="/pets/all" className="cta-button">
          Browse Pets
        </Link>
      </section>

      <section className="featured">
        <h2>Featured Pets</h2>
        {loading ? (
          <p className="loading-text">Loading pets...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="featured-pets">
            {featuredPets.length > 0 ? (
              featuredPets.map((pet) => {
                return (
                  <div key={pet._id} className="pet-card">
                    <Link to={`/pets/${pet._id}`}>
                      <img src={pet.image} alt={pet.name} />
                      <h3>{pet.name}</h3>
                      <p>{pet.species}</p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="error-text">No featured pets available.</p>
            )}
          </div>
        )}
      </section>

      <section className="categories">
        <h2>Browse by Category</h2>
        <div className="category-buttons">
          <Link to="/pets?type=Dog" className="category">
            Dogs
          </Link>
          <Link to="/pets?type=Cat" className="category">
            Cats
          </Link>
          <Link to="/pets?type=Rabbit" className="category">
            Rabbits
          </Link>
          <Link to="/pets?type=Bird" className="category">
            Birds
          </Link>
        </div>
      </section>

      <section className="stories">
        <h2>Happy Adoption Stories</h2>
        <div className="story-container">
          <div className="story">
            <p>
              “I adopted Bella two months ago, and she has changed my life! This
              platform made the process so easy.”
            </p>
            <span>- Saif, Mumbai</span>
          </div>
          <div className="story">
            <p>
              “Max is the best dog ever! I found him here and couldn’t be
              happier.”
            </p>
            <span>- Devesh, Delhi</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
