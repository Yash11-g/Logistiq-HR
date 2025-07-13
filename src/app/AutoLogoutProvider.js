'use client';
import useAutoLogout from '@/hooks/useAutoLogout';
import { usePathname } from 'next/navigation';

export default function AutoLogoutProvider({ children }) {
  const pathname = usePathname();

  // Exclude /upload/[token] and any subroutes
  const isUploadPage = pathname.startsWith('/upload/');

  if (!isUploadPage) {
    useAutoLogout();
  }

  return children;
} 