import type { Request, Response } from "express";
import { estudiantesService } from "./estudiantes.service.js";

function obtenerId(req: Request): number | undefined {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function listar(req: Request, res: Response): void {
  res.status(200).json(estudiantesService.listar());
}

export function buscarPorId(req: Request, res: Response): void {
  const id = obtenerId(req);
  if (!id) {
    res.status(400).json({ error: "Identificador inválido" });
    return;
  }

  const estudiante = estudiantesService.buscarPorId(id);
  if (!estudiante) {
    res.status(404).json({ error: "Estudiante no encontrado" });
    return;
  }

  res.status(200).json(estudiante);
}

export function crear(req: Request, res: Response): void {
  const { nombre, correo } = req.body ?? {};

  if (typeof nombre !== "string" || nombre.trim() === "") {
    res.status(400).json({ error: "El nombre es obligatorio" });
    return;
  }

  if (correo !== undefined && typeof correo !== "string") {
    res.status(400).json({ error: "El correo debe ser una cadena" });
    return;
  }

  const estudiante = estudiantesService.crear({
    nombre: nombre.trim(),
    ...(correo ? { correo } : {})
  });

  res.status(201).json(estudiante);
}

export function cambiarCorreo(req: Request, res: Response): void {
  const id = obtenerId(req);
  if (!id) {
    res.status(400).json({ error: "Identificador inválido" });
    return;
  }

  const { correo } = req.body ?? {};
  if (typeof correo !== "string" || correo.trim() === "") {
    res.status(400).json({ error: "El correo es obligatorio" });
    return;
  }

  const estudiante = estudiantesService.cambiarCorreo(id, correo.trim());
  if (!estudiante) {
    res.status(404).json({ error: "Estudiante no encontrado" });
    return;
  }

  res.status(200).json(estudiante);
}

export function eliminar(req: Request, res: Response): void {
  const id = obtenerId(req);
  if (!id) {
    res.status(400).json({ error: "Identificador inválido" });
    return;
  }

  if (!estudiantesService.eliminar(id)) {
    res.status(404).json({ error: "Estudiante no encontrado" });
    return;
  }

  res.status(204).send();
}
