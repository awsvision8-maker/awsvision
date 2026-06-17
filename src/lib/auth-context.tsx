"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { KYCData, NonprofitSignupApplication, SignupApplication, User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupApplication) => Promise<boolean>;
  signupNonprofit: (data: NonprofitSignupApplication) => Promise<boolean>;
  recordDeposit: (accountId: string, amount: number, description: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateKYC: (data: KYCData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function parseResponse<T>(res: Response): Promise<T | null> {
  const data = await res.json().catch(() => null);
  if (!res.ok) return null;
  return data as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => parseResponse<{ user: User }>(res))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse<{ user: User }>(res);
    if (data?.user) {
      setUser(data.user);
      return true;
    }
    return false;
  };

  const signup = async (data: SignupApplication) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await parseResponse<{ user: User }>(res);
    if (result?.user) {
      setUser(result.user);
      return true;
    }
    return false;
  };

  const signupNonprofit = async (data: NonprofitSignupApplication) => {
    const res = await fetch("/api/auth/signup/nonprofit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await parseResponse<{ user: User }>(res);
    if (result?.user) {
      setUser(result.user);
      return true;
    }
    return false;
  };

  const recordDeposit = async (accountId: string, amount: number, description: string) => {
    const res = await fetch("/api/portfolio/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId, amount, description }),
    });
    const data = await parseResponse<{ user: User }>(res);
    if (data?.user) {
      setUser(data.user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateKYC = async (data: KYCData) => {
    const res = await fetch("/api/auth/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await parseResponse<{ user: User }>(res);
    if (result?.user) setUser(result.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        signupNonprofit,
        recordDeposit,
        logout,
        updateKYC,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
