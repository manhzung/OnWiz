/**
 * Custom hook for authentication
 * Now acts as a wrapper around AuthContext
 */

import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
