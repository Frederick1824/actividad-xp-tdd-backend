import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const archivoActual = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(archivoActual);
const rutaOpenApi = path.join(directorioActual, "openapi.yaml");

const contenido = fs.readFileSync(rutaOpenApi, "utf8");

export const openApiDocument = YAML.parse(contenido);
