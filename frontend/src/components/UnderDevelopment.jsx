import React from "react";
import { useNavigate } from "react-router-dom";

const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", color: "#2c3e50", marginBottom: "16px" }}>
        Page Under Development
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "600px" }}>
        <button onClick={()=>navigate("/")}>GO TO HOME</button>
      </p>
    </div>
  );
};

export default UnderDevelopment;
