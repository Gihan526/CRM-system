import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  Card,
  Button,
  LoadingOverlay,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrendingUp, IconChevronRight } from "@tabler/icons-react";
import { dashboardApi } from "../lib/api";
import type { DashboardStats } from "../types/lead";

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
        {title}
      </Text>
      <Text fw={700} size="xl">
        {value}
      </Text>
    </Card>
  );
}

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
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load dashboard statistics",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { title: "Total Leads", value: stats?.totalLeads || 0 },
    { title: "New", value: stats?.newLeads || 0 },
    { title: "Contacted", value: stats?.contactedLeads || 0 },
    { title: "Qualified", value: stats?.qualifiedLeads || 0 },
    { title: "Proposal Sent", value: stats?.proposalSentLeads || 0 },
    { title: "Won", value: stats?.wonLeads || 0 },
    { title: "Lost", value: stats?.lostLeads || 0 },
  ];

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={loading} />

      <Group justify="space-between" align="flex-end" mb="xl">
        <div>
          <Title order={1} mb="xs">Dashboard</Title>
          <Text c="dimmed">Overview of your sales pipeline</Text>
        </div>
        <Button
          variant="default"
          leftSection={<IconTrendingUp size={16} />}
          onClick={() => navigate("/leads/new")}
        >
          Add New Lead
        </Button>
      </Group>

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {statsConfig.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Card withBorder padding="lg" radius="md">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
              Total Estimated Deal Value
            </Text>
            <Text fw={700} size="xl">
              ${(stats?.totalDealValue || 0).toLocaleString()}
            </Text>
          </Card>
          <Card withBorder padding="lg" radius="md">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs">
              Total Won Deal Value
            </Text>
            <Text fw={700} size="xl">
              ${(stats?.wonDealValue || 0).toLocaleString()}
            </Text>
          </Card>
        </SimpleGrid>

        <Button
          variant="subtle"
          rightSection={<IconChevronRight size={16} />}
          onClick={() => navigate("/leads")}
          mt="md"
        >
          View All Leads
        </Button>
      </Stack>
    </Container>
  );
}
