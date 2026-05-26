import { ROLE_STORAGE_KEY } from "@/lib/roles";
import type { UserRole } from "@/types";

export const ACCESS_TOKEN_STORAGE_KEY = "mysuf-token";
export const REFRESH_TOKEN_STORAGE_KEY = "mysuf-refresh-token";
export const USER_STORAGE_KEY = "mysuf-user";
export const CLIENT_TYPE_STORAGE_KEY = "mysuf-client-type";

export const WEB_CLIENT_TYPE = "ADMIN_WEB";

type PersistAuthSessionParams = {
  accessToken: string;
  refreshToken: string;
  user?: unknown;
  role?: UserRole;
  clientType?: string;
};

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function persistAuthSession({
  accessToken,
  refreshToken,
  user,
  role,
  clientType = WEB_CLIENT_TYPE,
}: PersistAuthSessionParams): void {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  window.localStorage.setItem(CLIENT_TYPE_STORAGE_KEY, clientType);

  if (typeof user !== "undefined") {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
  if (role) {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  }
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.localStorage.removeItem(CLIENT_TYPE_STORAGE_KEY);
  window.localStorage.removeItem(ROLE_STORAGE_KEY);
}
