export type Network = "offline" | "devnet" | "mainnet-beta";

export type TransactionStatus = "success" | "pending" | "failed";
export type TransactionType = "send" | "receive";

export interface Transaction {
  id: string | number;
  type: TransactionType;
  label: string;
  sub: string;
  amt: string;
  stat: TransactionStatus;
  time: string;
  signature?: string;
}

export interface TokenBalance {
  symbol: string;
  amount: number;
  usdValue: number;
  mint?: string;
}

export interface SolBalance {
  amount: number;
  usdValue: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  koliBalance: TokenBalance | null;
  solBalance: SolBalance | null;
  network: Network;
}
