import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const statuses = ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED'];

  for (const name of statuses) {
    await prisma.status.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Estados insertados correctamente');
}

main()
  .catch((e) => {
    console.error('Error en la seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
