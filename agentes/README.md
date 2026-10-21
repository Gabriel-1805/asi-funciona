# Agentes

Cada archivo describe un rol: qué lee, qué hace y qué entrega. Todos leen primero Reglas.md, marca/Marca.md y referencias/.

## Importante
Son instrucciones, no programas. En el chat de Claude los roles se hacen uno tras otro, no en paralelo. Para ejecutarlos solos habría que usar Claude Code; estos archivos ya llevan el formato para copiarlos a .claude/agents/.

## Equipos
- Coordinación: coordinador.
- Guion: investigador, verificador, guionista.
- Edición: director-visual, animador, revisor-tecnico, revisor-marca-derechos.

## Flujo
Pedido (tema) → investigador (investigacion/<id>.md) → verificador → guionista (guiones/<id>.md y escenas.json) → director visual (storyboard) → animador (código) → render → revisor técnico (fotogramas) → correcciones → revisor de marca y derechos → publicación.

## Cómo pedirlo en el chat
Escribe: Producción: <tema>. El coordinador ejecuta el flujo y se detiene en cada punto de parada.

## Puntos de parada para el usuario
1. Tras la investigación y la verificación: confirmar los datos.
2. Tras el guion y el storyboard: aprobar el texto y lo que se dibuja.
3. Tras el render: subir el MP4 para la revisión de fotogramas.
4. Antes de publicar.
