Característica: Gestión de estudiantes
  Como usuario de la API
  Quiero gestionar estudiantes mediante HTTP
  Para consultar y mantener la información disponible

  Escenario: Consultar todos los estudiantes
    Cuando envío una solicitud GET a "/estudiantes"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe ser JSON

  Escenario: Consultar un estudiante existente
    Cuando envío una solicitud GET a "/estudiantes/1"
    Entonces el código de respuesta debe ser 200
    Y el estudiante devuelto debe tener id 1

  Escenario: Consultar un estudiante inexistente
    Cuando envío una solicitud GET a "/estudiantes/999"
    Entonces el código de respuesta debe ser 404

  Escenario: Crear un estudiante
    Cuando envío una solicitud POST a "/estudiantes" con nombre y correo válidos
    Entonces el código de respuesta debe ser 201
    Y la respuesta debe incluir el identificador creado

  Escenario: Modificar el correo
    Dado que existe el estudiante 1
    Cuando envío una solicitud PATCH a "/estudiantes/1" con un nuevo correo
    Entonces el código de respuesta debe ser 200
    Y solamente el correo debe quedar modificado

  Escenario: Eliminar un estudiante
    Dado que existe el estudiante 1
    Cuando envío una solicitud DELETE a "/estudiantes/1"
    Entonces el código de respuesta debe ser 204

  Escenario: Invocar una ruta desconocida
    Cuando envío una solicitud GET a una ruta inexistente
    Entonces el código de respuesta debe ser 404
