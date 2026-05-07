import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-title">CRM</div>
          <div className="auth-brand-subtitle">
            A calm, focused space for tracking your sales pipeline.
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <LoadingOverlay visible={authLoading} overlayProps={{ blur: 2 }} />

        <div className="auth-form-card">
          <Title
            order={2}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 600,
              marginBottom: 4,
              color: "var(--text-primary)",
            }}
          >
            Welcome back
          </Title>
          <Text
            size="sm"
            style={{
              color: "var(--text-secondary)",
              marginBottom: 28,
            }}
          >
            Sign in to access your dashboard
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="admin@example.com"
                leftSection={<IconMail size={16} color="var(--text-tertiary)" />}
                required
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                leftSection={<IconLock size={16} color="var(--text-tertiary)" />}
                required
                {...form.getInputProps("password")}
              />

              <Button
                type="submit"
                fullWidth
                mt="sm"
                loading={form.submitting}
                style={{ height: 44 }}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Box mt="lg" ta="center">
            <Text size="sm" style={{ color: "var(--text-secondary)" }}>
              Don&apos;t have an account?{" "}
              <Anchor
                size="sm"
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Create account
              </Anchor>
            </Text>
          </Box>
        </div>

        <Text
          size="xs"
          style={{ color: "var(--text-tertiary)", textAlign: "center", marginTop: 24 }}
        >
          Test credentials: admin@example.com / password123
        </Text>
      </div>
    </div>
  );
}
