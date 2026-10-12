// Adds an "Export CSV" button to the jar detail panel (per-jar history).
// Reads the same localStorage data that script.js writes.
(() => {
  const panel = document.querySelector('.detail-panel');
  const anchor = document.getElementById('removeJarBtn');
  if (!panel || !anchor) return;

  const btn = document.createElement('button');
  btn.className = 'btn small ghost csv-btn';
  btn.textContent = 'Export history as CSV';
  panel.insertBefore(btn, anchor);

  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  btn.addEventListener('click', () => {
    let jars = [];
    try { jars = JSON.parse(localStorage.getItem('budget-jars-v1')).jars; } catch {}
    const name = document.getElementById('detailName').textContent;
    const jar = jars.find(j => j.name === name);
    if (!jar) return;
    let running = 0;
    const rows = [...jar.txns].sort((a, b) => a.date.localeCompare(b.date)).map(t => {
      running += t.amount;
      return [t.date, t.amount >= 0 ? 'deposit' : 'withdrawal', t.amount, t.note, running.toFixed(2)];
    });
    const csv = [['date', 'type', 'amount', 'note', 'balance'], ...rows].map(r => r.map(cell).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${name.replace(/\W+/g, '-').toLowerCase() || 'jar'}-history.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();
