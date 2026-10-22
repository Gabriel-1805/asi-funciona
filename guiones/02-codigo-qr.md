# 02 · Cómo funciona el QR y por qué no son iguales entre sí

## Estado (coordinador)
- Etapa: parada 2. Guion y storyboard listos; falta la aprobación del usuario.
- Vuelta de corrección: 0 de 3.
- Puntuación medida hasta ahora: 3 de 10 (detalle en revision/registro/02-codigo-qr.md).
- Datos: investigacion/02-codigo-qr.md. Escenas: escenas/02-codigo-qr/escenas.json.

## Gancho
Elegido: «Todos los QR parecen iguales. Por dentro, casi nunca lo son.»
Cambio respecto a la idea inicial: se cambió «ninguno lo es» por «casi nunca», porque dos QR con el mismo contenido y los mismos ajustes sí pueden ser idénticos.
Alternativas: «Este cuadrado puede estar roto y aun así funciona.» y «Tres cuadrados. Un solo secreto.»

## Narración (127 palabras)
1. Todos los QR parecen iguales. Por dentro, casi nunca lo son.
2. Nacieron en 1994, en una empresa del grupo Toyota. Su inventor se inspiró en un tablero de Go.
3. Los QR estándar tienen tres cuadrados en las esquinas. Así el lector sabe dónde está el código y cómo girarlo.
4. Entonces, ¿qué los hace distintos? Tres cosas.
5. Primero, el tamaño: de 21 por 21 módulos hasta 177 por 177. La más grande guarda más de siete mil dígitos.
6. Segundo, la corrección de errores: cuatro niveles que recuperan hasta cerca del 30 por ciento de los datos. Más corrección, código más grande.
7. Tercero, la máscara: el generador prueba ocho patrones y elige el menos ambiguo.
8. Mismos cuadrados, distinto interior. ¿Cuál de estos datos no sabías? Cuéntamelo en los comentarios.

## Respaldo de datos (números de investigacion/02-codigo-qr.md)
- Escena 2: datos 1 y 3 (5 y 6 fuentes).
- Escena 3: dato 4 (5 fuentes). Se dice «estándar» porque el Micro QR tiene un solo cuadrado de posición.
- Escena 5: datos 8 y 9 (6 y 5 fuentes). Lo de las siete mil cifras vale para el modo numérico con la corrección más baja.
- Escena 6: datos 6, 7 y 13 (6, 2 y 4 fuentes). Se dice «hasta cerca del 30 por ciento de los datos» para no afirmar de más.
- Escena 7: dato 11 (5 fuentes).
- Se dejó fuera el modo de codificación (dato 10) para no pasar de 60 s. Está verificado por si se quiere volver a incluir.

## Ritmo esperado
127 palabras entre 2,4 y 2,6 por segundo dan entre 49 y 53 s de voz. Con 8 pausas de 0,45 s, el total queda entre 52 y 57 s. La velocidad real se ajusta con el parámetro rate cuando se oiga la voz de Jorge.

## Storyboard (director visual)
Un elemento por frase. Casi todo es una transformación continua: el dibujo anterior se convierte en el siguiente. Cortes duros previstos: 0.

| Frase | Texto | Elemento visual | Movimiento |
|---|---|---|---|
| 1 | Todos los QR | Tres QR de 21×21 en línea dorada, ya dibujados en el fotograma 0 | Zoom suave hacia adelante |
| 2 | parecen iguales. | Los tres QR laten a la vez (dibujo) | Pulso de brillo; destello amarillo en el segundo 1 |
| 3 | Por dentro, | Zoom al QR central; los módulos se ttiñen por zonas con etiquetas DATOS, CORRECCIÓN y FORMATO | Zoom y color |
| 4 | casi nunca | Los otros dos QR se ttiñen con patrones distintos | Paneo corto |
| 5 | lo son. | Ícono «≠» grande entre dos QR | Golpe de escala |
| 6 | Nacieron en 1994, | Contador grande que sube hasta 1994 | Contador |
| 7 | en una empresa | Ícono de engranaje y pieza de auto en línea dorada | Trazo que se dibuja |
| 8 | del grupo Toyota. | Etiqueta técnica DENSO · GRUPO TOYOTA con línea | Etiqueta |
| 9 | Su inventor | Silueta simple de un ingeniero con etiqueta MASAHIRO HARA | Dibujo y etiqueta |
| 10 | se inspiró en | Las líneas de un código de barras se convierten en una cuadrícula | Transformación |
| 11 | un tablero de Go. | Tablero de Go con fichas blancas y negras y etiqueta TABLERO DE GO | Zoom hacia atrás |
| 12 | Los QR estándar | El tablero se transforma en un QR grande, centrado | Transformación de fichas a módulos |
| 13 | tienen tres cuadrados | Tres cuadrados de esquina con anillos de brillo y números 1, 2 y 3 | Resalte |
| 14 | en las esquinas. | Etiqueta técnica CUADRADO DE POSICIÓN con línea | Etiqueta |
| 15 | Así el lector | Ícono de visor con una línea de escaneo | Barrido |
| 16 | sabe dónde está | Caja azul de selección con puntos en las esquinas | La caja se cierra sobre el QR |
| 17 | el código | La caja se ajusta al borde del QR con marca verde | Ajuste |
| 18 | y cómo girarlo. | El QR gira hasta quedar derecho, con flecha curva; tira de proporción 1:1:3:1:1 sobre un cuadrado | Rotación |
| 19 | Entonces, ¿qué | El QR se aleja | Zoom hacia atrás |
| 20 | los hace distintos? | Tres QR con un signo «?» que parpadea | Símbolo |
| 21 | Tres cosas. | Tres insignias numeradas 1, 2 y 3 en fila | Aparición con rebote |
| 22 | Primero, el tamaño: | Etiqueta VERSIÓN e insignia 1 resaltada | Etiqueta |
| 23 | de 21 por 21 | QR pequeño con contador 21 | Contador |
| 24 | módulos hasta | La cuadrícula crece y el contador sube | Crecimiento |
| 25 | 177 por 177. | QR denso enorme con contador 177 | Zoom |
| 26 | La más grande | Comparación: QR pequeño junto al enorme | Paneo |
| 27 | guarda más de | Contador que empieza a subir con etiqueta DÍGITOS | Contador |
| 28 | siete mil dígitos. | El contador se detiene en 7.089 con brillo | Golpe de escala |
| 29 | Segundo, la corrección | Insignia 2, etiqueta CORRECCIÓN y un QR al que se le borra un trozo | Desaparición |
| 30 | de errores: | El hueco se repara con líneas doradas; lupa con marca verde | Reparación |
| 31 | cuatro niveles | Cuatro QR en fila etiquetados L, M, Q y H | Aparición escalonada |
| 32 | que recuperan | Una barra de progreso vacía bajo cada QR | Barras |
| 33 | hasta cerca del | Las barras se llenan en orden: 7, 15 y 25 | Barras |
| 34 | 30 por ciento | Última barra llena y contador grande de 30 | Contador |
| 35 | de los datos. | Ícono de cuadrícula de datos con una parte iluminada | Resalte |
| 36 | Más corrección, | QR de nivel L y de nivel H juntos; el H más denso | Comparación |
| 37 | código más grande. | El QR H crece más que el L, con flecha de tamaño | Escala |
| 38 | Tercero, la máscara: | Insignia 3, etiqueta MÁSCARA y tablero de ajedrez sobre el QR | Superposición |
| 39 | el generador | Ícono de engranaje | Giro |
| 40 | prueba ocho patrones | Cuadrícula de 8 miniaturas (2×4) que se iluminan una a una | Miniaturas |
| 41 | y elige el | Lupa que recorre las miniaturas | Lupa |
| 42 | menos ambiguo. | Una miniatura con marca verde y las demás se atenuan | Marca de verificación |
| 43 | Mismos cuadrados, | Tres QR con los cuadrados de esquina brillando igual | Brillo |
| 44 | distinto interior. | Los interiores cambian de patrón y de color | Cambio de color |
| 45 | ¿Cuál de estos | Las tres insignias con íconos: tamaño, corrección y máscara | Aparición |
| 46 | datos no sabías? | Las insignias laten | Pulso |
| 47 | Cuéntamelo en | Ícono de burbuja de comentario | Aparición |
| 48 | los comentarios. | Logo así funciona en caja junto a la burbuja | Logo |

## Notas para el animador
- Motor 2D nuevo en SVG y GSAP, con subtítulos acumulativos (palabra actual en blanco y negrita, anteriores en gris). El primer fotograma ya tiene texto y dibujo.
- Usar un generador de QR real con versión fijada para que los dibujos sean QR verdaderos. Las 8 máscaras se calculan con las fórmulas publicadas (fuente S23 de la investigación).
- Contadores: 1994, de 21 a 177, 7.089, y 7, 15, 25 y 30.
- Colores: datos en azul, corrección en dorado, formato en turquesa.
- Riesgo: el motor es nuevo y no se ha renderizado nunca. La primera ejecución en Actions es la prueba real.

## Pendiente
- Aprobación del usuario del texto y del storyboard (parada 2).
- Ajustar el rate de la voz cuando se oiga a Jorge (criterio 3).
- Contrastar los números con la fuente oficial de Denso Wave antes de publicar.
