import { Router } from "express";
import { crearPedido } from "./pedidos.controller.js";

export const pedidosRouter = Router();

pedidosRouter.post("/", crearPedido);
