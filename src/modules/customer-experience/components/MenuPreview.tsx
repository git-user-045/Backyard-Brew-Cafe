'use client';

import { useState, useEffect } from 'react';

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
];

export function MenuPreview() {
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

  // Flatten all menu items from categories for preview
  const allItems = menu.flatMap(category => 
    category.items.map(item => ({
      ...item,
      category: category.name,
    }))
  );

  if (isLoading) {
    return (
      <section id="menu" className="section">
        <div className="site-shell">
          <div className="section-header">
            <h2>Menu favorites ready for QR ordering.</h2>
            <p>Loading menu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="section">
      <div className="site-shell">
        <div className="section-header">
          <h2>Menu favorites ready for QR ordering.</h2>
          <p>
            The public menu is built as a reusable module so future CafeOS menu management can feed this page directly.
          </p>
        </div>
        <div className="menu-grid">
          {allItems.slice(0, 3).map((item, idx) => (
            <article className="menu-card" key={item.id}>
              <div 
                className="menu-image" 
                style={{ 
                  backgroundImage: `url(${item.image || placeholderImages[idx % placeholderImages.length]})` 
                }} 
              />
              <div className="menu-content">
                <div className="menu-meta">
                  <span>{item.category}</span>
                  <span>Rs. {item.price}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description || ''}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
