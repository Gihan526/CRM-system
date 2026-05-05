import { PrismaClient } from "@prisma/client";
import { auth } from "../src/auth.js";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!existingUser) {
      // Create test user using Better Auth's API
      await auth.api.signUpEmail({
        body: {
          email: "admin@example.com",
          password: "password123",
          name: "Admin User",
        },
      });
      console.log("Test user created successfully!");
      console.log("Email: admin@example.com");
      console.log("Password: password123");
    } else {
      console.log("Test user already exists.");
    }

    // Check if demo leads already exist
    const existingLeads = await prisma.lead.count();
    if (existingLeads > 0) {
      console.log("Demo leads already exist.");
      return;
    }

    // Create demo leads
    const leads = [
      {
        leadName: "John Smith",
        companyName: "Acme Corp",
        email: "john.smith@acme.com",
        phoneNumber: "+1 (555) 123-4567",
        leadSource: "Website",
        assignedSalesperson: "Admin User",
        status: "New",
        estimatedDealValue: 50000,
      },
      {
        leadName: "Sarah Johnson",
        companyName: "TechStart",
        email: "sarah.j@techstart.io",
        phoneNumber: "+1 (555) 234-5678",
        leadSource: "LinkedIn",
        assignedSalesperson: "Admin User",
        status: "Contacted",
        estimatedDealValue: 75000,
      },
      {
        leadName: "Mike Brown",
        companyName: "Global Inc",
        email: "mike.brown@globalinc.com",
        phoneNumber: "+1 (555) 345-6789",
        leadSource: "Referral",
        assignedSalesperson: "Admin User",
        status: "Qualified",
        estimatedDealValue: 120000,
      },
      {
        leadName: "Emily Davis",
        companyName: "SmartSolutions",
        email: "emily.davis@smartsolutions.com",
        phoneNumber: "+1 (555) 456-7890",
        leadSource: "Cold Email",
        assignedSalesperson: "Admin User",
        status: "Proposal Sent",
        estimatedDealValue: 45000,
      },
      {
        leadName: "Chris Wilson",
        companyName: "MegaCorp",
        email: "chris.wilson@megacorp.com",
        phoneNumber: "+1 (555) 567-8901",
        leadSource: "Event",
        assignedSalesperson: "Admin User",
        status: "Won",
        estimatedDealValue: 200000,
      },
      {
        leadName: "Lisa Anderson",
        companyName: "StartupXYZ",
        email: "lisa.anderson@startupxyz.com",
        phoneNumber: "+1 (555) 678-9012",
        leadSource: "Website",
        assignedSalesperson: "Admin User",
        status: "Lost",
        estimatedDealValue: 30000,
      },
      {
        leadName: "David Lee",
        companyName: "Enterprise Co",
        email: "david.lee@enterpriseco.com",
        phoneNumber: "+1 (555) 789-0123",
        leadSource: "LinkedIn",
        assignedSalesperson: "Admin User",
        status: "Contacted",
        estimatedDealValue: 90000,
      },
      {
        leadName: "Amanda White",
        companyName: "BlueChip Ltd",
        email: "amanda.white@bluechip.com",
        phoneNumber: "+1 (555) 890-1234",
        leadSource: "Referral",
        assignedSalesperson: "Admin User",
        status: "New",
        estimatedDealValue: 60000,
      },
    ];

    for (const leadData of leads) {
      const lead = await prisma.lead.create({
        data: leadData,
      });

      // Add sample notes to some leads
      if (lead.status === "Contacted" || lead.status === "Qualified") {
        await prisma.note.create({
          data: {
            content: `Initial contact made with ${lead.leadName}. They showed interest in our enterprise solution.`,
            createdBy: "Admin User",
            leadId: lead.id,
          },
        });
      }

      if (lead.status === "Won") {
        await prisma.note.create({
          data: {
            content: `Deal closed! ${lead.leadName} signed the contract. Great work!`,
            createdBy: "Admin User",
            leadId: lead.id,
          },
        });
      }
    }

    console.log(`Created ${leads.length} demo leads successfully!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
