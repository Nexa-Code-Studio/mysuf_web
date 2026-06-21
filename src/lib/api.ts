/**
 * Centralized API configuration for MySUF Web Application.
 * Edit this file to change the backend endpoint dynamically across the entire app.
 */

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("vercel.app") || hostname === "mysuf-web.vercel.app") {
      return "https://api.smkn1wringin.sch.id";
    }
    return `${window.location.protocol}//${hostname}:8080`;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const BACKEND_URL = getBackendUrl();
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

