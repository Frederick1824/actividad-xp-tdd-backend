import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const usuario = await prisma.usuario.upsert({
    where: { email: "fede@ejemplo.com" },
    update: { nombre: "Federico" },
    create: {
      nombre: "Federico",
      email: "fede@ejemplo.com"
    }
  });

  const producto1 = await prisma.producto.upsert({
    where: { id: 1 },
    update: {
      nombre: "Teclado mecánico",
      precio: 45000,
      stock: 10
    },
    create: {
      nombre: "Teclado mecánico",
      precio: 45000,
      stock: 10
    }
  });

  const producto2 = await prisma.producto.upsert({
    where: { id: 2 },
    update: {
      nombre: "Mouse inalámbrico",
      precio: 25000,
      stock: 15
    },
    create: {
      nombre: "Mouse inalámbrico",
      precio: 25000,
      stock: 15
    }
  });

  console.log("Seed completado");
  console.log({ usuario, productos: [producto1, producto2] });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
