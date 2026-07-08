'use client';

import {
  CalendarClock,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

type Reservation = {
  id: number;
  guestName: string;
  phone: string;
  partySize: number;
  timeSlot: string;
  notes: string | null;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type Favorite = {
  id: number;
  customerId: string;
  menuItemId: number;
  createdAt: string;
  menuItem: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    image: string | null;
    category: {
      name: string;
    };
  };
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Reservations", icon: CalendarClock },
  { label: "Favorites", icon: Heart },
  { label: "Profile", icon: User },
];

export function CustomerDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name || '',
    phone: session?.user?.customer?.phone || '',
  });
  const [profileMeta, setProfileMeta] = useState<{ name?: string | null; phone?: string | null; email?: string | null } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reservationsRes, favoritesRes, profileRes] = await Promise.all([
          fetch('/api/customer/reservations'),
          fetch('/api/customer/favorites'),
          fetch('/api/customer/profile'),
        ]);
        
        if (reservationsRes.ok) {
          const reservationsData = await reservationsRes.json();
          setReservations(reservationsData);
        }
        
        if (favoritesRes.ok) {
          const favoritesData = await favoritesRes.json();
          setFavorites(favoritesData);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfileMeta(profileData);
          setProfileForm((prev) => ({
            name: prev.name || profileData?.name || session?.user?.name || '',
            phone: prev.phone || profileData?.phone || session?.user?.customer?.phone || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingReservations = reservations.filter(r => r.status === 'PENDING').length;
  const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED').length;

  const removeFavorite = async (favoriteId: number) => {
    try {
      await fetch(`/api/customer/favorites/${favoriteId}`, { method: 'DELETE' });
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (res.ok) {
        const profileData = await res.json();
        setProfileMeta(profileData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="ops-app">
      <aside className="ops-sidebar" aria-label="Customer dashboard navigation">
        <a className="ops-logo" href="/">
          <span>C</span>
          CafeOS
        </a>
        <nav className="ops-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={item.label === activeTab ? "ops-nav-item active" : "ops-nav-item"}
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '16px', marginTop: 'auto' }}>
          <button
            onClick={() => signOut()}
            style={{
              width: '100%',
              display: 'flex',
              gap: '8px',
              padding: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9a3327',
              borderRadius: '8px',
            }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <section className="ops-main">
        <header className="ops-topbar">
          <div>
            <p className="ops-kicker">Customer portal</p>
            <h1>Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!</h1>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>
              Manage your reservations and favorites
            </p>
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            <section className="ops-metrics" aria-label="Your metrics">
              <MetricCard label="Total Reservations" value={String(reservations.length)} icon={<CalendarClock size={19} />} />
              <MetricCard label="Confirmed" value={String(confirmedReservations)} icon={<CalendarClock size={19} />} />
              <MetricCard label="Pending" value={String(pendingReservations)} icon={<CalendarClock size={19} />} />
              <MetricCard label="Favorites" value={String(favorites.length)} icon={<Heart size={19} />} />
            </section>

            <section className="ops-grid">
              <article className="ops-panel ops-panel-large">
                <PanelHeader icon={<CalendarClock size={18} />} title="Recent Reservations" />
                {isLoading ? (
                  <p style={{ padding: '20px', color: '#666' }}>Loading reservations...</p>
                ) : reservations.length === 0 ? (
                  <p style={{ padding: '20px', color: '#666' }}>No reservations yet. <a href="/" style={{ color: '#233f15' }}>Make your first reservation</a></p>
                ) : (
                  <div className="ops-table">
                    <div className="ops-table-row ops-table-head">
                      <span>Date & Time</span>
                      <span>Party Size</span>
                      <span>Status</span>
                    </div>
                    {reservations.slice(0, 5).map((reservation) => (
                      <div className="ops-table-row" key={reservation.id}>
                        <strong>{reservation.timeSlot}</strong>
                        <span>{reservation.partySize} guests</span>
                        <span className={`ops-status ${reservation.status.toLowerCase()}`}>{reservation.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="ops-panel">
                <PanelHeader icon={<Heart size={18} />} title="Quick Actions" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                  <a
                    href="/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  >
                    <CalendarClock size={20} />
                    <span>Make a Reservation</span>
                  </a>
                  <a
                    href="/menu"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#333',
                      fontWeight: 600,
                    }}
                  >
                    <Heart size={20} />
                    <span>View Menu</span>
                  </a>
                </div>
              </article>
            </section>
          </>
        )}

        {activeTab === 'Reservations' && (
          <article className="ops-panel ops-panel-large">
            <PanelHeader icon={<CalendarClock size={18} />} title="All Reservations" />
            {isLoading ? (
              <p style={{ padding: '20px', color: '#666' }}>Loading reservations...</p>
            ) : reservations.length === 0 ? (
              <p style={{ padding: '20px', color: '#666' }}>No reservations yet.</p>
            ) : (
              <div className="ops-table">
                <div className="ops-table-row ops-table-head">
                  <span>Date & Time</span>
                  <span>Party Size</span>
                  <span>Status</span>
                  <span>Notes</span>
                </div>
                {reservations.map((reservation) => (
                  <div className="ops-table-row" key={reservation.id}>
                    <strong>{reservation.timeSlot}</strong>
                    <span>{reservation.partySize} guests</span>
                    <span className={`ops-status ${reservation.status.toLowerCase()}`}>{reservation.status}</span>
                    <span>{reservation.notes || '-'}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        )}

        {activeTab === 'Favorites' && (
          <article className="ops-panel ops-panel-large">
            <PanelHeader icon={<Heart size={18} />} title="Favorite Items" />
            {isLoading ? (
              <p style={{ padding: '20px', color: '#666' }}>Loading favorites...</p>
            ) : favorites.length === 0 ? (
              <p style={{ padding: '20px', color: '#666' }}>
                No favorites yet. Visit the <a href="/menu" style={{ color: '#233f15' }}>menu</a> to add items to your favorites.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', padding: '16px' }}>
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      padding: '16px',
                      position: 'relative',
                    }}
                  >
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9a3327',
                      }}
                      title="Remove from favorites"
                    >
                      <Heart size={18} fill="#9a3327" />
                    </button>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', paddingRight: '32px' }}>
                      {favorite.menuItem.name}
                    </h3>
                    <p style={{ margin: '0 0 8px', fontSize: '0.875rem', color: '#666' }}>
                      {favorite.menuItem.category.name}
                    </p>
                    <p style={{ margin: '0', fontSize: '1rem', fontWeight: 600, color: '#233f15' }}>
                      Rs. {favorite.menuItem.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        )}

        {activeTab === 'Profile' && (
          <article className="ops-panel ops-panel-large">
            <PanelHeader icon={<User size={18} />} title="Profile Settings" />
            <form onSubmit={handleProfileUpdate} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Email</label>
                <input
                  type="email"
                  value={profileMeta?.email || session?.user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    background: '#f5f5f5',
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Add your phone number"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    background: '#233f15',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.7 : 1,
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {saveSuccess && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3f6738', fontWeight: 600 }}>
                    <Check size={18} />
                    Saved successfully
                  </span>
                )}
              </div>
            </form>
          </article>
        )}
      </section>
    </main>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <article className="ops-metric">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function PanelHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="ops-panel-header">
      <h2>
        {icon}
        {title}
      </h2>
    </div>
  );
}
