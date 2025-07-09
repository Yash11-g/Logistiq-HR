'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export default function useAuthRedirect() {
  const router = useRouter(); // ✅ should always be called

  const [loading, setLoading] = useState(true); // ✅ always runs
  const [shouldRender, setShouldRender] = useState(false); // ✅ always runs

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // ✅ redirects if not logged in
      } else {
        setShouldRender(true); // ✅ allows rendering
      }
      setLoading(false); // ✅ always finishes loading
    });

    return () => unsubscribe(); // ✅ always cleanup
  }, [router]);

  return { loading, shouldRender };
}