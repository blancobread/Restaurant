import prisma from "./prisma.js";

async function main() {
  await prisma.restaurant_tables.createMany({
    data: [
      { id: "table-1", table_number: 1, capacity: 2, is_active: true },
      { id: "table-2", table_number: 2, capacity: 2, is_active: true },
      { id: "table-3", table_number: 3, capacity: 4, is_active: true },
      { id: "table-4", table_number: 4, capacity: 4, is_active: true },
      { id: "table-5", table_number: 5, capacity: 6, is_active: true },
      { id: "table-6", table_number: 6, capacity: 8, is_active: true },
    ],
    skipDuplicates: true,
  });

  await prisma.special_days.createMany({
    data: [
      {
        date: new Date("2026-07-04"),
        reason: "Independence Day",
        holding_fee_amount: 10,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
