import axios from "axios";
import Cookies from "js-cookie";
import { message } from "antd";
import { useAppSelector } from "../hooks/redux";
import { clearCredentialCookie } from "../utils";

/** Khóa quyền do backend định nghĩa (src/auth/permissions.ts), vd "dialogue.write". */
export type Permission = string;

const PERMISSIONS_KEY = "permissions";

export const getToken = () => Cookies.get("access_token") || "";

/**
 * Quyền lấy từ /auth/me lần gần nhất. Menu được dựng một lần lúc tải trang
 * nên đọc từ đây; Home tải lại trang khi quyền thay đổi.
 */
export function storedPermissions(): Permission[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(PERMISSIONS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/** Lưu quyền mới; trả về true nếu khác quyền đang lưu. */
export function storePermissions(permissions: Permission[]): boolean {
  const next = JSON.stringify([...permissions].sort());
  const changed = next !== JSON.stringify([...storedPermissions()].sort());
  sessionStorage.setItem(PERMISSIONS_KEY, next);
  return changed;
}

export function clearPermissions() {
  sessionStorage.removeItem(PERMISSIONS_KEY);
}

export const can = (
  permission: Permission,
  permissions: Permission[] = storedPermissions()
) => permissions.includes(permission);

/** Trong component: const can = useCan(); can("users.write") */
export function useCan() {
  const permissions = useAppSelector((state) => state.account.permissions);
  return (permission: Permission) => permissions.includes(permission);
}

/** EventSource không gửi được header, nên token đi kèm trên URL. */
export function withToken(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}access_token=${encodeURIComponent(getToken())}`;
}

/** Nội dung lỗi backend trả về (lỗi validate là một mảng câu). */
export function errorMessage(error: any, fallback = "Có lỗi xảy ra") {
  const text = error?.response?.data?.message;
  if (Array.isArray(text)) return text.join(", ");
  return text || fallback;
}

/**
 * Gắn token vào mọi request axios; hết phiên (401) thì về trang đăng nhập,
 * không có quyền (403) thì báo cho người dùng biết.
 */
export function setupAxiosAuth() {
  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const isLogin = String(error?.config?.url ?? "").includes("/auth/login");
      if (status === 401 && !isLogin) {
        clearCredentialCookie();
        if (!window.location.pathname.startsWith("/auth")) {
          message.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          window.location.href = "/auth/login";
        }
      } else if (status === 403) {
        message.error(errorMessage(error, "Bạn không có quyền thực hiện thao tác này"));
      }
      return Promise.reject(error);
    }
  );
}
