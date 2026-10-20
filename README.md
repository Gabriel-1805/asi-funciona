# asi-funciona

Videos de motion graphics con IA sobre curiosidades del día a día.
Formato 9:16 (Reels), 45–60 s, tono educativo y divertido. Motor: [Hyperframes](https://github.com/heygen-com/hyperframes) (HTML → MP4).

## Estructura
- `kit-de-marca/` paleta, tipografía y datos de marca
- `escenas/` una carpeta por video, con su `escenas.json`
- `guiones/` guion y fuentes de cada video
- `scripts/build.mjs` genera el proyecto de video (voz + composición)
- `workflow-pendiente/render.yml` workflow de render (mover a `.github/workflows/`, ver abajo)

## Flujo
1. Escribir el guion en `guiones/` y las escenas en `escenas/<id>/escenas.json`.
2. En GitHub: Actions > Renderizar video > Run workflow (elige la carpeta y la calidad; `draft` para probar).
3. Al terminar, abre la ejecución y descarga el MP4 desde Artifacts.
4. Subirlo a Reels.

## Activar el workflow
GitHub no permite que la integración escriba en `.github/workflows/`. Una sola vez:
abre `workflow-pendiente/render.yml`, toca el lápiz (editar), cambia el nombre del archivo a
`.github/workflows/render.yml` y confirma el cambio.

## Marca
- Fondo: #0F1B2D · Acento: #FFB703 · Azul: #4B5BFF · Turquesa: #3DDBD9
- Tipografía: Montserrat ExtraBold (títulos) y Montserrat ExtraBold Italic (destacados)
- Destacados: brillo suave y sombra en el color de acento
