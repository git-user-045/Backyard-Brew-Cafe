export const metadata = {
  title: "Platform Admin | CafeOS"
};

// Import the client component from a separate file
import AdminDashboardClient from './AdminDashboardClient';

export default function AdminPage() {
  return <AdminDashboardClient />;
}
