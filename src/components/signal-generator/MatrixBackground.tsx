import React, { useEffect, useRef } from "react";

interface MatrixBackgroundProps {
  opacity?: number;
}

const MatrixBackground = ({ opacity = 0.1 }: MatrixBackgroundProps) => {
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = dotsCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create dots
    const createDots = () => {
      const numDots = Math.floor((canvas.width * canvas.height) / 4000); // More dots
      for (let i = 0; i < numDots; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2, // Faster movement
          vy: (Math.random() - 0.5) * 2, // Faster movement
          radius: Math.random() * 1.5 + 1, // Varied sizes
        });
      }
    };

    createDots();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw dots
      dots.forEach((dot, i) => {
        // Mouse interaction
        const dx = mouseRef.current.x - dot.x;
        const dy = mouseRef.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.8;
          dot.vx -= dx * force * 0.02;
          dot.vy -= dy * force * 0.02;
        }

        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Add some randomness to movement
        dot.vx += (Math.random() - 0.5) * 0.2;
        dot.vy += (Math.random() - 0.5) * 0.2;

        // Dampen velocity
        dot.vx *= 0.99;
        dot.vy *= 0.99;

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width) {
          dot.vx *= -1;
          dot.x = Math.max(0, Math.min(canvas.width, dot.x));
        }
        if (dot.y < 0 || dot.y > canvas.height) {
          dot.vy *= -1;
          dot.y = Math.max(0, Math.min(canvas.height, dot.y));
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
        ctx.fill();

        // Draw connections
        dots.forEach((otherDot, j) => {
          if (i !== j) {
            const dx = dot.x - otherDot.x;
            const dy = dot.y - otherDot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              // Shorter connection distance for more connections
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(otherDot.x, otherDot.y);
              ctx.strokeStyle = `rgba(0, 255, 0, ${0.15 * (1 - distance / 100)})`;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-0">
      {/* Animated dots */}
      <canvas
        ref={dotsCanvasRef}
        className="absolute inset-0"
        style={{
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      />
      {/* Grid background with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(10, 10, 10, 1) 0%, 
            rgba(10, 10, 10, 0.8) 20%, 
            rgba(10, 10, 10, 0.6) 40%, 
            rgba(10, 10, 10, 0.4) 60%, 
            rgba(10, 10, 10, 0.2) 80%, 
            rgba(10, 10, 10, 0) 100%
          )`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 0, 0.15) 1px, transparent 1px)`,
          backgroundSize: "100px 100px", // Even larger grid
          opacity: 0.3,
          transform: "translate3d(0,0,0)",
        }}
      />
    </div>
  );
};

export default MatrixBackground;
