import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: { name: "Demo Company" }
  });

  const user = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      password: "123456",
      role: "ADMIN",
      tenantId: tenant.id
    }
  });

  const employee = await prisma.employee.create({
    data: {
      name: "John Doe",
      position: "Developer",
      salary: 50000,
      tenantId: tenant.id
    }
  });

  const account = await prisma.account.create({
    data: {
      name: "Cash Account",
      type: "ASSET",
      balance: 10000,
      tenantId: tenant.id
    }
  });

  await prisma.transaction.create({
    data: {
      amount: 2000,
      type: "DEBIT",
      accountId: account.id,
      tenantId: tenant.id
    }
  });

  await prisma.inventory.create({
  data: {
    productName: "Laptop",
    sku: "LP1001",
    quantity: 10,
    price: 65000,
    category: "Electronics",
    tenantId: tenant.id,
 
    }
  });

  console.log("✅ Seed data created");
}

main();