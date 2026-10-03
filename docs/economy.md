# Economía y balance

> Estado: **borrador v0.1** · Valores iniciales, todavía **sin simular**.
> En el juego estos valores vivirán en `data/balance.json`, el mismo archivo que leerá el simulador de balance (`tools/`). Si cambias un número aquí, cámbialo también allá.

## Reglas base

- **Moneda:** pesos mexicanos. Se muestran como `$1,250` y, desde 10 mil, abreviados: `$12.5K`, `$3.2M`, `$1.1B`.
- **Precio del token:** $0.01 MXN, es decir **1K tokens = $10 MXN**.
- **Dinero inicial:** $500.
- **Regla de diseño:** cada app cuesta unas **5 veces** más tokens que la anterior, pero paga unas **3.5 veces** más. El jugador nunca puede depender solo de sus apps.
- **Ritmo objetivo:** primera app en ~1 minuto; cada app siguiente entre 2 y 6 minutos de juego activo; juego completo en ~1–2 horas activas (más el progreso offline).

## Empleo

| Nivel | Puesto | Sueldo ($/s) | Tokens regalo (/s) | Costo del ascenso |
|---|---|---|---|---|
| 0 | Dev Junior | 30 | 1K | — |
| 1 | Dev Semi-Senior | 90 | 3K | $3,500 |
| 2 | Dev Senior | 250 | 8K | $25,000 |
| 3 | Tech Lead | 700 | 22K | $180,000 |
| 4 | Staff Engineer | 2,000 | 60K | $1.3M |
| 5 | Principal Engineer | 6,000 | 180K | $10M |
| 6 | CTO | 18,000 | 550K | $80M |

## Apps

| # | App | Tipo | Tokens necesarios | Ingreso ($/s) | Mundo mínimo |
|---|---|---|---|---|---|
| 1 | Lista de Tareas | App | 200K | 20 | Garaje |
| 2 | Calculadora de Propinas | App | 1M | 70 | Garaje |
| 3 | Flappy Taco | Juego | 5M | 250 | Garaje |
| 4 | PetGram | App | 25M | 900 | Coworking |
| 5 | Antojo Express | App | 120M | 3,200 | Coworking |
| 6 | Battle Royale Móvil | Juego | 600M | 11,500 | Oficina |
| 7 | Super App | App | 3B | 42,000 | Oficina |
| 8 | Asistente IA | App | 15B | 150,000 | Torre Tech |
| 9 | StreamFlix | App | 75B | 550,000 | Torre Tech |
| 10 | Metaverso | Juego | 400B | 2.2M | Campus |

Tokens reales consumidos = tokens necesarios × multiplicador del modelo de IA.

## Mundos

| Mundo | Escritorios | Costo de mudanza | Requiere haber lanzado |
|---|---|---|---|
| Garaje | 1 | — | — |
| Coworking | 3 | $60,000 | Flappy Taco |
| Oficina | 5 | $2M | Antojo Express |
| Torre Tech | 7 | $50M | Super App |
| Campus Silicon Valley | 9 | $1.2B | StreamFlix |

## PC de la startup (velocidad de desarrollo)

| Nivel | PC | Velocidad (tokens/s) | Costo | Mundo mínimo |
|---|---|---|---|---|
| 0 | Laptop vieja | 10K | — | Garaje |
| 1 | Laptop gamer | 35K | $4,000 | Garaje |
| 2 | PC Workstation | 120K | $40,000 | Garaje |
| 3 | Rig multi-GPU | 400K | $400,000 | Coworking |
| 4 | Servidor GPU | 1.3M | $4M | Oficina |
| 5 | Cluster de GPUs | 4.5M | $40M | Oficina |
| 6 | Supercomputadora | 15M | $400M | Torre Tech |
| 7 | Computadora cuántica | 50M | $4B | Campus |

## Modelo de IA (eficiencia)

| Nivel | Modelo | Multiplicador de tokens | Costo | Mundo mínimo |
|---|---|---|---|---|
| 0 | IA Básica | ×1.00 | — | Garaje |
| 1 | IA Plus | ×0.85 | $15,000 | Garaje |
| 2 | IA Pro | ×0.70 | $600,000 | Coworking |
| 3 | IA Ultra | ×0.55 | $20M | Oficina |
| 4 | IA AGI | ×0.45 | $600M | Torre Tech |

## Servidores

Cada rack multiplica el ingreso de **todas** las apps: `×(1 + 0.5 × racks)`.

| Rack | Costo | Mundo mínimo |
|---|---|---|
| 1 | $50,000 | Coworking |
| 2 | $300,000 | Coworking |
| 3 | $2M | Oficina |
| 4 | $15M | Oficina |
| 5 | $120M | Torre Tech |
| 6 | $1B | Campus |

## Empleados

Para el empleado número `i` (empezando en 0):

- **Velocidad:** `12K × 2.4^i` tokens/s
- **Costo de contratación:** `$2,500 × 4^i`

| # | Velocidad | Costo |
|---|---|---|
| 1 | 12K/s | $2,500 |
| 2 | 29K/s | $10,000 |
| 3 | 69K/s | $40,000 |
| 4 | 166K/s | $160,000 |
| 5 | 398K/s | $640,000 |
| 6 | 956K/s | $2.6M |
| 7 | 2.3M/s | $10M |
| 8 | 5.5M/s | $41M |
| 9 | 13.2M/s | $164M |

## Distracciones

Cada empleado trabajando tiene una probabilidad por segundo de distraerse (50% dormido, 50% jugando):

| Nivel | Mejora | Probabilidad por segundo | Costo |
|---|---|---|---|
| 0 | Sin café | 1/40 | — |
| 1 | Cafetera | 1/80 | $8,000 |
| 2 | Barista | 1/160 | $1.5M |

Un empleado distraído se queda así **hasta que el jugador lo despierta**.

## Otros

| Concepto | Valor |
|---|---|
| Auto-compra de tokens | $30,000 (pago único) |
| Bug en producción | Cada 60–120 s, ingreso de apps ×0.5 hasta aplastarlo |
| Tap al avatar | Bono instantáneo = 1 segundo de sueldo |
| Modo crunch | Velocidad de la PC ×3 (no afecta a empleados); sin sueldo ni tokens de regalo mientras dure |
| Progreso offline | Ingreso de apps × 50%, tope 2 h |

## Fórmulas

```
ingreso_apps/s      = Σ ingreso(apps lanzadas) × (1 + 0.5 × racks) × (bug ? 0.5 : 1)
ingreso_total/s     = ingreso_apps + (avatar_sentado ? sueldo : 0)
velocidad_dev       = velocidad_pc × (crunch ? 3 : 1) + Σ velocidad(empleados trabajando)
tokens_app_actual   = tokens_base × multiplicador_ia
```

## Pendiente
- [ ] Escribir el simulador de balance (`tools/`) y ajustar los números con él.
- [ ] Validar el ritmo objetivo (primera app en ~1 min, juego completo en 1–2 h).
