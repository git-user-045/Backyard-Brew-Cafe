'use client';

import {
  BarChart3,
  CalendarClock,
  Coffee,
  LayoutDashboard,
  Megaphone,
  Menu,
  Settings,
  Star,
  UsersRound,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

// Types matching our Prisma models
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

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  cafeId: string;
  items: MenuItem[];
};

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
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Menu", icon: Menu },
  { label: "Reservations", icon: CalendarClock },
  { label: "Customers", icon: UsersRound },
  { label: "Analytics", icon: BarChart3 },
  { label: "Marketing", icon: Megaphone },
  { label: "Settings", icon: Settings }
];

export function OwnerDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [reservationsRes, tasksRes, categoriesRes] = await Promise.all([
          fetch('/api/reservations'),
          fetch('/api/tasks'),
          fetch('/api/menu-categories'),
        ]);
        const reservationsData = await reservationsRes.json();
        const tasksData = await tasksRes.json();
        const categoriesData = await categoriesRes.json();
        setReservations(reservationsData);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setReservations(prev => prev.map(res =>
        res.id === id ? { ...res, status: newStatus } : res
      ));
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const removeTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const createCategory = async () => {
    const name = prompt('Enter category name');
    if (!name) return;

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const res = await fetch('/api/menu-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          slug, 
          cafeId: session?.user?.cafe?.id || (categories[0]?.cafeId)
        }),
      });
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`/api/menu-categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const createItem = async (categoryId: number) => {
    const name = prompt('Enter item name');
    if (!name) return;
    const price = Number(prompt('Enter item price (number)') || '0');

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const res = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          price,
          categoryId,
          cafeId: session?.user?.cafe?.id || categories[0]?.cafeId,
        }),
      });
      const newItem = await res.json();
      setCategories(categories.map(cat =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat
      ));
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const deleteItem = async (categoryId: number, itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' });
      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      ));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleItemAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      const updatedItem = await res.json();
      setCategories(categories.map(cat =>
        cat.id === item.categoryId
          ? { ...cat, items: cat.items.map(i => i.id === item.id ? updatedItem : i) }
          : cat
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="ops-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="ops-app">
      <aside className="ops-sidebar" aria-label="Owner dashboard navigation">
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
            <p className="ops-kicker">Owner workspace</p>
            <h1>Backyard Brew Cafe</h1>
            {session?.user && (
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Welcome, {session.user.name || session.user.email}
              </p>
            )}
          </div>
          <div className="ops-plan">
            <span>Advanced</span>
            Plan
          </div>
        </header>

        {activeTab === 'Dashboard' && (
          <>
            <section className="ops-metrics" aria-label="Today metrics">
              <MetricCard label="Revenue" value="Rs. 42,860" icon={<BarChart3 size={19} />} />
              <MetricCard label="Reservations" value={String(reservations.length)} icon={<CalendarClock size={19} />} />
              <MetricCard label="Walk-ins" value="64" icon={<UsersRound size={19} />} />
              <MetricCard label="Average order" value="Rs. 410" icon={<Coffee size={19} />} />
            </section>

            <section className="ops-grid">
              <article className="ops-panel ops-panel-large">
                <PanelHeader icon={<CalendarClock size={18} />} title="Reservation Management" action="View all" />
                <div className="ops-table">
                  <div className="ops-table-row ops-table-head">
                    <span>Guest</span>
                    <span>Time</span>
                    <span>Party</span>
                    <span>Status</span>
                    <span>Source</span>
                    <span>Actions</span>
                  </div>
                  {reservations.map((reservation) => (
                    <div className="ops-table-row" key={reservation.id}>
                      <strong>{reservation.guestName}</strong>
                      <span>{reservation.timeSlot}</span>
                      <span>{reservation.partySize}</span>
                      <span className={`ops-status ${reservation.status.toLowerCase()}`}>{reservation.status}</span>
                      <span>{reservation.source}</span>
                      <span style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(reservation.id, "CONFIRMED")}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.25rem",
                            borderRadius: "4px",
                            color: "#3f6738"
                          }}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(reservation.id, "PENDING")}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.25rem",
                            borderRadius: "4px",
                            color: "#9b5a19"
                          }}
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(reservation.id, "CANCELLED")}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.25rem",
                            borderRadius: "4px",
                            color: "#9a3327"
                          }}
                        >
                          <XCircle size={16} />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="ops-panel">
                <PanelHeader icon={<Star size={18} />} title="Action Queue" />
                <ul className="ops-task-list">
                  {tasks.filter(task => !task.completed).map((task) => (
                    <li key={task.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "1rem" }}>
                      {task.title}
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9a3327"
                        }}
                      >
                        <XCircle size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          </>
        )}

        {activeTab === 'Menu' && (
          <section className="ops-grid">
            <article className="ops-panel ops-panel-large">
              <PanelHeader
                icon={<Menu size={18} />}
                title="Menu Management"
                action={<button onClick={createCategory} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Add Category</button>}
              />
              {categories.map((category) => (
                <div key={category.id} style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{category.name}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => createItem(category.id)} style={{ background: '#233f15', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Plus size={14} /> Add Item
                      </button>
                      <button onClick={() => deleteCategory(category.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9a3327' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                    {category.items.map((item) => (
                      <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#666' }}>Rs. {item.price}</p>
                            {item.description && <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#888' }}>{item.description}</p>}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => toggleItemAvailability(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: item.isAvailable ? '#3f6738' : '#666' }} title={item.isAvailable ? 'Available' : 'Unavailable'}>
                              {item.isAvailable ? <Check size={16} /> : <XCircle size={16} />}
                            </button>
                            <button onClick={() => deleteItem(category.id, item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9a3327' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </article>
          </section>
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

function PanelHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode | string }) {
  return (
    <div className="ops-panel-header">
      <h2>
        {icon}
        {title}
      </h2>
      {action && (typeof action === 'string' ? <button type="button">{action}</button> : action)}
    </div>
  );
}
