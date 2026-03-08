import React from "react";
import { motion } from "framer-motion";

export default function Vault3DCyberElements({ zIndex = 1 }) {
  return (
    <div>
      {/* Vault Circle */}
      <motion.div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "4px solid #FFD700",
          zIndex,
          filter: "drop-shadow(0 0 20px #FFD70088)"
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Cyber Ring */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "12%",
          right: "15%",
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: "3px dashed #00F5D4",
          zIndex,
          filter: "drop-shadow(0 0 16px #00F5D488)"
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating Cube */}
      <motion.div
        style={{
          position: "absolute",
          top: "40%",
          right: "8%",
          width: 40,
          height: 40,
          background: "#FFD700",
          borderRadius: "8px",
          zIndex,
          filter: "drop-shadow(0 0 12px #FFD70099)"
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );