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
  const [taskTitle, setTaskTitle] = useState('');
  const [summary, setSummary] = useState({
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalTasks: 0,
  });

  const recalculateSummary = (nextReservations: Reservation[], nextTasks: Task[]) => {
    setSummary({
      confirmed: nextReservations.filter((res) => res.status === 'CONFIRMED').length,
      pending: nextReservations.filter((res) => res.status === 'PENDING').length,
      cancelled: nextReservations.filter((res) => res.status === 'CANCELLED').length,
      totalTasks: nextTasks.length,
    });
  };

  const reservationStats = {
    total: reservations.length,
    confirmed: reservations.filter((reservation) => reservation.status === 'CONFIRMED').length,
    pending: reservations.filter((reservation) => reservation.status === 'PENDING').length,
    cancelled: reservations.filter((reservation) => reservation.status === 'CANCELLED').length,
    averageParty: reservations.length
      ? Math.round(reservations.reduce((sum, reservation) => sum + reservation.partySize, 0) / reservations.length)
      : 0,
  };

  const customerList = Array.from(
    reservations.reduce((map, reservation) => {
      const key = reservation.phone || reservation.guestName;
      const existing = map.get(key) || {
        name: reservation.guestName,
        phone: reservation.phone,
        visits: 0,
        lastVisit: reservation.createdAt,
      };
      existing.visits += 1;
      existing.lastVisit = reservation.createdAt;
      map.set(key, existing);
      return map;
    }, new Map<string, { name: string; phone: string; visits: number; lastVisit: string }>())
      .values()
  );

  const sourceBreakdown = reservations.reduce<Record<string, number>>((acc, reservation) => {
    const source = reservation.source || 'Website';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const cafeName = session?.user?.cafe?.name || 'Backyard Brew Cafe';

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
        recalculateSummary(reservationsData, tasksData);
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
      setReservations(prev => {
        const updated = prev.map(res => res.id === id ? { ...res, status: newStatus } : res);
        recalculateSummary(updated, tasks);
        return updated;
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const removeTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        recalculateSummary(reservations, updated);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTask = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle.trim() }),
      });
      const newTask = await res.json();
      setTasks(prev => {
        const updated = [newTask, ...prev];
        recalculateSummary(reservations, updated);
        return updated;
      });
      setTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
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
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`/api/menu-categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(cat => cat.id !== id));
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
      setCategories(prev => prev.map(cat =>
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
      setCategories(prev => prev.map(cat =>
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
      setCategories(prev => prev.map(cat =>
        cat.id === item.categoryId
          ? { ...cat, items: cat.items.map(i => i.id === item.id ? updatedItem : i) }
          : cat
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const updatedTask = await res.json();
      setTasks(prev => {
        const updated = prev.map(item => item.id === task.id ? updatedTask : item);
        recalculateSummary(reservations, updated);
        return updated;
      });
    } catch (error) {
      console.error('Error updating task:', error);
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
            <h1>{cafeName}</h1>
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
              <MetricCard label="Reservations" value={String(reservations.length)} icon={<CalendarClock size={19} />} />
              <MetricCard label="Confirmed" value={String(summary.confirmed)} icon={<CheckCircle2 size={19} />} />
              <MetricCard label="Pending" value={String(summary.pending)} icon={<Clock size={19} />} />
              <MetricCard label="Tasks" value={String(summary.totalTasks)} icon={<Star size={19} />} />
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
                <form onSubmit={addTask} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Add a task"
                    style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <button type="submit" style={{ background: '#233f15', color: 'white', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}>Add</button>
                </form>
                <ul className="ops-task-list">
                  {tasks.filter(task => !task.completed).map((task) => (
                    <li key={task.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => toggleTaskCompletion(task)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#3f6738", padding: 0 }}
                        title="Mark as complete"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <span style={{ flex: 1, marginLeft: "0.5rem" }}>{task.title}</span>
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

              <article className="ops-panel">
                <PanelHeader icon={<BarChart3 size={18} />} title="Today at a glance" />
                <div className="ops-list">
                  <div className="ops-list-row">
                    <div>
                      <strong>Confirmed bookings</strong>
                      <span>{summary.confirmed} reservations locked in</span>
                    </div>
                    <b>{summary.pending} pending</b>
                  </div>
                  <div className="ops-list-row">
                    <div>
                      <strong>Open tasks</strong>
                      <span>{summary.totalTasks} active follow-ups</span>
                    </div>
                    <b>{summary.cancelled} cancelled</b>
                  </div>
                </div>
              </article>
            </section>
          </>
        )}

        {activeTab === 'Reservations' && (
          <section className="ops-grid">
            <article className="ops-panel ops-panel-large">
              <PanelHeader icon={<CalendarClock size={18} />} title="Reservation Inbox" />
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
                    <span style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}><CheckCircle2 size={16} /></button>
                      <button type="button" onClick={() => updateReservationStatus(reservation.id, 'PENDING')}><Clock size={16} /></button>
                      <button type="button" onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}><XCircle size={16} /></button>
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'Customers' && (
          <section className="ops-grid">
            <article className="ops-panel ops-panel-large">
              <PanelHeader icon={<UsersRound size={18} />} title="Customer Directory" />
              <div className="ops-list">
                {customerList.map((customer) => (
                  <div className="ops-list-row" key={customer.phone || customer.name}>
                    <div>
                      <strong>{customer.name}</strong>
                      <span>{customer.phone || 'No phone on file'}</span>
                    </div>
                    <b>{customer.visits} visits</b>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'Analytics' && (
          <section className="ops-grid">
            <article className="ops-panel">
              <PanelHeader icon={<BarChart3 size={18} />} title="Booking overview" />
              <div className="ops-list">
                <div className="ops-list-row">
                  <div>
                    <strong>Total reservations</strong>
                    <span>{reservationStats.total} bookings logged</span>
                  </div>
                  <b>{reservationStats.confirmed} confirmed</b>
                </div>
                <div className="ops-list-row">
                  <div>
                    <strong>Average party size</strong>
                    <span>Typical guest volume</span>
                  </div>
                  <b>{reservationStats.averageParty} guests</b>
                </div>
              </div>
            </article>
            <article className="ops-panel">
              <PanelHeader icon={<BarChart3 size={18} />} title="Traffic sources" />
              <div className="ops-list">
                {Object.entries(sourceBreakdown).map(([source, count]) => (
                  <div className="ops-list-row" key={source}>
                    <div>
                      <strong>{source}</strong>
                      <span>Reservations received</span>
                    </div>
                    <b>{count}</b>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === 'Marketing' && (
          <section className="ops-grid">
            <article className="ops-panel ops-panel-large">
              <PanelHeader icon={<Megaphone size={18} />} title="Marketing pulse" />
              <div className="ops-list">
                <div className="ops-list-row">
                  <div>
                    <strong>Top channel</strong>
                    <span>Most bookings came from the web</span>
                  </div>
                  <b>{Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Website'}</b>
                </div>
                <div className="ops-list-row">
                  <div>
                    <strong>Repeat customers</strong>
                    <span>Returning guests in your booking history</span>
                  </div>
                  <b>{customerList.filter((customer) => customer.visits > 1).length}</b>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === 'Settings' && (
          <section className="ops-grid">
            <article className="ops-panel ops-panel-large">
              <PanelHeader icon={<Settings size={18} />} title="Cafe settings" />
              <div className="ops-list">
                <div className="ops-list-row">
                  <div>
                    <strong>Cafe name</strong>
                    <span>Displayed to customers and staff</span>
                  </div>
                  <b>{cafeName}</b>
                </div>
                <div className="ops-list-row">
                  <div>
                    <strong>Plan</strong>
                    <span>Current subscription tier</span>
                  </div>
                  <b>Advanced</b>
                </div>
                <div className="ops-list-row">
                  <div>
                    <strong>Reservations</strong>
                    <span>Live booking workflow status</span>
                  </div>
                  <b>{reservationStats.confirmed} confirmed</b>
                </div>
              </div>
            </article>
          </section>
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
