import React, { useState, useEffect, useCallback } from "react";
import MatrixBackground from "./signal-generator/MatrixBackground";
import SignalInterface from "./signal-generator/SignalInterface";
import LoadingOverlay from "./signal-generator/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Terminal, ExternalLink, User } from "lucide-react";
import { fetchSignals, type SignalData, type Signal } from "@/lib/signals";
import UserCounter from "./user-counter/UserCounter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { signOut, getUserId, setUserId } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<"real" | "otc" | null>(
    null,
  );
  const [signals, setSignals] = useState<SignalData | null>(null);
  const [generatedSignals, setGeneratedSignals] = useState<Signal[]>([]);
  const [showUserIdDialog, setShowUserIdDialog] = useState(false);
  const [userId, setUserIdValue] = useState("");
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoadingUserId, setIsLoadingUserId] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Quotex Signal Generator | Dashboard";
    loadSignals();
    preloadUserData();
  }, []);

  const preloadUserData = async () => {
    setIsLoadingUserId(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email);
      const { data } = await getUserId();
      setCurrentUserId(data?.user_id || null);
    }
    setIsLoadingUserId(false);
  };

  const loadSignals = async () => {
    const data = await fetchSignals();
    setSignals(data);
  };

  const getNextLiveSignal = useCallback(
    (signals: Signal[], currentTime: string): Signal | null => {
      const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      const sortedSignals = [...signals].sort((a, b) => {
        const [aHours, aMinutes] = a.time.split(":").map(Number);
        const [bHours, bMinutes] = b.time.split(":").map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });

      const nextSignal = sortedSignals.find((signal) => {
        const [signalHours, signalMinutes] = signal.time.split(":").map(Number);
        const signalTotalMinutes = signalHours * 60 + signalMinutes;
        return signalTotalMinutes > currentTotalMinutes;
      });

      return nextSignal || sortedSignals[0];
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    if (!selectedMarket || !signals) return;

    // Pre-calculate the signal data before showing loading state
    let nextSignals: Signal[];
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    if (selectedMarket === "real") {
      const nextSignal = getNextLiveSignal(signals["Live Signal"], currentTime);
      nextSignals = nextSignal ? [nextSignal] : [];
    } else {
      nextSignals = signals["OTC Market"];
    }

    // Show loading state after data is ready
    setIsGenerating(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setGeneratedSignals(nextSignals);
        setIsGenerating(false);
      }, 5000);
    });
  }, [selectedMarket, signals, getNextLiveSignal]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/login");
    }
  };

  const handleSetUserId = async () => {
    if (userId.length < 3) {
      setError("User ID must be at least 3 characters long");
      return;
    }

    try {
      const { error: setUserIdError } = await setUserId(userId);
      if (setUserIdError) throw setUserIdError;
      setShowUserIdDialog(false);
      setCurrentUserId(userId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      {!isGenerating && <MatrixBackground />}
      <LoadingOverlay show={isGenerating} />

      <div className="sticky top-4 z-20 mx-4">
        <div
          className={`w-full backdrop-blur-md bg-[#0a0a0a]/40 border border-[#00ff00]/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)] transition-opacity duration-300 ${isGenerating ? "opacity-50" : "opacity-100"}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#00ff00]/5 border border-[#00ff00]/10">
                <Terminal className="w-6 h-6 text-[#00ff00]" />
                <span className="text-[#00ff00] font-bold text-xl tracking-wide">
                  Quotex Signal Generator
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button
                  variant="ghost"
                  className="bg-[#00ff00]/5 text-[#00ff00] hover:bg-[#00ff00]/10 hover:text-[#00ff00] border border-[#00ff00]/20 hover:border-[#00ff00]/40 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300"
                >
                  UTC +6
                </Button>

                <Button
                  variant="ghost"
                  className="bg-[#00ff00]/5 text-[#00ff00] hover:bg-[#00ff00]/10 hover:text-[#00ff00] border border-[#00ff00]/20 hover:border-[#00ff00]/40 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300"
                  onClick={() =>
                    window.open("https://t.me/randomlink", "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Telegram
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-[#00ff00]/5 text-[#00ff00] hover:bg-[#00ff00]/10 hover:text-[#00ff00] border border-[#00ff00]/20 hover:border-[#00ff00]/40 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300 p-2"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#0a0a0a] border-[#00ff00]/20">
                    <DropdownMenuLabel className="text-[#00ff00]">
                      {userEmail}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#00ff00]/20" />
                    <DropdownMenuItem className="text-[#00ff00] focus:bg-[#00ff00]/10 focus:text-[#00ff00]">
                      User ID:{" "}
                      {isLoadingUserId ? (
                        <span className="text-[#00ff00]/50 ml-1">
                          Loading...
                        </span>
                      ) : (
                        currentUserId || (
                          <Button
                            variant="link"
                            className="text-[#00ff00] p-0 h-auto font-normal hover:no-underline ml-1"
                            onClick={() => setShowUserIdDialog(true)}
                          >
                            Set User ID
                          </Button>
                        )
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#00ff00]/20" />
                    <DropdownMenuItem
                      className="text-[#00ff00] focus:bg-[#00ff00]/10 focus:text-[#00ff00]"
                      onClick={handleSignOut}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Counter */}
      <div className="relative z-20 mx-4 mt-4">
        <UserCounter />
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="text-center w-full max-w-[95vw] mx-auto">
          <h1
            className={`text-6xl font-bold text-[#00ff00] mb-8 tracking-wider ${!isGenerating ? "animate-pulse" : ""}`}
            style={{
              textShadow:
                "0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.1)",
            }}
          >
            TRADER RABBY
          </h1>
          <SignalInterface
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            selectedMarket={selectedMarket}
            onMarketSelect={setSelectedMarket}
            signals={generatedSignals}
          />
        </div>
      </div>

      <div className="relative z-20 mx-4 mb-4">
        <div
          className={`w-full backdrop-blur-md bg-[#0a0a0a]/40 border border-[#00ff00]/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)] transition-opacity duration-300 ${isGenerating ? "opacity-50" : "opacity-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <p className="text-center text-[#00ff00]/70 text-sm font-medium">
              Made by Trader Rabby
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showUserIdDialog} onOpenChange={setShowUserIdDialog}>
        <DialogContent className="bg-[#0a0a0a] border-[#00ff00]/20">
          <DialogHeader>
            <DialogTitle className="text-[#00ff00]">
              Set Your User ID
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-[#00ff00]/70 text-sm">
              Please set your User ID. This cannot be changed later.
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Input
              value={userId}
              onChange={(e) => setUserIdValue(e.target.value)}
              placeholder="Enter User ID (min 3 characters)"
              className="bg-[#0a0a0a] border-[#00ff00]/20 text-[#00ff00] placeholder:text-[#00ff00]/50"
            />
            <Button
              onClick={handleSetUserId}
              className="w-full bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 border border-[#00ff00]/20 hover:border-[#00ff00]/40"
            >
              Set User ID
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;