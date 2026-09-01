export interface Estudiante {
  id: number;
  nombre: string;
  correo?: string;
}

export type NuevoEstudiante = Omit<Estudiante, "id">;
