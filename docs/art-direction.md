# Dirección de arte

> Estado: **borrador v0.1** · Faltan los mockups y la paleta final.

## Estilo general

- **3D low-poly estilizado**, con sombreado suave y colores planos. Nada de texturas realistas.
- **Vista tipo Sims:** cámara **ortográfica** fija en diagonal (~45° horizontal, ~35° de inclinación) que mira un cuarto con las **dos paredes del lado de la cámara recortadas** (cutaway).
- **Personajes de bloques** inspirados en el estilo de Roblox: cabeza cúbica, torso, brazos y piernas como piezas sólidas. Es un diseño propio; no se usan assets ni marcas de Roblox.
- Ambiente **cálido y optimista**. Cada mundo tiene su propia luz y paleta.

## Personajes

| Pieza | Detalle |
|---|---|
| Cabeza | Cubo con esquinas redondeadas. Cara como textura simple (ojos, boca) que cambia según el estado: normal, dormido o feliz. |
| Torso | Bloque con color de camisa. El jugador usa sudadera con gorro; los empleados, colores aleatorios. |
| Brazos y piernas | Bloques independientes, animados **por código** (no se necesita rigging). |
| Accesorios | Audífonos, gorra o lentes, para distinguir empleados. |

**Animaciones (procedurales, desde el código)**
- Teclear: brazos alternando y cabeza con un pequeño rebote.
- Caminar: balanceo de piernas y brazos.
- Dormido: cabeza caída sobre el escritorio y "Z" flotando.
- Jugando con el celular: celular en las manos y cabeza inclinada.
- Despertar: salto de susto y signo "!".
- Celebración: brazos arriba, al lanzar una app.

## Mundos

| Mundo | Ambiente | Elementos clave |
|---|---|---|
| Garaje | Noche, luz cálida de foco colgante | Herramientas, caja de cartón, bici, póster, ventana pequeña |
| Coworking | Día, luz natural | Ladrillo, plantas, mesas compartidas, letrero de neón |
| Oficina | Tarde, luz blanca | Cubículos, pizarrón, máquina de snacks, ventanales |
| Torre Tech | Vista de ciudad de noche | Vidrio, piso alto, sala de juntas, ciudad iluminada al fondo |
| Campus Silicon Valley | Día soleado | Jardín, mesa de ping-pong, puffs, palmeras, logo gigante |

## Objetos comprables (aparecen en el cuarto)

- Escritorio del empleo (laptop) y PC de la startup (cambia de modelo con cada mejora: laptop, workstation, rig con luces RGB, cluster, computadora cuántica brillante).
- Escritorios de empleados (los pads se ven como silueta punteada brillante con el precio flotando).
- Racks de servidores con LEDs parpadeantes.
- Cafetera y barra de barista.

## Interfaz

- Botones **gordos y redondeados**, con sombra inferior sólida (sensación de "botón físico" de juego).
- **Verde** = comprar o confirmar · **Amarillo** = dinero · **Turquesa** = tokens · **Rojo** = alerta o bug.
- Números grandes y legibles con cifras de ancho fijo. Animaciones de "pop" al ganar o comprar.
- Tipografía: una display gruesa para títulos y números (candidatas: *Lilita One*, *Fredoka*) y una legible para textos.

## Pipeline de assets

- Modelado en **Blender vía MCP**. Fuentes en `assets/blender/*.blend`, exportadas a `assets/models/*.glb`.
- **Escala:** 1 unidad = 1 metro. Escritorio ≈ 1.2 × 0.6 × 0.75 m; personaje ≈ 1.1 m de alto (proporciones de juguete).
- **Materiales:** una **textura de paleta compartida** (atlas de colores) para casi todo. Pocos materiales = mejor rendimiento en Android.
- **Polígonos:** objetos pequeños < 500 tris; personajes < 1,000; cuarto completo < 30K.

## Pendiente
- [ ] Paleta de colores final por mundo.
- [ ] Mockups: pantalla principal, tienda de tokens, lista de apps y mudanza.
- [ ] Primer modelo de prueba: personaje de bloques y escritorio, para validar el pipeline Blender → Godot.
