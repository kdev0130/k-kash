/**
 * QRCode — static placeholder grid.
 * Replace with `qrcode.react` or `react-qr-code` once wallet is connected
 * and you have a real address to encode.
 */

interface QRCodeProps {
  value?: string; // reserved for real QR generation
  size?: number;
}

export function QRCode({ size = 188 }: QRCodeProps) {
  const n = 21;

  // Deterministic-ish grid that looks like a real QR code
  const cells = Array.from({ length: n * n }, (_, i) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const inTL = r < 7 && c < 7;
    const inTR = r < 7 && c >= 14;
    const inBL = r >= 14 && c < 7;

    if (inTL || inTR || inBL) {
      const edge =
        r === 0 || r === 6 || r === 14 || r === 20 ||
        c === 0 || c === 6 || c === 14 || c === 20;
      const inner =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= 16 && c <= 18) ||
        (r >= 16 && r <= 18 && c >= 2 && c <= 4);
      return edge || inner ? 1 : 0;
    }

    // Timing pattern
    if (r === 6 || c === 6) return i % 2 === 0 ? 1 : 0;

    // Data area — seeded pseudo-random
    const seed = (r * 31 + c * 17 + r * c) % 7;
    return seed > 3 ? 1 : 0;
  });

  const cellSize = (size - 8) / n;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
      aria-label="Wallet QR code"
    >
      <rect width={size} height={size} rx={12} fill="white" />
      {cells.map((v, i) =>
        v ? (
          <rect
            key={i}
            x={(i % n) * cellSize + 4}
            y={Math.floor(i / n) * cellSize + 4}
            width={cellSize - 0.8}
            height={cellSize - 0.8}
            rx={1.2}
            fill="#111111"
          />
        ) : null
      )}
    </svg>
  );
}
