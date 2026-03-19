"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import type { ToastPayload, ToastType } from "@/types/ui";

interface ToastContextValue {
  toast: ToastPayload | null;
  addToast: (msg: string, type?: ToastType) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: null,
  addToast: () => {},
  dismiss: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dismiss = useCallback(() => setToast(null), []);

  const addToast = useCallback((msg: string, type: ToastType = "info") => {
    clearTimeout(timer.current);
    setToast({ msg, type });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
