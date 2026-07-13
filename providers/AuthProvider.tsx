"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/auth";

import type { LoggedInUser } from "@/lib/auth";

interface AuthContextType {
  user: LoggedInUser | null;

  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    setUser(currentUser);

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
