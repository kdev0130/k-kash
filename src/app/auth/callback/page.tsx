"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Processing authorization...");

  const tokenServiceUrl =
    process.env.NEXT_PUBLIC_TOKEN_SERVICE_URL ?? "http://localhost:4000";

  useEffect(() => {
    handleCallback();
  }, []);

  const getIdToken = async () => {
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) throw new Error("Unable to obtain auth token");
    return token;
  };

  const ensureKashAccount = async (authData: any) => {
    // Ensure auth before any protected reads/writes
    await getIdToken();
    const memberRef = doc(db, "members", authData.userId);
    const kashRef = doc(db, "kashAccounts", authData.userId);

    const [memberSnap, kashSnap] = await Promise.all([
      getDoc(memberRef),
      getDoc(kashRef),
    ]);

    const member = memberSnap.exists() ? memberSnap.data() : {};
    let walletPublicKey = kashSnap.exists()
      ? (kashSnap.data().walletPublicKey as string | undefined)
      : undefined;
    let walletId = kashSnap.exists()
      ? (kashSnap.data().walletId as string | undefined)
      : undefined;

    if (!walletPublicKey) {
      const token = await getIdToken();
      const res = await fetch(`${tokenServiceUrl}/create-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID: authData.userId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create wallet");
      }

      const payload = await res.json();
      walletPublicKey = payload.publicKey;
      walletId = payload.walletId;
    }

    const displayName =
      member.displayName || authData.displayName || authData.email?.split("@")[0];
    const email = member.email || authData.email;

    const accountPayload: Record<string, unknown> = {
      uid: authData.userId,
      email,
      displayName,
      firstName: member.firstName || null,
      lastName: member.lastName || null,
      walletPublicKey,
      walletId: walletId ?? null,
      lastLoginAt: serverTimestamp(),
      memberUid: authData.userId,
    };

    if (!kashSnap.exists()) {
      accountPayload.createdAt = serverTimestamp();
    }

    await setDoc(kashRef, accountPayload, { merge: true });

    return { displayName, email, walletPublicKey };
  };

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
      const tokenRes = await fetch(`${tokenServiceUrl}/auth/kash-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to authorize");
      }

      const tokenPayload = await tokenRes.json();
      const authData = {
        userId: tokenPayload.user?.id,
        email: tokenPayload.user?.email,
        displayName: tokenPayload.user?.displayName,
        avatarInitial: tokenPayload.user?.avatarInitial,
      };

      if (!authData.userId) {
        throw new Error("Authorization payload missing user id");
      }

      await signInWithCustomToken(auth, tokenPayload.customToken);

      const accountInfo = await ensureKashAccount(authData);

      // Build session from embedded auth data (no members read needed)
      const authUser = {
        id: authData.userId,
        name: accountInfo.displayName || authData.email.split("@")[0],
        email: accountInfo.email || authData.email,
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
