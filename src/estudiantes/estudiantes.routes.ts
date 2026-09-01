import { Router } from "express";
import {
  buscarPorId,
  cambiarCorreo,
  crear,
  eliminar,
  listar
} from "./estudiantes.controller.js";

export const estudiantesRouter = Router();

estudiantesRouter.get("/", listar);
estudiantesRouter.get("/:id", buscarPorId);
estudiantesRouter.post("/", crear);
estudiantesRouter.patch("/:id", cambiarCorreo);
estudiantesRouter.delete("/:id", eliminar);
