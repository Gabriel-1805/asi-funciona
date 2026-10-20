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
- La palabra clave del gancho aparece resaltada desde el segundo 0.
- Evitar frases genéricas ("hola a todos", "hoy te cuento").
- El gancho también necesita fuente: no inventar cifras ni plazos (por ejemplo "3 segundos") sin respaldo.

## Subtítulos (regla obligatoria)
- Poco texto y rápido: una frase de 1 a 3 palabras a la vez, en el centro superior.
- Cada frase reemplaza a la anterior (la nueva entra cuando la anterior sale).
- No hay títulos largos ni párrafos en pantalla. Como mucho, una etiqueta corta de una línea por escena.
- Las palabras clave van resaltadas con *asteriscos* en `frases` (amarillo, cursiva, brillo).
- Las frases deben sumar exactamente las mismas palabras que la narración (`voz`); el script avisa si no cuadran.

## Tipografía y estilo
- Montserrat ExtraBold para el texto y Montserrat ExtraBold Italic para los destacados.
- Brillo suave y sombra en color acento (#FFB703) en las palabras destacadas.
- Colores: fondo #0F1B2D, azul #4B5BFF, turquesa #3DDBD9, acento #FFB703, rosa #FF4D6D, texto #FFFFFF.
- Marca: logo "así funciona" en su versión de caja (ver kit-de-marca/).
- Montserrat (subconjunto latino) no incluye emojis: no usarlos en el texto del video.

## Movimiento 3D (Three.js)
- La capa 3D vive en scripts/escena3d.js: una escena de Three.js con un objeto principal por escena, cámara que gira y se acerca al entrar cada escena, halo luminoso y partículas.
- Se dibuja solo a partir del tiempo de Hyperframes (evento `hf-seek`). Prohibido usar `Date.now()`, `performance.now()` o bucles libres de animación.
- Versión fijada: three@0.181.2. No cambiarla sin probar el render completo.
- Si WebGL falla, la capa 3D se desactiva y el video sigue con el texto (el log muestra "Capa 3D desactivada").
- Cada escena de escenas.json tiene un `visual` (prueba, progreso, avion, marca, telefonos, cierre). Un visual nuevo necesita su función en escena3d.js.
- El render con WebGL por software es más lento: probar siempre con calidad `draft`.

## Guiones y escenas
- La fuente de verdad de cada video es escenas/<id>/escenas.json: por escena, `visual`, `etiqueta` (opcional), `voz` y `frases`.
- guiones/<id>.md documenta el guion y sus fuentes. Plantilla: guiones/_plantilla.md.
- Estructura: gancho (0-2 s), 3 o 4 datos, cierre con pregunta para comentarios.
- Cada dato debe tener una fuente verificable. Si no hay fuente, no se publica.

## Herramientas (solo gratuitas)
- Voz principal: Edge TTS con es-MX-JorgeNeural (masculina), con rate -3% y pitch -8Hz para que suene más grave y cálida. Sin claves. Script: scripts/tts_edge.py (da tiempos por palabra).
- Voz de respaldo: `hyperframes tts` (Kokoro, ef_dora, femenina). Solo entra si Edge TTS falla; el log avisa con "voz de RESPALDO".
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
- La composición raíz usa data-composition-id="main" y data-duration, y registra su timeline en window.__timelines["main"].
- Three.js: el adaptador no infiere la duración; por eso la raíz siempre lleva data-duration.
- Node 22 y FFmpeg son requisitos.

## Revisión antes de render
- Gancho cumple la regla de 2 segundos.
- Duración entre 45 y 60 s (el script avisa si no).
- Todas las afirmaciones tienen fuente.
- Subtítulos cortos, legibles y dentro del área segura (sin tapar la parte inferior de la pantalla de Reels).
