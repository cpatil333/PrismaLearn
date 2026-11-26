import "dotenv/config";
import { PrismaClient, Prisma, Employee } from "./generated/client";
import { count } from "node:console";

const prisma = new PrismaClient();
type EmployeeHaving = Prisma.EmployeeScalarWhereWithAggregatesInput;

const prismas = new PrismaClient().$extends({
  client: {
    async transferEmployee(employeeId: number, newDepartmentId: number) {
      //First check exist employee Id
      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
      });

      if (existingEmployee === null) {
        throw new Error("Employee not found");
      }

      //Check deparment exist or not
      const existingDepartment = await prisma.department.findUnique({
        where: {
          id: newDepartmentId,
        },
      });

      if (existingDepartment === null) {
        throw new Error("Department not found");
      }

      if (existingEmployee.departmentId === newDepartmentId) {
        throw new Error("Employee already belongs to this department");
      }

      //If both exist, update the employee's departmentId.
      const updatedEmployee = await prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          departmentId: newDepartmentId,
        },
      });

      return updatedEmployee;
    },
  },
});

async function main() {
  await prismas.$connect();
  console.log("Database connected successfully");

  const transferEmployee = await prismas.transferEmployee(3, 999);

  console.log(transferEmployee);
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
