import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Button,
  Group,
  Stack,
  Textarea,
  LoadingOverlay,
  Divider,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconSend,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { leadsApi, notesApi } from "../lib/api";
import type { Lead, LeadStatus, Note } from "../types/lead";

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
        padding: "4px 12px",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.75rem",
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
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load lead details",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async (leadId: string) => {
    try {
      const data = await notesApi.getByLeadId(leadId);
      setNotes(data);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to load notes",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsApi.delete(id!);
      notifications.show({
        title: "Deleted",
        message: "Lead removed successfully",
        color: "green",
      });
      navigate("/leads");
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete lead",
        color: "red",
      });
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim() || !id) return;
    setSubmittingNote(true);
    try {
      await notesApi.create(id, noteContent);
      setNoteContent("");
      loadNotes(id);
      notifications.show({
        title: "Note Added",
        message: "Your note has been saved",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to add note",
        color: "red",
      });
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    try {
      await leadsApi.update(id!, { status: newStatus });
      loadLead(id!);
      notifications.show({
        title: "Status Updated",
        message: `Lead status changed to ${newStatus}`,
        color: "blue",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to update status",
        color: "red",
      });
    }
  };

  if (!lead && !loading) {
    return (
      <Container py="xl">
        <p style={{ color: "var(--text-secondary)" }}>Lead not found</p>
        <Button variant="subtle" onClick={() => navigate("/leads")} mt="md">
          Back to Leads
        </Button>
      </Container>
    );
  }

  const statusPillClass = (status: LeadStatus) => {
    const base = "status-pill";
    const active = lead?.status === status ? "active" : "";
    const map: Record<LeadStatus, string> = {
      New: "status-new",
      Contacted: "status-contacted",
      Qualified: "status-qualified",
      "Proposal Sent": "status-proposal",
      Won: "status-won",
      Lost: "status-lost",
    };
    return `${base} ${active} ${map[status]}`.trim();
  };

  return (
    <Container size="md" pos="relative" py={0}>
      <LoadingOverlay visible={loading} />

      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/leads")}
        mb="md"
        style={{ paddingLeft: 0 }}
      >
        Back to Leads
      </Button>

      {lead && (
        <Stack gap="lg">
          {/* Hero */}
          <div className="lead-hero">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div className="lead-hero-name">{lead.leadName}</div>
                  <StatusBadge status={lead.status as LeadStatus} />
                </div>
                <div className="lead-hero-company">{lead.companyName}</div>
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
            </div>
          </div>

          {/* Details */}
          <div className="section-card">
            <div className="section-title">Lead Details</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px 32px",
              }}
            >
              {[
                { label: "Email", value: lead.email },
                { label: "Phone", value: lead.phoneNumber || "—" },
                { label: "Lead Source", value: lead.leadSource },
                { label: "Assigned To", value: lead.assignedSalesperson || "—" },
                {
                  label: "Deal Value",
                  value: lead.estimatedDealValue
                    ? `$${lead.estimatedDealValue.toLocaleString()}`
                    : "—",
                  mono: true,
                },
                {
                  label: "Created",
                  value: new Date(lead.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                },
              ].map((item) => (
                <div key={item.label}>
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
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      fontFamily: item.mono ? "var(--font-mono)" : "var(--font-body)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <Divider my="xl" style={{ borderColor: "var(--border)" }} />

            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-tertiary)",
                marginBottom: 14,
              }}
            >
              Update Status
            </div>
            <div className="status-pill-group">
              {(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"] as LeadStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    className={statusPillClass(status)}
                    onClick={() => handleStatusUpdate(status)}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="section-card">
            <div className="section-title">Notes</div>

            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
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
                style={{ alignSelf: "flex-start", height: 44 }}
              >
                Add
              </Button>
            </div>

            {notes.length === 0 ? (
              <p style={{ color: "var(--text-tertiary)", textAlign: "center", padding: "32px 0" }}>
                No notes yet. Add your first note above.
              </p>
            ) : (
              <div className="notes-timeline">
                {notes.map((note) => (
                  <div key={note.id} className="notes-timeline-item">
                    <div className="notes-timeline-bullet">
                      <div className="notes-timeline-avatar">
                        {note.createdBy.charAt(0)}
                      </div>
                    </div>
                    <div className="notes-timeline-header">
                      <span className="notes-timeline-author">
                        {note.createdBy}
                      </span>
                      <span className="notes-timeline-date">
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
                      </span>
                    </div>
                    <div className="notes-timeline-content">{note.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Stack>
      )}
    </Container>
  );
}
