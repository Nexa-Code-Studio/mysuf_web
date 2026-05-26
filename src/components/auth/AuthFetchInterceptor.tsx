"use client";

import { useEffect } from "react";

import { API_BASE_URL } from "@/lib/api";
import {
  WEB_CLIENT_TYPE,
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  persistAuthSession,
} from "@/lib/auth-session";

type RefreshResponse = {
  access_token?: string;
  refresh_token?: string;
  user?: unknown;
};

let refreshInFlight: Promise<string | null> | null = null;

const AUTH_LOGIN_PATH = "/api/v1/auth/login";
const AUTH_REFRESH_PATH = "/api/v1/auth/refresh";

function requestUrl(input: RequestInfo | URL): URL | null {
  try {
    if (input instanceof Request) {
      return new URL(input.url, window.location.origin);
    }
    if (input instanceof URL) {
      return input;
    }
    return new URL(input, window.location.origin);
  } catch {
    return null;
  }
}

function isApiRequest(url: URL): boolean {
  return (
    url.pathname.startsWith("/api/v1/") ||
    url.href.startsWith(API_BASE_URL)
  );
}

function shouldSkipRefresh(pathname: string): boolean {
  return pathname === AUTH_LOGIN_PATH || pathname === AUTH_REFRESH_PATH;
}

function shouldAttachAccessToken(pathname: string): boolean {
  return !shouldSkipRefresh(pathname);
}

function failSession(): void {
  clearAuthSession();
  if (window.location.pathname.startsWith("/login")) {
    return;
  }
  window.location.assign("/login");
}

async function refreshAccessToken(
  originalFetch: typeof window.fetch,
): Promise<string | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      failSession();
      return null;
    }

    try {
      const response = await originalFetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
          client_type: WEB_CLIENT_TYPE,
        }),
      });

      if (!response.ok) {
        failSession();
        return null;
      }

      const data = (await response.json()) as RefreshResponse;
      const nextAccessToken = data.access_token;
      const nextRefreshToken = data.refresh_token;
      if (!nextAccessToken || !nextRefreshToken) {
        failSession();
        return null;
      }

      persistAuthSession({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: data.user,
        clientType: WEB_CLIENT_TYPE,
      });
      return nextAccessToken;
    } catch {
      failSession();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function withAuthHeader(request: Request, token: string | null): Request {
  const headers = new Headers(request.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return new Request(request, { headers });
}

export default function AuthFetchInterceptor() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = requestUrl(input);
      if (!url || !isApiRequest(url)) {
        return originalFetch(input, init);
      }

      const sourceRequest = new Request(input, init);
      const firstRequest = withAuthHeader(
        sourceRequest.clone(),
        shouldAttachAccessToken(url.pathname) ? getAccessToken() : null,
      );
      let response = await originalFetch(firstRequest);

      if (
        response.status !== 401 ||
        shouldSkipRefresh(url.pathname) ||
        !getRefreshToken()
      ) {
        return response;
      }

      const nextToken = await refreshAccessToken(originalFetch);
      if (!nextToken) {
        return response;
      }

      const retryRequest = withAuthHeader(sourceRequest.clone(), nextToken);
      response = await originalFetch(retryRequest);
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
