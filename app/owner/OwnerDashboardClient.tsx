'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OwnerDashboard } from "@/modules/business-operations/components/OwnerDashboard";

export default function OwnerDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <OwnerDashboard />;
}
