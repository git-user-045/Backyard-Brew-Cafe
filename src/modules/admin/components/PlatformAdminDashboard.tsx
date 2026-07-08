'use client';

import {
  Activity,
  BadgeIndianRupee,
  Building2,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  ShieldCheck,
  TrendingDown,
  UsersRound,
  LogOut,
  CalendarClock,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const adminNav = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Clients", icon: Building2 },
  { label: "Subscriptions", icon: BadgeIndianRupee },
  { label: "Support", icon: LifeBuoy },
  { label: "Onboarding", icon: ListChecks },
  { label: "Health", icon: Activity },
  { label: "Access", icon: ShieldCheck }
];

type PlatformAdminDashboardProps = {
  data?: any;
};

export function PlatformAdminDashboard({ data }: PlatformAdminDashboardProps) {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(data || {
    summary: { activeClients: 0, monthlyRevenue: "Rs. 0", openIssues: 0, churnRisk: 0 },
    clients: [],
    supportQueue: [],
    onboarding: [],
    planMix: [],
    subscriptions: [],
    health: [],
    access: [],
  });
  const [isLoading, setIsLoading] = useState(!data);
  const [activeSection, setActiveSection] = useState("Overview");

  useEffect(() => {
    if (data) {
      setDashboardData(data);
      setIsLoading(false);
      return;
    }

    async function fetchOverview() {
      try {
        const res = await fetch('/api/admin/overview');
        if (res.ok) {
          const result = await res.json();
          setDashboardData(result);
        }
      } catch (error) {
        console.error('Error fetching admin overview:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOverview();
  }, [data]);

  return (
    <main className="admin-app">
      <aside className="admin-sidebar" aria-label="Platform admin navigation">
        <a className="admin-logo" href="/">
          <span>OS</span>
          CafeOS Admin
        </a>
        <nav className="admin-nav">
          {adminNav.map((item) => {
            const Icon = item.icon;

            return (
              <a
                className={activeSection === item.label || (item.label === 'Overview' && activeSection === 'Overview') ? "admin-nav-item active" : "admin-nav-item"}
                href="#"
                key={item.label}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveSection(item.label);
                }}
              >
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

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Platform control center</p>
            <h1>Client Monitoring</h1>
            {session?.user && (
              <p style={{ color: '#666', fontSize: '0.875rem' }}>
                Welcome, {session.user.name || session.user.email} ({session.user.role})
              </p>
            )}
          </div>
          <a className="admin-action" href="/owner">
            View owner panel
          </a>
        </header>

        <section className="admin-metrics" aria-label="Platform metrics">
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: '16px', color: '#666' }}>Loading platform overview...</div>
          ) : (
            <>
              <AdminMetric icon={<Building2 size={19} />} label="Active clients" value={String(dashboardData.summary.activeClients)} />
              <AdminMetric icon={<BadgeIndianRupee size={19} />} label="Monthly revenue" value={dashboardData.summary.monthlyRevenue} />
              <AdminMetric icon={<Headphones size={19} />} label="Open issues" value={String(dashboardData.summary.openIssues)} />
              <AdminMetric icon={<TrendingDown size={19} />} label="Churn risk" value={String(dashboardData.summary.churnRisk)} />
            </>
          )}
        </section>

        <section className="admin-grid">
          {activeSection === 'Clients' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Client Cafes" icon={<UsersRound size={18} />} action="Add client" />
                <div className="admin-table">
                  <div className="admin-table-row admin-table-head">
                    <span>Cafe</span>
                    <span>Owner</span>
                    <span>City</span>
                    <span>Plan</span>
                    <span>Status</span>
                    <span>MRR</span>
                    <span>Last active</span>
                  </div>
                  {(dashboardData.clients || []).map((client: any) => (
                    <div className="admin-table-row" key={client.cafe}>
                      <strong>{client.cafe}</strong>
                      <span>{client.owner}</span>
                      <span>{client.city}</span>
                      <span>{client.plan}</span>
                      <span className={`admin-status ${statusClass(client.status)}`}>{client.status}</span>
                      <span>{client.mrr}</span>
                      <span>{client.lastActive}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <PanelHeader title="Client Health" icon={<Activity size={18} />} />
                <div className="admin-list">
                  {(dashboardData.health || []).map((item: any) => (
                    <div className="admin-list-row" key={item.cafe}>
                      <div>
                        <strong>{item.cafe}</strong>
                        <span>{item.issue}</span>
                      </div>
                      <b>{item.score}%</b>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeSection === 'Subscriptions' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Subscription Overview" icon={<BadgeIndianRupee size={18} />} />
                <div className="admin-list">
                  {(dashboardData.subscriptions || []).map((plan: any) => (
                    <div className="admin-list-row" key={`${plan.cafe}-${plan.plan}`}>
                      <div>
                        <strong>{plan.cafe}</strong>
                        <span>{plan.nextBilling}</span>
                      </div>
                      <b>{plan.plan}</b>
                      <span>{plan.revenue}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="admin-panel">
                <PanelHeader title="Plan Mix" icon={<BadgeIndianRupee size={18} />} />
                <div className="admin-plan-list">
                  {(dashboardData.planMix || []).map((plan: any) => (
                    <div className="admin-plan-row" key={plan.plan}>
                      <span>{plan.plan}</span>
                      <strong>{plan.count}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeSection === 'Support' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Support Queue" icon={<LifeBuoy size={18} />} />
                <div className="admin-list">
                  {(dashboardData.supportQueue || []).map((ticket: any) => (
                    <div className="admin-list-row" key={`${ticket.client}-${ticket.issue}`}>
                      <div>
                        <strong>{ticket.client}</strong>
                        <span>{ticket.issue}</span>
                      </div>
                      <b className={`admin-priority ${ticket.priority.toLowerCase()}`}>{ticket.priority}</b>
                    </div>
                  ))}
                </div>
              </article>
              <article className="admin-panel">
                <PanelHeader title="Recent Activity" icon={<CalendarClock size={18} />} />
                <div className="admin-list">
                  {(dashboardData.stats?.recentReservations || []).map((reservation: any) => (
                    <div className="admin-list-row" key={reservation.id}>
                      <div>
                        <strong>{reservation.cafe?.name || 'Unknown cafe'}</strong>
                        <span>{reservation.guestName} • {reservation.timeSlot}</span>
                      </div>
                      <b className={`admin-priority ${reservation.status.toLowerCase()}`}>{reservation.status}</b>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeSection === 'Onboarding' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Onboarding" icon={<ListChecks size={18} />} />
                <div className="admin-progress-list">
                  {(dashboardData.onboarding || []).map((client: any) => (
                    <div className="admin-progress-row" key={client.client}>
                      <div className="admin-progress-label">
                        <strong>{client.client}</strong>
                        <span>{client.stage} • {client.nextStep}</span>
                      </div>
                      <div className="admin-progress-track" aria-label={`${client.client} onboarding ${client.progress}%`}>
                        <span style={{ width: `${client.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeSection === 'Health' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Platform Health" icon={<Activity size={18} />} />
                <div className="admin-list">
                  {(dashboardData.health || []).map((item: any) => (
                    <div className="admin-list-row" key={item.cafe}>
                      <div>
                        <strong>{item.cafe}</strong>
                        <span>{item.issue}</span>
                      </div>
                      <b className={`admin-priority ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</b>
                      <span>{item.score}%</span>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeSection === 'Access' ? (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Access Control" icon={<ShieldCheck size={18} />} />
                <div className="admin-table">
                  <div className="admin-table-row admin-table-head">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Cafe</span>
                    <span>Status</span>
                  </div>
                  {(dashboardData.access || []).map((entry: any) => (
                    <div className="admin-table-row" key={entry.email}>
                      <strong>{entry.name}</strong>
                      <span>{entry.email}</span>
                      <span>{entry.role}</span>
                      <span>{entry.cafe}</span>
                      <span className={`admin-status ${statusClass(entry.status)}`}>{entry.status}</span>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : (
            <>
              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Operational Snapshot" icon={<CalendarClock size={18} />} />
                <div className="admin-list" style={{ display: 'grid', gap: '10px' }}>
                  <div className="admin-list-row">
                    <div>
                      <strong>Total reservations</strong>
                      <span>{dashboardData.stats?.totalReservations ?? 0}</span>
                    </div>
                    <b>{dashboardData.stats?.confirmedReservations ?? 0} confirmed</b>
                  </div>
                  <div className="admin-list-row">
                    <div>
                      <strong>Cancelled reservations</strong>
                      <span>{dashboardData.stats?.cancelledReservations ?? 0}</span>
                    </div>
                    <b>{dashboardData.stats?.openTasks ?? 0} open tasks</b>
                  </div>
                </div>
              </article>

              <article className="admin-panel admin-panel-wide">
                <PanelHeader title="Client Cafes" icon={<UsersRound size={18} />} action="Add client" />
                <div className="admin-table">
                  <div className="admin-table-row admin-table-head">
                    <span>Cafe</span>
                    <span>Owner</span>
                    <span>City</span>
                    <span>Plan</span>
                    <span>Status</span>
                    <span>MRR</span>
                    <span>Last active</span>
                  </div>
                  {(dashboardData.clients || []).map((client: any) => (
                    <div className="admin-table-row" key={client.cafe}>
                      <strong>{client.cafe}</strong>
                      <span>{client.owner}</span>
                      <span>{client.city}</span>
                      <span>{client.plan}</span>
                      <span className={`admin-status ${statusClass(client.status)}`}>{client.status}</span>
                      <span>{client.mrr}</span>
                      <span>{client.lastActive}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <PanelHeader title="Support Queue" icon={<LifeBuoy size={18} />} />
                <div className="admin-list">
                  {(dashboardData.supportQueue || []).map((ticket: any) => (
                    <div className="admin-list-row" key={`${ticket.client}-${ticket.issue}`}>
                      <div>
                        <strong>{ticket.client}</strong>
                        <span>{ticket.issue}</span>
                      </div>
                      <b className={`admin-priority ${ticket.priority.toLowerCase()}`}>{ticket.priority}</b>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <PanelHeader title="Recent Activity" icon={<CalendarClock size={18} />} />
                <div className="admin-list">
                  {(dashboardData.stats?.recentReservations || []).map((reservation: any) => (
                    <div className="admin-list-row" key={reservation.id}>
                      <div>
                        <strong>{reservation.cafe?.name || 'Unknown cafe'}</strong>
                        <span>{reservation.guestName} • {reservation.timeSlot}</span>
                      </div>
                      <b className={`admin-priority ${reservation.status.toLowerCase()}`}>{reservation.status}</b>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <PanelHeader title="Onboarding" icon={<ListChecks size={18} />} />
                <div className="admin-progress-list">
                  {(dashboardData.onboarding || []).map((client: any) => (
                    <div className="admin-progress-row" key={client.client}>
                      <div className="admin-progress-label">
                        <strong>{client.client}</strong>
                        <span>{client.nextStep}</span>
                      </div>
                      <div className="admin-progress-track" aria-label={`${client.client} onboarding ${client.progress}%`}>
                        <span style={{ width: `${client.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <PanelHeader title="Plan Mix" icon={<BadgeIndianRupee size={18} />} />
                <div className="admin-plan-list">
                  {(dashboardData.planMix || []).map((plan: any) => (
                    <div className="admin-plan-row" key={plan.plan}>
                      <span>{plan.plan}</span>
                      <strong>{plan.count}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function AdminMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="admin-metric">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function PanelHeader({ icon, title, action }: { icon: ReactNode; title: string; action?: string }) {
  return (
    <div className="admin-panel-header">
      <h2>
        {icon}
        {title}
      </h2>
      {action ? <button type="button">{action}</button> : null}
    </div>
  );
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}
