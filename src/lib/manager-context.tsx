"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface ManagerUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  referralUrl?: string;
}

interface ManagerContextValue {
  manager: ManagerUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ManagerContext = createContext<ManagerContextValue | null>(null);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [manager, setManager] = useState<ManagerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/manager/auth/me");
      if (res.ok) {
        const data = await res.json();
        setManager(data.manager);
      } else {
        setManager(null);
      }
    } catch {
      setManager(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/manager/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setManager(data.manager);
    return true;
  };

  const logout = async () => {
    await fetch("/api/manager/auth/logout", { method: "POST" });
    setManager(null);
  };

  return (
    <ManagerContext.Provider
      value={{
        manager,
        isLoading,
        isAuthenticated: !!manager,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const ctx = useContext(ManagerContext);
  if (!ctx) throw new Error("useManager must be used within ManagerProvider");
  return ctx;
}
