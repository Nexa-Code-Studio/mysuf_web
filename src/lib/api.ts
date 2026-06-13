/**
 * Centralized API configuration for MySUF Web Application.
 * Edit this file to change the backend endpoint dynamically across the entire app.
 */

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8080";
    }
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.smkn1wringin.sch.id";
};

export const BACKEND_URL = getBackendUrl();
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

