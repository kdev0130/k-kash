"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextValue {
  dark: boolean;
  setDark: (val: boolean) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  setDark: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = localStorage.getItem("koli-theme");
    if (stored !== null) {
      setDarkState(stored === "dark");
    } else {
      setDarkState(mq.matches);
    }
    setMounted(true);
  }, []);

  const setDark = (val: boolean) => {
    setDarkState(val);
    localStorage.setItem("koli-theme", val ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark, toggle: () => setDark(!dark) }}>
      <div
        data-dark={mounted ? String(dark) : "false"}
        suppressHydrationWarning
        style={{ height: "100%" }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
