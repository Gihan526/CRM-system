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
        width: 240,
        height: "100vh",
        backgroundColor: "#F7F7F7",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        borderRight: "1px solid #EEEEEE",
      }}
    >
      {/* Logo */}
      <Box px="md" pt="lg" pb="md">
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.03em",
          }}
        >
          CRM
        </Text>
        <Text
          size="xs"
          style={{
            color: "#9CA3AF",
            fontWeight: 400,
            marginTop: 2,
          }}
        >
          Lead Management
        </Text>
      </Box>

      <Divider style={{ borderColor: "#EEEEEE" }} />

      {/* Navigation */}
      <Box px="xs" pt="sm" style={{ flex: 1 }}>
        <NavLink
          label={
            <Text
              size="sm"
              style={{
                fontWeight: isActive("/dashboard") ? 600 : 400,
                color: isActive("/dashboard") ? "#111827" : "#6B7280",
              }}
            >
              Dashboard
            </Text>
          }
          leftSection={
            <IconLayoutDashboard
              size={18}
              stroke={1.5}
              style={{ color: isActive("/dashboard") ? "#111827" : "#9CA3AF" }}
            />
          }
          active={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
          styles={{
            root: {
              borderRadius: 6,
              marginBottom: 2,
              backgroundColor: isActive("/dashboard") ? "#EEEEEE" : "transparent",
              "&:hover": {
                backgroundColor: isActive("/dashboard") ? "#EEEEEE" : "#F0F0F0",
              },
            },
          }}
        />
        <NavLink
          label={
            <Text
              size="sm"
              style={{
                fontWeight: isActive("/leads") ? 600 : 400,
                color: isActive("/leads") ? "#111827" : "#6B7280",
              }}
            >
              Leads
            </Text>
          }
          leftSection={
            <IconUsers
              size={18}
              stroke={1.5}
              style={{ color: isActive("/leads") ? "#111827" : "#9CA3AF" }}
            />
          }
          active={isActive("/leads")}
          onClick={() => navigate("/leads")}
          styles={{
            root: {
              borderRadius: 6,
              marginBottom: 2,
              backgroundColor: isActive("/leads") ? "#EEEEEE" : "transparent",
              "&:hover": {
                backgroundColor: isActive("/leads") ? "#EEEEEE" : "#F0F0F0",
              },
            },
          }}
        />
      </Box>

      <Divider style={{ borderColor: "#EEEEEE" }} />

      {/* User Section */}
      <Box px="md" py="md">
        <Group gap="sm" mb="md">
          <Avatar
            radius="xl"
            size="sm"
            color="gray"
            style={{ backgroundColor: "#E5E5E5", color: "#6B7280" }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="sm"
              style={{
                fontWeight: 500,
                color: "#374151",
                letterSpacing: "-0.01em",
              }}
              truncate
            >
              {user?.name || user?.email}
            </Text>
            <Text
              size="xs"
              style={{ color: "#9CA3AF", fontWeight: 400 }}
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
            borderRadius: 6,
            cursor: "pointer",
            color: "#9CA3AF",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#F0F0F0";
            (e.currentTarget as HTMLElement).style.color = "#EF4444";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#9CA3AF";
          }}
        >
          <IconLogout size={16} stroke={1.5} />
          <Text size="sm">Logout</Text>
        </Box>
      </Box>
    </Box>
  );
}
