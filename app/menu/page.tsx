'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Heart, LoaderCircle } from 'lucide-react';

type MenuItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  sortOrder: number;
  categoryId: number;
  cafeId: string;
  createdAt: string;
  updatedAt: string;
};

type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  items: MenuItem[];
  cafeId: string;
  createdAt: string;
  updatedAt: string;
};

// Placeholder images for menu items
const placeholderImages = [
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
];

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/public-menu');
        const data = await res.json();
        setMenu(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      if (status !== 'authenticated' || session?.user?.role !== 'CUSTOMER') {
        setFavoriteIds([]);
        return;
      }

      try {
        const res = await fetch('/api/customer/favorites');
        if (!res.ok) return;
        const data = await res.json();
        setFavoriteIds(data.map((favorite: { menuItemId: number }) => favorite.menuItemId));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }

    fetchFavorites();
  }, [session, status]);

  const handleFavorite = async (itemId: number) => {
    if (status !== 'authenticated' || session?.user?.role !== 'CUSTOMER') {
      router.push('/login?callbackUrl=/menu');
      return;
    }

    setLoadingFavoriteId(itemId);
    setFeedback(null);

    try {
      const res = await fetch('/api/customer/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: itemId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback(data.error || 'Could not add favorite');
        return;
      }

      setFavoriteIds((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
      setFeedback('Added to your favorites');
    } catch (error) {
      console.error('Error adding favorite:', error);
      setFeedback('Something went wrong');
    } finally {
      setLoadingFavoriteId(null);
      window.setTimeout(() => setFeedback(null), 2200);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <main className="site-shell" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '8px', fontWeight: 700 }}>Our Menu</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Freshly brewed, carefully crafted, and made with love.</p>
        {feedback && (
          <p style={{ marginTop: '12px', color: '#3f6738', fontWeight: 600 }}>{feedback}</p>
        )}
      </header>
      {menu.map((category) => (
        <section key={category.id} style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '24px', fontWeight: 600 }}>
            {category.name}
            {category.description && (
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)', marginTop: '4px' }}>
                {category.description}
              </span>
            )}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {category.items.map((item, idx) => (
              <div 
                key={item.id}
                style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div 
                  style={{ 
                    height: '160px', 
                    backgroundImage: `url(${item.image || placeholderImages[idx % placeholderImages.length]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} 
                />
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.name}</h3>
                    <button
                      type="button"
                      onClick={() => handleFavorite(item.id)}
                      disabled={loadingFavoriteId === item.id}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: loadingFavoriteId === item.id ? 'wait' : 'pointer',
                        color: favoriteIds.includes(item.id) ? '#9a3327' : '#6e625a',
                        padding: 0,
                      }}
                      aria-label={`Favorite ${item.name}`}
                    >
                      {loadingFavoriteId === item.id ? <LoaderCircle size={18} className="spin" /> : <Heart size={18} fill={favoriteIds.includes(item.id) ? '#9a3327' : 'none'} />}
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--copper)' }}>Rs. {item.price}</span>
                  </div>
                  {item.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
