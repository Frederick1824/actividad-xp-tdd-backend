import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

export function manejarSolicitud(
  solicitud: IncomingMessage,
  respuesta: ServerResponse
): void {
  respuesta.setHeader("Content-Type", "application/json; charset=utf-8");

  if (solicitud.method === "GET" && solicitud.url === "/salud") {
    respuesta.writeHead(200);
    respuesta.end(
      JSON.stringify({
        estado: "ok",
        fecha: new Date().toISOString()
      })
    );
    return;
  }

  if (solicitud.method === "GET" && solicitud.url === "/hora") {
    respuesta.writeHead(200);
    respuesta.end(
      JSON.stringify({
        hora: new Date().toISOString()
      })
    );
    return;
  }

  respuesta.writeHead(404);
  respuesta.end(
    JSON.stringify({
      error: "Recurso no encontrado"
    })
  );
}

export function crearServidor() {
  return createServer(manejarSolicitud);
}

if (process.env.NODE_ENV !== "test") {
  const puerto = Number(process.env.PORT ?? 3000);
  const servidor = crearServidor();

  servidor.listen(puerto, () => {
    console.log(`Servidor disponible en http://localhost:${puerto}`);
  });
}
