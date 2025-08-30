import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.isAdmin || false);
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
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
    setIsAdmin(false);
    navigate("/login");
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          PetLify
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/pets" className="nav-link">Find Pets</Link>
          <Link to="/submit-pet" className="nav-link">Submit Pet</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          {isLoggedIn && (
            <>
              <Link to="/my-adoptions" className="nav-link">My Adoptions</Link>
              <Link to="/organization" className="nav-link">Organization</Link>
            </>
          )}
        </div>

        <div className="nav-auth">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          ) : (
            <div className="profile-menu" ref={profileRef}>
              <button 
                className="profile-toggle"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                Profile ▼
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
