import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      password: passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin user berhasil dibuat');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
