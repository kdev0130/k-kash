"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import type { Network } from "@/types/wallet";

export interface KoliBalance {
  symbol: string;
  amount: number;
  phpValue: number; // 1 KOLI = 1 PHP
}

interface WalletContextValue {
  connected: boolean;
  address: string | null;
  walletId: string | null;
  koliBalance: KoliBalance | null;
  network: Network;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (n: Network) => void;
}

const WalletContext = createContext<WalletContextValue>({
  connected: false,
  address: null,
  walletId: null,
  koliBalance: null,
  network: "offline",
  connect: async () => {},
  disconnect: () => {},
  setNetwork: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<Network>("offline");
  const [koliBalance, setKoliBalance] = useState<KoliBalance | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);

  useEffect(() => {
    const tokenServiceUrl =
      process.env.NEXT_PUBLIC_TOKEN_SERVICE_URL ?? "http://localhost:4000";

    const syncBalance = async (token: string) => {
      await fetch(`${tokenServiceUrl}/kash/sync-balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => undefined);
    };

    let stopKash = () => {};
    let stopBalance = () => {};

    const authUnsub = onAuthStateChanged(auth, async (authUser) => {
      stopKash();
      stopBalance();

      const sessionUserId = (() => {
        try {
          const raw = localStorage.getItem("koli_auth_user");
          if (raw) return JSON.parse(raw).id as string | undefined;
        } catch {}
        return undefined;
      })();

      const userId = authUser?.uid || sessionUserId;
      if (!userId || !authUser) {
        setKoliBalance(null);
        setAddress(null);
        setWalletId(null);
        return;
      }

      const token = await authUser.getIdToken(true).catch(() => null);
      if (token) await syncBalance(token);

      stopKash = onSnapshot(doc(db, "kashAccounts", userId), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAddress(typeof data.walletPublicKey === "string" ? data.walletPublicKey : null);
          setWalletId(typeof data.walletId === "string" ? data.walletId : null);
        } else {
          setAddress(null);
          setWalletId(null);
        }
      });

      stopBalance = onSnapshot(doc(db, "members", userId), (snap) => {
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
    });

    return () => {
      stopKash();
      stopBalance();
      authUnsub();
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected: Boolean(koliBalance || address),
        address,
        walletId,
        koliBalance,
        network,
        connect: async () => {},
        disconnect: () => {
          setKoliBalance(null);
          setAddress(null);
          setWalletId(null);
        },
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
