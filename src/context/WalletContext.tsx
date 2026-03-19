"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Network } from "@/types/wallet";

export interface KoliBalance {
  symbol: string;
  amount: number;
  phpValue: number; // 1 KOLI = 1 PHP
}

interface WalletContextValue {
  connected: boolean;
  address: string | null;
  koliBalance: KoliBalance | null;
  network: Network;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (n: Network) => void;
}

const WalletContext = createContext<WalletContextValue>({
  connected: false,
  address: null,
  koliBalance: null,
  network: "offline",
  connect: async () => {},
  disconnect: () => {},
  setNetwork: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<Network>("offline");
  const [koliBalance, setKoliBalance] = useState<KoliBalance | null>(null);

  useEffect(() => {
    const getUserId = () => {
      try {
        const raw = localStorage.getItem("koli_auth_user");
        if (raw) return JSON.parse(raw).id as string | undefined;
      } catch {}
      return undefined;
    };

    const userId = getUserId();
    if (!userId) return;

    // Live-listen to balance in Firestore
    const unsub = onSnapshot(doc(db, "members", userId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const amount = typeof data.balance === "number" ? data.balance : 0;
        setKoliBalance({
          symbol: "KOLI",
          amount,
          phpValue: amount, // 1 KOLI = 1 PHP
        });
      }
    });

    return () => unsub();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected: koliBalance !== null,
        address: null,
        koliBalance,
        network,
        connect: async () => {},
        disconnect: () => setKoliBalance(null),
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
