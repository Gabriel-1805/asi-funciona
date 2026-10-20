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
- Segmentos de 2 a 4 palabras (máximo 6), aproximadamente uno por segundo.
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
- El video 01 usa Three.js en las seis escenas (versión anterior a estas reglas).
- Objetivo: pasar el video 01 y los siguientes a 2D según este documento.
