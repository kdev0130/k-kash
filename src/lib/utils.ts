/**
 * Shorten a base58 wallet address.
 * e.g. "7xKX...AsU"
 */
export function shorten(address: string, leading = 6, trailing = 4): string {
  if (!address) return "";
  if (address.length <= leading + trailing + 3) return address;
  return `${address.slice(0, leading)}···${address.slice(-trailing)}`;
}

/**
 * Format a token amount with locale commas.
 */
export function formatAmount(amount: number, decimals = 2): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a USD value.
 */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Relative time helper (placeholder — swap with date-fns or dayjs later).
 */
export function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
