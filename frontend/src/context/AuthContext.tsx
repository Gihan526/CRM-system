import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authClient } from "../lib/auth-client";
import { notifications } from "@mantine/notifications";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      notifications.show({
        title: "Login Failed",
        message: error.message || "Invalid email or password",
        color: "red",
      });
      throw error;
    }

    await fetchSession();
    notifications.show({
      title: "Welcome back!",
      message: "You have successfully logged in.",
      color: "green",
    });
  };

  const register = async (email: string, password: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0],
    });

    if (error) {
      notifications.show({
        title: "Registration Failed",
        message: error.message || "Could not create account",
        color: "red",
      });
      throw error;
    }

    notifications.show({
      title: "Account Created!",
      message: "Your account has been created successfully.",
      color: "green",
    });
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    notifications.show({
      title: "Logged Out",
      message: "You have been logged out successfully.",
      color: "blue",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
