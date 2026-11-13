import "dotenv/config";
import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log("Database connected successfully");

  const department = await prisma.department.update({
    where: {
      id: 4,
    },
    data: {
      employees: {
        deleteMany: {
          salary: {
            lt: 55000,
          },
        },
      },
    },
    include: {
      employees: true,
    },
  });

  console.log("Updated department:", department);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
