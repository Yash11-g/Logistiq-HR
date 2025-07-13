import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';

const AUTO_LOGOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

export default function useAutoLogout(timeoutMs = AUTO_LOGOUT_MS) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef();

  useEffect(() => {
    // Exclude /upload/[token] and any subroutes
    if (pathname.startsWith('/upload/')) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        signOut(auth);
        router.push('/login');
        alert('You have been logged out due to inactivity.');
      }, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [router, timeoutMs, pathname]);
} 