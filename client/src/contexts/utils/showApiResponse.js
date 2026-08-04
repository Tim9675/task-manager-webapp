import { toast } from "react-hot-toast";

export function showApiError(error, fallback) {
  if (error.isAuthError) return;

  toast.error(error.message ?? fallback);
}

export function showActionSuccess(object, action) {
  toast.success(`${object} successfully ${action}`);
}

export function showWarning(error) {
  toast(error, { icon: "⚠️" });
}
