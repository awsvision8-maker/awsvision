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
  /** Admin or BA viewing this portal as the user — no writes allowed */
  isViewOnly: boolean;
  adminPreview: boolean;
  managerPreview: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  signup: (data: SignupApplication) => Promise<void>;
  signupNonprofit: (data: NonprofitSignupApplication) => Promise<void>;
  recordDeposit: (accountId: string, amount: number, description: string) => Promise<boolean>;
  logout: () => Promise<void>;
  /** Exit admin or BA preview; returns target userId when known */
  exitPortalPreview: () => Promise<{
    userId: string | null;
    mode: "admin" | "manager" | null;
  }>;
  /** @deprecated prefer exitPortalPreview */
  exitAdminPreview: () => Promise<string | null>;
  updateKYC: (data: KYCData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function parseResponse<T>(res: Response): Promise<T | null> {
  const data = await res.json().catch(() => null);
  if (!res.ok) return null;
  return data as T;
}

type MeResponse = {
  user: User;
  viewOnly?: boolean;
  adminPreview?: boolean;
  managerPreview?: boolean;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [adminPreview, setAdminPreview] = useState(false);
  const [managerPreview, setManagerPreview] = useState(false);

  const applyMe = (data: MeResponse | null) => {
    if (!data?.user) return;
    setUser(data.user);
    setIsViewOnly(Boolean(data.viewOnly));
    setAdminPreview(Boolean(data.adminPreview));
    setManagerPreview(Boolean(data.managerPreview));
  };

  const clearAuthFlags = () => {
    setUser(null);
    setIsViewOnly(false);
    setAdminPreview(false);
    setManagerPreview(false);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => parseResponse<MeResponse>(res))
      .then((data) => applyMe(data))
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
      setIsViewOnly(false);
      setAdminPreview(false);
      setManagerPreview(false);
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
      setIsViewOnly(false);
      setAdminPreview(false);
      setManagerPreview(false);
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
      setIsViewOnly(false);
      setAdminPreview(false);
      setManagerPreview(false);
      return;
    }
    throw new Error("Application submission failed. Please try again.");
  };

  const recordDeposit = async (accountId: string, amount: number, description: string) => {
    if (isViewOnly) return false;
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

  const exitPortalPreview = async () => {
    if (managerPreview) {
      const res = await fetch("/api/manager/preview/exit", { method: "POST" });
      const data = await parseResponse<{ userId?: string | null }>(res);
      clearAuthFlags();
      return { userId: data?.userId ?? null, mode: "manager" as const };
    }
    if (adminPreview) {
      const res = await fetch("/api/admin/preview/exit", { method: "POST" });
      const data = await parseResponse<{ userId?: string | null }>(res);
      clearAuthFlags();
      return { userId: data?.userId ?? null, mode: "admin" as const };
    }
    clearAuthFlags();
    return { userId: null, mode: null };
  };

  const exitAdminPreview = async () => {
    const result = await exitPortalPreview();
    return result.userId;
  };

  const logout = async () => {
    if (adminPreview || managerPreview) {
      await exitPortalPreview();
      return;
    }
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuthFlags();
  };

  const updateKYC = async (data: KYCData) => {
    if (isViewOnly) return;
    const res = await fetch("/api/auth/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await parseResponse<{ user: User }>(res);
    if (result?.user) setUser(result.user);
  };

  const refreshUser = async () => {
    const data = await parseResponse<MeResponse>(await fetch("/api/auth/me"));
    applyMe(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isViewOnly,
        adminPreview,
        managerPreview,
        login,
        signup,
        signupNonprofit,
        recordDeposit,
        logout,
        exitPortalPreview,
        exitAdminPreview,
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
