# Jars. 🫙

An envelope-style budgeting app where each savings goal is a jar that
visibly fills with liquid as you add money to it — set on a little shelf,
general-store ledger style, instead of another dashboard-with-progress-bars.

No build step, no dependencies, no backend: `index.html`, `styles.css`,
`script.js`. Data is saved in your browser's `localStorage`.

## Screenshots

| Overview | Jar detail |
|---|---|
| ![Overview with a Travel jar] (<img width="445" height="381" alt="image" src="https://github.com/user-attachments/assets/320e99f6-8d0a-44f5-9f12-aff21809d3a0" />
)
 | ![Jar detail panel with deposits](<img width="695" height="831" alt="image" src="https://github.com/user-attachments/assets/09193cbf-27e8-4144-8018-a198f23f928a" />
) |

## Features

- **Jars**: name a goal, set a target amount, pick a color — the jar fills
  with liquid (with a gentle animated wave) as its percentage climbs
- **Quick-add buttons** (+$5 / +$10 / +$25 / +$50) plus a custom
  amount field with an optional note, for both deposits and withdrawals
- **Overview bar**: total saved vs. total goal across every jar
- **Per-jar history**: every deposit and withdrawal, newest first
- **Backup**: export everything as JSON, import it on another device

## Running it

Open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Putting it on GitHub

```bash
git init
git add .
git commit -m "Jars: an envelope-style budgeting app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Free hosting with GitHub Pages

1. Push the repo.
2. **Settings → Pages → Source → Deploy from a branch**, choose `main` and
   `/ (root)`.
3. Live at `https://<your-username>.github.io/<repo-name>/`.

Note: `localStorage` is per-browser and per-device. Use Export/Import to
move your jars between devices.

## File structure

```
budget-jars/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Ideas to extend it

- Monthly auto-contribution reminders per jar
- A "round up" mode that logs spare change from manually entered purchases
- Export a single jar's history as CSV
- Archive a jar once its goal is hit, instead of deleting it
