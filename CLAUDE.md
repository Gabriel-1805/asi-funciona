# Instrucciones para agentes: así funciona

## Proyecto
Videos de motion graphics con IA sobre curiosidades del día a día, para Instagram Reels.
Motor: Hyperframes (HTML → MP4). Render en la nube con GitHub Actions. Sin computadora local.

## Formato
- 9:16, 1080×1920, 30 fps
- Duración: 45 a 60 segundos
- Idioma: español. Tono educativo y divertido.

## Gancho (regla obligatoria)
- Los primeros 2 segundos deben frenar el scroll.
- Texto grande y directo en el primer fotograma. Sin logo ni fundido al inicio.
- Un destello o cambio de color en el segundo 1.
- La palabra clave del gancho aparece resaltada en los subtítulos desde el segundo 0.
- Evitar frases genéricas ("hola a todos", "hoy te cuento").
- El gancho también necesita fuente: no inventar cifras ni plazos (por ejemplo "3 segundos") sin respaldo.

## Tipografía y estilo
- Títulos y subtítulos: Montserrat ExtraBold. Palabras destacadas en Montserrat ExtraBold Italic.
- Palabras destacadas: brillo suave y sombra en color acento (#FFB703).
- Colores: fondo #0F1B2D, azul #4B5BFF, turquesa #3DDBD9, texto #FFFFFF.
- Marca: logo "así funciona" en su versión de caja (ver kit-de-marca/).
- Montserrat (subconjunto latino) no incluye emojis: no usarlos en el texto del video.

## Guiones y escenas
- La fuente de verdad de cada video es escenas/<id>/escenas.json: por escena, `visual`, `titulo` y `voz`.
- En `titulo` y `voz`, *palabra* marca una palabra resaltada con brillo.
- guiones/<id>.md documenta el guion y sus fuentes. Plantilla: guiones/_plantilla.md.
- Estructura: gancho (0-2 s), 3 o 4 datos, cierre con pregunta para comentarios.
- Cada dato debe tener una fuente verificable. Si no hay fuente, no se publica.

## Herramientas (solo gratuitas)
- Voz: `hyperframes tts` (Kokoro, local), voz ef_dora en español. Sin claves.
- Música e imágenes: pendiente. Solo licencias libres, con la fuente registrada en el guion.
- Claves de API solo en GitHub Secrets, nunca en archivos del repo.

## Cómo se genera un video
1. `node scripts/build.mjs escenas/<id>` crea build/<id>/ con index.html, audio por escena y fuentes.
   La duración de cada escena sale de la duración real del audio.
2. `hyperframes lint` y `hyperframes render` sobre build/<id>.
3. En GitHub: Actions > Renderizar video > Run workflow. El MP4 queda en Artifacts.

## Reglas técnicas de Hyperframes (verificadas)
- Versión fijada: hyperframes@0.8.181.
- Todo <audio> con data-start necesita un id; sin id el audio sale mudo en el render.
- La composición raíz usa data-composition-id="main" y registra su timeline en window.__timelines["main"].
- Node 22 y FFmpeg son requisitos.

## Revisión antes de render
- Gancho cumple la regla de 2 segundos.
- Duración entre 45 y 60 s (el script avisa si no).
- Todas las afirmaciones tienen fuente.
- Subtítulos legibles dentro del área segura (sin tapar la parte inferior de la pantalla de Reels).
