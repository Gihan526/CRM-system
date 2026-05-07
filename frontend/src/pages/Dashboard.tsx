import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, LoadingOverlay, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrendingUp, IconChevronRight } from "@tabler/icons-react";
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

  const pipelineSegments = [
    { label: "New", value: stats?.newLeads || 0, color: "var(--status-new)" },
    { label: "Contacted", value: stats?.contactedLeads || 0, color: "var(--status-contacted)" },
    { label: "Qualified", value: stats?.qualifiedLeads || 0, color: "var(--status-qualified)" },
    { label: "Proposal", value: stats?.proposalSentLeads || 0, color: "var(--status-proposal)" },
    { label: "Won", value: stats?.wonLeads || 0, color: "var(--status-won)" },
    { label: "Lost", value: stats?.lostLeads || 0, color: "var(--status-lost)" },
  ];

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={loading} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 40,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 6 }}>Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", margin: 0 }}>
            Overview of your sales pipeline
          </p>
        </div>
        <Button
          variant="default"
          leftSection={<IconTrendingUp size={16} />}
          onClick={() => navigate("/leads/new")}
        >
          Add New Lead
        </Button>
      </div>

      <Stack gap="lg">
        {/* Top row: two prominent stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          <div className="stat-large">
            <div className="stat-large-label">Total Leads</div>
            <div className="stat-large-value">{stats?.totalLeads || 0}</div>
          </div>
          <div className="stat-large">
            <div className="stat-large-label">Total Estimated Deal Value</div>
            <div className="stat-large-value">
              ${(stats?.totalDealValue || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Pipeline distribution */}
        <div className="section-card">
          <div className="section-title">Pipeline Distribution</div>
          <div className="pipeline-bar">
            {pipelineSegments.map((seg) =>
              seg.value > 0 ? (
                <div
                  key={seg.label}
                  className="pipeline-segment"
                  style={{
                    flex: seg.value,
                    background: seg.color,
                  }}
                  title={`${seg.label}: ${seg.value}`}
                />
              ) : null
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px 24px",
              marginTop: 20,
            }}
          >
            {pipelineSegments.map((seg) => (
              <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: seg.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                  {seg.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {seg.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle row: won deal value + stage counts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          <div className="stat-medium">
            <div className="stat-medium-label">Won Deal Value</div>
            <div className="stat-medium-value" style={{ color: "var(--status-won)" }}>
              ${(stats?.wonDealValue || 0).toLocaleString()}
            </div>
          </div>
          <div className="stat-medium">
            <div className="stat-medium-label">Won</div>
            <div className="stat-medium-value" style={{ color: "var(--status-won)" }}>
              {stats?.wonLeads || 0}
            </div>
          </div>
          <div className="stat-medium">
            <div className="stat-medium-label">Lost</div>
            <div className="stat-medium-value" style={{ color: "var(--status-lost)" }}>
              {stats?.lostLeads || 0}
            </div>
          </div>
          <div className="stat-medium">
            <div className="stat-medium-label">In Progress</div>
            <div className="stat-medium-value">
              {(stats?.newLeads || 0) +
                (stats?.contactedLeads || 0) +
                (stats?.qualifiedLeads || 0) +
                (stats?.proposalSentLeads || 0)}
            </div>
          </div>
        </div>

        {/* Bottom row: stage breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { label: "New", value: stats?.newLeads || 0, color: "var(--status-new)" },
            { label: "Contacted", value: stats?.contactedLeads || 0, color: "var(--status-contacted)" },
            { label: "Qualified", value: stats?.qualifiedLeads || 0, color: "var(--status-qualified)" },
            { label: "Proposal Sent", value: stats?.proposalSentLeads || 0, color: "var(--status-proposal)" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                transition: "transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-tertiary)",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: item.color,
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="subtle"
          rightSection={<IconChevronRight size={16} />}
          onClick={() => navigate("/leads")}
          style={{ alignSelf: "flex-start" }}
        >
          View All Leads
        </Button>
      </Stack>
    </Container>
  );
}
