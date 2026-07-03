# D4 Loot Filter Builder

A client-side web application that generates Diablo IV loot filter import strings — a Base64-encoded Protocol Buffer payload the game client accepts natively.

The core idea is an inheritance-based logic engine: users define global stat-weight baselines that cascade to every gear slot, with the ability to override individual slots. A client-side compiler then flattens and compresses this into the flat, top-to-bottom, 25-rule-max structure the D4 client enforces, before serializing it with protobuf.js.

**Status:** UX/architecture design spike (issue #1) is closed. Implementation is underway — see the [GitHub Project board](https://github.com/users/ThatRasputin/projects/3) and the 6 epics tracking remaining work.

## Stack

React + TypeScript + Vite, tested with Vitest + React Testing Library. `src/core/` holds the rule/condition/inheritance engine as plain data and pure functions with zero UI imports, so it can be extracted as a standalone npm package later without a rewrite. There is no backend — this is a fully client-side app; the final compiler step serializes state to a Base64 protobuf string entirely in the browser.

## Development

Requires Node.js 22+. Any Linux environment works (this project has no OS-specific dependencies); on Windows, WSL2 is recommended:

```bash
wsl --install -d Ubuntu   # one-time, from Windows PowerShell, if WSL isn't already set up
```

Then, inside the Linux shell:

```bash
bash scripts/setup-wsl.sh   # installs nvm + Node LTS, then npm install
npm run dev                 # Vite dev server — reachable from Windows at localhost:5173
```

### Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck + production build
- `npm run test` / `npm run test:run` — Vitest (watch / single run)
- `npm run coverage` — test run with coverage report (80% threshold enforced)
- `npm run lint` — oxlint

## Deployment

Pushes to `main` build and deploy automatically to GitHub Pages via `.github/workflows/deploy.yml`.
