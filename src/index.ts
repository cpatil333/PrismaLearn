import "dotenv/config";
import { PrismaClient, Prisma, Employee } from "./generated/client";
import { error } from "node:console";

const prisma = new PrismaClient();
type EmployeeHaving = Prisma.EmployeeScalarWhereWithAggregatesInput;

const prismas = new PrismaClient().$extends({
  query: {
    employee: {
      async upsert({ args, query }) {
        console.log("Creating or updating employee...");
        return query(args);
      },
    },
  },
});

async function main() {
  await prismas.$connect();
  console.log("Database connected successfully");

  const employee = await prismas.employee.upsert({
    where: {
      email: "neha@company.com",
    },
    update: {
      salary: 60000,
    },
    create: {
      name: "Neha",
      email: "neha@company.com",
      salary: 60000,
      departmentId: 1,
    },
  });

  console.log(employee);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
