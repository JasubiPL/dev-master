# Arquitectura técnica

> Estado: **borrador v0.1**

## Stack

| Área | Elección | Motivo |
|---|---|---|
| Motor | **Godot 4** (última estable) | Gratis, todo el proyecto es texto (escenas `.tscn`, scripts `.gd`), buen 3D para estilo low-poly, exporta a Android |
| Lenguaje | **GDScript** con tipado estático | Nativo de Godot, sin compilación aparte |
| Renderer | **Mobile**; *Compatibility* como respaldo para Android de gama baja | Rendimiento en celular |
| Plataforma | **Android** (APK para pruebas, AAB si algún día va a Play Store) | Alcance v1 |
| Modelado | **Blender** vía MCP → exportación `.glb` | Claude modela y exporta los assets |
| Pruebas | **GUT** (Godot Unit Test) para la lógica | La economía se prueba sin abrir el juego |
| Guardado | JSON local en `user://save.json` | Sin servidor en v1 |

## Estructura del proyecto (propuesta)

```
dev-master/
├── project.godot
├── data/
│   └── balance.json          # Todos los números de la economía (ver docs/economy.md)
├── scripts/
│   ├── autoload/             # Singletons: GameState, SaveManager, Events
│   ├── economy/              # Lógica pura: cálculos, compras, tick (sin nodos 3D)
│   ├── characters/           # Avatar, empleados, animaciones procedurales
│   └── world/                # Mundos, pads de compra, cámara
├── scenes/
│   ├── main.tscn
│   ├── worlds/               # garage.tscn, coworking.tscn, ...
│   ├── characters/
│   ├── props/                # Escritorios, PCs, servidores, cafetera
│   └── ui/                   # HUD, pestañas, popups
├── assets/
│   ├── blender/              # Fuentes .blend
│   ├── models/               # .glb exportados
│   ├── textures/             # Atlas de paleta, caras
│   ├── fonts/
│   └── audio/
├── tests/                    # Pruebas GUT
├── tools/                    # Simulador de balance
└── docs/                     # GDD y specs
```

## Principios de arquitectura

1. **La lógica del juego está separada de lo visual.** `scripts/economy/` no conoce nodos 3D: recibe el estado y el tiempo transcurrido, y devuelve el nuevo estado más eventos (app lanzada, bug, etc.). Así se puede probar con GUT y simular el balance.
2. **Los datos del balance no están en el código.** Todos los números vienen de `data/balance.json`.
3. **Eventos en lugar de referencias cruzadas.** Un autoload `Events` emite señales (`app_launched`, `employee_distracted`, `money_changed`…) que la UI y el mundo escuchan.
4. **Un solo `GameState`** con todo lo que se guarda: dinero, tokens, niveles, empleados, apps lanzadas, progreso y marca de tiempo.

## Cámara y controles

- Cámara **ortográfica** fija en diagonal (estilo Sims). Arrastrar para mover; pellizcar para zoom con límites.
- **Tap** sobre objetos 3D mediante raycast: pads, empleados, bugs y avatar.
- Personajes que caminan con **NavigationAgent3D** para esquivar muebles.

## Guardado

- Autoguardado cada 10 s y al pasar el juego a segundo plano (`NOTIFICATION_APPLICATION_PAUSED`).
- El save tiene campo `version` para migraciones futuras.
- Al cargar: calcular el progreso offline (ver [economy.md](economy.md)).

## Verificación

- **Lógica:** pruebas GUT en modo headless (`godot --headless -s addons/gut/gut_cmdln.gd`).
- **Visual:** Claude graba frames del juego con `godot --write-movie` y los revisa como imágenes.
- **Dispositivo:** exportación a APK e instalación en un celular o emulador Android con `adb`.

## Herramientas necesarias

- [ ] Godot 4 (`brew install --cask godot`)
- [x] Blender
- [ ] Blender MCP conectado a Claude Code
- [x] Android Studio (SDK y emulador)
- [ ] Plantillas de exportación de Android en Godot (Editor → Manage Export Templates)
- [ ] JDK 17 (lo pide Godot para exportar a Android)
