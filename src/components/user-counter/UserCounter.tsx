import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { counterStyles } from "./styles";
import { numberAnimation } from "./animations";

interface UserCounterProps {
  className?: string;
}

const UserCounter: React.FC<UserCounterProps> = ({ className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const targetNumber = 4493;

  const { number } = useSpring(numberAnimation(targetNumber));

  return (
    <div
      className={`relative flex items-center gap-3 p-4 rounded-lg backdrop-blur-sm bg-black/20 border border-[#00ff00]/20 transition-all duration-300 group ${className} ${
        isHovered ? "bg-black/30" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={counterStyles.container(isHovered)}
    >
      {/* Pulsing dot */}
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={counterStyles.dot}
        />
      </div>

      {/* Counter text */}
      <div className="flex flex-col">
        <span className="text-[#00ff00] text-sm font-medium tracking-wide mb-1">
          Total Users
        </span>
        <animated.span
          className={`font-mono text-xl font-bold tracking-wider text-[#00ff00] transition-all duration-300 ${
            isHovered ? "text-[#00ff00]" : "text-[#00ff00]/90"
          }`}
          style={counterStyles.text(isHovered)}
        >
          {number.to((n) => n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
        </animated.span>
      </div>

      {/* Background grid effect */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={counterStyles.grid}
      />

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none ${
          isHovered ? "opacity-20" : "opacity-0"
        }`}
        style={counterStyles.glow}
      />
    </div>
  );
};

export default UserCounter;