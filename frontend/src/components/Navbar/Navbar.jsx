import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Close the profile menu if user clicks outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Petlify</Link>
      </div>
      <div className="navbar-links">
        <Link to="/pets/all">Pets</Link>
        {isLoggedIn ? (
          <div className="profile-container" ref={profileRef}>
            <button className="profile-btn" onClick={() => setIsProfileOpen((prev) => !prev)}>
              Profile
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <ul onClick={() => { navigate("/submit-pet"); setIsProfileOpen(false); }}>List Pets for Adoption</ul>
                <ul onClick={() => { navigate("/my-adoptions"); setIsProfileOpen(false); }}>Adoption Requests</ul>
                <ul onClick={handleLogout}>Logout</ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
