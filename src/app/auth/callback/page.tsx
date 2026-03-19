"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing authorization...");

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const code = searchParams?.get("code");
    const error = searchParams?.get("error");
    const rawState = searchParams?.get("state");
    let returnTo = "/app";
    try {
      if (rawState) {
        const parsed = JSON.parse(atob(decodeURIComponent(rawState)));
        if (parsed.returnTo) returnTo = parsed.returnTo;
      }
    } catch {}
    const state = rawState;

    // Check if user denied access
    if (error === "access_denied") {
      setStatus("error");
      setMessage("Authorization was denied. You need to authorize K-Kash to continue.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No authorization code received.");
      setTimeout(() => router.push("/login"), 3000);
      return;
    }

    try {
      // Fetch authorization from Firestore
      const authDoc = await getDoc(doc(db, "walletAuthorizations", code));

      if (!authDoc.exists()) {
        throw new Error("Invalid authorization code");
      }

      const authData = authDoc.data();

      // Check if already used
      if (authData.used) {
        throw new Error("Authorization code already used");
      }

      // Check if expired
      const expiresAt = new Date(authData.expiresAt);
      if (expiresAt < new Date()) {
        throw new Error("Authorization code expired");
      }

      // Mark as used
      await updateDoc(doc(db, "walletAuthorizations", code), {
        used: true,
        usedAt: new Date().toISOString(),
      });

      // Build session from embedded auth data (no members read needed)
      const authUser = {
        id: authData.userId,
        name: authData.displayName || authData.email.split("@")[0],
        email: authData.email,
        avatarInitial: authData.avatarInitial || authData.email[0].toUpperCase(),
        joinedAt: new Date().toISOString(),
      };
      localStorage.setItem("koli_auth_user", JSON.stringify(authUser));

      setStatus("success");
      setMessage("Authorization successful! Redirecting...");

      // Redirect to destination
      setTimeout(() => router.push(returnTo), 1500);
    } catch (err: any) {
      console.error("Callback error:", err);
      setStatus("error");
      setMessage(err.message || "Authorization failed. Please try again.");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
        <div className="text-center">
          {status === "processing" && (
            <>
              <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Processing</h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Success!</h2>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
            </>
          )}

          <p className="text-slate-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
              <p className="text-slate-300">Please wait...</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
