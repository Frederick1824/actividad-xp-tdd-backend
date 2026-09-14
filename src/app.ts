import express from "express";
import { estudiantesRouter } from "./estudiantes/estudiantes.routes.js";
import { pedidosRouter } from "./pedidos/pedidos.routes.js";

export const app = express();

app.use(express.json());

app.get("/salud", (_req, res) => {
  res.status(200).json({
    estado: "ok",
    fecha: new Date().toISOString()
  });
});

app.get("/hora", (_req, res) => {
  res.status(200).json({
    hora: new Date().toISOString()
  });
});

app.use("/estudiantes", estudiantesRouter);
app.use("/api/pedidos", pedidosRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: "Recurso no encontrado"
  });
});
