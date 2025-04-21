import Sidebar from "@/components/Sidebar";
import "../dashboard/dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
