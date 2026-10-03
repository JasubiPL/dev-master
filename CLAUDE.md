# Dev Master

3D tycoon game for Android: a developer turns their day-job salary into tokens to build apps and grow a startup from a garage to a Silicon Valley campus.

## Source of truth
- Design: `docs/gdd.md` · Economy numbers: `docs/economy.md` · Art: `docs/art-direction.md` · Tech: `docs/tech.md`
- Spec-Driven Development: every system gets a spec in `docs/specs/` (approved by the owner) before it is implemented. If implementation reveals the spec is wrong, update the spec first.

## Conventions
- Docs and in-game text: **Spanish (Mexico)**. Code identifiers, comments, file names, and everything git/GitHub: **English**.
- Currency: Mexican pesos (MXN). No monetization.
- Platform: Android only (portrait).
- Engine: Godot 4, statically typed GDScript. Game logic in `scripts/economy/` must not depend on scene nodes so it can be unit-tested (GUT) and simulated.
- Balance numbers live in `data/balance.json`, never hard-coded.
- 3D assets are modeled in Blender via MCP: sources in `assets/blender/`, exports as `.glb` in `assets/models/`. 1 unit = 1 meter, shared palette texture, low poly.
- Characters are blocky (rigid parts) and animated procedurally in code.
