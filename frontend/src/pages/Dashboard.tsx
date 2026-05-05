import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  Box,
  Button,
  LoadingOverlay,
  Stack,
} from "@mantine/core";
import {
  IconUsers,
  IconUserPlus,
  IconMailOpened,
  IconTarget,
  IconFileInvoice,
  IconTrophy,
  IconX,
  IconTrendingUp,
  IconChevronRight,
} from "@tabler/icons-react";
import { dashboardApi } from "../lib/api";
import type { DashboardStats } from "../types/lead";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Box
      style={{
        border: "1px solid #E5E5E5",
        borderRadius: 8,
        padding: "20px 24px",
        backgroundColor: "#FFFFFF",
        transition: "border-color 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#D1D1D1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5";
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text
            size="sm"
            style={{
              color: "#6B7280",
              fontWeight: 400,
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#111827",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </Text>
        </div>
        <Box style={{ color: "#9CA3AF" }}>{icon}</Box>
      </Group>
    </Box>
  );
}

interface DealValueCardProps {
  title: string;
  value: number;
  prefix?: string;
}

function DealValueCard({ title, value, prefix = "$" }: DealValueCardProps) {
  return (
    <Box
      style={{
        border: "1px solid #E5E5E5",
        borderRadius: 8,
        padding: "24px",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Text
        size="sm"
        style={{
          color: "#6B7280",
          fontWeight: 400,
          marginBottom: 12,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#111827",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {prefix}
        {value.toLocaleString()}
      </Text>
    </Box>
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
      icon: <IconUsers size={22} stroke={1.5} />,
    },
    {
      title: "New Leads",
      value: stats?.newLeads || 0,
      icon: <IconUserPlus size={22} stroke={1.5} />,
    },
    {
      title: "Contacted",
      value: stats?.contactedLeads || 0,
      icon: <IconMailOpened size={22} stroke={1.5} />,
    },
    {
      title: "Qualified",
      value: stats?.qualifiedLeads || 0,
      icon: <IconTarget size={22} stroke={1.5} />,
    },
    {
      title: "Proposal Sent",
      value: stats?.proposalSentLeads || 0,
      icon: <IconFileInvoice size={22} stroke={1.5} />,
    },
    {
      title: "Won",
      value: stats?.wonLeads || 0,
      icon: <IconTrophy size={22} stroke={1.5} />,
    },
  ];

  return (
    <Container fluid px="xl" py="xl" pos="relative" style={{ maxWidth: 1200 }}>
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title
            order={1}
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Dashboard
          </Title>
          <Text
            size="md"
            style={{
              color: "#6B7280",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Overview of your sales pipeline
          </Text>
        </div>
        <Button
          variant="default"
          leftSection={<IconTrendingUp size={16} stroke={1.5} />}
          onClick={() => navigate("/leads/new")}
          style={{
            border: "1px solid #E5E5E5",
            color: "#374151",
            fontWeight: 500,
            height: 36,
            borderRadius: 6,
            boxShadow: "none",
          }}
        >
          Add New Lead
        </Button>
      </Group>

      <Stack gap="xl">
        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </SimpleGrid>

        {/* Deal Values */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <DealValueCard
            title="Total Estimated Deal Value"
            value={stats?.totalDealValue || 0}
          />
          <DealValueCard
            title="Total Won Deal Value"
            value={stats?.wonDealValue || 0}
          />
        </SimpleGrid>

        {/* Lost Leads & View All */}
        <Group justify="space-between" align="center">
          <Box
            style={{
              border: "1px solid #E5E5E5",
              borderRadius: 8,
              padding: "20px 24px",
              backgroundColor: "#FFFFFF",
              minWidth: 200,
            }}
          >
            <Group justify="space-between" align="flex-start">
              <div>
                <Text
                  size="sm"
                  style={{
                    color: "#6B7280",
                    fontWeight: 400,
                    marginBottom: 8,
                  }}
                >
                  Lost
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {stats?.lostLeads || 0}
                </Text>
              </div>
              <Box style={{ color: "#9CA3AF" }}>
                <IconX size={22} stroke={1.5} />
              </Box>
            </Group>
          </Box>

          <Button
            variant="subtle"
            rightSection={<IconChevronRight size={16} stroke={2} />}
            onClick={() => navigate("/leads")}
            style={{
              color: "#374151",
              fontWeight: 500,
              fontSize: 14,
              height: 36,
              borderRadius: 6,
            }}
          >
            View All Leads
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
