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

  // Client-side filtering for search and other filters
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
    <Container fluid p="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Leads</Title>
          <Text c="dimmed" size="sm">
            Manage your sales leads
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate("/leads/new")}
        >
          Add New Lead
        </Button>
      </Group>

      {/* Filters */}
      <Paper withBorder p="md" mb="lg" radius="md">
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
            label="Lead Source"
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

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <Paper withBorder p="xl" radius="md" ta="center">
          <Text c="dimmed">No leads found</Text>
          <Button
            variant="light"
            mt="md"
            onClick={() => navigate("/leads/new")}
          >
            Add Your First Lead
          </Button>
        </Paper>
      ) : (
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Lead Name</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Source</Table.Th>
              <Table.Th>Deal Value</Table.Th>
              <Table.Th>Assigned To</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th style={{ width: 80 }}>Actions</Table.Th>
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
                  <Text size="xs" c="dimmed">
                    {lead.email}
                  </Text>
                </Table.Td>
                <Table.Td>{lead.companyName}</Table.Td>
                <Table.Td>
                  <Badge color={STATUS_COLORS[lead.status as LeadStatus]}>
                    {lead.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{lead.leadSource}</Table.Td>
                <Table.Td>
                  {lead.estimatedDealValue
                    ? `$${lead.estimatedDealValue.toLocaleString()}`
                    : "-"}
                </Table.Td>
                <Table.Td>{lead.assignedSalesperson || "-"}</Table.Td>
                <Table.Td>
                  {new Date(lead.createdAt).toLocaleDateString()}
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
      )}
    </Container>
  );
}
