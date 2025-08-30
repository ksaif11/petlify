import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Petlify</h3>
            <p className="footer-description">
              Connecting loving homes with pets in need. Find your perfect companion today.
            </p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/pets/all" className="footer-link">Browse Pets</a></li>
              <li><a href="/submit-pet" className="footer-link">List a Pet</a></li>
              <li><a href="/my-adoptions" className="footer-link">My Adoptions</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Petlify. All rights reserved. Made with ❤️ for pets everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
