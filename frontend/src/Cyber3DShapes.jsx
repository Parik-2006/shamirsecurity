import React from "react";
import { motion } from "framer-motion";

// Gold and cyber palette
const GOLD = "#FFD700";
const CYAN = "#00F5D4";

export default function Cyber3DShapes({ zIndex = 1 }) {
  return (
    <div>
      {/* 3D Shield */}
      <motion.div
        style={{
          position: "absolute",
          top: "12%",
          right: "7%",
          zIndex,
          filter: "drop-shadow(0 0 24px #FFD70099)",
        }}
        animate={{ rotateY: [0, 30, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="70" height="80" viewBox="0 0 70 80" fill="none">
          <defs>
            <linearGradient
              id="goldShield"
              x1="0"
              y1="0"
              x2="70"
              y2="80"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFF8DC" />
            </linearGradient>
          </defs>

          <path
            d="M35 5 Q65 15 60 40 Q55 70 35 75 Q15 70 10 40 Q5 15 35 5Z"
            fill="url(#goldShield)"
            stroke="#FFD700"
            strokeWidth="3"
          />

          <ellipse cx="35" cy="40" rx="10" ry="16" fill="#fff2" />
        </svg>
      </motion.div>

      {/* 3D Lock */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "8%",
          zIndex,
          filter: "drop-shadow(0 0 18px #FFD70099)",
        }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="54" height="64" viewBox="0 0 54 64" fill="none">
          <rect
            x="7"
            y="28"
            width="40"
            height="28"
            rx="8"
            fill="#FFD700"
            stroke="#FFF8DC"
            strokeWidth="3"
          />

          <rect x="20" y="38" width="14" height="10" rx="5" fill="#FFF8DC" />

          <path
            d="M14 28v-8a13 13 0 0 1 26 0v8"
            stroke="#FFD700"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* 3D Key */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "18%",
          right: "12%",
          zIndex,
          filter: "drop-shadow(0 0 16px #FFD70099)",
        }}
        animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <ellipse
            cx="15"
            cy="15"
            rx="13"
            ry="13"
            fill="#FFD700"
            stroke="#FFF8DC"
            strokeWidth="3"
          />

          <rect
            x="28"
            y="12"
            width="22"
            height="6"
            rx="2"
            fill="#FFD700"
            stroke="#FFF8DC"
            strokeWidth="2"
          />

          <rect
            x="50"
            y="10"
            width="6"
            height="10"
            rx="2"
            fill="#FFD700"
            stroke="#FFF8DC"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </div>
  );