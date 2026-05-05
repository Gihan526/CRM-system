import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  Textarea,
  LoadingOverlay,
  Divider,
  Timeline,
  Avatar,
  SimpleGrid,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconNote,
  IconSend,
} from "@tabler/icons-react";
import { leadsApi, notesApi } from "../lib/api";
import { STATUS_COLORS } from "../types/lead";
import type { Lead, LeadStatus, Note } from "../types/lead";

export default function LeadDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (id) {
      loadLead(id);
      loadNotes(id);
    }
  }, [id]);

  const loadLead = async (leadId: string) => {
    try {
      const data = await leadsApi.getById(leadId);
      setLead(data);
    } catch (error) {
      console.error("Error loading lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async (leadId: string) => {
    try {
      const data = await notesApi.getByLeadId(leadId);
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsApi.delete(id!);
      navigate("/leads");
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !id) return;
    setSubmittingNote(true);
    try {
      await notesApi.create(id, noteContent);
      setNoteContent("");
      loadNotes(id);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    try {
      await leadsApi.update(id!, { status: newStatus });
      loadLead(id!);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!lead && !loading) {
    return (
      <Container py="xl">
        <Text c="dimmed">Lead not found</Text>
        <Button variant="subtle" onClick={() => navigate("/leads")} mt="md">
          Back to Leads
        </Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl" pos="relative">
      <LoadingOverlay visible={loading} />

      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/leads")}
        mb="md"
      >
        Back to Leads
      </Button>

      {lead && (
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="sm" mb="xs">
                <Title order={1}>{lead.leadName}</Title>
                <Badge color={STATUS_COLORS[lead.status as LeadStatus]} variant="light">
                  {lead.status}
                </Badge>
              </Group>
              <Text size="lg" c="dimmed">
                {lead.companyName}
              </Text>
            </div>
            <Group gap="sm">
              <Button
                variant="default"
                leftSection={<IconEdit size={16} />}
                onClick={() => navigate(`/leads/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="default"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <Paper withBorder shadow="sm" p="xl" radius="md">
            <Title order={3} mb="lg">
              Lead Details
            </Title>

            <SimpleGrid cols={2} spacing="lg">
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Email</Text>
                <Text>{lead.email}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Phone</Text>
                <Text>{lead.phoneNumber || "—"}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Lead Source</Text>
                <Text>{lead.leadSource}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Assigned To</Text>
                <Text>{lead.assignedSalesperson || "—"}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Deal Value</Text>
                <Text>{lead.estimatedDealValue ? `$${lead.estimatedDealValue.toLocaleString()}` : "—"}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed" fw={500} mb={4}>Created</Text>
                <Text>
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </SimpleGrid>

            <Divider my="xl" />

            <Text size="sm" c="dimmed" fw={500} mb="sm">
              Update Status
            </Text>
            <Group gap="xs">
              {(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"] as LeadStatus[]).map(
                (status) => (
                  <Button
                    key={status}
                    size="xs"
                    variant={lead.status === status ? "filled" : "default"}
                    color={STATUS_COLORS[status]}
                    onClick={() => handleStatusUpdate(status)}
                  >
                    {status}
                  </Button>
                )
              )}
            </Group>
          </Paper>

          <Paper withBorder shadow="sm" p="xl" radius="md">
            <Group gap="xs" mb="lg">
              <IconNote size={20} />
              <Title order={3}>Notes</Title>
            </Group>

            <Group align="flex-start" mb="lg" gap="sm">
              <Textarea
                placeholder="Add a note about this lead..."
                style={{ flex: 1 }}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                minRows={2}
              />
              <Button
                leftSection={<IconSend size={16} />}
                onClick={handleAddNote}
                loading={submittingNote}
                disabled={!noteContent.trim()}
              >
                Add
              </Button>
            </Group>

            <Divider mb="lg" />

            {notes.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No notes yet. Add your first note above.
              </Text>
            ) : (
              <Timeline active={notes.length} bulletSize={28} lineWidth={2}>
                {notes.map((note) => (
                  <Timeline.Item
                    key={note.id}
                    bullet={
                      <Avatar size={28} radius="xl" color="gray">
                        {note.createdBy.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          {note.createdBy}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {new Date(note.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(note.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Group>
                    }
                  >
                    <Text size="sm" c="dimmed" mt={4}>
                      {note.content}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Paper>
        </Stack>
      )}
    </Container>
  );
}
