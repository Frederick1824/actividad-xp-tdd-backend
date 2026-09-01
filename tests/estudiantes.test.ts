import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { reiniciarEstudiantes } from "../src/estudiantes/estudiantes.repository.js";

beforeEach(() => {
  reiniciarEstudiantes();
});

describe("API de estudiantes", () => {
  it("GET /estudiantes devuelve la lista", async () => {
    const respuesta = await request(app).get("/estudiantes");

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toContain("application/json");
    expect(respuesta.body).toHaveLength(2);
  });

  it("GET /estudiantes/:id devuelve un estudiante existente", async () => {
    const respuesta = await request(app).get("/estudiantes/1");

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({ id: 1, nombre: "Ana" });
  });

  it("GET /estudiantes/:id devuelve 404 si no existe", async () => {
    const respuesta = await request(app).get("/estudiantes/999");

    expect(respuesta.status).toBe(404);
  });

  it("POST /estudiantes crea un estudiante", async () => {
    const respuesta = await request(app)
      .post("/estudiantes")
      .send({ nombre: "Lucía", correo: "lucia@universidad.edu" });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      id: 3,
      nombre: "Lucía",
      correo: "lucia@universidad.edu"
    });
  });

  it("POST /estudiantes devuelve 400 sin nombre", async () => {
    const respuesta = await request(app)
      .post("/estudiantes")
      .send({ correo: "sin-nombre@universidad.edu" });

    expect(respuesta.status).toBe(400);
  });

  it("PATCH /estudiantes/:id modifica solamente el correo", async () => {
    const respuesta = await request(app)
      .patch("/estudiantes/1")
      .send({ correo: "ana.nuevo@universidad.edu", nombre: "No debe cambiar" });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.nombre).toBe("Ana");
    expect(respuesta.body.correo).toBe("ana.nuevo@universidad.edu");
  });

  it("DELETE /estudiantes/:id elimina un estudiante", async () => {
    const borrado = await request(app).delete("/estudiantes/1");
    expect(borrado.status).toBe(204);

    const consulta = await request(app).get("/estudiantes/1");
    expect(consulta.status).toBe(404);
  });

  it("una ruta desconocida devuelve 404", async () => {
    const respuesta = await request(app).get("/ruta-que-no-existe");
    expect(respuesta.status).toBe(404);
  });
});
