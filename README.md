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

1. **+ Add menu → Scan QR code** — point the camera at the venue’s QR code. The URL autofills and a direct fetch is attempted.
1. If the fetch is blocked (CORS), tap **Open link in Safari**, Share → Save to Files, return, **Choose PDF from Files**.
1. Naming and metadata are automatic where possible: filenames like `FIZZ CHAMPAGNE BAR FB.pdf` are cleaned to “Fizz Champagne Bar” and matched against a built-in MSC World Europa venue directory that autofills category and deck. Unrecognized venues get a category guess from keywords; if the app is genuinely unsure, a **Look up venue on the web** button opens a pre-filled search in Safari.
1. Side (Port/Starboard/Midship, rendered as running lights) and Position (Forward/Amidships/Aft) are separate fields.
1. **Multiple menus per venue:** give each PDF a label (Food, Drinks, Wine list…). Saving with an existing venue name merges into that venue — a new label adds a menu, a matching label asks before replacing. Cards with several menus show a count and open a picker; ⋯ → Edit lists attached menus with per-menu removal.

## Sharing with friends

- Send them the same URL; they add it to their home screens. Data is per-device.
- To sync your curated collection: **Export** (top right) produces a single JSON bundle with all PDFs embedded → AirDrop it → they tap **Import**. Matching venue names are updated, new ones added.
- Individual menus can also be AirDropped from a card’s ⋯ → Share PDF.

## Notes

- The in-app viewer renders PDFs with pdf.js (cached offline) because iOS Safari’s inline PDF embedding only shows the first page.
- Export bundles grow ~33% over raw PDF size (base64). Menu PDFs are small; this is irrelevant in practice.
- To rename the ship in the header, edit the `ship-name` line in `index.html`.