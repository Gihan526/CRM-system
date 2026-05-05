import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
  Group,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Text ta="center">Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="sm" p="lg" radius="md">
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={2}>Dashboard</Title>
            <Text c="dimmed" size="sm">
              Welcome to your CRM dashboard
            </Text>
          </div>
          <Button
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            loading={isLoading}
          >
            Logout
          </Button>
        </Group>

        <Stack gap="md">
          <Paper withBorder p="md" radius="sm" bg="gray.0">
            <Text fw={500}>User Info</Text>
            <Text size="sm" c="dimmed">
              Email: {user?.email}
            </Text>
            <Text size="sm" c="dimmed">
              Name: {user?.name || "N/A"}
            </Text>
          </Paper>

          <Text c="dimmed" size="sm" ta="center" py="xl">
            This is a placeholder dashboard. The full CRM features will be implemented here.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
