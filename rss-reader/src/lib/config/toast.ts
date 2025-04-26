import { toast } from "@zerodevx/svelte-toast";

export type ToastType = "success" | "error" | "warning";

const toastThemes: Record<ToastType, Record<string, string>> = {
  success: {
    "--toastBackground": "#48BB78",
    "--toastBarBackground": "#2F855A",
  },
  error: {
    "--toastBackground": "#F56565",
    "--toastColor": "#ffffff",
    "--toastBarBackground": "#C53030",
  },
  warning: {
    "--toastBackground": "#ECC94B",
    "--toastColor": "#000000",
    "--toastBarBackground": "#D69E2E",
  },
};

export function toastNotify(message: string, type: ToastType = "success") {
  const theme = toastThemes[type];
  toast.push(message, { theme });
}
