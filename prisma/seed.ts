import "dotenv/config";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";

async function main() {
  console.log("Seeding database...");

  // Create first Owner user
  const ownerEmail = "owner@example.com";
  const ownerPassword = "password123"; // Change this in production!

  const existingOwner = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (!existingOwner) {
    const hashedPassword = await hashPassword(ownerPassword);
    const owner = await prisma.user.create({
      data: {
        email: ownerEmail,
        password: hashedPassword,
        name: "System Owner",
        role: Role.OWNER,
        status: UserStatus.ACTIVE,
      },
    });
    console.log(`Created Owner user: ${owner.email}`);
    console.log(`Password: ${ownerPassword} (change in production!)`);
  } else {
    console.log("Owner user already exists");
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
