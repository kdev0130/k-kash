export type SheetType = "send" | "receive" | "kash_out" | "kash_in" | null;
export type TabId = "home" | "activity" | "kash" | "settings" | "profile";
export type ToastType = "info" | "success" | "warn" | "error";

export interface ToastPayload {
  id?: number;
  msg: string;
  type: ToastType;
}

export interface RpcOption {
  label: string;
  url: string;
}
