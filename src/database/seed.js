import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const rolesData = [
    { name: 'Admin', description: 'Administrador con acceso completo' },
    { name: 'User', description: 'Usuario regular con acceso limitado' },
  ];

  const [roleAdmin, roleUser] = await Promise.all(
    rolesData.map((role) => prisma.role.create({ data: role })),
  );

  // Lista de usuarios
  const usersData = [
    {
      email: 'admin@example.com',
      password: 'a',
      roleId: roleAdmin.id,
    },
    {
      email: 'user@example.com',
      password: 'a',
      roleId: roleUser.id,
    },
  ];

  await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await hash(user.password, 10);
      await prisma.user.create({
        data: {
          email: user.email,
          hashedPassword,
          roleId: user.roleId,
        },
      });
    }),
  );

  console.log('Datos de seed creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
