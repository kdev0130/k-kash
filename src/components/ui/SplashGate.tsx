"use client";

import { ReactNode, useEffect, useState } from "react";

export function SplashGate({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const holdTimer = window.setTimeout(() => setFading(true), 1100);
    const hideTimer = window.setTimeout(() => setVisible(false), 1450);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {children}

      {visible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "var(--bg)",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.35s ease",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "var(--sh-md)",
            }}
          >
            <img
              src="/icons/koli-logo.png"
              alt="K-Kash Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              color: "var(--txt-1)",
              fontFamily: "var(--font)",
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "-0.02em",
            }}
          >
            K-Kash
          </div>
        </div>
      )}
    </>
  );
}
