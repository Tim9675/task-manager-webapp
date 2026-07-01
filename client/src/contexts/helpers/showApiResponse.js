import { toast } from "react-hot-toast";

export function showApiError(error, fallback) {
  toast.error(error.response?.data?.message ?? fallback);
}

export function showActionSuccess(object, action) {
  toast.success(`${object} successfully ${action}`);
}
