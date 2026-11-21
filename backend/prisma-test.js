import prisma from "./lib/prisma.js";

async function main() {}

main()
  .catch((error) => {
    console.error("Database query failed: ", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
