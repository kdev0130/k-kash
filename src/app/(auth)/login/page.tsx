"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in — go straight to app
  useEffect(() => {
    if (!loading && user) router.replace("/app");
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/app");
    } catch (err: any) {
      addToast(err.message ?? "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) return null; // Redirecting, show nothing momentarily

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px 48px",
        animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 16px",
          }}
        >
          <img src="/icons/koli-logo.png" alt="Kash" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--txt-1)",
            margin: 0,
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--txt-3)", margin: "6px 0 0", letterSpacing: "-0.01em" }}>
          Sign in to your Kash
        </p>
      </div>

      {/* KOLI Sign In Button */}
      <button
        type="button"
        onClick={() => {
          // If already logged in, skip OAuth and go straight to dashboard
          try {
            const existing = localStorage.getItem('koli_auth_user');
            if (existing) { router.replace('/app'); return; }
          } catch {}
          const redirectUri = `${window.location.origin}/auth/callback`;
          const state = btoa(JSON.stringify({ nonce: Math.random().toString(36).substring(7), returnTo: '/app' }));
          const koliAppUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:8082' 
            : 'https://koli-2bad9.web.app';
          const authUrl = `${koliAppUrl}/wallet-auth?redirect_uri=${encodeURIComponent(redirectUri)}&app=${encodeURIComponent('K-Kash')}&state=${encodeURIComponent(state)}`;
          window.location.href = authUrl;
        }}
        style={{
          width: "100%",
          padding: "14px 20px",
          borderRadius: 12,
          border: "none",
          background: "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)",
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.opacity = "1";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        Sign In using KOLI
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
        <span style={{ fontSize: 12, color: "var(--txt-3)" }}>or continue with email</span>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Email */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--txt-2)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            className="k-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--txt-2)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="k-input"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{ paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
              tabIndex={-1}
            >
              <Icon name={showPw ? "eye_off" : "eye"} size={17} color="var(--txt-3)" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn-primary"
          type="submit"
          disabled={submitting}
          style={{ marginTop: 8, opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
        <span style={{ fontSize: 12, color: "var(--txt-3)" }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
      </div>

      {/* Sign up link */}
      <p style={{ textAlign: "center", fontSize: 14, color: "var(--txt-2)", margin: 0 }}>
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/signup")}
          style={{
            background: "none",
            border: "none",
            color: "var(--gold)",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            padding: 0,
            fontFamily: "var(--font)",
          }}
        >
          Create one
        </button>
      </p>
    </div>
  );
}
