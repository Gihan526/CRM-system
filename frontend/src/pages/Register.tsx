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
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-title">CRM</div>
          <div className="auth-brand-subtitle">
            Start tracking your leads with clarity and focus.
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
            Create account
          </Title>
          <Text
            size="sm"
            style={{
              color: "var(--text-secondary)",
              marginBottom: 28,
            }}
          >
            Set up your CRM in seconds
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                leftSection={<IconMail size={16} color="var(--text-tertiary)" />}
                required
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Min 8 characters"
                leftSection={<IconLock size={16} color="var(--text-tertiary)" />}
                required
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                leftSection={<IconLock size={16} color="var(--text-tertiary)" />}
                required
                {...form.getInputProps("confirmPassword")}
              />

              <Button
                type="submit"
                fullWidth
                mt="sm"
                loading={form.submitting}
                style={{ height: 44 }}
              >
                Create Account
              </Button>
            </Stack>
          </form>

          <Box mt="lg" ta="center">
            <Text size="sm" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Anchor
                size="sm"
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign in
              </Anchor>
            </Text>
          </Box>
        </div>
      </div>
    </div>
  );
}
