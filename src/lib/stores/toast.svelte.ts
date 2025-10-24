interface MoniToast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  timeout?: NodeJS.Timeout;
}

export let toasts = $state<MoniToast[]>([])

interface ShowToastOptions {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const showToast = ({
  message,
  type,
  duration,
}: ShowToastOptions) => {
  const id = Date.now();
  const toast: MoniToast = {
    message,
    type,
    id,
  }
  toasts.push(toast);
  if (duration) {
    toast.timeout = setTimeout(() => {
      toasts = toasts.filter(x => x.id !== id)
    }, duration)
  }
  return id;
}

export const clearToast = (id: number) => {
  const toast = toasts.find(x => x.id === id);
  if (!toast) return;
  if (toast.timeout) {
    clearTimeout(toast.timeout)
  }
  toasts = toasts.filter(x => x.id !== id);
};
