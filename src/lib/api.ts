/**
 * Centralized API configuration for MySUF Web Application.
 * Edit this file to change the backend endpoint dynamically across the entire app.
 */

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://203.175.125.250";
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;
