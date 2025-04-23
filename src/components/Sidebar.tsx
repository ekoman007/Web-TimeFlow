"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Kjo për të drejtuar në login pas logout
import "../app/page/dashboard/dashboard.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Fshijmë token-et nga localStorage dhe cookie
    localStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Fshirje e RefreshToken nga cookie

    // Pas logout, drejtojmë përdoruesin në faqen e login-it
    router.push("page/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={() => setCollapsed(!collapsed)} className="collapse-button">
        {collapsed ? "👉" : "👈"}
      </button>

      {!collapsed && <h2 className="logo">Dashboard</h2>}

      <nav className="nav">
        <Link href="/page/dashboard">📊 Statistika</Link>
        <Link href="/page/dashboard/user-lists">📊 Lista e perdoruesve</Link>
        <Link href="/page/dashboard/appointments">📅 Terminet</Link>
        <Link href="/page/dashboard/users">👥 Përdoruesit</Link>
        <Link href="/page/dashboard/settings">⚙️ Konfigurime</Link>
      </nav>

      {/* Butoni për logout */}
      <button onClick={handleLogout} className="logout-button">
        🚪 Dalja
      </button>
    </aside>
  );
}
