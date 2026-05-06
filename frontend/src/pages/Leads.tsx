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
  Card,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconDotsVertical,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { SegmentedControl } from "@mantine/core";
import { leadsApi } from "../lib/api";
import { LEAD_STATUSES, LEAD_SOURCES, STATUS_COLORS } from "../types/lead";
import type { Lead, LeadStatus } from "../types/lead";
import { useAuth } from "../context/AuthContext";

export default function Leads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "mine">("all");
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
    if (viewMode === "mine" && lead.assignedSalesperson !== user?.name)
      return false;
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

      <Group justify="space-between" align="flex-end" mb="xl">
        <div>
          <Title order={1} mb="xs">Leads</Title>
          <Text c="dimmed">Manage your sales pipeline</Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/leads/new")}
        >
          Add New Lead
        </Button>
      </Group>

      <SegmentedControl
        value={viewMode}
        onChange={(value) => setViewMode(value as "all" | "mine")}
        data={[
          { label: "All Leads", value: "all" },
          { label: "My Leads", value: "mine" },
        ]}
        mb="md"
      />

      <Paper withBorder p="md" mb="md" radius="md">
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
        </Group>
      </Paper>

      {filteredLeads.length === 0 ? (
        <Card withBorder p="xl" ta="center">
          <Text c="dimmed">No leads found</Text>
          <Button
            variant="default"
            mt="md"
            onClick={() => navigate("/leads/new")}
          >
            Add Your First Lead
          </Button>
        </Card>
      ) : (
        <Paper withBorder radius="md">
          <Table highlightOnHover withTableBorder>
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
                    <Text fw={500}>{lead.leadName}</Text>
                    <Text size="sm" c="dimmed">
                      {lead.companyName}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={STATUS_COLORS[lead.status as LeadStatus]}
                      variant="light"
                    >
                      {lead.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{lead.leadSource}</Table.Td>
                  <Table.Td>
                    {lead.estimatedDealValue
                      ? `$${lead.estimatedDealValue.toLocaleString()}`
                      : "—"}
                  </Table.Td>
                  <Table.Td>{lead.assignedSalesperson || "—"}</Table.Td>
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
        </Paper>
      )}
    </Container>
  );
}
