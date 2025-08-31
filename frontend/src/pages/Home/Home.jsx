import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedPets } from "../../api";
import { getPetImageUrl, getFallbackImageUrl, getResponsiveImageUrl } from "../../utils/imageUtils";
import "./Home.css";

const Home = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const pets = await getFeaturedPets();
        setFeaturedPets(pets);
      } catch {
        setFeaturedPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedPets();
  }, []);

  const handleImageError = (e) => {
    e.target.src = getFallbackImageUrl('medium');
    e.target.onerror = null;
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Companion</h1>
          <p>Connect with loving pets waiting for their forever homes</p>
          <div className="hero-buttons">
            <Link to="/pets" className="cta-button primary">
              Browse Pets
            </Link>
            <Link to="/submit-pet" className="cta-button secondary">
              Submit a Pet
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-pets-section">
        <div className="container">
          <h2>Featured Pets</h2>
          <p>Meet some of our adorable pets looking for homes</p>
          
          {loading ? (
            <div className="loading-container">
              <p>Loading featured pets...</p>
            </div>
          ) : (
            <div className="featured-pets-grid">
              {featuredPets.map((pet) => (
                <div key={pet._id} className="featured-pet-card">
                  <div className="pet-image-container">
                    <img
                      src={getResponsiveImageUrl(getPetImageUrl(pet), 'medium')}
                      alt={pet.name}
                      onError={(e) => handleImageError(e, pet.name)}
                      loading="lazy"
                    />
                  </div>
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p>{pet.species} • {pet.breed}</p>
                    <p>{pet.age} years old</p>
                    <Link to={`/pets/${pet._id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="view-all-pets">
            <Link to="/pets" className="view-all-btn">
              View All Pets
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2>Success Stories</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>We found our perfect match through PetLify. The adoption process was smooth and we couldn&apos;t be happier!&quot;</p>
                <div className="testimonial-author">
                  <strong>Saif, Mumbai, India</strong>
                  <span>Adopted Luna, a 2-year-old Golden Retriever</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>PetLify helped us find our furry family member. The platform made it easy to connect with pet owners.&quot;</p>
                <div className="testimonial-author">
                  <strong>Devesh, Delhi, India</strong>
                  <span>Adopted Whiskers, a 1-year-old Tabby Cat</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>Thanks to PetLify, we found our loyal companion. The detailed pet profiles helped us make the right choice."</p>
                <div className="testimonial-author">
                  <strong>Mohit, Varanasi, India</strong>
                  <span>Adopted Max, a 3-year-old Labrador</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Pet?</h2>
          <p>Join thousands of happy families who found their companions through PetLify</p>
                     <div className="cta-buttons">
             <Link to="/pets" className="cta-button primary">
               Start Your Search
             </Link>
             <Link to="/submit-pet" className="cta-button secondary">
               List Your Pet
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
