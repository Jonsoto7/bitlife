/* ============================================================
   STAR WARS: A GALAXY LIFE — UI rendering & event wiring
   ============================================================ */

let currentTab = 'story';

function el(id) { return document.getElementById(id); }

function showScreen(name) {
  el('setup-screen').classList.toggle('hidden', name !== 'setup');
  el('game-screen').classList.toggle('hidden', name !== 'game');
  el('death-screen').classList.toggle('hidden', name !== 'death');
}

function fmtCredits(n) { return n.toLocaleString() + ' cr'; }

function render() {
  if (!state) { showScreen('setup'); return; }
  if (!state.alive) { renderDeath(); showScreen('death'); return; }
  showScreen('game');

  const sp = currentSpecies();
  const era = currentEra();

  el('hud-name').textContent = `${state.firstName}${state.lastName ? ' ' + state.lastName : ''}`;
  el('hud-age').textContent = state.age;
  el('hud-species').textContent = sp.name;
  el('hud-homeworld').textContent = state.homeworld;
  el('hud-era').textContent = `${era.name} (${formatYear(currentYear())})`;
  el('hud-job').textContent = state.jobTitle;
  el('hud-credits').textContent = fmtCredits(state.wealth);

  setBar('health', state.stats.health);
  setBar('happiness', state.stats.happiness);
  setBar('smarts', state.stats.smarts);
  setBar('looks', state.stats.looks);

  el('hud-midi-count').textContent = state.midichlorians.toLocaleString();
  const tierEl = el('hud-midi-tier');
  tierEl.textContent = state.forceTier;
  tierEl.className = 'tier-badge tier-' + state.forceTier.toLowerCase().replace(/\s+/g, '-');

  const forceBlock = el('force-block');
  if (state.forcePath) {
    forceBlock.classList.remove('hidden');
    el('hud-force-path').textContent = state.forceRank || state.forcePath;
    const align = state.forceAlignment;
    const pct = clamp((align + 100) / 2, 0, 100);
    el('force-align-fill').style.width = pct + '%';
    el('force-align-fill').className = 'bar-fill ' + (align >= 15 ? 'light' : align <= -15 ? 'dark' : 'balanced');
    el('hud-force-power').textContent = state.stats.forcePower;
  } else {
    forceBlock.classList.add('hidden');
  }

  renderTab();
  renderChoiceModal();
}

function setBar(key, val) {
  el('bar-' + key).style.width = clamp(val, 0, 100) + '%';
  el('val-' + key).textContent = Math.round(val);
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  renderTab();
}

function renderTab() {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  const panel = el('panel-' + currentTab);
  if (panel) panel.classList.remove('hidden');

  if (currentTab === 'story') renderStory();
  if (currentTab === 'activities') renderActivities();
  if (currentTab === 'career') renderCareer();
  if (currentTab === 'relationships') renderRelationships();
  if (currentTab === 'assets') renderAssets();
  if (currentTab === 'encounters') renderEncounters();
}

function renderEncounters() {
  const p = el('panel-encounters');
  const list = eligibleCharacters();
  let html = `<p class="muted">Year ${formatYear(currentYear())} &middot; ${state.canonMode === 'LEGEND' ? 'Legend Mode' : 'Canon Lock'}</p>`;
  if (!list.length) {
    html += '<p class="muted">No notable figures are within reach right now. Keep aging up — the galaxy is big.</p>';
  } else {
    html += '<div class="rel-list">';
    list.forEach(c => {
      const canDate = canRomanceCharacter(state.age, state.canonMode, c, currentYear());
      html += `<div class="encounter-row">
        <div class="encounter-name">${c.name}</div>
        <div class="encounter-actions">
          <button class="action-btn small" onclick="meetCharacter('${c.id}')">Meet</button>
          ${c.verbs.train ? `<button class="action-btn small" onclick="trainWithCharacter('${c.id}')">Train</button>` : ''}
          ${c.verbs.date ? `<button class="action-btn small" ${canDate ? '' : 'disabled'} onclick="dateCharacter('${c.id}')">Date</button>` : ''}
          ${c.verbs.fight ? `<button class="action-btn small danger" onclick="fightCharacter('${c.id}')">Fight</button>` : ''}
        </div>
      </div>`;
    });
    html += '</div>';
  }
  p.innerHTML = html;
}
function formatYear(y) { return y < 0 ? `${Math.abs(y)} BBY` : `${y} ABY`; }

function renderStory() {
  const log = el('panel-story');
  log.innerHTML = '<div class="log-list">' + state.eventLog.map(e =>
    `<div class="log-entry"><span class="log-age">Age ${e.age}</span><span class="log-text">${escapeHtml(e.text)}</span></div>`
  ).join('') + '</div>';
}

function renderActivities() {
  const p = el('panel-activities');
  let html = '<div class="action-grid">';
  const acts = [
    ['socialize', 'Socialize'], ['cantina', 'Visit a Cantina'], ['gamble', 'Gamble at Sabacc'],
    ['exercise', 'Exercise'], ['study', 'Study'], ['volunteer', 'Volunteer'],
  ];
  acts.forEach(([k, label]) => { html += `<button class="action-btn" onclick="doActivity('${k}')">${label}</button>`; });
  html += '</div>';

  if (state.forcePath) {
    html += '<h3 class="section-title">The Force</h3><div class="action-grid">';
    html += `<button class="action-btn light" onclick="doActivity('meditate-light')">Meditate: Light Side</button>`;
    html += `<button class="action-btn dark" onclick="doActivity('meditate-dark')">Meditate: Dark Side</button>`;
    html += `<button class="action-btn" onclick="doActivity('meditate-balance')">Meditate: Balance</button>`;
    html += '</div>';
  }

  html += '<h3 class="section-title">Crime</h3><div class="action-grid">';
  CRIME_ACTIONS.forEach((c, i) => { html += `<button class="action-btn danger" onclick="doCrime(${i})">${capitalize(c.text)}</button>`; });
  html += '</div>';

  p.innerHTML = html;
}

function renderCareer() {
  const p = el('panel-career');
  let html = `<div class="career-current"><strong>Current job:</strong> ${state.jobTitle}`;
  if (state.job) html += ` <button class="action-btn danger small" onclick="quitJob()">Quit</button>`;
  html += '</div>';

  const jobs = eligibleJobs();
  html += '<h3 class="section-title">Available Positions</h3><div class="job-list">';
  if (!jobs.length) html += '<p class="muted">No positions available yet at your age or skill level.</p>';
  jobs.forEach(j => {
    const disabled = state.job === j.id ? 'disabled' : '';
    html += `<div class="job-row"><span>${j.title}</span><span class="muted">${fmtCredits(j.pay[0])}–${fmtCredits(j.pay[1])}/yr</span><button class="action-btn small" ${disabled} onclick="applyForJob('${j.id}')">${state.job === j.id ? 'Employed' : 'Apply'}</button></div>`;
  });
  html += '</div>';
  p.innerHTML = html;
}

function renderRelationships() {
  const p = el('panel-relationships');
  const r = state.relationships;
  let html = '<h3 class="section-title">Family</h3><div class="rel-list">';
  html += relRow(r.mother.name, 'Mother', r.mother.job, r.mother.alive);
  html += relRow(r.father.name, 'Father', r.father.job, r.father.alive);
  r.siblings.forEach(s => { html += relRow(s.name, 'Sibling', '', s.alive); });
  html += '</div><div class="action-grid"><button class="action-btn" onclick="spendTimeWithFamily()">Spend Time with Family</button></div>';

  html += '<h3 class="section-title">Romance</h3>';
  if (r.spouse) {
    html += `<div class="rel-list">${relRow(r.spouse.name, 'Spouse', r.spouse.job, true)}</div>`;
    html += '<div class="action-grid">';
    if (state.age >= 16) html += `<button class="action-btn" onclick="haveChild()">Have a Child</button>`;
    html += `<button class="action-btn danger" onclick="divorce()">Divorce</button></div>`;
  } else if (r.romanticInterest) {
    html += `<div class="rel-list">${relRow(r.romanticInterest.name, 'Seeing', r.romanticInterest.job, true)}</div>`;
    html += `<div class="action-grid">`;
    if (state.age >= 18) html += `<button class="action-btn" onclick="proposeMarriage()">Propose Marriage</button>`;
    html += `<button class="action-btn" onclick="lookForPartner()">Meet Someone New</button></div>`;
  } else if (state.age >= 16) {
    html += `<div class="action-grid"><button class="action-btn" onclick="lookForPartner()">Look for a Partner</button></div>`;
  } else {
    html += `<p class="muted">You're too young for romance yet.</p>`;
  }

  if (r.children.length) {
    html += '<h3 class="section-title">Children</h3><div class="rel-list">';
    r.children.forEach(c => { html += relRow(c.name, 'Child', '', c.alive); });
    html += '</div>';
  }

  p.innerHTML = html;
}
function relRow(name, role, job, alive) {
  return `<div class="rel-row ${alive ? '' : 'deceased'}"><span class="rel-name">${escapeHtml(name)}</span><span class="rel-role">${role}${job ? ' · ' + job : ''}</span><span class="rel-status">${alive ? '' : 'Deceased'}</span></div>`;
}

function renderAssets() {
  const p = el('panel-assets');
  let html = `<div class="career-current"><strong>Net worth:</strong> ${fmtCredits(state.wealth)}</div>`;
  html += '<h3 class="section-title">Marketplace</h3><div class="job-list">';
  ASSET_CATALOG.forEach(a => {
    const owned = state.assets.includes(a.id);
    const canAfford = state.wealth >= a.cost;
    html += `<div class="job-row"><span>${a.name}</span><span class="muted">${fmtCredits(a.cost)}</span><button class="action-btn small" ${owned || !canAfford ? 'disabled' : ''} onclick="buyAsset('${a.id}')">${owned ? 'Owned' : 'Buy'}</button></div>`;
  });
  html += '</div>';
  p.innerHTML = html;
}

function renderChoiceModal() {
  const modal = el('choice-modal');
  if (!pendingChoice) { modal.classList.add('hidden'); return; }
  modal.classList.remove('hidden');
  el('choice-title').textContent = pendingChoice.title;
  el('choice-text').textContent = pendingChoice.text;
  const opts = el('choice-options');
  opts.innerHTML = '';
  pendingChoice.options.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'action-btn choice-btn';
    btn.textContent = o.label;
    btn.onclick = () => resolveChoice(i);
    opts.appendChild(btn);
  });
}

function renderDeath() {
  el('death-name').textContent = `${state.firstName}${state.lastName ? ' ' + state.lastName : ''}`;
  el('death-cause').textContent = state.deathCause + '.';
  el('death-age').textContent = state.deathAge;
  el('death-species').textContent = currentSpecies().name;
  el('death-era').textContent = currentEra().name;
  el('death-job').textContent = state.jobTitle;
  el('death-force').textContent = state.forcePath ? (state.forceRank || state.forcePath) : 'Not Force-trained';
  el('death-wealth').textContent = fmtCredits(state.wealth);
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ---------- setup screen ---------- */
function randomizeSetupName() {
  const sp = pickWeighted(SPECIES, s => s.weight);
  const gender = el('setup-gender').value === 'random' ? (chance(0.5) ? 'male' : 'female') : el('setup-gender').value;
  const n = generateName(sp, gender);
  el('setup-first').value = n.first;
  el('setup-last').value = n.last || '';
}

function beginLife() {
  const first = el('setup-first').value.trim();
  const last = el('setup-last').value.trim();
  let gender = el('setup-gender').value;
  if (gender === 'random') gender = chance(0.5) ? 'male' : 'female';
  const canonMode = el('setup-canon-mode').value;
  newCharacter(first || null, last === '' ? undefined : last, gender, canonMode);
  currentTab = 'story';
  render();
  save();
}

function startNewLife() {
  if (state && state.alive && !confirm('Abandon your current life and start a new one?')) return;
  state = null;
  pendingChoice = null;
  clearSave();
  showScreen('setup');
}

function beginAnotherLife() {
  state = null;
  pendingChoice = null;
  clearSave();
  showScreen('setup');
}

/* ---------- init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  el('btn-randomize').addEventListener('click', randomizeSetupName);
  el('btn-begin').addEventListener('click', beginLife);
  el('btn-age-up').addEventListener('click', ageUp);
  el('btn-new-life').addEventListener('click', startNewLife);
  el('btn-death-restart').addEventListener('click', beginAnotherLife);
  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

  if (load() && state) {
    render();
  } else {
    showScreen('setup');
  }
});
