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

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email address"),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
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
        Sign in to access your dashboard
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="admin@example.com"
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps("password")}
            />

            <Button type="submit" fullWidth mt="md" loading={form.submitting}>
              Sign In
            </Button>
          </Stack>
        </form>

        <Box mt="md" ta="center">
          <Text size="sm" c="dimmed">
            Don't have an account?{" "}
            <Anchor size="sm" href="/register" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
              Create account
            </Anchor>
          </Text>
        </Box>
      </Paper>

      <Text size="xs" c="dimmed" ta="center" mt="xl">
        Test credentials: admin@example.com / password123
      </Text>
    </Container>
  );
}
