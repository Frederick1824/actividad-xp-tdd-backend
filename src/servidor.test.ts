import { afterEach, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { crearServidor } from "./servidor.js";

let servidor: Server | undefined;

afterEach(async () => {
  if (!servidor) return;

  await new Promise<void>((resolve, reject) => {
    servidor?.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  servidor = undefined;
});

describe("GET /hora", () => {
  it("responde 200 y devuelve la hora actual en formato ISO", async () => {
    servidor = crearServidor();

    await new Promise<void>((resolve) => {
      servidor?.listen(0, "127.0.0.1", resolve);
    });

    const direccion = servidor.address() as AddressInfo;
    const respuesta = await fetch(
      `http://127.0.0.1:${direccion.port}/hora`
    );
    const cuerpo = (await respuesta.json()) as { hora?: string };

    expect(respuesta.status).toBe(200);
    expect(cuerpo.hora).toBeDefined();
    expect(Number.isNaN(Date.parse(cuerpo.hora ?? ""))).toBe(false);
  });
});
