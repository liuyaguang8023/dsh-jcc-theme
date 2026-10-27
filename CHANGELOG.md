# Changelog

## 0.2.0 — 2026-10-27

- **Hextech augment draft**: three cards, three different accents, pick one. The pick
  applies its accent + texture immediately.
- **12-card local codex**: every accent × texture pair, stored in the same `dsh-jcc/v1`
  key. Owned cards are usable from the codex; locked cards are silhouettes.
- No currency, cooldown, daily reset, rarity roll or duplicate shards. Redraws are
  unlimited and every combination remains manually selectable in the panel, so the draft
  is a discovery shortcut rather than a gate.
- Two-click "clear collection" instead of a dialog; the appearance reset leaves the
  codex untouched.
- Card deal animation with reduced-motion fallback; overlay focus trap and Esc-to-close.


## 0.1.2 — 2026-10-18

- Fourth augment: **Astral Blue** (星界蓝), with its own light/dark token pair.
- **Ambience** layer: a slow aurora plus two drifting layers of gold dust behind the
  interface, toggled from the panel and stilled by `prefers-reduced-motion`.
- **Corner style**: Soft / Sharp. Sharp also tightens the product's own radius tokens, so
  cards, buttons and the panel all square off together.
- Hovered links pick up a soft accent glow.
- Panel controls for both new options; state stays in the same `dsh-jcc/v1` key.


## 0.1.1 — 2026-10-17

- Original backdrop: a hextech night arena with a golden spatula crest for dark mode, and a
  parchment chart with contours, a compass and the same crest for light mode. Both scenes are
  inline SVG data URIs — no extra request, no game assets.
- The generated scenes sit under the hex lattice and the two ambient lights; the canvas-layer
  handling is unchanged.
- Market copy and screenshots updated for the new backdrop.


## 0.1.0 — 2026-10-17

First release.

- Hextech Gold / Arcane Cyan / Fury Violet token palettes for light and dark schemes.
- Hex board lattice with three intensity levels (subtle / standard / vivid).
- Floating hex-core panel: master switch, accent and texture pickers, reset.
- Local-only state (`localStorage` key `dsh-jcc/v1`); no network, no host API, no files.
- Off state restores the stock UI without unloading the bundle.
