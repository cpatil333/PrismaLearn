import "dotenv/config";
import { PrismaClient, Prisma, Employee } from "./generated/client";

const prisma = new PrismaClient();
type EmployeeHaving = Prisma.EmployeeScalarWhereWithAggregatesInput;

const prismas = new PrismaClient().$extends({
  query: {
    employee: {
      async update({ args, query }) {
        const employee = await prisma.employee.findUnique({
          where: {
            id: args.where.id,
          },
          select: {
            salary: true,
          },
        });

        let newSalary = employee?.salary;
        const salary = args.data.salary;

        if (typeof salary === "number") {
          newSalary = salary;
        } else if (
          salary &&
          "increment" in salary &&
          typeof salary.increment === "number"
        ) {
          newSalary = Number(employee?.salary) + salary.increment;
        } else if (
          salary &&
          "decrement" in salary &&
          typeof salary.decrement === "number"
        ) {
          newSalary = Number(employee?.salary) - salary.decrement;
        }
        // 2. Validate before updating
        if (newSalary !== undefined && newSalary < 20000) {
          throw new Error("Employee salary must be at least 20000");
        }
        console.log(employee);

        // We'll add validation here next.
        return query(args);
      },
    },
  },
});

function logEmployeeOperation(operation: string, identifier: string | number) {
  console.log(`Operation: ${operation}`);
  console.log(`Employee: ${identifier}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
}

async function main() {
  await prismas.$connect();
  console.log("Database connected successfully");
  const employee = await prismas.employee.update({
    where: {
      id: 27,
    },
    data: {
      salary: 30000,
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
