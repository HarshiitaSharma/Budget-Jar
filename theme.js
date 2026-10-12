// Dark mode toggle. Remembers the choice; defaults to the OS preference.
(() => {
  const KEY = 'budget-jars-theme';
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  let theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');

  function apply() {
    root.dataset.theme = theme;
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem(KEY, theme); } catch {}
  }
  btn.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; apply(); });
  document.body.appendChild(btn);
  apply();
})();
