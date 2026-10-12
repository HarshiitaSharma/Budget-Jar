// "Insights" card: monthly summary and simple stats, derived from localStorage.
(() => {
  const anchor = document.getElementById('jarEmpty');
  if (!anchor) return;
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = '<div class="card-head"><h2>Insights</h2></div><div class="insights-grid" id="insightsGrid"></div>';
  anchor.after(card);

  const money = (n) => '$' + Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const esc = (s) => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  function render() {
    let jars = [];
    try { jars = JSON.parse(localStorage.getItem('budget-jars-v1')).jars || []; } catch {}
    card.style.display = jars.length ? '' : 'none';
    const month = new Date().toISOString().slice(0, 7);
    const all = jars.flatMap(j => j.txns.map(t => ({ ...t, jar: j.name })));
    const thisMonth = all.filter(t => t.date.startsWith(month));
    const deposited = thisMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const withdrawn = thisMonth.filter(t => t.amount < 0).reduce((s, t) => s - t.amount, 0);
    const saved = (j) => j.txns.reduce((s, t) => s + t.amount, 0);
    const done = jars.filter(j => saved(j) >= j.goal).length;
    const open = jars.filter(j => saved(j) < j.goal)
      .sort((a, b) => saved(b) / b.goal - saved(a) / a.goal)[0];
    const items = [
      ['Deposited this month', money(deposited)],
      ['Withdrawn this month', money(withdrawn)],
      ['Goals reached', `${done} of ${jars.length}`],
      ['Closest to goal', open ? `${esc(open.name)} (${Math.round(saved(open) / open.goal * 100)}%)` : '—'],
    ];
    document.getElementById('insightsGrid').innerHTML =
      items.map(([l, v]) => `<div class="insight"><b>${v}</b><span>${l}</span></div>`).join('');
  }

  // script.js re-renders the overview whenever data changes; follow it.
  new MutationObserver(render).observe(document.getElementById('totalSaved'), { childList: true, characterData: true, subtree: true });
  render();
})();
