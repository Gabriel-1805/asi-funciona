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

## Tipografía y estilo
- Títulos y subtítulos: Montserrat ExtraBold. Subtítulos destacados en Montserrat ExtraBold Italic.
- Palabras destacadas: brillo suave y sombra en color acento (#FFB703).
- Colores: fondo #0F1B2D, azul #4B5BFF, turquesa #3DDBD9, texto #FFFFFF.
- Marca: logo "así funciona" en su versión de caja (ver kit-de-marca/).

## Guiones
- Usar guiones/_plantilla.md.
- Estructura: gancho (0-2 s), 3 o 4 datos, cierre con pregunta para comentarios.
- Cada dato debe tener una fuente verificable. Si no hay fuente, no se publica.

## Costos y herramientas
- Solo herramientas gratuitas. Voz: edge-tts (sin clave).
- Música e imágenes: solo licencias libres, con la fuente registrada en el guion.
- Claves de API solo en GitHub Secrets, nunca en archivos del repo.

## Revisión antes de render
- Gancho cumple la regla de 2 segundos.
- Duración entre 45 y 60 s.
- Todas las afirmaciones tienen fuente.
- Subtítulos legibles dentro del área segura (sin tapar la parte inferior de la pantalla de Reels).
