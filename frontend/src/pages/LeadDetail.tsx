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
  Box,
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
        <Text style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          Lead not found
        </Text>
        <Button
          variant="subtle"
          onClick={() => navigate("/leads")}
          mt="md"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Back to Leads
        </Button>
      </Container>
    );
  }

  return (
    <Container
      fluid
      px="xl"
      py="xl"
      pos="relative"
      style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}
    >
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />

      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={15} stroke={1.5} />}
        onClick={() => navigate("/leads")}
        mb="md"
        style={{
          color: "var(--text-secondary)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          padding: 0,
          height: 32,
        }}
      >
        Back to Leads
      </Button>

      {lead && (
        <>
          {/* Lead Header */}
          <Group justify="space-between" align="flex-start" mb="lg">
            <div>
              <Group gap="sm" mb="xs">
                <Title
                  order={1}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  {lead.leadName}
                </Title>
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
                    padding: "4px 12px",
                    height: "auto",
                  }}
                >
                  {lead.status}
                </Badge>
              </Group>
              <Text
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                }}
              >
                {lead.companyName}
              </Text>
            </div>
            <Group gap="sm">
              <Button
                variant="default"
                leftSection={<IconEdit size={15} stroke={1.5} />}
                onClick={() => navigate(`/leads/${id}/edit`)}
                style={{
                  border: "1px solid var(--border-medium)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                Edit
              </Button>
              <Button
                variant="default"
                leftSection={<IconTrash size={15} stroke={1.5} />}
                onClick={handleDelete}
                style={{
                  border: "1px solid var(--border-medium)",
                  color: "var(--accent-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <Box
            style={{
              height: 1,
              backgroundColor: "var(--border-light)",
              width: "100%",
              marginBottom: "var(--space-xl)",
            }}
          />

          <Stack gap="xl">
            {/* Lead Details */}
            <Paper
              withBorder
              p="xl"
              radius="sm"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-surface)",
                boxShadow: "none",
              }}
            >
              <Title
                order={3}
                mb="lg"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Lead Details
              </Title>

              <SimpleGrid cols={2} spacing="lg">
                <DetailItem label="Email" value={lead.email} />
                <DetailItem label="Phone" value={lead.phoneNumber || "—"} />
                <DetailItem label="Lead Source" value={lead.leadSource} />
                <DetailItem label="Assigned To" value={lead.assignedSalesperson || "—"} />
                <DetailItem
                  label="Deal Value"
                  value={lead.estimatedDealValue ? `$${lead.estimatedDealValue.toLocaleString()}` : "—"}
                  mono
                />
                <DetailItem
                  label="Created"
                  value={new Date(lead.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </SimpleGrid>

              {/* Status Update */}
              <Divider my="xl" style={{ borderColor: "var(--border-light)" }} />
              <Text
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-tertiary)",
                  marginBottom: 12,
                }}
              >
                Update Status
              </Text>
              <Group gap="xs">
                {(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"] as LeadStatus[]).map(
                  (status) => (
                    <Button
                      key={status}
                      size="xs"
                      variant={lead.status === status ? "filled" : "default"}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: 500,
                        height: 32,
                        borderRadius: "var(--radius-sm)",
                        borderColor: lead.status === status ? STATUS_COLORS[status] : "var(--border-light)",
                        backgroundColor: lead.status === status ? STATUS_COLORS[status] : "var(--bg-surface)",
                        color: lead.status === status ? "#FFFFFF" : "var(--text-secondary)",
                        letterSpacing: "0.02em",
                      }}
                      onClick={() => handleStatusUpdate(status)}
                    >
                      {status}
                    </Button>
                  )
                )}
              </Group>
            </Paper>

            {/* Notes */}
            <Paper
              withBorder
              p="xl"
              radius="sm"
              style={{
                borderColor: "var(--border-light)",
                backgroundColor: "var(--bg-surface)",
                boxShadow: "none",
              }}
            >
              <Group gap="xs" mb="lg">
                <IconNote size={18} stroke={1.5} style={{ color: "var(--text-tertiary)" }} />
                <Title
                  order={3}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Notes
                </Title>
              </Group>

              {/* Add Note */}
              <Group align="flex-start" mb="lg" gap="sm">
                <Textarea
                  placeholder="Add a note about this lead..."
                  style={{ flex: 1 }}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  minRows={2}
                  styles={{
                    input: {
                      fontFamily: "var(--font-body)",
                      borderColor: "var(--border-light)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 14,
                    },
                  }}
                />
                <Button
                  leftSection={<IconSend size={14} stroke={1.5} />}
                  onClick={handleAddNote}
                  loading={submittingNote}
                  disabled={!noteContent.trim()}
                  style={{
                    backgroundColor: "var(--text-primary)",
                    color: "var(--bg-surface)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 500,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  Add
                </Button>
              </Group>

              <Divider mb="lg" style={{ borderColor: "var(--border-light)" }} />

              {/* Notes List */}
              {notes.length === 0 ? (
                <Text
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No notes yet. Add your first note above.
                </Text>
              ) : (
                <Timeline
                  active={notes.length}
                  bulletSize={24}
                  lineWidth={1}
                  styles={{
                    itemBody: {
                      paddingLeft: 16,
                    },
                    itemBullet: {
                      backgroundColor: "var(--border-light)",
                      border: "none",
                    },
                  }}
                >
                  {notes.map((note) => (
                    <Timeline.Item
                      key={note.id}
                      bullet={
                        <Avatar
                          size={24}
                          radius="xl"
                          style={{
                            backgroundColor: "var(--border-light)",
                            color: "var(--text-tertiary)",
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 500,
                          }}
                        >
                          {note.createdBy.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Group gap="xs">
                          <Text
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--text-primary)",
                            }}
                          >
                            {note.createdBy}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: 11,
                              color: "var(--text-tertiary)",
                            }}
                          >
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
                      <Text
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                          marginTop: 4,
                        }}
                      >
                        {note.content}
                      </Text>
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

/* Simple grid helper for detail items */
function SimpleGrid({ cols, spacing, children }: { cols: number; spacing: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: spacing === "lg" ? 24 : 16,
      }}
    >
      {children}
    </div>
  );
}

function DetailItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <Text
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-tertiary)",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          fontSize: 14,
          fontWeight: 400,
          color: "var(--text-primary)",
          letterSpacing: mono ? "-0.01em" : "0",
        }}
      >
        {value}
      </Text>
    </div>
  );
}
