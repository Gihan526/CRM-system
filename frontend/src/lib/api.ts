import type { Lead, Note, DashboardStats } from "../types/lead";

const API_URL = "http://localhost:3001";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "An error occurred",
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Leads API
export const leadsApi = {
  getAll: (filters?: {
    status?: string;
    leadSource?: string;
    assignedSalesperson?: string;
    search?: string;
  }): Promise<Lead[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.leadSource) params.append("leadSource", filters.leadSource);
    if (filters?.assignedSalesperson)
      params.append("assignedSalesperson", filters.assignedSalesperson);
    if (filters?.search) params.append("search", filters.search);

    return fetchWithAuth(`${API_URL}/api/leads?${params}`);
  },

  getById: (id: string): Promise<Lead> => {
    return fetchWithAuth(`${API_URL}/api/leads/${id}`);
  },

  create: (data: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> => {
    return fetchWithAuth(`${API_URL}/api/leads`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: Partial<Lead>): Promise<Lead> => {
    return fetchWithAuth(`${API_URL}/api/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: string): Promise<{ message: string }> => {
    return fetchWithAuth(`${API_URL}/api/leads/${id}`, {
      method: "DELETE",
    });
  },
};

// Notes API
export const notesApi = {
  getByLeadId: (leadId: string): Promise<Note[]> => {
    return fetchWithAuth(`${API_URL}/api/leads/${leadId}/notes`);
  },

  create: (leadId: string, content: string): Promise<Note> => {
    return fetchWithAuth(`${API_URL}/api/leads/${leadId}/notes`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => {
    return fetchWithAuth(`${API_URL}/api/dashboard/stats`);
  },
};
