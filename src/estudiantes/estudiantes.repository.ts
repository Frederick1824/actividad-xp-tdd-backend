import type { Estudiante, NuevoEstudiante } from "./estudiante.js";

const datosIniciales: Estudiante[] = [
  { id: 1, nombre: "Ana", correo: "ana@universidad.edu" },
  { id: 2, nombre: "Juan", correo: "juan@universidad.edu" }
];

let estudiantes: Estudiante[] = datosIniciales.map((estudiante) => ({ ...estudiante }));

export function listarEstudiantes(): Estudiante[] {
  return estudiantes.map((estudiante) => ({ ...estudiante }));
}

export function buscarEstudiantePorId(id: number): Estudiante | undefined {
  const estudiante = estudiantes.find((item) => item.id === id);
  return estudiante ? { ...estudiante } : undefined;
}

export function crearEstudiante(datos: NuevoEstudiante): Estudiante {
  const siguienteId = estudiantes.length === 0
    ? 1
    : Math.max(...estudiantes.map((estudiante) => estudiante.id)) + 1;

  const nuevo: Estudiante = { id: siguienteId, ...datos };
  estudiantes.push(nuevo);
  return { ...nuevo };
}

export function actualizarCorreo(id: number, correo: string): Estudiante | undefined {
  const estudiante = estudiantes.find((item) => item.id === id);
  if (!estudiante) return undefined;

  estudiante.correo = correo;
  return { ...estudiante };
}

export function eliminarEstudiante(id: number): boolean {
  const indice = estudiantes.findIndex((item) => item.id === id);
  if (indice === -1) return false;

  estudiantes.splice(indice, 1);
  return true;
}

export function reiniciarEstudiantes(): void {
  estudiantes = datosIniciales.map((estudiante) => ({ ...estudiante }));
}
