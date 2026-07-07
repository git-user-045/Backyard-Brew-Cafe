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
} from "lucide-react";
import type { ReactNode } from "react";
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
  
  // Mock data for now
  const mockData = {
    summary: { activeClients: 8, monthlyRevenue: "Rs. 424,860", openIssues: 3, churnRisk: 2 },
    clients: [
      { cafe: "Backyard Brew", owner: "John Doe", city: "Delhi", plan: "Advanced", status: "Active", mrr: "Rs. 2,999", lastActive: "10 min ago" },
      { cafe: "Bean There", owner: "Jane Smith", city: "Mumbai", plan: "Pro", status: "Active", mrr: "Rs. 1,499", lastActive: "1h ago" },
    ],
    supportQueue: [
      { client: "Backyard Brew", issue: "Menu not updating", priority: "High" },
      { client: "Bean There", issue: "Reservations not loading", priority: "Medium" },
    ],
    onboarding: [
      { client: "Cafe Central", progress: 80, nextStep: "Connect POS" },
      { client: "Urban Grind", progress: 40, nextStep: "Add menu" },
    ],
    planMix: [
      { plan: "Starter", count: 5 },
      { plan: "Pro", count: 12 },
      { plan: "Advanced", count: 8 },
    ],
  };

  const dashboardData = data || mockData;

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
              <a className={item.active ? "admin-nav-item active" : "admin-nav-item"} href="#" key={item.label}>
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
          <AdminMetric icon={<Building2 size={19} />} label="Active clients" value={String(dashboardData.summary.activeClients)} />
          <AdminMetric icon={<BadgeIndianRupee size={19} />} label="Monthly revenue" value={dashboardData.summary.monthlyRevenue} />
          <AdminMetric icon={<Headphones size={19} />} label="Open issues" value={String(dashboardData.summary.openIssues)} />
          <AdminMetric icon={<TrendingDown size={19} />} label="Churn risk" value={String(dashboardData.summary.churnRisk)} />
        </section>

        <section className="admin-grid">
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
              {dashboardData.clients.map((client: any) => (
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
              {dashboardData.supportQueue.map((ticket: any) => (
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
            <PanelHeader title="Onboarding" icon={<ListChecks size={18} />} />
            <div className="admin-progress-list">
              {dashboardData.onboarding.map((client: any) => (
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
              {dashboardData.planMix.map((plan: any) => (
                <div className="admin-plan-row" key={plan.plan}>
                  <span>{plan.plan}</span>
                  <strong>{plan.count}</strong>
                </div>
              ))}
            </div>
          </article>
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
