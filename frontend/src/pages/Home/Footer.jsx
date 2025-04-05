import React from "react";
import { Link } from "react-router-dom";

const footerStyles = {
  footer: {
    // marginTop: "60px",
    padding: "30px 20px",
    background: "#222",
    color: "white",
    textAlign: "center",
    fontSize: "1rem",
    borderTop: "1px solid #444",
  },
  paragraph: {
    margin: 0,
    fontWeight: "500",
  },
  linksContainer: {
    marginTop: "15px",
  },
  link: {
    color: "#ddd",
    textDecoration: "none",
    margin: "0 12px",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

const Footer = () => {
  return (
    <footer style={footerStyles.footer}>
      <p style={footerStyles.paragraph}>© 2024 Petlify. All rights reserved.</p>
      <div style={footerStyles.linksContainer}>
        <Link to="/about" style={footerStyles.link}>About</Link>
        <Link to="/contact" style={footerStyles.link}>Contact</Link>
        <Link to="/privacy-policy" style={footerStyles.link}>Privacy Policy</Link>
      </div>
    </footer>
  );
};

export default Footer;
