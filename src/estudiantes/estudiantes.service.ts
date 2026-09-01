import type { NuevoEstudiante } from "./estudiante.js";
import {
  actualizarCorreo,
  buscarEstudiantePorId,
  crearEstudiante,
  eliminarEstudiante,
  listarEstudiantes
} from "./estudiantes.repository.js";

export const estudiantesService = {
  listar: listarEstudiantes,
  buscarPorId: buscarEstudiantePorId,
  crear(datos: NuevoEstudiante) {
    return crearEstudiante(datos);
  },
  cambiarCorreo(id: number, correo: string) {
    return actualizarCorreo(id, correo);
  },
  eliminar: eliminarEstudiante
};
