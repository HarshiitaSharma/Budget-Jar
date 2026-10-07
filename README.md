# Jars 🫙

An envelope-style budgeting app where each savings goal is represented by a jar that visibly fills with liquid as you add money to it. Jars sit on a little shelf with a general-store ledger aesthetic instead of the usual dashboard full of progress bars.

Built with plain HTML, CSS, and JavaScript — no build step, dependencies, or backend required. Data is stored locally in your browser using `localStorage`.

## Screenshots

| Overview | Jar Detail |
|---|---|
| <img width="445" height="381" alt="Jars overview showing a Travel jar" src="https://github.com/user-attachments/assets/320e99f6-8d0a-44f5-9f12-aff21809d3a0" /> | <img width="695" height="831" alt="Jar detail panel showing deposits" src="https://github.com/user-attachments/assets/09193cbf-27e8-4144-8018-a198f23f928a" /> |

## Features

- **Jars** — Create a jar for each savings goal, set a target amount, choose a color, and watch the jar fill with animated liquid as your savings grow.
- **Quick Add** — Quickly add `$5`, `$10`, `$25`, or `$50`, or enter a custom amount with an optional note.
- **Deposits & Withdrawals** — Record both deposits and withdrawals for each jar.
- **Overview** — See total savings compared with the combined target across all jars.
- **Per-Jar History** — View every deposit and withdrawal, with the newest transactions shown first.
- **Backup & Restore** — Export your complete data as JSON and import it on another device.

## Running Locally

No installation or build process is required.

Simply open `index.html` in your browser, or serve the project locally:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Putting It on GitHub

Initialize the repository and push it to GitHub:

```bash
git init
git add .
git commit -m "Jars: an envelope-style budgeting app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Replace `<your-username>` and `<repo-name>` with your GitHub username and repository name.

## Free Hosting with GitHub Pages

You can host Jars for free using GitHub Pages.

1. Push the project to GitHub.
2. Open **Settings → Pages** in your repository.
3. Under **Source**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Save the settings.

Your app will be available at:

```text
https://<your-username>.github.io/<repo-name>/
```

### Important

Jars uses browser `localStorage`, so your data is specific to the browser and device where it was created.

Use the **Export** feature to back up your jars and **Import** to restore them on another device or browser.

## File Structure

```text
budget-jars/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Future Ideas

Some possible improvements:

- Monthly automatic contribution reminders for individual jars
- A "round up" mode that records spare change from manually entered purchases
- Export the history of an individual jar as CSV
- Archive a jar automatically once its savings goal is reached
- Add recurring deposits
- Add transaction editing and deletion
- Add optional dark mode
- Add savings statistics and monthly summaries
