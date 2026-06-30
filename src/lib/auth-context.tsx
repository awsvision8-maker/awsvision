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
  login: (identifier: string, password: string) => Promise<boolean>;
  signup: (data: SignupApplication) => Promise<void>;
  signupNonprofit: (data: NonprofitSignupApplication) => Promise<void>;
  recordDeposit: (accountId: string, amount: number, description: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateKYC: (data: KYCData) => Promise<void>;
  refreshUser: () => Promise<void>;
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

  const login = async (identifier: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
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
    const result = (await res.json().catch(() => null)) as { user?: User; error?: string } | null;
    if (!res.ok) {
      throw new Error(result?.error ?? "Application submission failed. Please try again.");
    }
    if (result?.user) {
      setUser(result.user);
      return;
    }
    throw new Error("Application submission failed. Please try again.");
  };

  const signupNonprofit = async (data: NonprofitSignupApplication) => {
    const res = await fetch("/api/auth/signup/nonprofit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = (await res.json().catch(() => null)) as { user?: User; error?: string } | null;
    if (!res.ok) {
      throw new Error(result?.error ?? "Application submission failed. Please try again.");
    }
    if (result?.user) {
      setUser(result.user);
      return;
    }
    throw new Error("Application submission failed. Please try again.");
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

  const refreshUser = async () => {
    const data = await parseResponse<{ user: User }>(await fetch("/api/auth/me"));
    if (data?.user) setUser(data.user);
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
        refreshUser,
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
