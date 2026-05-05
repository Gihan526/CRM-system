import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Button,
  Table,
  Badge,
  Group,
  Text,
  Select,
  TextInput,
  LoadingOverlay,
  ActionIcon,
  Menu,
  Paper,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconDotsVertical,
} from "@tabler/icons-react";
import { leadsApi } from "../lib/api";
import { LEAD_STATUSES, LEAD_SOURCES, STATUS_COLORS } from "../types/lead";
import type { Lead, LeadStatus } from "../types/lead";

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
    } catch (error) {
      console.error("Error loading leads:", error);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsApi.delete(id);
      loadLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <Container
      fluid
      px="xl"
      py="xl"
      pos="relative"
      style={{
        maxWidth: 1200,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      {/* Header */}
      <Group justify="space-between" align="flex-end" mb="xl">
        <div>
          <Title
            order={1}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 44,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            Leads
          </Title>
          <Text
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--text-secondary)",
              fontWeight: 400,
            }}
          >
            Manage your sales pipeline
          </Text>
        </div>
        <Button
          variant="default"
          leftSection={<IconPlus size={15} stroke={1.5} />}
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
          marginBottom: "var(--space-xl)",
        }}
      />

      {/* Filters */}
      <Paper
        withBorder
        p="md"
        mb="lg"
        radius="sm"
        style={{
          borderColor: "var(--border-light)",
          backgroundColor: "var(--bg-surface)",
          boxShadow: "none",
        }}
      >
        <Group grow>
          <Select
            label="Status"
            placeholder="All statuses"
            value={filters.status}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value || "" }))
            }
            data={["", ...LEAD_STATUSES]}
            clearable
            styles={{
              label: {
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              },
              input: {
                fontFamily: "var(--font-body)",
                borderColor: "var(--border-light)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
              },
            }}
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
            styles={{
              label: {
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              },
              input: {
                fontFamily: "var(--font-body)",
                borderColor: "var(--border-light)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
              },
            }}
          />
          <TextInput
            label="Search"
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            leftSection={<IconSearch size={16} stroke={1.5} />}
            styles={{
              label: {
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              },
              input: {
                fontFamily: "var(--font-body)",
                borderColor: "var(--border-light)",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
              },
            }}
          />
        </Group>
      </Paper>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <Paper
          withBorder
          p="xl"
          radius="sm"
          ta="center"
          style={{
            borderColor: "var(--border-light)",
            backgroundColor: "var(--bg-surface)",
            boxShadow: "none",
          }}
        >
          <Text style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            No leads found
          </Text>
          <Button
            variant="default"
            mt="md"
            onClick={() => navigate("/leads/new")}
            style={{
              border: "1px solid var(--border-medium)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
            }}
          >
            Add Your First Lead
          </Button>
        </Paper>
      ) : (
        <Paper
          withBorder
          radius="sm"
          style={{
            borderColor: "var(--border-light)",
            backgroundColor: "var(--bg-surface)",
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          <Table highlightOnHover withTableBorder styles={{
            table: {
              borderColor: "var(--border-light)",
            },
          }}>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: "var(--bg-sidebar)" }}>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)" }}>Lead</Table.Th>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)" }}>Status</Table.Th>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)" }}>Source</Table.Th>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)" }}>Value</Table.Th>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)" }}>Assigned</Table.Th>
                <Table.Th style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-light)", width: 60 }}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredLeads.map((lead) => (
                <Table.Tr
                  key={lead.id}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                  }}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <Table.Td style={{ borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    <Text style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "var(--text-primary)" }}>
                      {lead.leadName}
                    </Text>
                    <Text style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>
                      {lead.companyName}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    <Badge
                      variant="outline"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderColor: STATUS_COLORS[lead.status as LeadStatus],
                        color: STATUS_COLORS[lead.status as LeadStatus],
                        backgroundColor: "transparent",
                        borderRadius: "var(--radius-sm)",
                        padding: "4px 10px",
                        height: "auto",
                      }}
                    >
                      {lead.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    {lead.leadSource}
                  </Table.Td>
                  <Table.Td style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-primary)", borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    {lead.estimatedDealValue
                      ? `$${lead.estimatedDealValue.toLocaleString()}`
                      : "—"}
                  </Table.Td>
                  <Table.Td style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    {lead.assignedSalesperson || "—"}
                  </Table.Td>
                  <Table.Td style={{ borderBottom: "1px solid var(--border-light)", padding: "16px 12px" }}>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          <IconDotsVertical size={16} stroke={1.5} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconEye size={14} stroke={1.5} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead.id}`);
                          }}
                          style={{ fontFamily: "var(--font-body)", fontSize: 13 }}
                        >
                          View
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconEdit size={14} stroke={1.5} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead.id}/edit`);
                          }}
                          style={{ fontFamily: "var(--font-body)", fontSize: 13 }}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={14} stroke={1.5} />}
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead.id);
                          }}
                          style={{ fontFamily: "var(--font-body)", fontSize: 13 }}
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
        </Paper>
      )}
    </Container>
  );
}
