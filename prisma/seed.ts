import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { birthstones } from "../src/lib/data/birthstones";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@voyage.example";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMeNow!123";
  const adminName = process.env.SEED_ADMIN_NAME ?? "VOYAGE Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
    },
  });

  for (const [index, stone] of birthstones.entries()) {
    const sku = `VOY-BS-${String(index + 1).padStart(2, "0")}`;
    const name = `${stone.month} Birthstone ${stone.gemstone} Necklace`;

    await prisma.product.upsert({
      where: { slug: stone.slug },
      update: {},
      create: {
        sku,
        name,
        slug: stone.slug,
        month: stone.month,
        gemstone: stone.gemstone,
        material: "925 Sterling Silver",
        price: 89,
        compareAtPrice: 109,
        description: `A ${stone.gemstone.toLowerCase()} birthstone pendant necklace in 925 sterling silver.`,
        story: `Traditionally associated with ${stone.month}, ${stone.gemstone} is often symbolized as a stone of personal meaning and celebration.`,
        careInstructions: "Store in the included pouch. Avoid harsh chemicals and prolonged water exposure.",
        seoTitle: `${name} | VOYAGE`,
        seoDescription: `Shop the ${stone.month} ${stone.gemstone} birthstone necklace from VOYAGE.`,
        featured: index < 4,
        active: true,
        inventory: { create: { quantity: 100 } },
        images: {
          create: [
            {
              url: `/placeholders/birthstones/${stone.slug}.jpg`,
              alt: name,
              sortOrder: 0,
              type: "hero",
            },
          ],
        },
      },
    });
  }

  console.info("Seed complete:", { adminEmail, products: birthstones.length });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
