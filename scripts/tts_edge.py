"""Genera voz con Edge TTS y guarda los tiempos por palabra.
Uso: python3 scripts/tts_edge.py "<texto>" <voz> <rate> <pitch> <salida.mp3> <salida.json>
"""
import asyncio
import json
import sys

import edge_tts


async def sintetizar(texto, voz, rate, pitch, salida_audio, salida_json):
    com = edge_tts.Communicate(texto, voz, rate=rate, pitch=pitch, boundary="WordBoundary")
    palabras = []
    with open(salida_audio, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                inicio = ch["offset"] / 1e7
                palabras.append({"texto": ch["text"], "inicio": inicio, "fin": inicio + ch["duration"] / 1e7})
    with open(salida_json, "w", encoding="utf-8") as f:
        json.dump(palabras, f, ensure_ascii=False)
    if not palabras:
        print("AVISO: Edge TTS no devolvió tiempos por palabra", file=sys.stderr)


def main():
    texto, voz, rate, pitch, salida_audio, salida_json = sys.argv[1:7]
    ultimo = None
    for intento in range(1, 4):
        try:
            asyncio.run(sintetizar(texto, voz, rate, pitch, salida_audio, salida_json))
            return
        except Exception as e:  # reintento simple ante fallos de red del servicio
            ultimo = e
            print(f"Intento {intento} falló: {e}", file=sys.stderr)
    raise SystemExit(f"Edge TTS falló tras 3 intentos: {ultimo}")


if __name__ == "__main__":
    main()
