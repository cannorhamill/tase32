import React, { useState, useEffect } from "react";
import { Terminal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import MatrixBackground from "../signal-generator/MatrixBackground";
import UserCounter from "../user-counter/UserCounter";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Quotex Signal Generator";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        throw new Error("Invalid login credentials");
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      <MatrixBackground />

      {/* Header */}
      <div className="sticky top-2 sm:top-4 z-20 mx-2 sm:mx-4">
        <div className="w-full backdrop-blur-md bg-[#0a0a0a]/40 border border-[#00ff00]/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#00ff00]/5 border border-[#00ff00]/10">
                <Terminal className="w-6 h-6 text-[#00ff00]" />
                <span className="text-[#00ff00] font-bold text-xl tracking-wide">
                  Quotex Signal Generator
                </span>
              </div>

              <Button
                variant="ghost"
                className="bg-[#00ff00]/5 text-[#00ff00] hover:bg-[#00ff00]/10 hover:text-[#00ff00] border border-[#00ff00]/20 hover:border-[#00ff00]/40 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] transition-all duration-300"
                onClick={() => window.open("https://t.me/randomlink", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Join Telegram
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Counter */}
      <div className="relative z-20 mx-4 mt-4">
        <UserCounter />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl sm:text-6xl font-bold text-[#00ff00] mb-8 sm:mb-12 tracking-wider animate-pulse">
          TRADER RABBY
          <style
            dangerouslySetInnerHTML={{
              __html: `
                h1 { text-shadow: 0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.1); }
              `,
            }}
          />
        </h1>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 backdrop-blur-md bg-[#0a0a0a]/40 border border-[#00ff00]/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)]"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border-red-500/20 text-red-500 border rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0a0a0a] border-[#00ff00]/20 text-[#00ff00] placeholder:text-[#00ff00]/50"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a0a0a] border-[#00ff00]/20 text-[#00ff00] placeholder:text-[#00ff00]/50"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff00]/10 text-[#00ff00] hover:bg-[#00ff00]/20 border border-[#00ff00]/20 hover:border-[#00ff00]/40"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="relative z-20 mx-4 mb-4">
        <div className="w-full backdrop-blur-md bg-[#0a0a0a]/40 border border-[#00ff00]/20 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <p className="text-center text-[#00ff00]/70 text-sm font-medium">
              Made by Trader Rabby
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;