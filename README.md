# Aircraft Trainer — FIC Delta

Visual aircraft recognition + performance grouping trainer, built per spec.

## Run

Requires **Node 18+** and npm.

```bash
cd aircraft-trainer
npm install
npm run dev
```

Open the URL printed in the terminal (default `http://localhost:5173`).

If Node is not installed:
- macOS: `brew install node` (with Homebrew), or download the macOS installer from <https://nodejs.org/>.
- Verify with `node -v` (should be ≥ 18).

## What's in here

```
src/
  App.jsx                    Top-level routing
  main.jsx                   React entry
  styles/global.css          All styles (dark mode primary)

  data/
    aircraft.js              All aircraft (Tier 1 fully authored, Tier 2/3 stubs)
    performanceTiers.js      6 perf tiers (1, 2, 3, 4, 5, 6A, 6B, 6C)
    confusionPairs.js        12 priority confusion pairs

  state/
    store.jsx                Context + reducer + localStorage persistence
                             + Wikipedia image fetcher (cached)
    sessionEngine.js         Pure logic: deck building, spaced rep,
                             mastery scoring, summary

  components/
    common/                  Topbar, AircraftImage
    flashcards/              Setup, Runner, Summary (the training loop)
    library/                 Grid, Detail, Compare
    dashboard/               Today, weekly trend, weak list, mission
    settings/                Theme, defaults, data export/import/reset
```

## Data model

All progress lives in `localStorage` under key `aircraft-trainer-v1`. Use
**Settings → Export backup** to save your data, or **Reset all** to start over.

Aircraft images are fetched at runtime from the Wikipedia API and cached in
`localStorage` under `aircraft-trainer-images-v1` — no images are bundled.

## Extending content

Tier 2/3 aircraft have `contentLevel: 'stub'`. Open `src/data/aircraft.js` and
expand `recognition`, `visualMarkers`, `confusedWith`, and `memoryTip` to reach
the same depth as Tier 1 entries (see Cessna 172 or Pilatus PC-12 for the bar).

## Keyboard shortcuts

In a session:

- `R` / `Space` — reveal answer
- `S` — skip · `F` — flag as hard
- `1` / `2` / `3` — Easy / Unsure / Wrong
- `P` — learn performance tier
- `Y` / `U` / `N` — Know / Unsure / Don't know (perf)
- `↵` / `Space` — next card
- `Esc` — end session
