import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  NavLink,
  Title,
  Divider,
  Group,
  Avatar,
  Text,
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      style={{
        width: 260,
        height: "100vh",
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #e9ecef",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box p="md">
        <Title order={3} c="blue">
          CRM
        </Title>
        <Text size="xs" c="dimmed">
          Lead Management
        </Text>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box p="xs" style={{ flex: 1 }}>
        <NavLink
          label="Dashboard"
          leftSection={<IconLayoutDashboard size={18} />}
          active={isActive("/dashboard")}
          onClick={() => navigate("/dashboard")}
        />
        <NavLink
          label="Leads"
          leftSection={<IconUsers size={18} />}
          active={isActive("/leads") || location.pathname.startsWith("/leads/")}
          onClick={() => navigate("/leads")}
        />
      </Box>

      <Divider />

      {/* User Section */}
      <Box p="md">
        <Group gap="sm" mb="sm">
          <Avatar radius="xl" size="sm" color="blue">
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
          leftSection={<IconLogout size={18} />}
          onClick={handleLogout}
          c="red"
        />
      </Box>
    </Box>
  );
}
