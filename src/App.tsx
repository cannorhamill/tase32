import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/auth/login";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "./lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserId, setUserId } from "@/lib/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showUserIdDialog, setShowUserIdDialog] = useState(false);
  const [userId, setUserIdValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkUserId();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkUserId();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserId = async () => {
    const { data: userData } = await getUserId();
    if (!userData?.user_id) {
      setShowUserIdDialog(true);
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
    } catch (err) {
      setError(err.message);
    }
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />

        {/* User ID Dialog - Only show when authenticated */}
        {isAuthenticated && (
          <Dialog open={showUserIdDialog} onOpenChange={() => {}}>
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
        )}
      </>
    </Suspense>
  );
}

export default App;
