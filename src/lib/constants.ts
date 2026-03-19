import type { RpcOption } from "@/types/ui";
import type { Network } from "@/types/wallet";

export const KOLI_SYMBOL = "KOLI";
export const KOLI_DECIMALS = 9;
export const KOLI_MINT = process.env.NEXT_PUBLIC_KOLI_MINT ?? "";

const rawNetwork = process.env.NEXT_PUBLIC_NETWORK;
export const NETWORK: Network =
  rawNetwork === "devnet" || rawNetwork === "mainnet-beta" || rawNetwork === "offline"
    ? rawNetwork
    : "offline";

export const RPC_OPTIONS: RpcOption[] = [
  { label: "Offline", url: "" },
  { label: "Default", url: "https://api.devnet.solana.com" },
  { label: "Helius",  url: "https://rpc-devnet.helius.xyz/?api-key=YOUR_KEY" },
  { label: "QuickNode", url: "https://your-endpoint.quiknode.pro/YOUR_KEY" },
  { label: "Custom",  url: "" },
];

export const DEFAULT_RPC = process.env.NEXT_PUBLIC_RPC_URL ?? "";

export const SOLANA_EXPLORER_BASE = {
  offline: "",
  devnet: "https://explorer.solana.com/tx/{sig}?cluster=devnet",
  "mainnet-beta": "https://explorer.solana.com/tx/{sig}",
};

export const explorerUrl = (sig: string, network: Network) =>
  SOLANA_EXPLORER_BASE[network] ? SOLANA_EXPLORER_BASE[network].replace("{sig}", sig) : "";
