# Rick Explorer

Explorador interactivo de personajes de **Rick and Morty** desarrollado para la Tarea 4. La aplicación consume datos reales desde [Rick and Morty API](https://rickandmortyapi.com/documentation) y permite buscar, filtrar y guardar personajes favoritos.

## Integrantes

- Joel Canche Chac
- Pendiente de completar con los demás integrantes

## Enlaces

- Repositorio: https://github.com/joelcanchechac2007-ai/Proyecto-web-ia
- Aplicación en GitHub Pages: Pendiente de activar

## Funciones principales

- Consulta de personajes mediante fetch().
- Tarjetas con imagen, nombre, estado, especie y origen.
- Buscador por nombre.
- Filtros por estado y especie.
- Ordenamiento alfabético.
- Favoritos guardados con localStorage.
- Mensajes para carga, errores y resultados vacíos.
- Diseño adaptable a celulares y computadoras.
- Modo claro y modo oscuro como funcionalidad extra.

## Estructura

- index.html: estructura y contenido de la interfaz.
- style.css: estilos visuales y diseño responsive.
- script.js: consulta a la API, filtros, favoritos y tema.
- README.md: documentación del proyecto.

## Uso

1. Abrir la aplicación publicada.
2. Esperar la carga de personajes desde la API.
3. Escribir un nombre en el buscador o seleccionar filtros.
4. Presionar la estrella de una tarjeta para agregar o quitar un favorito.
5. Cambiar el tema con el botón de la esquina superior derecha.

## Prompts utilizados durante el desarrollo

1. “Ayúdame a diseñar una aplicación web escolar que consuma la Rick and Morty API con HTML, CSS y JavaScript, incluyendo buscador, filtros y favoritos”.
2. “Explícame cómo guardar objetos de personajes en localStorage y cómo volver a mostrarlos al recargar la página”.
3. “Propón una funcionalidad extra que podamos explicar en clase e intégrala de forma sencilla; elegimos modo claro y oscuro”.

## Respuesta de IA que requirió correcciones

La primera propuesta usaba un filtro que consultaba la API en cada tecla. Se corrigió para descargar los personajes de la primera página una vez y aplicar los filtros en el navegador. Así se reducen solicitudes y el buscador responde más rápido.

## Error encontrado y solución

Si la API no responde, la aplicación podía quedarse mostrando solamente el mensaje de carga. Se agregó una validación de response.ok, un bloque try...catch y un mensaje visible para informar que la consulta falló.

## Modificación que podemos explicar

El modo oscuro se controla con el atributo data-theme del elemento html. JavaScript alterna entre light y dark, CSS cambia las variables de color y localStorage conserva la preferencia del usuario.

## Reflexión sobre el uso de IA

La inteligencia artificial ayudó a proponer la estructura, explicar funciones y detectar errores. Aun así, el equipo revisó el código, probó la aplicación y realizó cambios para comprender qué hace cada parte. La IA es una herramienta de apoyo, pero todos los integrantes deben poder explicar el uso de fetch(), los filtros, localStorage y GitHub Pages.

## Historial de colaboración

El historial del repositorio se construirá con commits pequeños y descriptivos. También se documentarán problemas mediante Issues y se incorporará una mejora usando Pull Request, como solicita la actividad.
