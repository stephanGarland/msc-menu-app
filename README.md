# Galley

A self-hosted PWA for collecting ship venue menus (PDFs) into one offline dashboard. No App Store, no backend, no accounts.

## Deploy (one time, ~5 minutes)

Any static host works. GitHub Pages is the path of least resistance:

1. Create a repo (e.g. `galley`), push these five files to the root:
   `index.html`, `sw.js`, `manifest.webmanifest`, `icon-180.png`, `icon-512.png`
1. Repo Settings → Pages → Source: `main` branch, `/ (root)`.
1. Visit `https://<user>.github.io/galley/` on each iPhone **while you have connectivity** — the service worker caches the app shell, fonts, and the PDF renderer on first load, so it works fully offline afterward.
1. In Safari: Share → **Add to Home Screen**. It launches standalone, like a native app.

> A home-screen web app is exempt from Safari’s 7-day inactive-storage eviction, and the app also requests persistent storage. Menus live in IndexedDB on-device.

## Daily use aboard

1. Scan a venue’s QR code → menu PDF opens in Safari.
1. Two ways to capture it:
- **Fetch from URL** inside Galley (paste/share the link). Works when the menu server allows cross-origin requests — common for ship-LAN content, not guaranteed.
- **Fallback (always works):** in Safari, Share → Save to Files. Then in Galley: + Add menu → Choose PDF from Files.
1. Fill in name, category, deck, side (port/starboard shown as red/green running lights), notes. Saving a name that already exists offers to replace it instead of duplicating.

## Sharing with friends

- Send them the same URL; they add it to their home screens. Data is per-device.
- To sync your curated collection: **Export** (top right) produces a single JSON bundle with all PDFs embedded → AirDrop it → they tap **Import**. Matching venue names are updated, new ones added.
- Individual menus can also be AirDropped from a card’s ⋯ → Share PDF.

## Notes

- The in-app viewer renders PDFs with pdf.js (cached offline) because iOS Safari’s inline PDF embedding only shows the first page.
- Export bundles grow ~33% over raw PDF size (base64). Menu PDFs are small; this is irrelevant in practice.
- To rename the ship in the header, edit the `ship-name` line in `index.html`.