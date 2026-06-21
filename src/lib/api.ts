/**
 * Centralized API configuration for MySUF Web Application.
 * Edit this file to change the backend endpoint dynamically across the entire app.
 */

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
};

export const BACKEND_URL = getBackendUrl();
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

