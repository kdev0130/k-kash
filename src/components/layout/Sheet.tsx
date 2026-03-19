"use client";

import { ReactNode } from "react";

interface SheetProps {
  onClose: () => void;
  children: ReactNode;
}

export function Sheet({ onClose, children }: SheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.30)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          zIndex: 200,
          animation: "fadeIn 0.22s ease",
        }}
      />

      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--bg-sheet)",
          borderRadius: "22px 22px 0 0",
          zIndex: 201,
          animation: "slideUp 0.44s cubic-bezier(0.16,1,0.3,1) both",
          maxHeight: "93vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as any,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 34,
            height: 4,
            borderRadius: 2,
            background: "var(--sep)",
            margin: "10px auto 0",
          }}
        />
        {children}
      </div>
    </>
  );
}
