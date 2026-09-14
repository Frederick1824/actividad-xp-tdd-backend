import type { PrismaClient, Usuario } from "@prisma/client";

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
}

export class UsuariosRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listar(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      orderBy: { id: "asc" }
    });
  }

  buscarPorId(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id }
    });
  }

  crear(datos: CrearUsuarioDto): Promise<Usuario> {
    return this.prisma.usuario.create({
      data: datos
    });
  }
}
