import { useNavigate, useLocation } from "react-router-dom";
import { Divider } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconUsers,
  IconLogout,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (path === "/leads") {
      return location.pathname === "/leads" || location.pathname.startsWith("/leads/");
    }
    return false;
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div>
        <div className="sidebar-logo">CRM</div>
        <div className="sidebar-tagline">Lead Management</div>
      </div>

      <Divider my="lg" style={{ borderColor: "var(--border)" }} />

      <nav className="sidebar-nav" style={{ flex: 1 }}>
        <button
          className={`sidebar-nav-item ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <IconLayoutDashboard size={18} stroke={1.5} />
          Dashboard
        </button>
        <button
          className={`sidebar-nav-item ${isActive("/leads") ? "active" : ""}`}
          onClick={() => navigate("/leads")}
        >
          <IconUsers size={18} stroke={1.5} />
          Leads
        </button>
      </nav>

      <Divider my="lg" style={{ borderColor: "var(--border)" }} />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            padding: "0 6px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--bg-sunken)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || user?.email}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>
        <button
          className="sidebar-nav-item"
          onClick={handleLogout}
          style={{ color: "var(--error)" }}
        >
          <IconLogout size={16} stroke={1.5} />
          Logout
        </button>
      </div>
    </div>
  );
}
