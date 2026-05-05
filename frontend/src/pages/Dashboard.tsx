import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  SimpleGrid,
  Paper,
  Text,
  Button,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { IconPlus, IconUsers, IconTrendingUp } from "@tabler/icons-react";
import { dashboardApi } from "../lib/api";
import type { DashboardStats } from "../types/lead";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      color: "blue",
      icon: IconUsers,
    },
    {
      title: "New Leads",
      value: stats?.newLeads || 0,
      color: "gray",
      icon: IconUsers,
    },
    {
      title: "Contacted",
      value: stats?.contactedLeads || 0,
      color: "orange",
      icon: IconUsers,
    },
    {
      title: "Qualified",
      value: stats?.qualifiedLeads || 0,
      color: "yellow",
      icon: IconUsers,
    },
    {
      title: "Won",
      value: stats?.wonLeads || 0,
      color: "green",
      icon: IconTrendingUp,
    },
    {
      title: "Lost",
      value: stats?.lostLeads || 0,
      color: "red",
      icon: IconUsers,
    },
  ];

  return (
    <Container fluid p="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Dashboard</Title>
          <Text c="dimmed" size="sm">
            Overview of your sales pipeline
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/leads/new")}
        >
          Add New Lead
        </Button>
      </Group>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
        {statCards.map((card) => (
          <Paper key={card.title} withBorder p="md" radius="md" shadow="sm">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm">
                  {card.title}
                </Text>
                <Text fw={700} size="xl">
                  {card.value}
                </Text>
              </div>
              <card.icon size={32} color={`var(--mantine-color-${card.color}-6)`} />
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Deal Value Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="xl">
        <Paper withBorder p="md" radius="md" shadow="sm" bg="blue.0">
          <Text c="dimmed" size="sm">
            Total Estimated Deal Value
          </Text>
          <Text fw={700} size="xl">
            ${stats?.totalDealValue?.toLocaleString() || "0"}
          </Text>
        </Paper>
        <Paper withBorder p="md" radius="md" shadow="sm" bg="green.0">
          <Text c="dimmed" size="sm">
            Total Won Deal Value
          </Text>
          <Text fw={700} size="xl">
            ${stats?.wonDealValue?.toLocaleString() || "0"}
          </Text>
        </Paper>
      </SimpleGrid>

      <Button variant="light" onClick={() => navigate("/leads")} fullWidth>
        View All Leads
      </Button>
    </Container>
  );
}
