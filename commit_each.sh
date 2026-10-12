#!/usr/bin/env bash
# Run from your repo root after copying these files in. One commit per feature.
set -e
c() { m="$1"; shift; git add "$@" && git commit -m "$m"; }
c "Add .gitignore"                                   .gitignore
c "Add MIT license"                                  LICENSE
c "Add dark mode with OS preference and toggle"      theme.css theme.js
c "Add per-jar CSV export of history"                csv-export.js
c "Add insights card with monthly summary"           stats.js
c "Add PWA manifest, icon and offline service worker" manifest.webmanifest sw.js pwa.js icon.svg
c "Add GitHub Pages deploy workflow"                 .github/workflows/pages.yml
c "Add changelog"                                    CHANGELOG.md
c "Wire new modules into index.html"                 index.html
c "Document extras in README"                        README.md
git log --oneline | head -10
