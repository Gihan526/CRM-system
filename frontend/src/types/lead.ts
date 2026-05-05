export interface Lead {
  id: string;
  leadName: string;
  companyName: string;
  email: string;
  phoneNumber: string | null;
  leadSource: string;
  assignedSalesperson: string | null;
  status: LeadStatus;
  estimatedDealValue: number | null;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Won"
  | "Lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

export const LEAD_SOURCES = [
  "Website",
  "LinkedIn",
  "Referral",
  "Cold Email",
  "Event",
  "Other",
];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "gray",
  Contacted: "orange",
  Qualified: "yellow",
  "Proposal Sent": "blue",
  Won: "green",
  Lost: "red",
};

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  proposalSentLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalDealValue: number;
  wonDealValue: number;
}
