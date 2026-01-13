import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.color.count();
  if (existing > 0) return;

  await prisma.color.createMany({
    data: [
      {
        name: "Дуб натуральный",
        sku: "OAK-NAT-01",
        brand: "ExampleLam",
        tone: "натуральный",
        wearClass: 33,
        thicknessMm: 8,
        plankSize: "1285×192",
        bevelType: "4V",
        waterResistant: true,
        surfaceType: "матовая",
        imagesJson: JSON.stringify([
          "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80"
        ])
      },
      {
        name: "Дуб серый",
        sku: "OAK-GRY-02",
        brand: "ExampleLam",
        tone: "серый",
        wearClass: 32,
        thicknessMm: 10,
        plankSize: "1380×193",
        bevelType: "2V",
        waterResistant: false,
        surfaceType: "тиснение",
        imagesJson: JSON.stringify([
          "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80"
        ])
      }
    ]
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
