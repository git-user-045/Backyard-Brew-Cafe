'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CustomerDashboard } from "@/modules/customer-experience/components/CustomerDashboard";

export default function CustomerDashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'CUSTOMER') {
      // Redirect non-customers to appropriate dashboard
      if (session.user.role === 'OWNER') {
        router.push('/owner');
      } else if (session.user.role === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [status, session, router]);

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

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null;
  }

  return <CustomerDashboard />;
}
