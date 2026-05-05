import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  NavLink,
  Text,
  Group,
  Avatar,
  Divider,
} from "@mantine/core";
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
    <Box
      style={{
        width: 220,
        height: "100vh",
        backgroundColor: "var(--bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        borderRight: "1px solid var(--border-light)",
      }}
    >
      {/* Logo */}
      <Box px="lg" pt="xl" pb="md">
        <Text
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          CRM
        </Text>
        <Text
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 400,
            color: "var(--text-tertiary)",
            marginTop: 2,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Lead Management
        </Text>
      </Box>

      <Divider style={{ borderColor: "var(--border-light)", margin: "0 20px" }} />

      {/* Navigation */}
      <Box px="sm" pt="md" style={{ flex: 1 }}>
        <NavLink
          label={
            <Text
              size="sm"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: isActive("/dashboard") ? 500 : 400,
                color: isActive("/dashboard") ? "var(--text-primary)" : "var(--text-secondary)",
                letterSpacing: "0.01em",
                fontSize: 14,
              }}
            >
              Dashboard
            </Text>
          }
          leftSection={
            <IconLayoutDashboard
              size={17}
              stroke={1.5}
              style={{ color: isActive("/dashboard") ? "var(--text-primary)" : "var(--text-tertiary)" }}
            />
          }
          active={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
          styles={{
            root: {
              borderRadius: "var(--radius-sm)",
              marginBottom: 2,
              backgroundColor: isActive("/dashboard") ? "var(--bg-hover)" : "transparent",
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: isActive("/dashboard") ? "var(--bg-hover)" : "rgba(0,0,0,0.03)",
              },
            },
          }}
        />
        <NavLink
          label={
            <Text
              size="sm"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: isActive("/leads") ? 500 : 400,
                color: isActive("/leads") ? "var(--text-primary)" : "var(--text-secondary)",
                letterSpacing: "0.01em",
                fontSize: 14,
              }}
            >
              Leads
            </Text>
          }
          leftSection={
            <IconUsers
              size={17}
              stroke={1.5}
              style={{ color: isActive("/leads") ? "var(--text-primary)" : "var(--text-tertiary)" }}
            />
          }
          active={isActive("/leads")}
          onClick={() => navigate("/leads")}
          styles={{
            root: {
              borderRadius: "var(--radius-sm)",
              marginBottom: 2,
              backgroundColor: isActive("/leads") ? "var(--bg-hover)" : "transparent",
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: isActive("/leads") ? "var(--bg-hover)" : "rgba(0,0,0,0.03)",
              },
            },
          }}
        />
      </Box>

      <Divider style={{ borderColor: "var(--border-light)", margin: "0 20px" }} />

      {/* User Section */}
      <Box px="lg" py="lg">
        <Group gap="sm" mb="md">
          <Avatar
            radius="xl"
            size="sm"
            style={{
              backgroundColor: "var(--border-light)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="sm"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--text-primary)",
                fontSize: 13,
                letterSpacing: "0.01em",
              }}
              truncate
            >
              {user?.name || user?.email}
            </Text>
            <Text
              size="xs"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-tertiary)",
                fontWeight: 400,
                fontSize: 11,
              }}
              truncate
            >
              {user?.email}
            </Text>
          </div>
        </Group>
        <Box
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            transition: "all 0.15s ease",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,0,0,0.03)";
            (e.currentTarget as HTMLElement).style.color = "var(--accent-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
          }}
        >
          <IconLogout size={15} stroke={1.5} />
          <Text size="sm" style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>Logout</Text>
        </Box>
      </Box>
    </Box>
  );
}
