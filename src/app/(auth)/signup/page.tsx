"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user, loading } = useAuth();
  const { addToast } = useToast();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in — go straight to app
  useEffect(() => {
    if (!loading && user) router.replace("/app");
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (password !== confirm) {
      addToast("Passwords don't match", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      addToast("Account created!", "success");
      router.replace("/app");
    } catch (err: any) {
      addToast(err.message ?? "Sign up failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && user) return null; // Redirecting

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
      <div style={{ textAlign: "center", marginBottom: 36 }}>
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
          Create account
        </h1>
        <p style={{ fontSize: 14, color: "var(--txt-3)", margin: "6px 0 0", letterSpacing: "-0.01em" }}>
          Your Kash journey starts here
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Name */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--txt-2)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Full Name
          </label>
          <input
            className="k-input"
            type="text"
            placeholder="Satoshi Nakamoto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

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
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

        {/* Confirm password */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--txt-2)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Confirm Password
          </label>
          <input
            className="k-input"
            type={showPw ? "text" : "password"}
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {/* Submit */}
        <button
          className="btn-primary"
          type="submit"
          disabled={submitting}
          style={{ marginTop: 8, opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
        <span style={{ fontSize: 12, color: "var(--txt-3)" }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--sep)" }} />
      </div>

      {/* Log in link */}
      <p style={{ textAlign: "center", fontSize: 14, color: "var(--txt-2)", margin: 0 }}>
        Already have an account?{" "}
        <button
          onClick={() => router.push("/login")}
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
          Sign in
        </button>
      </p>
    </div>
  );
}
