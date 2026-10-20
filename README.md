# asi-funciona

Videos de motion graphics con IA sobre curiosidades del día a día.
Formato 9:16 (Reels), 45–60 s, tono educativo y divertido. Motor: [Hyperframes](https://github.com/heygen-com/hyperframes) (HTML → MP4).

## Estructura
- `kit-de-marca/` paleta, tipografía y plantillas reutilizables
- `escenas/` una carpeta por video
- `guiones/` texto narrado de cada video
- `render/` MP4 finales

## Flujo
1. Escribir el guion en `guiones/`.
2. Crear la carpeta del video en `escenas/` a partir de las plantillas.
3. Generar la voz y los subtítulos.
4. Render en la nube (GitHub Actions) y descargar el MP4 desde Actions > Artifacts.

## Marca
- Fondo: #0F1B2D · Acento: #FFB703 · Azul: #4B5BFF · Turquesa: #3DDBD9
- Tipografía: Montserrat ExtraBold (títulos) y Montserrat ExtraBold Italic (subtítulos)
- Destacados: brillo suave y sombra en el color de acento
