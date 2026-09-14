import type { PrismaClient, Producto } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export interface CrearProductoDto {
  nombre: string;
  precio: Prisma.Decimal | number | string;
  stock: number;
}

export class ProductosRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listar(): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      orderBy: { id: "asc" }
    });
  }

  buscarPorId(id: number): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { id }
    });
  }

  crear(datos: CrearProductoDto): Promise<Producto> {
    return this.prisma.producto.create({
      data: datos
    });
  }
}
