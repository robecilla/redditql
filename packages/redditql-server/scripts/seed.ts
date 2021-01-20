import { PrismaClient } from "@prisma/client";
import faker from "faker";

const prisma = new PrismaClient();

async function seed() {
  await prisma.$executeRaw('TRUNCATE TABLE "User" CASCADE;');

  let userIds = [];
  for (let i = 0; i < 3; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    userIds.push(user.id);
  }

  for (let i = 0; i < 100; i++) {
    await prisma.post.create({
      data: {
        title: faker.random.words(6),
        content: faker.lorem.paragraphs(3),
        author: {
          connect: { id: userIds[Math.floor(Math.random() * userIds.length)] },
        },
      },
    });
  }
}

seed()
  .then(() => console.log("Seed complete"))
  .catch((err) => console.error(err))
  .finally(() => process.exit());
