'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{item.name}</h3>
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
