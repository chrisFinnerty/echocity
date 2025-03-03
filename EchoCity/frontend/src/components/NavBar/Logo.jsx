import React from 'react';

const Logo = () => (
  <svg
    width="150" 
    height="40" 
    viewBox="0 0 300 100" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        {/* <stop offset="0%" stopColor="#646cff">
          <animate 
            attributeName="stop-color" 
            values="#646cff;#ff66ff;#646cff" 
            dur="3s" 
            repeatCount="indefinite" 
          />
        </stop> */}
        <stop offset="100%" stopColor="#646cff">
          {/* <animate 
            attributeName="stop-color" 
            values="#646cff;#66ffff;#646cff" 
            dur="3s" 
            repeatCount="indefinite" 
          /> */}
        </stop>
      </linearGradient>
      
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <g transform="rotate(-25 40 60)">
      <circle 
        cx="50" 
        cy="50" 
        r="35" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.87)" 
        strokeWidth="3" 
        filter="url(#glow)" 
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Verdana, sans-serif"
        fontSize="62"
        fill="url(#grad)"
        filter="url(#glow)"
      >
        e
      </text>
    </g>
    
    <text
      x="63%"
      y="55%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Verdana, sans-serif"
      fontSize="45"
      fill="rgba(255, 255, 255, 0.87)"
    >
      Echocity
    </text>
  </svg>
);

export default Logo;
