import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Table,
  Group,
  Text,
  Select,
  TextInput,
  LoadingOverlay,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconDownload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { leadsApi } from "../lib/api";
import { LEAD_STATUSES, LEAD_SOURCES } from "../types/lead";
import type { Lead, LeadStatus } from "../types/lead";

function StatusBadge({ status }: { status: LeadStatus }) {
  const colorMap: Record<LeadStatus, string> = {
    New: "var(--status-new)",
    Contacted: "var(--status-contacted)",
    Qualified: "var(--status-qualified)",
    "Proposal Sent": "var(--status-proposal)",
    Won: "var(--status-won)",
    Lost: "var(--status-lost)",
  };
  const bgMap: Record<LeadStatus, string> = {
    New: "var(--status-new-bg)",
    Contacted: "var(--status-contacted-bg)",
    Qualified: "var(--status-qualified-bg)",
    "Proposal Sent": "var(--status-proposal-bg)",
    Won: "var(--status-won-bg)",
    Lost: "var(--status-lost-bg)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        background: bgMap[status],
        color: colorMap[status],
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: colorMap[status],
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    leadSource: "",
    assignedSalesperson: "",
    search: "",
  });

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await leadsApi.getAll(
        filters.status ? { status: filters.status } : undefined
      );
      setLeads(data);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load leads",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (filters.leadSource && lead.leadSource !== filters.leadSource)
      return false;
    if (
      filters.assignedSalesperson &&
      lead.assignedSalesperson !== filters.assignedSalesperson
    )
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        lead.leadName.toLowerCase().includes(searchLower) ||
        lead.companyName.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const downloadCSV = (data: Lead[]) => {
    const headers = [
      "Lead Name",
      "Company",
      "Email",
      "Phone",
      "Source",
      "Status",
      "Assigned",
      "Deal Value",
      "Created",
    ];

    const escapeCSV = (value: string | number | null | undefined) => {
      const str = value === null || value === undefined ? "" : String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = data.map((lead) =>
      [
        lead.leadName,
        lead.companyName,
        lead.email,
        lead.phoneNumber,
        lead.leadSource,
        lead.status,
        lead.assignedSalesperson,
        lead.estimatedDealValue ?? "",
        new Date(lead.createdAt).toLocaleDateString("en-US"),
      ]
        .map(escapeCSV)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsApi.delete(id);
      loadLeads();
      notifications.show({
        title: "Deleted",
        message: "Lead removed successfully",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete lead",
        color: "red",
      });
    }
  };

  return (
    <Container size="xl" pos="relative">
      <LoadingOverlay visible={loading} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 6 }}>Leads</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", margin: 0 }}>
            Manage your sales pipeline
          </p>
        </div>
        <Group gap="sm">
          <Button
            variant="default"
            leftSection={<IconDownload size={16} />}
            onClick={() => downloadCSV(filteredLeads)}
            disabled={filteredLeads.length === 0}
          >
            Export CSV
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/leads/new")}
          >
            Add New Lead
          </Button>
        </Group>
      </div>

      <div className="filter-bar" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          <Select
            label="Status"
            placeholder="All statuses"
            value={filters.status}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value || "" }))
            }
            data={["", ...LEAD_STATUSES]}
            clearable
          />
          <Select
            label="Source"
            placeholder="All sources"
            value={filters.leadSource}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, leadSource: value || "" }))
            }
            data={["", ...LEAD_SOURCES]}
            clearable
          />
          <TextInput
            label="Search"
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            leftSection={<IconSearch size={16} />}
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No leads found</p>
          <Button
            variant="default"
            onClick={() => navigate("/leads/new")}
          >
            Add Your First Lead
          </Button>
        </div>
      ) : (
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
          }}
        >
          <Table highlightOnHover withTableBorder={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Lead</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Source</Table.Th>
                <Table.Th>Value</Table.Th>
                <Table.Th>Assigned</Table.Th>
                <Table.Th style={{ width: 60 }} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredLeads.map((lead) => (
                <Table.Tr
                  key={lead.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <Table.Td>
                    <Text fw={500} style={{ color: "var(--text-primary)" }}>
                      {lead.leadName}
                    </Text>
                    <Text size="sm" style={{ color: "var(--text-tertiary)" }}>
                      {lead.companyName}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge status={lead.status as LeadStatus} />
                  </Table.Td>
                  <Table.Td style={{ color: "var(--text-secondary)" }}>
                    {lead.leadSource}
                  </Table.Td>
                  <Table.Td>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9375rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {lead.estimatedDealValue
                        ? `$${lead.estimatedDealValue.toLocaleString()}`
                        : "—"}
                    </span>
                  </Table.Td>
                  <Table.Td style={{ color: "var(--text-secondary)" }}>
                    {lead.assignedSalesperson || "—"}
                  </Table.Td>
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye size={14} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead.id}`);
                          }}
                        >
                          View
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead.id}/edit`);
                          }}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead.id);
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
