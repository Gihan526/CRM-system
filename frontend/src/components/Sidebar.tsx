import { useNavigate, useLocation } from "react-router-dom";
import { NavLink, Text, Group, Avatar, Divider } from "@mantine/core";
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
        <Text size="xl" fw={700} mb={2}>CRM</Text>
        <Text size="xs" c="dimmed" mb="md">Lead Management</Text>
      </div>

      <Divider mb="sm" />

      <div style={{ flex: 1 }}>
        <NavLink
          label="Dashboard"
          leftSection={<IconLayoutDashboard size={18} stroke={1.5} />}
          active={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
          variant="subtle"
        />
        <NavLink
          label="Leads"
          leftSection={<IconUsers size={18} stroke={1.5} />}
          active={isActive("/leads")}
          onClick={() => navigate("/leads")}
          variant="subtle"
        />
      </div>

      <Divider mb="sm" />

      <div>
        <Group gap="sm" mb="sm">
          <Avatar radius="xl" size="sm" color="gray">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" fw={500} truncate>
              {user?.name || user?.email}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {user?.email}
            </Text>
          </div>
        </Group>
        <NavLink
          label="Logout"
          leftSection={<IconLogout size={16} stroke={1.5} />}
          onClick={handleLogout}
          variant="subtle"
          color="red"
        />
      </div>
    </div>
  );
}
