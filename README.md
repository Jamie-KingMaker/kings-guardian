# King's Guard

Internal RG dashboard prototype currently delivered as a single-page `index.html` (with in-browser Babel/React CDN scripts) plus split `.jsx` source files for maintainability.

## What is in this repo

- `index.html`: runnable app entry point (self-contained).
- `*.jsx`: source modules mirrored into the HTML prototype.
- `logo-*.svg`: brand assets.

## Run with npm

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Build and preview

```bash
npm run build
npm run preview
```

## Notes

- This setup serves the existing prototype as-is; no framework rewrite was done.
- React, ReactDOM, and Babel are loaded from CDN inside `index.html`.

