'use client';
import useAutoLogout from '@/hooks/useAutoLogout';

export default function AutoLogoutProvider({ children }) {
  useAutoLogout(); // Always call the hook!
  return children;
} 