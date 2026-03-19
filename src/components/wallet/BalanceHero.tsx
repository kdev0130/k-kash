"use client";

import { formatAmount } from "@/lib/utils";
import type { KoliBalance } from "@/context/WalletContext";

interface BalanceHeroProps {
  balance: KoliBalance;
}

export function BalanceHero({ balance }: BalanceHeroProps) {
  return (
    <div
      style={{
        padding: "40px 28px 32px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Teal radial glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 260,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(94,155,138,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main balance number */}
      <div
        style={{
          fontSize: "clamp(56px, 15vw, 76px)",
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          color: "var(--gold)",
          animation: "numUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
          position: "relative",
          zIndex: 1,
          textShadow: "0 0 40px rgba(94,155,138,0.35)",
        }}
      >
        {formatAmount(balance.amount, 0)}
      </div>

      {/* Token label */}
      <div
        style={{
          marginTop: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "var(--gold)",
            letterSpacing: "0.04em",
          }}
        >
          {balance.symbol}
        </span>
      </div>

      {/* PHP equivalent — 1 KOLI = 1 PHP */}
      <div
        style={{
          marginTop: 6,
          fontSize: 14,
          color: "var(--txt-3)",
          fontWeight: 400,
        }}
      >
        ≈ ₱{balance.phpValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* Gold accent line */}
      <div
        style={{
          width: 36,
          height: 3,
          borderRadius: 2,
          background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
          margin: "20px auto 0",
          boxShadow: "0 0 8px rgba(94, 155, 138, 0.55)",
        }}
      />
    </div>
  );
}
