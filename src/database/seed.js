/* eslint-disable no-console */
import fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRoles() {
  const data = await fs.readFile('./mock/Roles.json', 'utf-8');
  const roles = JSON.parse(data);
  const cleanedRoles = roles.map((rol) => ({
    id: rol.id,
    name: rol.name,
    description: rol.description,
  }));
  await Promise.all(
    cleanedRoles.map((role) =>
      prisma.role.create({
        data: {
          ...role,
        },
      }),
    ),
  );
}

async function seedUsers() {
  const data = await fs.readFile('./mock/Users.json', 'utf-8');
  const users = JSON.parse(data);
  const cleanedUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    hashedPassword: user.hashedPassword,
    roleId: user.roleId,
  }));
  await Promise.all(
    cleanedUsers.map((user) =>
      prisma.user.create({
        data: {
          ...user,
        },
      }),
    ),
  );
}

async function main() {
  console.log('Seeding database...');
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await seedRoles();
  await seedUsers();
  console.log('Database seeded');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
