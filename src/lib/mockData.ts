import type { Transaction, TokenBalance, SolBalance } from "@/types/wallet";

export const MOCK_ADDRESS =
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

export const MOCK_KOLI_BALANCE: TokenBalance = {
  symbol: "KOLI",
  amount: 47_250,
  usdValue: 284.73,
  mint: "KoLiMintAddressPlaceholder111111111111111111",
};

export const MOCK_SOL_BALANCE: SolBalance = {
  amount: 2.4051,
  usdValue: 384.82,
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    type: "receive",
    label: "Received",
    sub: "From 3mXe···9kBp",
    amt: "+2,500",
    stat: "success",
    time: "2m ago",
    signature: "5xK2mN8p",
  },
  {
    id: 2,
    type: "send",
    label: "Sent",
    sub: "To 9pQr···2xLm",
    amt: "−1,000",
    stat: "success",
    time: "1h ago",
    signature: "2vR4kJ6n",
  },
  {
    id: 3,
    type: "receive",
    label: "Received",
    sub: "From 8nWs···7vKp",
    amt: "+5,000",
    stat: "success",
    time: "3h ago",
    signature: "9mP7xN3q",
  },
  {
    id: 4,
    type: "send",
    label: "Sent",
    sub: "To 2kMp···4xRn",
    amt: "−750",
    stat: "pending",
    time: "5h ago",
    signature: "1vX9cP2m",
  },
  {
    id: 5,
    type: "receive",
    label: "Received",
    sub: "From 6fYt···8uNk",
    amt: "+10,000",
    stat: "success",
    time: "Yesterday",
    signature: "8xW3vL7p",
  },
  {
    id: 6,
    type: "send",
    label: "Sent",
    sub: "To 4nKm···6pQr",
    amt: "−3,200",
    stat: "failed",
    time: "2d ago",
    signature: "3mN5xK8v",
  },
];
