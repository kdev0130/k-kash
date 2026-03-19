"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface QRScannerProps {
  onScan: (value: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [supportsTorch, setSupportsTorch] = useState(false);

  useEffect(() => {
    let detector: any = null;

    const start = async () => {
      // Check BarcodeDetector support
      if (!("BarcodeDetector" in window)) {
        setError("QR scanning is not supported in this browser. Please type the address manually.");
        return;
      }

      try {
        detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        setError("Could not initialise QR detector. Please type the address manually.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;

        // Check torch support
        const track = stream.getVideoTracks()[0];
        const caps = track.getCapabilities() as any;
        if (caps?.torch) setSupportsTorch(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        const scan = async () => {
          if (!videoRef.current || !detector) return;
          const video = videoRef.current;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            try {
              const codes = await detector.detect(video);
              if (codes.length > 0) {
                const raw = codes[0].rawValue as string;
                // Strip solana: prefix if present
                const address = raw.startsWith("solana:") ? raw.slice(7).split("?")[0] : raw;
                onScan(address);
                return; // stop scanning
              }
            } catch {}
          }
          rafRef.current = requestAnimationFrame(scan);
        };
        rafRef.current = requestAnimationFrame(scan);
      } catch (e: any) {
        if (e?.name === "NotAllowedError") {
          setError("Camera access was denied. Please allow camera permissions and try again.");
        } else {
          setError("Could not access camera. Please type the address manually.");
        }
      }
    };

    start();

    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onScan]);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await (track as any).applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {}
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 950,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      {/* Camera feed */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <video
          ref={videoRef}
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dimmed overlay with cutout */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Viewfinder */}
          <div
            style={{
              width: 240,
              height: 240,
              position: "relative",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
              borderRadius: 16,
            }}
          >
            {/* Corner brackets */}
            {[
              { top: 0, left: 0, borderTop: "3px solid #fff", borderLeft: "3px solid #fff", borderRadius: "12px 0 0 0" },
              { top: 0, right: 0, borderTop: "3px solid #fff", borderRight: "3px solid #fff", borderRadius: "0 12px 0 0" },
              { bottom: 0, left: 0, borderBottom: "3px solid #fff", borderLeft: "3px solid #fff", borderRadius: "0 0 0 12px" },
              { bottom: 0, right: 0, borderBottom: "3px solid #fff", borderRight: "3px solid #fff", borderRadius: "0 0 12px 0" },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 28, height: 28, ...s }} />
            ))}

            {/* Scanning line */}
            {scanning && !error && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--gold)",
                  boxShadow: "0 0 8px 2px rgba(198,168,79,0.6)",
                  animation: "scanLine 2s linear infinite",
                  borderRadius: 2,
                }}
              />
            )}
          </div>
        </div>

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            padding: "52px 20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon name="close" size={16} color="#fff" strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
            Scan QR Code
          </span>
          {supportsTorch ? (
            <button
              onClick={toggleTorch}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: torchOn ? "rgba(198,168,79,0.4)" : "rgba(255,255,255,0.15)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon name="sun" size={16} color="#fff" strokeWidth={2} />
            </button>
          ) : <div style={{ width: 36 }} />}
        </div>

        {/* Bottom hint / error */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            padding: "16px 20px 36px",
            textAlign: "center",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        >
          {error ? (
            <div
              style={{
                background: "rgba(255,59,48,0.15)",
                border: "1px solid rgba(255,59,48,0.4)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "#fff",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: 0 }}>
              Point camera at a Solana wallet QR code
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; }
          50%  { top: calc(100% - 2px); }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
