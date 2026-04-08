import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";

  const adminExist = await prisma.user.findUnique({
    where: { email },
  });

  if (adminExist) {
    console.log("Admin đã tồn tại!");
    return;
  }

  const hashPassword = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      fullName: "Administrator",
      email: email,
      password: hashPassword,
      role: "admin",
    },
  });

  console.log("Tạo tài khoản admin thành công!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
