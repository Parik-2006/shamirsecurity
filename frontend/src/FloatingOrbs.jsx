import React from "react";
import { motion } from "framer-motion";

export default function FloatingOrbs({ zIndex = 0 }) {
  const orbs = [
    { size: 120, top: "20%", left: "10%", color: "#00F5D4" },
    { size: 160, top: "60%", left: "80%", color: "#FFD700" },
    { size: 100, top: "75%", left: "20%", color: "#8b5cf6" },
    { size: 140, top: "30%", left: "70%", color: "#06b6d4" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: "blur(80px)",
            opacity: 0.25,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );