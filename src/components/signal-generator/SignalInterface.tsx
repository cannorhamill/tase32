import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SignalDisplay from "./SignalDisplay";
import { Loader2, AlertCircle } from "lucide-react";
import { type Signal } from "@/lib/signals";

interface SignalInterfaceProps {
  onGenerate?: () => void;
  isGenerating?: boolean;
  selectedMarket?: "real" | "otc" | null;
  onMarketSelect?: (market: "real" | "otc") => void;
  signals?: Signal[];
}

const SignalInterface = ({
  onGenerate = () => {},
  isGenerating = false,
  selectedMarket = null,
  onMarketSelect = () => {},
  signals = [],
}: SignalInterfaceProps) => {
  const [hasGeneratedSignal, setHasGeneratedSignal] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleGenerate = () => {
    if (!selectedMarket) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setShowError(false);
    setHasGeneratedSignal(true);
    onGenerate();
  };

  const getMarketDisplayName = (market: string) => {
    return market === "real" ? "Quotex Live Signal" : "Quotex OTC Signal";
  };

  return (
    <div className="w-full min-h-[600px] bg-transparent px-2 sm:px-4">
      <Tabs
        value={selectedMarket || ""}
        onValueChange={(value) => {
          onMarketSelect(value as "real" | "otc");
          setHasGeneratedSignal(false);
          setShowError(false);
        }}
        className="w-full flex flex-col relative max-w-full overflow-x-hidden"
      >
        <div className="w-full bg-[#0a0a0a]/40 backdrop-blur-md border border-[#00ff00]/20 rounded-xl p-2 sm:p-4 mb-6">
          <TabsList className="w-full bg-transparent flex space-x-2 sm:space-x-6 justify-center">
            <TabsTrigger
              value="real"
              className="px-4 sm:px-8 py-3 sm:py-4 border-2 border-[#00ff00] text-[#00ff00] hover:text-[#00ff00] data-[state=active]:bg-[#00ff00]/20 data-[state=active]:text-[#00ff00] data-[state=active]:border-[#00ff00] data-[state=active]:shadow-[0_0_20px_rgba(0,255,0,0.5),inset_0_0_15px_rgba(0,255,0,0.5)] transition-all duration-300 rounded-lg font-medium text-xs sm:text-base whitespace-nowrap"
            >
              QUOTEX LIVE
            </TabsTrigger>
            <TabsTrigger
              value="otc"
              className="px-4 sm:px-8 py-3 sm:py-4 border-2 border-[#00ff00] text-[#00ff00] hover:text-[#00ff00] data-[state=active]:bg-[#00ff00]/20 data-[state=active]:text-[#00ff00] data-[state=active]:border-[#00ff00] data-[state=active]:shadow-[0_0_20px_rgba(0,255,0,0.5),inset_0_0_15px_rgba(0,255,0,0.5)] transition-all duration-300 rounded-lg font-medium text-xs sm:text-base whitespace-nowrap"
            >
              QUOTEX OTC
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex flex-col">
          {showError && (
            <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm shadow-[0_0_10px_rgba(255,0,0,0.1)] animate-shake mb-4 max-w-md mx-auto">
              <p className="text-red-500 text-sm sm:text-lg font-semibold flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Please select a Market first
              </p>
            </div>
          )}

          {!selectedMarket ? (
            <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px] sm:min-h-[300px]">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#00ff00]/50" />
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-[#00ff00]/5 border border-[#00ff00]/20 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <p className="text-[#00ff00] text-sm sm:text-lg text-center">
                  Please select a market and click Generate to get signal
                </p>
              </div>
            </div>
          ) : !hasGeneratedSignal ? (
            <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px] sm:min-h-[300px]">
              <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-[#00ff00]/5 border border-[#00ff00]/20 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <p className="text-[#00ff00] text-sm sm:text-lg text-center">
                  Click Generate to get {getMarketDisplayName(selectedMarket)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {signals.map((signal, index) => (
                <SignalDisplay
                  key={`${signal.name}-${index}`}
                  isLoading={isGenerating}
                  currencyPair={signal.name}
                  isOTC={selectedMarket === "otc"}
                  timestamp={signal.time}
                  action={signal.action}
                />
              ))}
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex flex-col items-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="relative w-48 sm:w-64 h-12 sm:h-16 bg-[#0a0a0a] border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00]/5 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10 text-base sm:text-lg font-bold tracking-wider group-hover:scale-105 transition-transform duration-300">
                    GENERATE
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 animate-ping bg-[#00ff00] opacity-10" />
                    <div className="absolute inset-0 animate-pulse bg-[#00ff00] opacity-5" />
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "0 0 15px #00ff00, inset 0 0 15px #00ff00",
                    }}
                  />
                </>
              )}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SignalInterface;
