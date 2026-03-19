"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { useWallet } from "@/hooks/useWallet";
import { shorten } from "@/lib/utils";

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const { address } = useWallet();

  const [editing, setEditing]         = useState(false);
  const [name, setName]               = useState(user?.name ?? "");
  const [email, setEmail]             = useState(user?.email ?? "");
  const [saving, setSaving]           = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      addToast("Name and email are required", "error");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({ name: name.trim(), email: email.trim() });
    addToast("Profile updated", "success");
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    addToast("Logged out", "info");
  };

  const joined = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch" as any,
        paddingBottom: 90,
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
      <NavBar title="Profile" showBack onBack={onBack} />

      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Avatar + name card */}
        <div
          style={{
            background: "var(--bg-2)",
            borderRadius: 20,
            padding: "28px 20px 24px",
            boxShadow: "var(--sh-sm)",
            textAlign: "center",
            animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: "50%",
              background: "var(--gold-faint)",
              border: "2px solid var(--gold-line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 800, color: "var(--gold)" }}>
              {user?.avatarInitial ?? "?"}
            </span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "var(--txt-1)", letterSpacing: "-0.02em" }}>
            {user?.name ?? "—"}
          </div>
          <div style={{ fontSize: 13, color: "var(--txt-3)", marginTop: 4 }}>
            {user?.email ?? "—"}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 12,
              background: "var(--bg-group)",
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <Icon name="calendar" size={12} color="var(--txt-3)" strokeWidth={1.8} />
            <span style={{ fontSize: 11, color: "var(--txt-3)", fontWeight: 500 }}>
              Joined {joined}
            </span>
          </div>
        </div>

        {/* Wallet address */}
        <div
          style={{
            background: "var(--bg-group)",
            borderRadius: 16,
            overflow: "hidden",
            animation: "fadeUp 0.35s 0.05s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--txt-3)", letterSpacing: "0.05em", textTransform: "uppercase", padding: "14px 16px 6px" }}>
            Wallet
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 14px" }}>
            <div
              style={{
                width: 30, height: 30, borderRadius: 9,
                background: "var(--gold-faint)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Icon name="wallet" size={15} color="var(--gold)" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--txt-3)", marginBottom: 2 }}>Solana Address</div>
              <div style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--txt-1)", letterSpacing: "0.03em" }}>
                {address ? shorten(address) : "—"}
              </div>
            </div>
            <button
              onClick={() => {
                if (address) {
                  navigator.clipboard.writeText(address);
                  addToast("Address copied", "info");
                }
              }}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", display: "flex" }}
            >
              <Icon name="copy" size={15} color="var(--txt-3)" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Edit profile */}
        <div
          style={{
            background: "var(--bg-group)",
            borderRadius: 16,
            overflow: "hidden",
            animation: "fadeUp 0.35s 0.10s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: editing ? "1px solid var(--sep)" : "none",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--txt-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Edit Profile
            </span>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setName(user?.name ?? ""); setEmail(user?.email ?? ""); }}
                style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}
              >
                Edit
              </button>
            )}
          </div>

          {editing && (
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--txt-3)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Name</label>
                <input className="k-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--txt-3)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Email</label>
                <input className="k-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: "11px" }} onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button className="btn-primary" style={{ flex: 2, padding: "11px", opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Log out */}
        <div
          style={{
            background: "var(--bg-group)",
            borderRadius: 16,
            overflow: "hidden",
            animation: "fadeUp 0.35s 0.15s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 13,
              padding: "14px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font)",
            }}
          >
            <div
              style={{
                width: 30, height: 30, borderRadius: 9,
                background: "rgba(255,59,48,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Icon name="disconnect" size={15} color="#FF3B30" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#FF3B30" }}>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
