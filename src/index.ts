import "dotenv/config";
import { PrismaClient, Prisma, Employee } from "./generated/client";
import { count } from "node:console";

const prisma = new PrismaClient();
type EmployeeHaving = Prisma.EmployeeScalarWhereWithAggregatesInput;

const prismas = new PrismaClient().$extends({
  client: {
    async departmentStats(departmentId: number) {
      return prisma.employee.aggregate({
        where: { departmentId },
        _count: true,
        _avg: { salary: true },
      });
    },

    async highSalaryEmployees(departmentId: number) {
      return prisma.employee.count({
        where: {
          departmentId,
          salary: { gt: 50000 },
        },
      });
    },
  },
});

async function main() {
  await prismas.$connect();
  console.log("Database connected successfully");

  const [departmentStats, highSalaryEmployees] = await Promise.all([
    prismas.departmentStats(1),
    prismas.highSalaryEmployees(1),
  ]);

  const result = {
    totalEmployees: departmentStats._count,
    averageSalary: departmentStats._avg.salary,
    highSalaryEmployees: highSalaryEmployees,
  };

  console.log("result:", result);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
