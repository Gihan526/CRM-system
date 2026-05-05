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
        <Text>Lead not found</Text>
        <Button variant="light" onClick={() => navigate("/leads")} mt="md">
          Back to Leads
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid p="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/leads")}
        mb="md"
      >
        Back to Leads
      </Button>

      {lead && (
        <>
          {/* Lead Info Header */}
          <Group justify="space-between" mb="lg">
            <div>
              <Group gap="sm">
                <Title order={2}>{lead.leadName}</Title>
                <Badge
                  size="lg"
                  color={STATUS_COLORS[lead.status as LeadStatus]}
                >
                  {lead.status}
                </Badge>
              </Group>
              <Text c="dimmed">{lead.companyName}</Text>
            </div>
            <Group>
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={() => navigate(`/leads/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <Stack gap="lg">
            {/* Lead Details Card */}
            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Title order={4} mb="md">
                Lead Details
              </Title>
              <Group grow>
                <div>
                  <Text size="sm" c="dimmed">
                    Email
                  </Text>
                  <Text>{lead.email}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Phone
                  </Text>
                  <Text>{lead.phoneNumber || "-"}</Text>
                </div>
              </Group>
              <Group grow mt="md">
                <div>
                  <Text size="sm" c="dimmed">
                    Lead Source
                  </Text>
                  <Text>{lead.leadSource}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Assigned To
                  </Text>
                  <Text>{lead.assignedSalesperson || "-"}</Text>
                </div>
              </Group>
              <Group grow mt="md">
                <div>
                  <Text size="sm" c="dimmed">
                    Deal Value
                  </Text>
                  <Text>
                    {lead.estimatedDealValue
                      ? `$${lead.estimatedDealValue.toLocaleString()}`
                      : "-"}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Created
                  </Text>
                  <Text>{new Date(lead.createdAt).toLocaleDateString()}</Text>
                </div>
              </Group>

              {/* Quick Status Update */}
              <Divider my="lg" />
              <Text size="sm" fw={500} mb="xs">
                Quick Status Update
              </Text>
              <Group gap="xs">
                {(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"] as LeadStatus[]).map(
                  (status) => (
                    <Button
                      key={status}
                      size="xs"
                      variant={lead.status === status ? "filled" : "light"}
                      color={STATUS_COLORS[status]}
                      onClick={() => handleStatusUpdate(status)}
                    >
                      {status}
                    </Button>
                  )
                )}
              </Group>
            </Paper>

            {/* Notes Section */}
            <Paper withBorder shadow="sm" p="xl" radius="md">
              <Title order={4} mb="md">
                <Group gap="xs">
                  <IconNote size={20} />
                  Notes
                </Group>
              </Title>

              {/* Add Note Form */}
              <Group align="flex-start" mb="lg">
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
                  Add Note
                </Button>
              </Group>

              <Divider mb="lg" />

              {/* Notes List */}
              {notes.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">
                  No notes yet. Add your first note above.
                </Text>
              ) : (
                <Timeline active={notes.length} bulletSize={24} lineWidth={2}>
                  {notes.map((note) => (
                    <Timeline.Item
                      key={note.id}
                      bullet={<Avatar size={24} radius="xl" color="blue" />}
                      title={
                        <Group gap="xs">
                          <Text size="sm" fw={500}>
                            {note.createdBy}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(note.createdAt).toLocaleDateString()}{" "}
                            {new Date(note.createdAt).toLocaleTimeString()}
                          </Text>
                        </Group>
                      }
                    >
                      <Text size="sm">{note.content}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Paper>
          </Stack>
        </>
      )}
    </Container>
  );
}
