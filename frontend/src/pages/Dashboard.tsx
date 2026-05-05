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
  IconTrendingUp,
  IconChevronRight,
} from "@tabler/icons-react";
import { dashboardApi } from "../lib/api";
import type { DashboardStats } from "../types/lead";

/* ============================================
   Editorial Minimalism Dashboard
   ============================================ */

interface StatCardProps {
  title: string;
  value: number;
  accentColor: string;
  delay: number;
}

function StatCard({ title, value, accentColor, delay }: StatCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      style={{
        border: "1px solid var(--border-light)",
        borderTop: `3px solid ${accentColor}`,
        borderRadius: "var(--radius-sm)",
        padding: "28px 24px",
        backgroundColor: "var(--bg-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), border-color 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
      }}
    >
      <Text
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-tertiary)",
          marginBottom: 16,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 36,
          fontWeight: 400,
          color: "var(--text-primary)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </Text>
    </Box>
  );
}

interface DealValueProps {
  label: string;
  value: number;
  prefix?: string;
  accentColor: string;
  delay: number;
}

function DealValue({ label, value, prefix = "$", accentColor, delay }: DealValueProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      style={{
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-sm)",
        padding: "32px 28px",
        backgroundColor: "var(--bg-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent line on left */}
      <Box
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: accentColor,
        }}
      />
      <Text
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--text-tertiary)",
          marginBottom: 12,
          marginLeft: 8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 28,
          fontWeight: 400,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          marginLeft: 8,
        }}
      >
        {prefix}{value.toLocaleString()}
      </Text>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const statsConfig = [
    { title: "Total Leads", value: stats?.totalLeads || 0, accent: "var(--text-primary)", delay: 200 },
    { title: "New", value: stats?.newLeads || 0, accent: "var(--status-new)", delay: 250 },
    { title: "Contacted", value: stats?.contactedLeads || 0, accent: "var(--status-contacted)", delay: 300 },
    { title: "Qualified", value: stats?.qualifiedLeads || 0, accent: "var(--status-qualified)", delay: 350 },
    { title: "Proposal Sent", value: stats?.proposalSentLeads || 0, accent: "var(--status-proposal)", delay: 400 },
    { title: "Won", value: stats?.wonLeads || 0, accent: "var(--status-won)", delay: 450 },
    { title: "Lost", value: stats?.lostLeads || 0, accent: "var(--status-lost)", delay: 500 },
  ];

  return (
    <Container
      fluid
      px="xl"
      py="xl"
      pos="relative"
      style={{
        maxWidth: 1100,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* Header */}
      <Box
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
          marginBottom: "var(--space-3xl)",
        }}
      >
        <Group justify="space-between" align="flex-end" mb="lg">
          <div>
            <Title
              order={1}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 52,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: 12,
              }}
            >
              Dashboard
            </Title>
            <Text
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 400,
                color: "var(--text-secondary)",
                letterSpacing: "0.01em",
                lineHeight: 1.5,
              }}
            >
              Overview of your sales pipeline
            </Text>
          </div>
          <Button
            variant="default"
            leftSection={<IconTrendingUp size={15} stroke={1.5} />}
            onClick={() => navigate("/leads/new")}
            style={{
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              fontWeight: 500,
              fontSize: 13,
              height: 40,
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-surface)",
              letterSpacing: "0.02em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-dark)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-surface)";
            }}
          >
            Add New Lead
          </Button>
        </Group>

        {/* Horizontal rule */}
        <Box
          style={{
            height: 1,
            backgroundColor: "var(--border-light)",
            width: "100%",
          }}
        />
      </Box>

      <Stack gap="xl">
        {/* Stats Grid — Asymmetric, editorial */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {statsConfig.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              accentColor={stat.accent}
              delay={stat.delay}
            />
          ))}
        </SimpleGrid>

        {/* Deal Values — Prominent, typographic */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <DealValue
            label="Total Estimated Deal Value"
            value={stats?.totalDealValue || 0}
            accentColor="var(--accent-slate)"
            delay={550}
          />
          <DealValue
            label="Total Won Deal Value"
            value={stats?.wonDealValue || 0}
            accentColor="var(--accent-warm)"
            delay={600}
          />
        </SimpleGrid>

        {/* View All Leads — Minimal text link */}
        <Box
          style={{
            opacity: headerVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
            paddingTop: "var(--space-lg)",
            borderTop: "1px solid var(--border-light)",
            marginTop: "var(--space-lg)",
          }}
        >
          <Button
            variant="subtle"
            rightSection={<IconChevronRight size={14} stroke={2} />}
            onClick={() => navigate("/leads")}
            style={{
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: 13,
              height: 36,
              padding: 0,
              letterSpacing: "0.02em",
              backgroundColor: "transparent",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            View All Leads
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
