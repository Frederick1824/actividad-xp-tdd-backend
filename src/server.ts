import { app } from "./app.js";

const puerto = Number(process.env.PORT ?? 3000);

app.listen(puerto, () => {
  console.log(`Servidor disponible en http://localhost:${puerto}`);
});
