import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  Stack,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { leadsApi } from "../lib/api";
import { LEAD_STATUSES, LEAD_SOURCES } from "../types/lead";
import type { LeadStatus } from "../types/lead";

export default function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      leadName: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      leadSource: "",
      assignedSalesperson: "",
      status: "New" as LeadStatus,
      estimatedDealValue: undefined as number | undefined,
    },
    validate: {
      leadName: (value) => (!value ? "Lead name is required" : null),
      companyName: (value) => (!value ? "Company name is required" : null),
      email: (value) =>
        !value
          ? "Email is required"
          : /^\S+@\S+$/.test(value)
          ? null
          : "Invalid email address",
      leadSource: (value) => (!value ? "Lead source is required" : null),
      status: (value) => (!value ? "Status is required" : null),
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadLead(id);
    }
  }, [isEditing, id]);

  const loadLead = async (leadId: string) => {
    try {
      const lead = await leadsApi.getById(leadId);
      form.setValues({
        leadName: lead.leadName,
        companyName: lead.companyName,
        email: lead.email,
        phoneNumber: lead.phoneNumber || "",
        leadSource: lead.leadSource,
        assignedSalesperson: lead.assignedSalesperson || "",
        status: lead.status as LeadStatus,
        estimatedDealValue: lead.estimatedDealValue || undefined,
      });
    } catch (error) {
      console.error("Error loading lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        estimatedDealValue: values.estimatedDealValue || null,
      };

      if (isEditing && id) {
        await leadsApi.update(id, data);
      } else {
        await leadsApi.create(data as any);
      }
      navigate("/leads");
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      size="md"
      py="xl"
      pos="relative"
      style={{ maxWidth: 640 }}
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

      <Title
        order={1}
        mb="xl"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 40,
          fontWeight: 600,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}
      >
        {isEditing ? "Edit Lead" : "New Lead"}
      </Title>

      <Box
        style={{
          height: 1,
          backgroundColor: "var(--border-light)",
          width: "100%",
          marginBottom: "var(--space-xl)",
        }}
      />

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Lead Name"
              placeholder="John Smith"
              required
              {...form.getInputProps("leadName")}
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
                  height: 42,
                },
              }}
            />

            <TextInput
              label="Company Name"
              placeholder="Acme Corp"
              required
              {...form.getInputProps("companyName")}
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
                  height: 42,
                },
              }}
            />

            <Group grow>
              <TextInput
                label="Email"
                placeholder="john@acme.com"
                required
                {...form.getInputProps("email")}
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
                    height: 42,
                  },
                }}
              />
              <TextInput
                label="Phone"
                placeholder="+1 (555) 123-4567"
                {...form.getInputProps("phoneNumber")}
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
                    height: 42,
                  },
                }}
              />
            </Group>

            <Group grow>
              <Select
                label="Lead Source"
                placeholder="Select source"
                required
                data={LEAD_SOURCES}
                {...form.getInputProps("leadSource")}
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
                    height: 42,
                  },
                }}
              />
              <Select
                label="Status"
                placeholder="Select status"
                required
                data={LEAD_STATUSES}
                {...form.getInputProps("status")}
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
                    height: 42,
                  },
                }}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Assigned To"
                placeholder="Sales Rep Name"
                {...form.getInputProps("assignedSalesperson")}
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
                    height: 42,
                  },
                }}
              />
              <NumberInput
                label="Deal Value"
                placeholder="50000"
                prefix="$"
                thousandSeparator
                {...form.getInputProps("estimatedDealValue")}
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
                    fontFamily: "var(--font-mono)",
                    borderColor: "var(--border-light)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 14,
                    height: 42,
                  },
                }}
              />
            </Group>

            <Group justify="flex-end" mt="xl" pt="md" style={{ borderTop: "1px solid var(--border-light)" }}>
              <Button
                variant="subtle"
                onClick={() => navigate("/leads")}
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={15} stroke={1.5} />}
                loading={submitting}
                style={{
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg-surface)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 500,
                  height: 40,
                  borderRadius: "var(--radius-sm)",
                  letterSpacing: "0.02em",
                }}
              >
                {isEditing ? "Save Changes" : "Create Lead"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
