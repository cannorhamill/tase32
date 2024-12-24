export const counterStyles = {
  container: (isHovered: boolean) => ({
    boxShadow: isHovered
      ? "0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 20px rgba(0, 255, 0, 0.1)"
      : "0 0 10px rgba(0, 255, 0, 0.1), inset 0 0 10px rgba(0, 255, 0, 0.05)",
  }),
  
  dot: {
    background: "radial-gradient(circle, #00ff00 30%, transparent 70%)",
    opacity: "0.4",
  },
  
  text: (isHovered: boolean) => ({
    textShadow: isHovered
      ? "0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5)"
      : "0 0 5px rgba(0, 255, 0, 0.5)",
  }),
  
  grid: {
    backgroundImage:
      "linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  
  glow: {
    background: "radial-gradient(circle at center, #00ff00 0%, transparent 70%)",
  },
};