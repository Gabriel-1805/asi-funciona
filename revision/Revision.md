# Revisión

Sigue el patrón de las referencias: se renderiza, se mira cuadro por cuadro y se arregla lo que falla. Máximo 3 vueltas por video.

La puntuación y sus pruebas están en Reglas.md, sección 12 (10 criterios, 8 puntos mínimos para publicar). Esta lista es el procedimiento para medirla.

## A. Antes de renderizar (texto y datos)
- [ ] Cada dato tiene fuente anotada en investigacion/<id>.md (mínimo 3 fuentes por dato clave).
- [ ] Ninguna cifra ni plazo sin respaldo.
- [ ] Las frases de escenas.json suman las mismas palabras que la voz.
- [ ] El gancho cumple Reglas.md, sección 3.
- [ ] Ningún texto literal de otra cuenta.
- [ ] Cada frase del storyboard tiene un elemento visual (criterio 6).

## B. Técnica (la hace el script)
- [ ] build.mjs no avisa de duración fuera de 45–60 s.
- [ ] hyperframes lint: 0 errores.
- [ ] El log no dice «voz de RESPALDO» ni «Capa 3D desactivada» (salvo que sea intencional).

## C. Después del render: revisión de fotogramas
1. Descargar el MP4 desde Actions > Artifacts y subirlo al chat.
2. Extraer fotogramas: el primero, el 15, uno por segundo y uno en cada cambio de frase.
3. Medir los criterios 1, 2, 7, 8, 9 y 10 con las pruebas de la rúbrica.
4. Revisar además:
   - [ ] El subtítulo coincide con la voz (desfase menor a 0,15 s).
   - [ ] Nada importante en la franja inferior.
   - [ ] Sin saltos bruscos ni parpadeos entre escenas.
   - [ ] Contraste y legibilidad en pantalla pequeña.
   - [ ] Voz masculina y sin palabras cortadas.
5. Anotar los hallazgos y la puntuación en revision/registro/<id>.md.
6. Corregir y volver a renderizar.

## D. Antes de publicar
- [ ] Puntuación de 8 o más sobre 10.
- [ ] Revisión de marca y derechos aprobada.
- [ ] Música e imágenes con licencia libre y fuente anotada.
- [ ] Texto de publicación y portada listos.

## Formato del registro (revision/registro/<id>.md)
| Criterio | Medición | Punto (1 o 0) | Arreglo |
|---|---|---|---|

Al final: total sobre 10 y número de vuelta.
