import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMail, IconLock } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email address"),
      password: (value) =>
        value.length < 8 ? "Password must be at least 8 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await register(values.email, values.password);
      navigate("/login");
    } catch {
      // Error is handled in AuthContext
    }
  };

  return (
    <Container size={420} my={80} pos="relative">
      <LoadingOverlay visible={authLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Title ta="center" fw={700} size="h2" mb="xs">
        CRM
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb={30}>
        Create a new account
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Min 8 characters"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Repeat your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps("confirmPassword")}
            />

            <Button type="submit" fullWidth mt="md" loading={form.submitting}>
              Create Account
            </Button>
          </Stack>
        </form>

        <Box mt="md" ta="center">
          <Text size="sm" c="dimmed">
            Already have an account?{" "}
            <Anchor size="sm" href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Sign in
            </Anchor>
          </Text>
        </Box>
      </Paper>
    </Container>
  );
}
