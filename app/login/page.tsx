'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/owner';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      window.location.href = callbackUrl;
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef7e6 0%, #fff 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ fontSize: '2rem', fontWeight: 700, color: '#233f15', textDecoration: 'none' }}>
            ☕ Backyard Brew
          </Link>
          <p style={{ color: '#666', marginTop: '8px' }}>Sign in to manage your cafe</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '4px',
              color: '#333',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '4px',
              color: '#333',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#9a3327', fontWeight: 600, textAlign: 'center' }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              background: '#233f15',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
          <p>Demo accounts:</p>
          <p>Owner: owner@backyardbrew.com / password123</p>
          <p>Admin: admin@backyardbrew.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
