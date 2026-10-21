# Investigación · 02 · Cómo funciona el QR y por qué no son iguales entre sí

Pedido del usuario: «cómo funciona el QR y por qué no son iguales entre sí».
Fecha de consulta: 21 de octubre de 2026. Estado: investigación y verificación hechas; falta que el usuario confirme los datos (parada 1).

## Datos verificados

Estados: Confirmado = 3 fuentes independientes o más. Parcial = menos de 3 o con conflicto. Los datos parciales no se usan en la voz salvo que se amplíe la verificación.

| # | Dato | Fuentes | Estado |
|---|---|---|---|
| 1 | QR significa Quick Response. Lo creó en 1994 Masahiro Hara en Denso (grupo Toyota, luego Denso Wave) para controlar piezas de automóviles | S1, S2, S3, S5, S12 | Confirmado |
| 2 | Antes se usaban más de 10 códigos de barras por caja y se escaneaba varias veces | S11, S12 | Parcial (2) |
| 3 | La idea le vino jugando al Go (tablero con fichas blancas y negras). Es el relato del propio Hara | S6, S7, S8, S9, S10, S11 | Confirmado |
| 4 | Los tres cuadrados de las esquinas tienen proporción 1:1:3:1:1 y sirven para ubicar y orientar el código desde cualquier ángulo | S6, S24, S25, S26, S27 | Confirmado |
| 5 | La proporción 1:1:3:1:1 se encontró tras 3 meses de pruebas con una base de datos de imágenes de periódicos | S6 | Parcial (1) |
| 6 | Corrección de errores Reed-Solomon con 4 niveles: L 7 %, M 15 %, Q 25 %, H 30 % | S4, S13, S14, S15, S16, S17 | Confirmado |
| 7 | Ese porcentaje se mide en palabras código (datos), no en superficie visible | S13, S18 | Parcial: S4 lo describe como área dañada. Conflicto de redacción; decir «hasta cerca del 30 % de los datos» |
| 8 | Hay 40 versiones: de 21×21 a 177×177 módulos, 4 módulos más por lado en cada versión (tamaño = 17 + 4 × versión) | S4, S19, S20, S21, S22, S26 | Confirmado |
| 9 | Capacidad máxima (versión 40, con la corrección más baja): 7.089 dígitos, 4.296 caracteres alfanuméricos o 2.953 bytes | S4, S8, S19, S20, S21 | Confirmado |
| 10 | Cuatro modos de codificación: numérico, alfanumérico, byte y kanji | S4, S20, S21, S22 | Confirmado |
| 11 | Hay 8 máscaras. El generador prueba las 8 y elige la que deja el código menos ambiguo: equilibra negros y blancos y evita patrones que parezcan los cuadrados de las esquinas | S23, S24, S25, S26, S27 | Confirmado |
| 12 | El nivel de corrección y la máscara se guardan en la información de formato, junto a los cuadrados | S4, S18, S24 | Confirmado |
| 13 | El mismo contenido con más corrección da un código más grande (idea general) | S13, S15, S16, S17 | Confirmado. El ejemplo numérico (25×25 con L y 29×29 con H) solo está en S16: Parcial |
| 14 | Denso Wave conserva la patente pero no ejerce sus derechos, por eso el uso es libre | S2, S3, S5, S7, S12 | Confirmado |
| 15 | Un logo en el centro funciona gracias a la corrección (nivel H), aunque Denso no lo recomienda | S13, S16, S18 | Confirmado, con ese matiz |

## Datos descartados (y por qué)
- Hara se habría inspirado en un edificio alto: solo S3 y S6, y S3 es secundaria. Parcial.
- Se lee cinco veces más rápido que un código de barras: solo S6.
- Guarda cientos de veces más datos que un código de barras: S9 dice 200 veces y otra fuente dice varios cientos. No coinciden.
- QR sobrevive a un 30 % de daño: incorrecto como lo cuenta la gente. Es hasta cerca del 30 % de los datos y solo en el nivel H (ver dato 7).
- Fechas de iOS 11 y Android 8 para el lector nativo: una sola fuente (S2).

## Fuentes consultadas (21 oct 2026)
No se pudo abrir el sitio oficial de Denso Wave ni la norma ISO/IEC 18004. Los datos técnicos vienen de documentación que reproduce la especificación (Keyence, socios de Denso, documentación de librerías) y de artículos y entrevistas. Antes de publicar, conviene contrastar los números con la fuente oficial si se logra acceder.

- S1 Wikipedia, Masahiro Hara: https://en.wikipedia.org/wiki/Masahiro_Hara
- S2 ANZ BlueNotes, historia de los QR: https://bluenotes.anz.com/posts/2021/10/history-qr-codes-digital-technology-business-government
- S3 LabTag, historia del QR: https://blog.labtag.com/the-history-of-the-qr-code/
- S4 Keyence, qué es un QR (reproduce la especificación de Denso Wave): https://www.keyence.com/ss/products/auto_id/barcode_lecture/basic_2d/qr/
- S5 Delivr, socio de Denso: https://delivr.com/faq/1323/what-is-a-qr-code
- S6 IEEE Spectrum, entrevista a Hara: https://spectrum.ieee.org/how-a-board-game-and-skyscrapers-inspired-the-development-of-the-qr-code
- S7 Universidad de Hosei, entrevista a Hara: https://www.en.hosei.ac.jp/LUC2HOSEI/cdata/luc2hosei_12907_jaen.html
- S8 BGR: https://www.bgr.com/2155648/qr-code-idea-came-from-popular-board-game/
- S9 BBC Witness History (vía Player FM): https://da.player.fm/series/series-2653698/how-the-qr-code-was-invented
- S10 Shaastra, IIT Madras: https://shaastramag.iitm.ac.in/time-machine/masahiro-hara-he-cracked-qr-code
- S11 Car Revs Daily (cita a nippon.com): https://www.car-revs-daily.com/?p=48905
- S12 Microsoft 365 Life Hacks: https://www.microsoft.com/en-us/microsoft-365-life-hacks/?p=5687
- S13 XenoSpectrum, corrección de errores: https://xenospectrum.com/en/qr-code-error-correction-reed-solomon/
- S14 Gigazine: https://www.gigazine.net/gsc_news/en/20250504-qr-code-error-correction
- S15 DevExpress, documentación: https://docs.devexpress.com/OfficeFileApiJava/com.devexpress.docs.barcode.QRCodeErrorCorrectionLevel
- S16 Deloitte QR, ayuda: https://qr.deloitte.com/help/en/article/qr-code-error-correction
- S17 Terence Eden (cita a Denso Wave): https://shkspr.mobi/blog/2010/10/qr-codes-and-error-correction/
- S18 Make Tech Easier: https://maketecheasier.com/?p=861503
- S19 DataFlex, documentación: https://docs.dataflex.dev/reports/explanations/barcode-types/qr-code/
- S20 Accusoft: https://help.accusoft.com/BarcodeXpress/v13.2/BxNet/QRcode.html
- S21 Documentación de jpgraph (UNAL): https://posgrados.unal.edu.co/formatos_un/libs/jpgraph/docs/chunkhtml/ch27.html
- S22 npm, librería qrcode: https://npmjs.com/package/qrcode
- S23 Swetake, cómo crear un QR: https://www.swetake.com/qrcode/qr5_en.html
- S24 Dan Hollick: https://typefully.com/DanHollick/qr-codes-T7tLlNi
- S25 Per Thirty Six: https://perthirtysix.com/how-the-heck-do-qr-codes-work
- S26 Qubittool: https://qubittool.com/en/blog/qrcode-complete-guide
- S27 pkg.go.dev, codificación QR: https://pkg.go.dev/github.com/os-gomod/qrcode/encoding

## Ángulo para el video
Lo que comparten todos los QR (tres cuadrados, patrón de reloj, información de formato) frente a lo que cambia: tamaño (versión), nivel de corrección, máscara, modo de codificación y, claro, el contenido.

## Ideas de gancho (3)
1. Todos los QR parecen iguales. Ninguno lo es.
2. Este cuadrado puede estar roto y aun así funciona.
3. Tres cuadrados. Un solo secreto.

## Ideas visuales (3)
1. Un QR que se dibuja módulo a módulo, con etiquetas técnicas cortas (CUADRADOS, RELOJ, FORMATO, DATOS, CORRECCIÓN).
2. El mismo enlace en cuatro QR con niveles L, M, Q y H que crecen, con un contador 7, 15, 25 y 30 %.
3. Un tablero de Go que se transforma en una cuadrícula de QR; un trozo del QR se rompe y se repara. Contador de tamaño: 21 hasta 177.

## Dudas pendientes
- Contrastar los números con la fuente oficial de Denso Wave (no se pudo abrir).
- Decidir si se usa el ejemplo de tamaño 25×25 frente a 29×29 (solo una fuente) o se cuenta la idea sin números.
- Decidir si el video menciona la historia (Go y Toyota) o se centra solo en cómo funciona.
