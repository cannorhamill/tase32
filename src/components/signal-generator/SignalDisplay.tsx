import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SignalDisplayProps {
  currencyPair?: string;
  timestamp?: string;
  action?: "CALL" | "PUT";
  isLoading?: boolean;
  isOTC?: boolean;
}

const SignalDisplay = ({
  currencyPair = "USD/CAD",
  timestamp = new Date().toLocaleTimeString("en-US", { hour12: false }),
  action = "CALL",
  isLoading = false,
  isOTC = false,
}: SignalDisplayProps) => {
  // Custom divider component
  const CyberDivider = () => (
    <div className="text-[#00ff00] mx-4 opacity-50 text-lg">|</div>
  );

  // Arrow component (non-animated during loading)
  const Arrow = ({ isCall }: { isCall: boolean }) => {
    const ArrowIcon = isCall ? ArrowUp : ArrowDown;
    const color = isCall ? "#22c55e" : "#ef4444";

    return (
      <ArrowIcon
        className={`w-4 h-4 ml-2 ${!isLoading ? "animate-bounce" : ""}`}
        style={{
          color,
          filter: `drop-shadow(0 0 5px ${color})`,
        }}
      />
    );
  };

  return (
    <Card className="w-full h-[140px] bg-[#0a0a0a] border-[#00ff00] border-2 p-3 relative overflow-hidden mx-auto max-w-[1200px]">
      {/* Main content */}
      <div className="font-mono h-full flex items-center overflow-x-auto">
        {isLoading ? (
          <div className="space-y-2 w-full">
            <div className="h-4 bg-[#00ff00]/20 rounded w-3/4"></div>
            <div className="h-4 bg-[#00ff00]/20 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 w-full">
            {/* Headers */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center text-[#00ff00] text-sm border-b border-[#00ff00]/30 pb-1">
                Currency
              </div>
              <div className="text-center text-[#00ff00] text-sm border-b border-[#00ff00]/30 pb-1">
                Time
              </div>
              <div className="text-center text-[#00ff00] text-sm border-b border-[#00ff00]/30 pb-1">
                Action
              </div>
            </div>

            {/* Values with dividers */}
            <div className="flex items-center justify-between px-2 sm:px-4 text-sm sm:text-lg">
              <div className="text-white min-w-[80px] sm:min-w-[100px] text-center">
                {currencyPair}
              </div>
              <CyberDivider />
              <div className="text-white min-w-[80px] sm:min-w-[100px] text-center">
                {timestamp}
              </div>
              <CyberDivider />
              <div className="flex items-center justify-center min-w-[80px] sm:min-w-[100px]">
                <Badge
                  className={`${action === "CALL" ? "bg-green-500" : "bg-red-500"} text-black font-bold px-3 py-0.5 text-base`}
                >
                  {action}
                </Badge>
                <Arrow isCall={action === "CALL"} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Glitch effect overlay - only shown when not loading */}
      {!isLoading && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10 animate-pulse bg-gradient-to-r from-transparent via-[#00ff00] to-transparent"></div>
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGZmMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
      )}
    </Card>
  );
};

export default SignalDisplay;
