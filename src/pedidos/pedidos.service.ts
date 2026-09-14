import { Prisma, type PrismaClient } from "@prisma/client";

export type ProductoComprado = {
  productoId: number;
  cantidad: number;
};

export type CrearPedidoDto = {
  usuarioId: number;
  productosComprados: ProductoComprado[];
};

export class PedidoError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "PedidoError";
  }
}

export class PedidosService {
  constructor(private readonly prisma: PrismaClient) {}

  async checkout(datos: CrearPedidoDto) {
    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { id: datos.usuarioId }
      });

      if (!usuario) {
        throw new PedidoError(404, "USUARIO_NO_ENCONTRADO", "Usuario no encontrado");
      }

      const pedido = await tx.pedido.create({
        data: {
          usuarioId: datos.usuarioId,
          total: new Prisma.Decimal(0)
        }
      });

      let total = new Prisma.Decimal(0);

      for (const item of datos.productosComprados) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId }
        });

        if (!producto) {
          throw new PedidoError(
            404,
            "PRODUCTO_NO_ENCONTRADO",
            `Producto ${item.productoId} no encontrado`
          );
        }

        if (producto.stock - item.cantidad < 0) {
          throw new PedidoError(
            400,
            "STOCK_INSUFICIENTE",
            `Stock insuficiente para ${producto.nombre}`
          );
        }

        await tx.producto.update({
          where: { id: producto.id },
          data: {
            stock: { decrement: item.cantidad }
          }
        });

        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precioUnit: producto.precio
          }
        });

        total = total.plus(producto.precio.times(item.cantidad));
      }

      return tx.pedido.update({
        where: { id: pedido.id },
        data: { total },
        include: {
          usuario: true,
          detalles: {
            include: { producto: true }
          }
        }
      });
    });
  }
}
