import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Better Auth handler - MUST be before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Express JSON middleware - only apply to non-auth routes
app.use("/api/*", (req, res, next) => {
  if (!req.path.startsWith("/api/auth")) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CRM API is running" });
});

// ==================== LEAD ROUTES ====================

// GET /api/leads - List all leads with optional filtering
app.get("/api/leads", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const leadSource = req.query.leadSource ? String(req.query.leadSource) : undefined;
    const assignedSalesperson = req.query.assignedSalesperson ? String(req.query.assignedSalesperson) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (leadSource) where.leadSource = leadSource;
    if (assignedSalesperson) where.assignedSalesperson = assignedSalesperson;
    if (search) {
      where.OR = [
        { leadName: { contains: search } },
        { companyName: { contains: search } },
        { email: { contains: search } },
      ];
    }
    
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// GET /api/leads/:id - Get single lead with notes
app.get("/api/leads/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
});

// POST /api/leads - Create new lead
app.post("/api/leads", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      leadName,
      companyName,
      email,
      phoneNumber,
      leadSource,
      assignedSalesperson,
      status,
      estimatedDealValue,
    } = req.body;
    
    // Validation
    if (!leadName || !companyName || !email || !leadSource || !status) {
      return res.status(400).json({
        error: "Missing required fields: leadName, companyName, email, leadSource, status",
      });
    }
    
    const lead = await prisma.lead.create({
      data: {
        leadName,
        companyName,
        email,
        phoneNumber: phoneNumber || null,
        leadSource,
        assignedSalesperson: assignedSalesperson || req.user?.name || "Unassigned",
        status,
        estimatedDealValue: estimatedDealValue ? parseFloat(String(estimatedDealValue)) : null,
      },
    });
    
    res.status(201).json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// PUT /api/leads/:id - Update lead
app.put("/api/leads/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const {
      leadName,
      companyName,
      email,
      phoneNumber,
      leadSource,
      assignedSalesperson,
      status,
      estimatedDealValue,
    } = req.body;
    
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });
    
    if (!existingLead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    const updateData: any = {};
    if (leadName !== undefined) updateData.leadName = leadName;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null;
    if (leadSource !== undefined) updateData.leadSource = leadSource;
    if (assignedSalesperson !== undefined) updateData.assignedSalesperson = assignedSalesperson || null;
    if (status !== undefined) updateData.status = status;
    if (estimatedDealValue !== undefined) updateData.estimatedDealValue = estimatedDealValue ? parseFloat(String(estimatedDealValue)) : null;
    
    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });
    
    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// DELETE /api/leads/:id - Delete lead
app.delete("/api/leads/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });
    
    if (!existingLead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    await prisma.lead.delete({
      where: { id },
    });
    
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

// ==================== NOTE ROUTES ====================

// GET /api/leads/:id/notes - Get notes for a lead
app.get("/api/leads/:id/notes", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    
    const notes = await prisma.note.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
    });
    
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /api/leads/:id/notes - Add note to lead
app.post("/api/leads/:id/notes", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id);
    const { content } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Note content is required" });
    }
    
    const lead = await prisma.lead.findUnique({
      where: { id },
    });
    
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    
    const note = await prisma.note.create({
      data: {
        content,
        createdBy: req.user?.name || req.user?.email || "Unknown",
        leadId: id,
      },
    });
    
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ==================== DASHBOARD ROUTES ====================

// GET /api/dashboard/stats - Get dashboard statistics
app.get("/api/dashboard/stats", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      wonLeads,
      lostLeads,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "New" } }),
      prisma.lead.count({ where: { status: "Contacted" } }),
      prisma.lead.count({ where: { status: "Qualified" } }),
      prisma.lead.count({ where: { status: "Proposal Sent" } }),
      prisma.lead.count({ where: { status: "Won" } }),
      prisma.lead.count({ where: { status: "Lost" } }),
    ]);
    
    const totalDealValue = await prisma.lead.aggregate({
      _sum: { estimatedDealValue: true },
    });
    
    const wonDealValue = await prisma.lead.aggregate({
      where: { status: "Won" },
      _sum: { estimatedDealValue: true },
    });
    
    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      wonLeads,
      lostLeads,
      totalDealValue: totalDealValue._sum.estimatedDealValue || 0,
      wonDealValue: wonDealValue._sum.estimatedDealValue || 0,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Auth endpoint: http://localhost:${PORT}/api/auth`);
});
