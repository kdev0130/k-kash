"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarInitial: string;
  joinedAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "email">>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

const STORAGE_KEY = "koli_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(u);
  };

  const login = async (email: string, _password: string) => {
    // TODO: replace with real auth — currently accepts any credentials
    await new Promise((r) => setTimeout(r, 400));
    // Reuse existing account if one exists, otherwise create a guest one
    const key = `koli_user_${email.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const stored = JSON.parse(raw);
      const { password: _, ...safeUser } = stored;
      persist(safeUser);
    } else {
      const name = email.split("@")[0];
      const guestUser: AuthUser = {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        avatarInitial: name.charAt(0).toUpperCase(),
        joinedAt: new Date().toISOString(),
      };
      persist(guestUser);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const key = `koli_user_${email.toLowerCase()}`;
    if (localStorage.getItem(key)) throw new Error("An account with that email already exists.");
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      avatarInitial: name.charAt(0).toUpperCase(),
      joinedAt: new Date().toISOString(),
    };
    // Store with password for login lookup
    localStorage.setItem(key, JSON.stringify({ ...newUser, password }));
    persist(newUser);
  };

  const logout = () => persist(null);

  const updateProfile = (data: Partial<Pick<AuthUser, "name" | "email">>) => {
    if (!user) return;
    const updated: AuthUser = {
      ...user,
      ...data,
      avatarInitial: (data.name ?? user.name).charAt(0).toUpperCase(),
    };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
