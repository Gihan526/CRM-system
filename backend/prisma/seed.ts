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

    if (existingUser) {
      console.log("Test user already exists.");
      return;
    }

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
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
