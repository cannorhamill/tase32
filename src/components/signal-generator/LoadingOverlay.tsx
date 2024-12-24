import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  show: boolean;
}

const LoadingOverlay = ({ show }: LoadingOverlayProps) => {
  const [progress, setProgress] = useState(0);
  const [columns, setColumns] = useState<
    Array<{ chars: string[]; x: number; speed: number }>
  >([]);

  useEffect(() => {
    if (!show) {
      setProgress(0);
      return;
    }

    // Initialize columns immediately when show becomes true
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

    const initialColumns = Array.from({ length: 30 }).map(() => ({
      chars: Array.from({ length: 20 }).map(() => getRandomChar()),
      x: Math.random() * 100,
      speed: Math.random() * 1.5 + 1,
    }));

    setColumns(initialColumns);

    // Progress animation
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    // Update characters periodically
    const interval = setInterval(() => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          chars: [getRandomChar(), ...col.chars.slice(0, -1)],
        })),
      );
    }, 100);

    return () => {
      clearInterval(interval);
      setProgress(0);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/50 flex items-center justify-center overflow-hidden">
      {/* Matrix rain */}
      <div className="absolute inset-0 overflow-hidden">
        {columns.map((column, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 flex flex-col transition-transform"
            style={{
              left: `${column.x}%`,
              transform: "translateZ(0)",
              animation: `fall ${column.speed}s linear infinite`,
              willChange: "transform",
            }}
          >
            {column.chars.map((char, j) => (
              <div
                key={j}
                className="font-mono font-bold text-2xl transition-opacity duration-300"
                style={{
                  color: "#00ff00",
                  textShadow: "0 0 8px #00ff00",
                  opacity: Math.max(0, 1 - j * 0.1),
                  transform: "translateZ(0)",
                  animation: "glow 1.5s ease-in-out infinite alternate",
                }}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-10 w-96 text-center space-y-6 bg-black/30 p-8 rounded-xl border border-[#00ff00]/20 backdrop-blur-md">
        <h2 className="text-4xl font-bold text-[#00ff00] animate-pulse">
          Generating Signal
          <style
            dangerouslySetInnerHTML={{
              __html: `
                h2 { text-shadow: 0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3); }
              `,
            }}
          />
        </h2>

        <div className="relative h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#00ff00]/20">
          <div
            className="absolute left-0 top-0 bottom-0 animate-progress-glow rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fall { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
            @keyframes glow { from { filter: brightness(1); } to { filter: brightness(1.5); } }
          `,
        }}
      />
    </div>
  );
};

export default LoadingOverlay;
