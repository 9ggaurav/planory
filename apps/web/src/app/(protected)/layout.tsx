'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loding...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
