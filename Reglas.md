# Reglas de «así funciona»

Documento maestro. Si otro archivo lo contradice, manda este. Los agentes lo leen antes de cada tarea (ver agentes/README.md).

## 1. Qué hacemos
Reels de curiosidades del día a día: educativos y divertidos, con ilustración animada y voz narrada. Sin cámara y sin presentador.

## 2. Formato
- 9:16, 1080×1920, 30 fps.
- Duración: 45 a 60 s. La referencia más cercana dura 32 s: si un tema no da para 45 s, no se rellena; se avisa al usuario.
- Idioma: español neutro. Tono cercano y sin jerga.

## 3. Gancho (0–2 s)
- La primera frase es una afirmación contundente o una pregunta que crea curiosidad. Sin saludo, sin logo y sin fundido.
- El texto ya está en pantalla en el primer fotograma. Destello o cambio de color en el segundo 1.
- Fórmulas que usan las referencias: «Todo esto es X hecho por Y» (algo que no esperas) y «La pantalla nota X… pero si Y, ni se entera» (contraste que genera duda).
- Nunca cifras ni plazos sin fuente.

## 4. Gramática de los subtítulos
- Segmentos de 2 a 4 palabras (máximo 6), aproximadamente uno por segundo. Se permite una sola palabra, para dar énfasis, en hasta el 20 % de las frases.
- Una frase a la vez: la nueva reemplaza a la anterior.
- Dentro de un segmento, las palabras pueden aparecer una tras otra: la actual en blanco y negrita, las anteriores en gris.
- La palabra clave se destaca en amarillo, cursiva y con brillo (marca propia). La caja azul de selección de la referencia se puede usar en una palabra por escena.
- Posición: tercio superior. Nunca en la franja inferior (la tapa la interfaz de Reels).
- Los números importantes salen grandes, como elemento gráfico y no solo como texto.

## 5. Estructura y retórica
Orden observado en las referencias:
1. Gancho contundente.
2. Prueba o cifra que lo respalda.
3. Explicación en pasos cortos, una idea por paso.
4. Giro: pregunta retórica («¿Qué es lo que está notando de verdad?») o dos puntos que crean expectativa («No es la presión:»).
5. Cierre: tres negaciones seguidas («Sin X, sin Y y sin Z: solo…») o pregunta para comentarios.

Recursos: contraste «X… pero Y», pregunta retórica, tres elementos y dos puntos antes de la revelación.

## 6. Ritmo
- Voz de 2,2 a 2,6 palabras por segundo.
- Una pausa de 0,2 a 0,6 s al final de cada oración. Oraciones de 2 a 4,5 s.
- Pocos cortes: como máximo 2 o 3 cortes duros por video. El resto son transformaciones continuas (zoom, paneo, el dibujo cambia de forma).

## 7. Visual
- Base 2D: fondo oscuro, dibujo de línea con brillo (dorado y azul) y un elemento principal por idea.
- Recursos de las referencias: maquetas de interfaz (carpeta, terminal), etiquetas técnicas cortas en mayúsculas con una línea (CARGA, CABLES, CRISTAL), contadores que suben, insignia de reproducciones, íconos tachados en rojo y cuadrícula de miniaturas con lupa.
- Todo se dibuja con código (SVG, canvas, GSAP). Sin plantillas ni imágenes de stock, salvo licencia libre.
- Three.js solo para tomas con profundidad real (por ejemplo, un campo de objetos en perspectiva). No como base.

## 8. Voz y audio
- Voz principal: es-MX-JorgeNeural (Edge TTS), masculina, grave y cálida. Respaldo: Kokoro (ef_dora).
- Música: solo con licencia libre y con la fuente anotada. Volumen bajo; la voz manda.

## 9. Contenido
- Mínimo 3 fuentes por dato clave, con enlaces guardados en investigacion/<id>.md.
- Todo dato lleva fuente o no se publica. Sin cifras inventadas.

## 10. Originalidad y derechos
- De las referencias copiamos técnicas y estructura, nunca textos literales, logos, @ ni cifras de otras cuentas.
- Los videos de referencia no se suben al repo público. Aquí solo van los análisis.

## 11. Estado actual
- Desde ahora todos los videos nuevos usan el estilo 2D de estas reglas. El video 01 queda descartado como modelo.
- El motor actual (scripts/build.mjs y scripts/escena3d.js) es 3D y muestra una frase a la vez. El primer video nuevo incluye construir el motor 2D (SVG y GSAP, subtítulos acumulativos). Lo hace el animador y se valida con el render de prueba.

## 12. Rúbrica de calidad (v2)
Origen: la armó Claude a partir de las reglas del usuario y del análisis de las dos referencias (carpeta referencias/). No proviene de un estudio externo. El umbral de 8 lo eligió Claude y lo aprobó el usuario. Los valores numéricos son provisionales: se recalibran después del primer video con el estilo nuevo.

Puntuación: 1 punto por criterio cumplido y 0 si no. Para publicar hacen falta 8 de 10 como mínimo. Si no se llega, se corrige y se mide otra vez (máximo 3 vueltas). Si después de 3 vueltas sigue por debajo de 8, se avisa al usuario con la lista de fallos y él decide. El coordinador suma los puntos y los anota en revision/registro/<id>.md.

| # | Criterio | Prueba (sí/no o número) | Quién la aplica |
|---|---|---|---|
| 1 | Gancho en 2 s | En el fotograma 0 hay texto legible. Entre el fotograma 0 y el 15 cambian más del 2 % de los píxeles (hay movimiento). En el segundo 1 hay un destello o cambio de color. | Revisor técnico |
| 2 | Subtítulos cortos | Cada frase tiene de 2 a 4 palabras (una sola palabra solo en hasta el 20 % de las frases). Nunca hay dos frases visibles a la vez. | Revisor técnico |
| 3 | Ritmo | Palabras de la voz ÷ duración del audio de voz = entre 2,2 y 2,6. | Verificador |
| 4 | Duración | El MP4 final dura entre 45,0 y 60,0 s. | Verificador |
| 5 | Fuentes | Cada dato que dice la voz tiene al menos 3 fuentes con enlace y fecha en investigacion/<id>.md. | Verificador |
| 6 | Elemento visual por frase | En el storyboard, cada frase tiene un elemento asignado: contador, etiqueta técnica, ícono, maqueta de interfaz, cuadrícula o dibujo. Ninguna frase queda sin elemento. | Animador, al recibir el storyboard |
| 7 | Cortes | Con ffmpeg y el filtro de escena a 0,25 se detectan 3 cortes o menos. | Revisor técnico |
| 8 | Sin errores de texto | En los fotogramas (uno por segundo y uno por cambio de frase), ningún texto queda a menos de 60 px del borde, ni se solapa con otro texto o elemento, ni se corta. | Revisor técnico |
| 9 | Voz sin huecos | Con silencedetect a -32 dB y 0,8 s, no hay ningún silencio dentro de la narración (se ignoran los últimos 0,5 s). | Revisor técnico |
| 10 | Cierre | Las dos últimas frases tienen tres negaciones seguidas (sin X, sin Y y sin Z) o una pregunta que invita a comentar. | Revisor técnico |
