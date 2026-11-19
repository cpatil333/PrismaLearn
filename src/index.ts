import "dotenv/config";
import { PrismaClient, Prisma, Employee } from "./generated/client";
import { error } from "node:console";

const prisma = new PrismaClient();
type EmployeeHaving = Prisma.EmployeeScalarWhereWithAggregatesInput;

async function main() {
  await prisma.$connect();
  console.log("Database connected successfully");

  const prismas = new PrismaClient().$extends({
    query: {
      employee: {
        async findMany({ args, query }) {
          // Custom logic here
          console.log();
          return query(args);
        },
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
