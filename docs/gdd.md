# Dev Master — Game Design Document

> Estado: **borrador v0.2** · Última actualización: 2026-10-02
> Este documento es la fuente de verdad del diseño. Si el código y el GDD no coinciden, se corrige uno de los dos a propósito, nunca por accidente.

## 1. Visión

**Dev Master** es un tycoon 3D para Android donde eres un desarrollador con empleo que, poco a poco, convierte su sueldo en una startup. Empiezas en el garaje de tu casa y terminas con un campus en Silicon Valley.

**Frase del juego:** "Trabaja de día, construye tu startup con tokens y nunca dejes de crecer."

**Referentes**
- *[UPD] ¡Carga el camión! (Delivery Trucks)* en Roblox: construyes tu negocio pieza por pieza, contratas gente y desbloqueas zonas.
- *Los Sims*: vista de cuarto en 3D con cámara en diagonal y paredes recortadas.
- Juegos idle o tycoon en general: progreso que sigue aunque no toques nada.

**Plataforma:** solo Android (por ahora), orientación vertical.
**Moneda:** pesos mexicanos (MXN).
**Monetización:** ninguna. Es un proyecto de prueba y aprendizaje.

## 2. Pilares de diseño

1. **Ver a tu muñeco trabajar solo es satisfactorio.** El personaje siempre está haciendo algo visible (teclear, caminar, despertar gente) sin que el jugador lo controle directamente.
2. **Siempre hay una siguiente meta a la vista.** En pantalla se ve siempre cuánto falta para la próxima app, mejora o mundo.
3. **La siguiente app siempre cuesta más de lo que te paga la actual.** Esa tensión te obliga a combinar el empleo, los ingresos de tus apps y las mejoras.
4. **Construyes tu espacio.** Cada compra aparece físicamente en el cuarto. El progreso se *ve*, no solo se lee en números.

## 3. Ciclo principal (core loop)

```
Empleo ──► dinero ($ MXN) + tokens de regalo
   │
   ▼
Compras tokens con dinero ──► La PC de tu startup gasta tokens y avanza la app
   │
   ▼
Lanzas la app ──► ingreso pasivo para siempre
   │
   ▼
Mejoras (PC, IA, servidores, empleados) ──► te mudas de mundo ──► apps más grandes
```

**Ciclo de sesión (1–5 minutos):** abres el juego, cobras lo ganado offline, despiertas empleados, compras tokens y mejoras, ves avanzar la app y cierras.

**Ciclo largo (días):** lanzar las 10 apps, mudarte por los 5 mundos y salir a bolsa.

## 4. Recursos

| Recurso | Cómo se obtiene | En qué se gasta |
|---|---|---|
| **Dinero ($ MXN)** | Sueldo del empleo, ingresos de apps, ganancias offline | Tokens, mejoras, empleados, mudanzas |
| **Tokens** | Se compran con dinero; el empleo regala algunos por segundo | Desarrollar apps (los consume la PC de la startup) |

Los tokens se cuentan en miles y millones (como los tokens reales de IA). Los números exactos están en [economy.md](economy.md).

## 5. Sistemas

### 5.1 Empleo
- El avatar del jugador trabaja **automáticamente** en su escritorio del empleo: teclea, le salen "+$30" y "+1K tokens" flotando.
- **Solo cobra mientras está sentado.** Si se levanta (a despertar a alguien, a matar un bug o a hacer crunch), deja de ganar.
- **Ascensos:** Junior → Semi-Senior → Senior → Tech Lead → Staff → Principal → CTO. Cada uno cuesta dinero y sube el sueldo y los tokens de regalo.
- **Tap al avatar:** da un pequeño bono instantáneo, con efecto visual y sonido.

### 5.2 Desarrollo de apps
- Hay una sola app en desarrollo a la vez y se construyen **en orden**.
- La **PC de la startup** consume tokens del inventario a cierta velocidad (tokens/s) y la app avanza. Su pantalla muestra código y una barra de progreso.
- **Modo crunch:** si tocas la PC de la startup, el avatar camina hasta ella y se pone a programar. Mientras está ahí, la velocidad de la PC se **triplica**, pero **no cobra sueldo ni recibe tokens de regalo**. Para terminar el crunch, tocas el escritorio del empleo y el avatar regresa. Es opcional: sirve para acelerar el final de una app cuando ya tienes los tokens.
- Si te quedas sin tokens, el desarrollo se pausa. Una alerta visual en la PC te avisa.
- Al terminar: **lanzamiento** con confeti, notificación y el ingreso pasivo empieza.
- Algunas apps necesitan estar en cierto mundo para empezar a desarrollarse.

**Lista de apps (v1):** Lista de Tareas, Calculadora de Propinas, Flappy Taco, PetGram, Antojo Express, Battle Royale Móvil, Super App, Asistente IA, StreamFlix y Metaverso.

### 5.3 Empleados
- Se contratan tocando un **pad de compra** (escritorio vacío con precio) en el cuarto.
- Cada empleado suma velocidad de desarrollo (tokens/s).
- **Distracciones:** de vez en cuando un empleado **se duerme** (💤) o **se pone a jugar con el celular** (🎮). Mientras está distraído no aporta nada.
- **Despertarlos:** el jugador toca al empleado y el avatar **se levanta, camina hasta él**, lo despierta con una animación y regresa a su escritorio. Esta es la mecánica de "atención" principal.
- La cafetera reduce la frecuencia de distracciones.

### 5.4 Mejoras

| Mejora | Efecto |
|---|---|
| Ascenso en el empleo | Más sueldo y más tokens de regalo |
| PC de la startup | Más tokens/s de desarrollo |
| Modelo de IA | Las apps cuestan menos tokens |
| Servidores | Multiplican el ingreso de todas las apps |
| Cafetera / Barista | Menos distracciones de los empleados |
| Auto-compra de tokens | Compra automáticamente los tokens que faltan para la app actual |

Las mejoras que tienen objeto físico (PC, servidores, cafetera, escritorios) **aparecen en el cuarto** al comprarse.

### 5.5 Mundos

| # | Mundo | Escritorios para empleados | Requisito |
|---|---|---|---|
| 1 | Garaje | 1 | — |
| 2 | Coworking | 3 | Lanzar Flappy Taco + pagar mudanza |
| 3 | Oficina | 5 | Lanzar Antojo Express + pagar mudanza |
| 4 | Torre Tech | 7 | Lanzar Super App + pagar mudanza |
| 5 | Campus Silicon Valley | 9 | Lanzar StreamFlix + pagar mudanza |

Al mudarte conservas apps, empleados y mejoras. Solo cambia el escenario y se abren más espacios.

### 5.6 Eventos
- **Bug en producción:** aparece cada 1–2 minutos si tienes apps lanzadas. Un insecto rojo sale en la PC o en los servidores y el ingreso de apps baja **50%** hasta que lo tocas. El avatar camina y lo aplasta.
- *(Ideas para después: inversionista ángel, app viral ×2 temporal, caída de servidores.)*

### 5.7 Progreso offline
- Al volver, cobras el ingreso de apps del tiempo fuera al **50%**, con tope de **2 horas**.
- El empleo **no** paga offline: tu avatar no está trabajando.

### 5.8 Final del juego
- Lanzar el **Metaverso** = tu startup **sale a bolsa (IPO)**. Pantalla de victoria con estadísticas y opción de seguir jugando.

## 6. Interfaz (alto nivel)

- **Arriba (HUD):** dinero, tokens, ingreso por segundo y nombre del mundo.
- **Centro:** el cuarto en 3D. Se toca directamente para comprar pads, despertar empleados, aplastar bugs y dar tap al avatar.
- **Barra de meta:** la app en desarrollo, su progreso y lo que falta.
- **Abajo:** pestañas **Tokens · Apps · Mejoras · Mundos**.

Detalle visual en [art-direction.md](art-direction.md).

## 7. Decisiones

### Tomadas (2026-10-02)

| # | Pregunta | Decisión |
|---|---|---|
| D1 | ¿Quién construye la app? | La PC sola, más el **modo crunch** opcional (ver 5.2). |
| D2 | ¿Las apps se degradan con el tiempo? | No. Ingreso permanente. |
| D3 | ¿Rebirth (vender la startup y reiniciar con bonus)? | Después de v1. En v1 el juego termina con la IPO. |
| D4 | ¿Los empleados tienen sueldo? | No. Solo se paga al contratarlos. |

### Abiertas

| # | Pregunta | Propuesta actual |
|---|---|---|
| D5 | ¿Sonido y música? | Efectos simples en v1; música después. |

## 8. Fuera de alcance (v1)
- iOS, multijugador, cuentas o guardado en la nube, monetización, rebirth y personalización del avatar.

## 9. Glosario
- **Pad de compra:** marca en el piso, con precio, de algo que todavía no compras. Al tocarlo aparece el objeto.
- **Tokens:** la "energía" que la IA consume para programar apps.
- **Mundo:** la oficina o lugar donde está tu startup.
