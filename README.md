# Kinetix Flow

**Kinetix Flow** is a developer-first financial infrastructure and automated ledger reconciliation SaaS landing page. Built with a flat, architectural Swiss-grid aesthetic, it pairs interactive WebGL topology visualization with real-time theme switching and end-to-end user conversion flows.

---

## Core Capabilities

| Module | Description |
| :--- | :--- |
| **3D Ledger Topology (`three-scene.js`)** | Orthographic isometric WebGL cluster rendered on a transparent canvas with frosted glass blocks, precision wireframe edges, core settlement nodes, a traversing transaction packet, and pointer-driven parallax. |
| **Dual-Theme System (`styles.css`, `app.js`)** | Seamless Light Mode (sage-eucalyptus `#BAC8B1` → `#6C8480` backdrop with terracotta `#C84B11` accents) and Dark Mode (botanical obsidian `#0E1513` → `#1B2A26` with `#E86327` accents), persisted in `localStorage` and synchronized live with Three.js materials. |
| **Interactive API Workflow** | Three-step integration switcher (*Connect API Keys*, *Configure Routing Rules*, *Real-Time Settlement*) with syntax-highlighted TypeScript examples and one-click clipboard copy. |
| **Dynamic Pricing Engine** | Monthly / Annual (`-20%`) billing toggle that recalculates tier pricing in real time and pre-selects the chosen plan in the demo form below. |
| **Validated Demo Request Flow** | Hero email capture pre-fills the contact form, backed by strict client-side validation, inline error states, and an instant sandbox confirmation view without page reloads. |

---

## File Architecture

```text
Kinetix-Flow/
├── index.html        # Semantic HTML5 layout, typography imports, and section markup
├── styles.css        # CSS custom properties, light/dark surface tokens, and transitions
├── three-scene.js    # Isolated Three.js WebGL scene, resize handling, and render loop
├── app.js            # Theme controller, mobile drawer, workflow tabs, pricing, and validation
└── README.md         # Project overview and setup guide
```

---

## Design & Technical Stack

- **Markup & Styling:** HTML5, CSS3 Custom Properties, Tailwind CSS (CDN)
- **Interactivity & 3D Graphics:** Vanilla ES6 JavaScript, Three.js (`r128`)
- **Typography:** `Instrument Serif` (editorial headings), `IBM Plex Sans` (UI & body), `IBM Plex Mono` (`tabular-nums` for telemetry and code)
- **Visual System:** Zero drop-shadows (`box-shadow: none`), `1px` structural borders, `4px` / `6px` border radii, and responsive mobile-first grids (`390px` to `1440px+`)

---

## Running Locally

No build tools, package managers, or bundlers are required:

1. Download or clone the repository.
2. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari) or launch via a local static server.