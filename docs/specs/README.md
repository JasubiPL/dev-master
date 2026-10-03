# Specs

Cada sistema del juego tiene su spec **antes** de programarse (Spec-Driven Development).

## Flujo

1. **Borrador:** se escribe la spec a partir del [GDD](../gdd.md).
2. **Aprobada:** el dueño del proyecto la revisa y la aprueba.
3. **En progreso:** se implementa en su propia rama (`feat/<nombre>`).
4. **Hecha:** el código cumple los criterios de aceptación y tiene pruebas.

Si al implementar se descubre que la spec está mal, **se corrige la spec primero**.

## Índice

| # | Spec | Estado |
|---|---|---|
| 001 | Núcleo de economía (estado, tick, compras) | Pendiente |
| 002 | Escena del garaje y cámara | Pendiente |
| 003 | Avatar y empleo | Pendiente |
| 004 | Desarrollo y lanzamiento de apps | Pendiente |
| 005 | Empleados y distracciones | Pendiente |
| 006 | Pads de compra y mejoras | Pendiente |
| 007 | HUD y pestañas | Pendiente |
| 008 | Guardado y progreso offline | Pendiente |
| 009 | Mundos y mudanza | Pendiente |
| 010 | Bugs en producción | Pendiente |

## Plantilla

```markdown
# NNN — Nombre

> Estado: Borrador | Aprobada | En progreso | Hecha

## Objetivo
Qué problema resuelve y qué parte del GDD implementa.

## Comportamiento
Lista concreta de lo que pasa, desde el punto de vista del jugador.

## Reglas y datos
Fórmulas, valores (referencia a balance.json) y casos límite.

## Fuera de alcance
Lo que esta spec NO incluye.

## Criterios de aceptación
- [ ] Verificable 1
- [ ] Verificable 2
```
