"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Kjo për të drejtuar në login pas logout
import "../app/page/dashboard/dashboard.css";
import { Menu } from "@headlessui/react"; 
import '../styles/style.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter(); 
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);

  const handleLogout = () => {
    // Fshijmë token-et nga localStorage dhe cookie
    localStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Fshirje e RefreshToken nga cookie

    // Pas logout, drejtojmë përdoruesin në faqen e login-it
    router.push("/page/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Butoni për të kollapsuar sidebar */}
      <button onClick={() => setCollapsed(!collapsed)} className="collapse-button">
        {collapsed ? "👉" : "👈"}
      </button>

      {/* Logo dhe titulli shfaqet vetëm kur sidebar është i zgjeruar */}
      {!collapsed && <h2 className="logo">Dashboard</h2>}

      <nav className="nav">
        {/* Link për statistikat */}
        <Link href="/page/dashboard">📊 Statistika</Link>

        {/* Dropdown për përdoruesit */}
        <div className="dropdown">
          <div
            onClick={() => setShowUsersDropdown(!showUsersDropdown)}
            className="dropdown-title"
          >
            👥 Përdoruesit ▾
          </div>
          {!collapsed && showUsersDropdown && (
            <div className="dropdown-content">
              <Link href="/page/dashboard/users/user-lists">📋 Lista e Përdoruesve</Link>
              <Link href="/page/dashboard/users/create">➕ Shto Përdorues</Link>
            </div>
          )}
        </div>

        {/* Link për termine */}
        <Link href="/page/dashboard/appointments">📅 Terminet</Link>

        {/* Link për konfigurime */}
        <Link href="/page/dashboard/settings">⚙️ Konfigurime</Link>
      </nav>

      {/* Butoni për logout */}
      <button onClick={handleLogout} className="logout-button">
        🚪 Dalja
      </button>
    </aside>
  );
}
