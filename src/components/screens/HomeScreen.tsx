"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { BalanceHero } from "@/components/wallet/BalanceHero";
import { ActionButtons } from "@/components/wallet/ActionButtons";
import { TransactionList } from "@/components/wallet/TransactionList";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";
import type { SheetType } from "@/types/ui";

interface HomeScreenProps {
  openSheet: (s: NonNullable<SheetType>) => void;
  onNavigate?: (screen: "settings" | "profile") => void;
}

export function HomeScreen({ openSheet, onNavigate }: HomeScreenProps) {
  const { koliBalance } = useWallet();
  const { addToast } = useToast();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    addToast("Logged out", "info");
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {showLogoutConfirm && (
        <ConfirmDialog
          title="Log Out"
          message="Are you sure you want to log out of your Kash?"
          confirmLabel="Log Out"
          danger
          onConfirm={() => { setShowLogoutConfirm(false); handleLogout(); }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      {/* Nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "16px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
        }}
      >
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--gold-faint)",
              border: "1.5px solid var(--gold-line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon name="user" size={17} color="var(--gold)" />
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: 42,
                left: 0,
                minWidth: 180,
                background: "var(--bg-sheet)",
                borderRadius: 14,
                boxShadow: "var(--sh-lg)",
                overflow: "hidden",
                border: "1px solid var(--sep)",
                animation: "scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              <DropdownItem
                icon="user"
                label="Profile"
                onClick={() => {
                  onNavigate?.("profile");
                  setShowDropdown(false);
                }}
              />
              <DropdownItem
                icon="settings"
                label="Settings"
                onClick={() => {
                  onNavigate?.("settings");
                  setShowDropdown(false);
                }}
              />
              <DropdownItem
                icon="disconnect"
                label="Logout"
                onClick={() => { setShowDropdown(false); setShowLogoutConfirm(true); }}
                danger
                noBorder
              />
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--txt-2)",
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <img src="/icons/koli-logo.png" alt="KOLI" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
          {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Kash"}
        </span>
        <div style={{ width: 34 }} />
      </div>

      {/* Balance */}
      {koliBalance && <BalanceHero balance={koliBalance} />}

      {/* Actions */}
      <ActionButtons onAction={openSheet} />

      {/* Transactions — independently scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 12,
        }}
      >
        <TransactionList transactions={MOCK_TRANSACTIONS} />
      </div>
    </div>
  );
}

/* Dropdown Item Component */
function DropdownItem({
  icon,
  label,
  onClick,
  danger,
  noBorder,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        cursor: "pointer",
        background: "var(--bg-sheet)",
        borderBottom: noBorder ? "none" : "1px solid var(--sep)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-input)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-sheet)";
      }}
    >
      <Icon
        name={icon as any}
        size={16}
        color={danger ? "#FF3B30" : "var(--txt-2)"}
        strokeWidth={1.8}
      />
      <span
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: danger ? "#FF3B30" : "var(--txt-1)",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
