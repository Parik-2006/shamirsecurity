import React, { useState } from "react";
import FloatingShapes from "./FloatingShapes";
// import Cyber3DShapes from "./Cyber3DShapes";

export default function CyberLogin3D({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    // Simulate login success, call parent handler
    if (onLoginSuccess) {
      onLoginSuccess({ username, password });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0a192f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background animated shapes */}
      {/* <Cyber3DShapes zIndex={0} /> */}

      {/* Login Card */}
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 0 30px rgba(0,255,247,0.2)",
          color: "white",
          width: "320px",
          zIndex: 2,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Cyber Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "none",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#00fff7",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>
        {error && <p style={{ color: '#FFD700', marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}