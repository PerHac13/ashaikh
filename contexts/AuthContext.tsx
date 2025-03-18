"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface CacheData {
  isAuthenticated: boolean;
  timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Cache the last auth check
  const [lastCheck, setLastCheck] = useState<CacheData | null>(null);

  const checkAuth = async (forceCheck = false) => {
    // If cache is available and not expired, use it
    if (
      !forceCheck && 
      lastCheck && 
      Date.now() - lastCheck.timestamp < CACHE_DURATION
    ) {
      setIsAuthenticated(lastCheck.isAuthenticated);
      setIsLoading(false);
      return;
    }
    
    // Otherwise, fetch the authentication status
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/check", {
        credentials: "include",
      });
      
      const authState = response.ok;
      setIsAuthenticated(authState);
      
      // Update cache
      setLastCheck({
        isAuthenticated: authState,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      setIsAuthenticated(true);
      setLastCheck({
        isAuthenticated: true,
        timestamp: Date.now(),
      });
      
      router.push("/admin");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      setLastCheck({
        isAuthenticated: false,
        timestamp: Date.now(),
      });
      
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};