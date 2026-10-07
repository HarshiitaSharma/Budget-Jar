(() => {
  const KEY = 'budget-jars-v1';
  const $ = (id) => document.getElementById(id);
  const uid = () => Math.random().toString(36).slice(2, 9);

  const COLORS = [
    { id: 'brass', hex: '#C9A24B' },
    { id: 'denim', hex: '#4A7290' },
    { id: 'sage',  hex: '#7C9473' },
    { id: 'plum',  hex: '#8E6C94' },
    { id: 'terra', hex: '#C4702E' },
    { id: 'teal',  hex: '#4A8C86' },
  ];

  const blank = () => ({ jars: [] }); // jar: { id, name, goal, color, txns: [{id,amount,note,date}] }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      return raw && Array.isArray(raw.jars) ? raw : blank();
    } catch { return blank(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* unavailable */ }
  }

  let state = load();
  let selectedColor = COLORS[0].id;
  let openJarId = null;

  // ---------- Helpers ----------
  const money = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const escapeHtml = (s) => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
  const colorHex = (id) => (COLORS.find(c => c.id === id) || COLORS[0]).hex;

  function jarSaved(jar) {
    return jar.txns.reduce((sum, t) => sum + t.amount, 0);
  }

  // ---------- Jar SVG (liquid fill) ----------
  function jarSvg(jar, size = 'normal') {
    const saved = Math.max(0, jarSaved(jar));
    const pct = jar.goal > 0 ? Math.min(1, saved / jar.goal) : 0;
    const hex = colorHex(jar.color);
    const clipId = `clip-${jar.id}-${size}`;

    // jar body occupies y 20..96 in a 0 0 84 104 viewBox; liquid fills from bottom
    const bodyTop = 22, bodyBottom = 96, bodyHeight = bodyBottom - bodyTop;
    const liquidTop = bodyBottom - bodyHeight * pct;
    const waveId = `wave-${jar.id}-${size}`;

    return `
      <svg viewBox="0 0 84 104" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="${clipId}">
            <path d="M14,22 L70,22 L70,90 Q70,96 64,96 L20,96 Q14,96 14,90 Z"/>
          </clipPath>
        </defs>
        <!-- lid -->
        <rect x="24" y="8" width="36" height="12" rx="3" fill="${hex}" opacity="0.9"/>
        <rect x="22" y="16" width="40" height="7" rx="2" fill="${hex}"/>
        <!-- jar glass outline -->
        <path d="M14,22 L70,22 L70,90 Q70,96 64,96 L20,96 Q14,96 14,90 Z"
              fill="#ffffff" opacity="0.55" stroke="#B9AD8F" stroke-width="1.5"/>
        <!-- liquid -->
        <g clip-path="url(#${clipId})">
          <rect x="10" y="${liquidTop}" width="64" height="${bodyBottom - liquidTop + 4}" fill="${hex}" opacity="0.85"/>
          <path d="M10,${liquidTop} q 6,-3 12,0 t 12,0 t 12,0 t 12,0 t 12,0 v 6 h -60 z" fill="${hex}" opacity="0.6">
            <animateTransform attributeName="transform" type="translate"
              values="0,0; -24,0; 0,0" dur="4s" repeatCount="indefinite"/>
          </path>
        </g>
        <!-- glass rim highlight -->
        <path d="M14,22 L70,22 L70,90 Q70,96 64,96 L20,96 Q14,96 14,90 Z"
              fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.5"/>
      </svg>`;
  }

  // ---------- Overview ----------
  function renderOverview() {
    const totalSaved = state.jars.reduce((s, j) => s + jarSaved(j), 0);
    const totalGoal = state.jars.reduce((s, j) => s + Number(j.goal || 0), 0);
    $('totalSaved').textContent = money(totalSaved);
    $('totalGoal').textContent = money(totalGoal);
    $('jarCount').textContent = String(state.jars.length);
    $('overviewFill').style.width = `${totalGoal > 0 ? Math.min(100, (totalSaved / totalGoal) * 100) : 0}%`;
  }

  // ---------- Jar grid ----------
  function renderJars() {
    const grid = $('jarGrid');
    $('jarEmpty').style.display = state.jars.length ? 'none' : 'block';
    grid.innerHTML = state.jars.map(jar => {
      const saved = jarSaved(jar);
      return `
        <button class="jar" data-jid="${jar.id}" aria-label="Open ${escapeHtml(jar.name)}">
          ${jarSvg(jar)}
          <span class="jar-name">${escapeHtml(jar.name)}</span>
          <span class="jar-amounts">${money(saved)} / ${money(jar.goal)}</span>
        </button>`;
    }).join('');
    renderOverview();
  }

  $('jarGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.jar');
    if (!btn) return;
    openDetail(btn.dataset.jid);
  });

  // ---------- Color picker ----------
  function renderColorRow() {
    $('colorRow').innerHTML = COLORS.map(c => `
      <button type="button" class="color-dot ${c.id === selectedColor ? 'is-selected' : ''}"
        style="--swatch:${c.hex}" data-color="${c.id}" aria-label="${c.id}"></button>
    `).join('');
  }
  $('colorRow').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-color]');
    if (!btn) return;
    selectedColor = btn.dataset.color;
    renderColorRow();
  });

  // ---------- Add jar ----------
  $('addJarBtn').addEventListener('click', () => {
    const name = $('jarName').value.trim();
    const goal = parseFloat($('jarGoal').value);
    if (!name) { $('jarName').focus(); return; }
    if (Number.isNaN(goal) || goal <= 0) { $('jarGoal').focus(); return; }
    state.jars.push({ id: uid(), name, goal, color: selectedColor, txns: [] });
    $('jarName').value = '';
    $('jarGoal').value = '';
    save(); renderJars();
  });

  // ---------- Detail overlay ----------
  const overlay = $('detailOverlay');
  const QUICK = [5, 10, 25, 50];

  function openDetail(jarId) {
    openJarId = jarId;
    overlay.hidden = false;
    renderDetail();
  }
  function closeDetail() {
    overlay.hidden = true;
    openJarId = null;
  }
  $('detailClose').addEventListener('click', closeDetail);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetail(); });

  function currentJar() { return state.jars.find(j => j.id === openJarId); }

  function renderDetail() {
    const jar = currentJar();
    if (!jar) { closeDetail(); return; }

    $('detailJarSvg').innerHTML = jarSvg(jar, 'detail');
    $('detailName').textContent = jar.name;
    $('detailSaved').textContent = money(jarSaved(jar));
    $('detailGoal').textContent = money(jar.goal);

    $('quickAmounts').innerHTML = QUICK.map(a => `<button data-q="${a}">+$${a}</button>`).join('');

    const txns = [...jar.txns].sort((a, b) => b.date.localeCompare(a.date));
    $('txnList').innerHTML = txns.length
      ? txns.map(t => `
          <li class="txn-item">
            <span class="t-left">
              <span class="t-note">${escapeHtml(t.note || (t.amount >= 0 ? 'Deposit' : 'Withdrawal'))}</span>
              <span class="t-date">${t.date}</span>
            </span>
            <span class="t-amt ${t.amount >= 0 ? 'pos' : 'neg'}">${t.amount >= 0 ? '+' : '−'}${money(Math.abs(t.amount))}</span>
          </li>`).join('')
      : '<li class="txn-empty">No activity yet.</li>';
  }

  function addTxn(amount, note) {
    const jar = currentJar();
    if (!jar) return;
    jar.txns.push({ id: uid(), amount, note: note || '', date: new Date().toISOString().slice(0, 10) });
    save(); renderDetail(); renderJars();
  }

  $('quickAmounts').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-q]');
    if (!btn) return;
    addTxn(Number(btn.dataset.q), '');
  });

  $('addMoneyBtn').addEventListener('click', () => {
    const amt = parseFloat($('customAmount').value);
    if (Number.isNaN(amt) || amt <= 0) { $('customAmount').focus(); return; }
    addTxn(amt, $('txnNote').value.trim());
    $('customAmount').value = '';
    $('txnNote').value = '';
  });

  $('removeMoneyBtn').addEventListener('click', () => {
    const amt = parseFloat($('customAmount').value);
    if (Number.isNaN(amt) || amt <= 0) { $('customAmount').focus(); return; }
    const jar = currentJar();
    if (jar && amt > jarSaved(jar)) {
      if (!confirm('That withdrawal is more than what\'s saved in this jar. Continue anyway?')) return;
    }
    addTxn(-amt, $('txnNote').value.trim() || 'Withdrawal');
    $('customAmount').value = '';
    $('txnNote').value = '';
  });

  $('removeJarBtn').addEventListener('click', () => {
    const jar = currentJar();
    if (!jar) return;
    if (!confirm(`Delete "${jar.name}" and all its history? This can't be undone.`)) return;
    state.jars = state.jars.filter(j => j.id !== jar.id);
    save(); closeDetail(); renderJars();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeDetail();
  });

  // ---------- Backup ----------
  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `jars-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || !Array.isArray(data.jars)) throw new Error('bad file');
      if (!confirm('Replace your current jars with this backup?')) return;
      state = data;
      save(); renderJars();
    } catch {
      alert('That file does not look like a Jars backup.');
    } finally {
      e.target.value = '';
    }
  });

  // ---------- Init ----------
  renderColorRow();
  renderJars();
})();
