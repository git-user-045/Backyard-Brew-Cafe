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

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Reservations", icon: CalendarClock },
  { label: "Customers", icon: UsersRound },
  { label: "Menu", icon: Menu },
  { label: "Analytics", icon: BarChart3 },
  { label: "Marketing", icon: Megaphone },
  { label: "Settings", icon: Settings }
];

export function OwnerDashboard() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [reservationsRes, tasksRes] = await Promise.all([
          fetch('/api/reservations'),
          fetch('/api/tasks'),
        ]);
        const reservationsData = await reservationsRes.json();
        const tasksData = await tasksRes.json();
        setReservations(reservationsData);
        setTasks(tasksData);
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
              <a className={item.active ? "ops-nav-item active" : "ops-nav-item"} href="#" key={item.label}>
                <Icon size={18} />
                {item.label}
              </a>
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

          <article className="ops-panel">
            <PanelHeader icon={<UsersRound size={18} />} title="Customer List" action="Open CRM" />
            <div className="ops-list">
              {/* Static customer data for now */}
              <div className="ops-list-row">
                <div>
                  <strong>Aarav Mehta</strong>
                  <span>Loyal</span>
                </div>
                <div>
                  <strong>Rs. 8,420</strong>
                  <span>12 visits</span>
                </div>
              </div>
              <div className="ops-list-row">
                <div>
                  <strong>Nisha Rao</strong>
                  <span>Growing</span>
                </div>
                <div>
                  <strong>Rs. 2,160</strong>
                  <span>4 visits</span>
                </div>
              </div>
              <div className="ops-list-row">
                <div>
                  <strong>Kabir Singh</strong>
                  <span>Regular</span>
                </div>
                <div>
                  <strong>Rs. 5,740</strong>
                  <span>7 visits</span>
                </div>
              </div>
            </div>
          </article>

          <article className="ops-panel">
            <PanelHeader icon={<Menu size={18} />} title="Menu Performance" action="Manage" />
            <div className="ops-list">
              {/* Static menu health data for now */}
              <div className="ops-list-row">
                <div>
                  <strong>Salted Caramel Cold Brew</strong>
                  <span>36 sold today</span>
                </div>
                <b>+18%</b>
              </div>
              <div className="ops-list-row">
                <div>
                  <strong>Garden Pesto Sandwich</strong>
                  <span>24 sold today</span>
                </div>
                <b>+9%</b>
              </div>
              <div className="ops-list-row">
                <div>
                  <strong>Cocoa Hazelnut Waffle</strong>
                  <span>19 sold today</span>
                </div>
                <b>-3%</b>
              </div>
            </div>
          </article>
        </section>
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

function PanelHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: string }) {
  return (
    <div className="ops-panel-header">
      <h2>
        {icon}
        {title}
      </h2>
      {action ? <button type="button">{action}</button> : null}
    </div>
  );
}
