# Instrucciones para agentes: así funciona

Lee primero, en este orden: Reglas.md (maestro, incluye la rúbrica de calidad), marca/Marca.md, revision/Revision.md, referencias/ y agentes/README.md. Si algo de este archivo choca con Reglas.md, manda Reglas.md.

## Proyecto
Videos de motion graphics con IA sobre curiosidades del día a día, para Instagram Reels.
Motor: Hyperframes (HTML → MP4). Render en la nube con GitHub Actions. Sin computadora local.

## Resumen de reglas (el detalle está en Reglas.md)
- 9:16, 1080×1920, 30 fps, de 45 a 60 s, en español.
- Gancho en los primeros 2 segundos, con texto desde el primer fotograma y destello en el segundo 1.
- Subtítulos: frases de 2 a 4 palabras, una a la vez, palabra clave en amarillo cursiva con brillo, tercio superior.
- Cada dato con fuente. Sin cifras inventadas. No copiar textos, logos, @ ni cifras de otras cuentas.
- Para publicar, el video necesita 8 de 10 en la rúbrica de Reglas.md (sección 12). Solo se da un punto si el criterio se midió.
- Montserrat ExtraBold y Montserrat ExtraBold Italic. Colores de marca/Marca.md.
- Sin emojis en el texto del video (Montserrat latino no los incluye).

## Motor visual
- Desde ahora todos los videos nuevos son 2D (SVG y GSAP). El video 01 queda descartado como modelo.
- Los scripts actuales (scripts/build.mjs y scripts/escena3d.js) son 3D y muestran una frase a la vez. El primer video nuevo incluye construir el motor 2D con subtítulos acumulativos; lo hace el animador.
- Three.js queda solo para tomas con profundidad real. Si se usa: se dibuja a partir del tiempo de Hyperframes (evento hf-seek); prohibido Date.now, performance.now y bucles libres; versión fijada three@0.181.2.
- Si WebGL falla, la capa 3D se desactiva y el video sigue con el texto (el log muestra Capa 3D desactivada).
- El render con WebGL por software es lento: probar siempre con calidad draft.

## Guiones y escenas
- La fuente de verdad de cada video es escenas/<id>/escenas.json: por escena, visual, etiqueta (opcional), voz y frases.
- En frases, *palabra* marca una palabra destacada. Las frases deben sumar las mismas palabras que la voz.
- guiones/<id>.md documenta el guion, el storyboard y las fuentes. investigacion/<id>.md guarda los datos y enlaces.

## Herramientas (solo gratuitas)
- Voz principal: Edge TTS con es-MX-JorgeNeural (scripts/tts_edge.py), rate -3% y pitch -8Hz.
- Voz de respaldo: hyperframes tts (Kokoro, ef_dora). El log avisa con voz de RESPALDO.
- Música e imágenes: solo licencias libres, con la fuente anotada. Claves de API solo en GitHub Secrets.

## Cómo se genera un video
1. node scripts/build.mjs escenas/<id> crea build/<id>/ con index.html, audio por escena y fuentes. La duración de cada escena sale del audio real.
2. hyperframes lint y hyperframes render sobre build/<id>.
3. En GitHub: Actions > Renderizar video > Run workflow. El MP4 queda en Artifacts.
4. Revisión y puntuación: revision/Revision.md y Reglas.md, sección 12.

## Reglas técnicas de Hyperframes (verificadas)
- Versión fijada: hyperframes@0.8.181. Node 22 y FFmpeg son requisitos.
- Todo audio con data-start necesita un id; sin id sale mudo en el render.
- La composición raíz usa data-composition-id con el valor main y data-duration, y registra su timeline GSAP en window.__timelines con la clave main.
- El adaptador de Three.js no infiere la duración; por eso la raíz siempre lleva data-duration.
- El workflow vive en .github/workflows/render.yml. La integración de Claude no puede escribir en esa carpeta (error 403): los cambios al workflow los hace el usuario.
