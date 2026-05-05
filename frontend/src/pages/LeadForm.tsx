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

      <Title order={1} mb="xl">
        {isEditing ? "Edit Lead" : "New Lead"}
      </Title>

      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Lead Name"
              placeholder="John Smith"
              required
              {...form.getInputProps("leadName")}
            />

            <TextInput
              label="Company Name"
              placeholder="Acme Corp"
              required
              {...form.getInputProps("companyName")}
            />

            <Group grow>
              <TextInput
                label="Email"
                placeholder="john@acme.com"
                required
                {...form.getInputProps("email")}
              />
              <TextInput
                label="Phone"
                placeholder="+1 (555) 123-4567"
                {...form.getInputProps("phoneNumber")}
              />
            </Group>

            <Group grow>
              <Select
                label="Lead Source"
                placeholder="Select source"
                required
                data={LEAD_SOURCES}
                {...form.getInputProps("leadSource")}
              />
              <Select
                label="Status"
                placeholder="Select status"
                required
                data={LEAD_STATUSES}
                {...form.getInputProps("status")}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Assigned To"
                placeholder="Sales Rep Name"
                {...form.getInputProps("assignedSalesperson")}
              />
              <NumberInput
                label="Deal Value"
                placeholder="50000"
                prefix="$"
                thousandSeparator
                {...form.getInputProps("estimatedDealValue")}
              />
            </Group>

            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" onClick={() => navigate("/leads")}>
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={submitting}
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
