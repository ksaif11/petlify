import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
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
        setUserName(payload.name || "User");
      } catch (error) {
        setIsAdmin(false);
        setUserName("User");
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
    setUserName("");
    navigate("/login");
    setIsProfileOpen(false);
  };

  const handleProfileAction = (action) => {
    setIsProfileOpen(false);
    switch (action) {
      case 'my-adoptions':
        navigate('/my-adoptions');
        break;
      case 'organization':
        navigate('/organization');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="navbar-logo">
          <Link to="/">PetLify</Link>
        </div>
        
        <div className="navbar-links">
          <Link to="/">Home</Link>
                      <Link to="/pets">Find Pets</Link>
          <Link to="/submit-pet">Submit Pet</Link>
          {isAdmin && (
            <Link to="/only-admin">Admin</Link>
          )}
        </div>

        <div className="profile-container">
          {!isLoggedIn ? (
            <div className="navbar-links">
              <Link to="/login">Login</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </div>
          ) : (
            <div ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                Profile
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="user-greeting">
                    Hi, {userName}
                  </div>
                  <ul onClick={() => handleProfileAction('my-adoptions')}>
                    My Adoptions
                  </ul>
                  {isAdmin && (
                    <ul onClick={() => handleProfileAction('organization')}>
                      Organization Dashboard
                    </ul>
                  )}
                  <ul onClick={() => handleProfileAction('logout')}>
                    Logout
                  </ul>
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
