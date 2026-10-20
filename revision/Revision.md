# Revisión

Sigue el patrón de las referencias: se renderiza, se mira cuadro por cuadro y se arregla lo que falla. Máximo 3 vueltas por video.

## A. Antes de renderizar (texto y datos)
- [ ] Cada dato tiene fuente anotada en investigacion/<id>.md (mínimo 3 fuentes por dato clave).
- [ ] Ninguna cifra ni plazo sin respaldo.
- [ ] Las frases de escenas.json suman las mismas palabras que la voz.
- [ ] El gancho cumple Reglas.md, sección 3.
- [ ] Ningún texto literal de otra cuenta.

## B. Técnica (la hace el script)
- [ ] build.mjs no avisa de duración fuera de 45–60 s.
- [ ] hyperframes lint: 0 errores.
- [ ] El log no dice «voz de RESPALDO» ni «Capa 3D desactivada» (salvo que sea intencional).

## C. Después del render: revisión de fotogramas
1. Descargar el MP4 desde Actions > Artifacts y subirlo al chat.
2. Extraer fotogramas: el primero, uno por segundo y uno en cada cambio de frase.
3. Revisar:
   - [ ] Fotograma 0: ya hay texto y elemento visual (gancho).
   - [ ] Texto dentro de márgenes, sin cortes ni solapes.
   - [ ] El subtítulo coincide con la voz (desfase menor a 0,15 s).
   - [ ] Una sola frase visible a la vez.
   - [ ] Nada importante en la franja inferior.
   - [ ] Sin saltos bruscos ni parpadeos entre escenas.
   - [ ] Contraste y legibilidad en pantalla pequeña.
   - [ ] Voz masculina, sin silencios mayores de 0,8 s y sin palabras cortadas.
   - [ ] Duración total entre 45 y 60 s.
4. Anotar los hallazgos en revision/registro/<id>.md.
5. Corregir y volver a renderizar.

## D. Antes de publicar
- [ ] Revisión de marca y derechos aprobada.
- [ ] Música e imágenes con licencia libre y fuente anotada.
- [ ] Texto de publicación y portada listos.

## Formato del registro
| Tiempo | Problema | Arreglo | Estado |
|---|---|---|---|
