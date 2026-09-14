import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { PedidoError, PedidosService } from "./pedidos.service.js";

const pedidosService = new PedidosService(prisma);

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

export async function crearPedido(req: Request, res: Response): Promise<void> {
  const { usuarioId, productosComprados } = req.body ?? {};

  if (!esEnteroPositivo(usuarioId) || !Array.isArray(productosComprados) || productosComprados.length === 0) {
    res.status(400).json({
      error: {
        code: "DATOS_INCOMPLETOS",
        message: "usuarioId y productosComprados son obligatorios"
      }
    });
    return;
  }

  const productosValidos = productosComprados.every(
    (item) =>
      item &&
      typeof item === "object" &&
      esEnteroPositivo(item.productoId) &&
      esEnteroPositivo(item.cantidad)
  );

  if (!productosValidos) {
    res.status(400).json({
      error: {
        code: "PRODUCTOS_INVALIDOS",
        message: "Cada producto debe tener productoId y cantidad como enteros positivos"
      }
    });
    return;
  }

  try {
    const pedido = await pedidosService.checkout({
      usuarioId,
      productosComprados
    });

    res.status(201).json({ data: pedido });
  } catch (error) {
    if (error instanceof PedidoError) {
      res.status(error.status).json({
        error: {
          code: error.code,
          message: error.message
        }
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Ocurrió un error interno"
      }
    });
  }
}
