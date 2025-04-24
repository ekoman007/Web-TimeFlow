// src/app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
