/**
 * API endpoints constants
 */

const API_BASE = '';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh-tokens`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE}/users`,
    PROFILE: `${API_BASE}/users/me`,
    BY_ID: (id: string) => `${API_BASE}/users/${id}`,
  },
  
  // Courses
  COURSES: {
    BASE: `${API_BASE}/courses`,
    BY_ID: (id: string) => `${API_BASE}/courses/${id}`,
  },
  
  // Orders
  ORDERS: {
    BASE: `${API_BASE}/orders`,
    BY_ID: (id: string) => `${API_BASE}/orders/${id}`,
  },
} as const;

