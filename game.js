/* ============================================================
   STAR WARS: A GALAXY LIFE — game engine
   ============================================================ */

const SAVE_KEY = 'swgl_save_v1';

/* ---------- utility helpers ---------- */
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function chance(p) { return Math.random() < p; }
function pickWeighted(list, weightFn) {
  const total = list.reduce((s, x) => s + weightFn(x), 0);
  let r = Math.random() * total;
  for (const x of list) { r -= weightFn(x); if (r <= 0) return x; }
  return list[list.length - 1];
}
function syllableName(n) {
  let s = '';
  for (let i = 0; i < n; i++) s += pick(SYLLABLES);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateName(species, gender) {
  const style = species.nameStyle;
  const pool = NAME_POOLS[style];
  let first;
  const g = gender === 'female' ? 'female' : 'male';
  if (pool && pool[g] && pool[g].length) first = pick(pool[g]);
  else first = syllableName(randInt(2, 3));
  let last = '';
  if (style === 'human') last = pick(NAME_POOLS.human.last);
  else if (pool && pool.last && pool.last.length) last = pick(pool.last);
  let full = last ? `${first} ${last}` : first;
  if (species.id === 'hutt') full = `${first} the Hutt`;
  return { first, last, full };
}

function speciesById(id) { return SPECIES.find(s => s.id === id); }
function eraById(id) { return ERAS.find(e => e.id === id); }
function jobById(id) { return JOBS.find(j => j.id === id); }

/* ---------- flags (object map: state.flags[name] === true) ---------- */
function hasFlag(name) { return !!(state && state.flags && state.flags[name]); }
function addFlags(names) { if (!names) return; names.forEach(n => { state.flags[n] = true; }); }

/* ---------- midichlorians / Force system ---------- */
function rollMidichlorians(species) {
  const bonus = species.forceBonus || 0;
  const shift = Math.min(0.6, (bonus / 20000)) * Math.random();
  const roll = Math.min(0.999, Math.random() + shift);
  let count;
  if (roll < 0.85) count = randInt(80, 2400);
  else if (roll < 0.965) count = randInt(2500, 7999);
  else if (roll < 0.995) count = randInt(8000, 13999);
  else count = randInt(14000, 20000);
  count += Math.floor(bonus * 0.15);
  count = Math.max(50, count);
  return { count, tier: classifyMidichlorians(count) };
}
function classifyMidichlorians(count) {
  if (count < 2500) return 'Average';
  if (count < 8000) return 'Force-Sensitive';
  if (count < 14000) return 'Gifted';
  return 'Exceptional';
}

/* ---------- character generation ---------- */
let state = null;
const LEGACY_KEY = 'swgl_legacy_v1';

function eligibleOrigins(eraId, canonMode) {
  return ORIGINS.filter(o => o.eras.includes(eraId) && (!o.legendOnly || canonMode === 'LEGEND'));
}

function newCharacter(firstNameOverride, lastNameOverride, gender, canonMode) {
  const era = pick(ERAS);
  const species = pickWeighted(SPECIES, s => s.weight);
  let homeworld = pick(species.homeworlds);
  const midi = rollMidichlorians(species);
  const name = generateName(species, gender);
  const first = firstNameOverride || name.first;
  const last = lastNameOverride !== undefined ? lastNameOverride : name.last;

  const lifespan = randInt(species.lifespan[0], species.lifespan[1]);
  const elderStart = Math.max(60, Math.round(lifespan * 0.78));
  const birthYear = rollBirthYear(era.id);

  const baseStats = {
    health: clamp(70 + randInt(-10, 10), 10, 100),
    happiness: clamp(70 + randInt(-10, 10), 10, 100),
    smarts: clamp(50 + (species.traits.int || 0) + randInt(-10, 10), 5, 100),
    looks: clamp(50 + randInt(-15, 15), 5, 100),
    forcePower: 0,
  };

  const mother = generateParent(species, 'female');
  const father = generateParent(species, 'male');
  const siblings = generateSiblings(species);

  const origin = pick(eligibleOrigins(era.id, canonMode));
  if (origin && origin.worlds && origin.worlds.length) homeworld = pick(origin.worlds);

  state = {
    firstName: first, lastName: last, gender,
    canonMode,
    speciesId: species.id, eraId: era.id, homeworld,
    birthYear, originId: origin ? origin.id : null,
    lifespan, elderStart,
    age: 0, stage: 'baby',
    midichlorians: midi.count, forceTier: midi.tier,
    forcePath: null, forceRank: null, forceAlignment: 0,
    stats: baseStats,
    wealth: randInt(0, 300),
    job: null, jobTitle: 'Unemployed', yearsInJob: 0,
    relationships: { mother, father, siblings, spouse: null, romanticInterest: null, children: [] },
    assets: [],
    eventLog: [],
    flags: {},
    achievements: [],
    firedGlobalEvents: [],
    activeLegendArc: null,
    completedLegendArcs: [],
    arcProgress: {},
    alive: true, born: true,
    deathAge: null, deathCause: null,
  };

  if (origin) {
    addFlags(origin.flags);
    log(origin.text);
    if (origin.flags.includes('force_sensitive') || origin.flags.includes('jedi')) {
      if (state.forceTier === 'Average') {
        state.midichlorians = randInt(2500, 6000);
        state.forceTier = classifyMidichlorians(state.midichlorians);
      }
    }
    if (origin.flags.includes('jedi')) { state.forcePath = 'jedi'; state.forceRank = 'Youngling'; state.forceAlignment = 20; }
    if (origin.flags.includes('inquisitor_trainee')) { state.forcePath = 'inquisitor'; state.forceRank = 'Inquisitor Trainee'; state.forceAlignment = -30; }
    if (origin.flags.includes('sith_eternal')) { state.forceAlignment = -20; }
    if (origin.flags.includes('slave')) state.arcProgress.slave = 0;
    if (origin.flags.includes('mandalorian')) state.arcProgress.mando = 0;
    if (origin.flags.includes('clone')) state.arcProgress.clone = 0;
  } else {
    log(`You were born ${speciesArticle(species)} ${species.name} on ${homeworld}, during ${era.name}.`);
  }
  if (midi.tier !== 'Average') {
    log(`Something about you feels different — your midichlorian count reads unusually high (${midi.count}).`);
  }

  const worldData = CANON_WORLDS.find(w => w.name === homeworld);
  if (worldData && worldData.bonus) applyEffects(worldData.bonus);

  applyLegacyBonus();

  return state;
}

function applyLegacyBonus() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw);
    if (!legacy) return;
    if (legacy.type === 'jedi_master') {
      applyEffects({ smarts: 4, happiness: 4 });
      log('Something about the way you move the Force feels... practiced, as if remembered from another life.');
    } else if (legacy.type === 'sith_lord') {
      applyEffects({ forcePower: 4 });
      log('A cold, patient anger seems to have followed you into this life.');
    }
    localStorage.removeItem(LEGACY_KEY);
  } catch (e) { /* ignore */ }
}

function speciesArticle(species) {
  return /^[AEIOU]/.test(species.name) ? 'an' : 'a';
}

function generateParent(species, sex) {
  const name = generateName(species, sex === 'female' ? 'female' : 'male');
  const jobsPool = ['moisture farmer', 'mechanic', 'shopkeeper', 'pilot', 'trader', 'laborer', 'musician', 'farmer', 'clerk', 'engineer', 'cook', 'guard'];
  return { name: name.full, job: pick(jobsPool), alive: true };
}

function generateSiblings(species) {
  const n = pickWeighted([0, 1, 2, 3], w => ({ 0: 35, 1: 35, 2: 20, 3: 10 }[w]));
  const out = [];
  for (let i = 0; i < n; i++) {
    const gender = chance(0.5) ? 'male' : 'female';
    const name = generateName(species, gender);
    out.push({ name: name.full, alive: true, ageDiff: randInt(-8, 8) });
  }
  return out;
}

/* ---------- stage / era helpers ---------- */
function computeStage(age) {
  if (age <= 2) return 'baby';
  if (age <= 7) return 'child';
  if (age <= 12) return 'preteen';
  if (age <= 17) return 'teen';
  if (age < state.elderStart) return 'adult';
  return 'elder';
}
function currentSpecies() { return speciesById(state.speciesId); }
function currentEra() { return eraById(state.eraId); }

function log(text) {
  state.eventLog.unshift({ age: state.age, text });
  if (state.eventLog.length > 300) state.eventLog.pop();
}

function applyEffects(effects) {
  if (!effects) return;
  if (effects.health !== undefined) state.stats.health = clamp(state.stats.health + effects.health, 0, 100);
  if (effects.happiness !== undefined) state.stats.happiness = clamp(state.stats.happiness + effects.happiness, 0, 100);
  if (effects.smarts !== undefined) state.stats.smarts = clamp(state.stats.smarts + effects.smarts, 0, 100);
  if (effects.looks !== undefined) state.stats.looks = clamp(state.stats.looks + effects.looks, 0, 100);
  if (effects.forcePower !== undefined) state.stats.forcePower = clamp(state.stats.forcePower + effects.forcePower, 0, 100);
  if (effects.wealth !== undefined) state.wealth = Math.max(0, state.wealth + effects.wealth);
  if (effects.alignment !== undefined) state.forceAlignment = clamp(state.forceAlignment + effects.alignment, -100, 100);
  if (effects.flags_add) addFlags(effects.flags_add);
}

/* ---------- Force path rank progression ---------- */
function updateForceRank() {
  if (!state.forcePath) return;
  const age = state.age;
  let newRank = state.forceRank;
  if (state.forcePath === 'jedi') {
    newRank = age < 13 ? 'Youngling' : age < 20 ? 'Padawan' : (state.forceAlignment >= 40 && age >= 40 && state.stats.forcePower >= 70) ? 'Jedi Master' : 'Jedi Knight';
  } else if (state.forcePath === 'sith') {
    newRank = age < 20 ? 'Sith Acolyte' : (state.forceAlignment <= -60 && age >= 35) ? 'Sith Lord' : 'Sith Acolyte';
  } else if (state.forcePath === 'inquisitor') {
    newRank = state.stats.forcePower >= 75 ? 'Grand Inquisitor' : 'Inquisitor';
  } else if (state.forcePath === 'ren') {
    newRank = 'Knight of Ren';
  } else if (state.forcePath === 'nightsister') {
    newRank = age < 20 ? 'Nightsister Acolyte' : 'Nightsister';
  }
  if (newRank !== state.forceRank) {
    state.forceRank = newRank;
    if (newRank === 'Padawan') log(`You constructed your first lightsaber and were taken on as a Padawan learner.`);
    else if (newRank === 'Sith Acolyte' && age >= 20) log(`Your dark side training deepened as you were formally named a Sith Acolyte.`);
    else if (newRank === 'Jedi Knight') log(`You stood before the Council and were named a Jedi Knight.`);
    else if (newRank === 'Jedi Master') log(`In recognition of your wisdom and skill, you were granted the rank of Jedi Master.`);
    else if (newRank === 'Sith Lord') log(`You claimed the title of Sith Lord, your mastery of the dark side complete.`);
    else log(`You are now known as a ${newRank}.`);
  }
}

/* ---------- career ---------- */
function eligibleJobs() {
  const sp = currentSpecies();
  return JOBS.filter(j => {
    if (state.age < j.minAge) return false;
    if (state.stats.smarts < j.smarts) return false;
    if (j.eras && !j.eras.includes(state.eraId)) return false;
    return true;
  });
}

function applyForJob(jobId) {
  const job = jobById(jobId);
  if (!job) return;
  const successChance = clamp(0.4 + (state.stats.smarts - job.smarts) * 0.006 + (state.stats.looks - 50) * 0.002, 0.1, 0.95);
  if (chance(successChance)) {
    state.job = job.id; state.jobTitle = job.title; state.yearsInJob = 0;
    log(`You landed a job as a ${job.title}.`);
    applyEffects({ happiness: 6 });
  } else {
    log(`You applied for a position as a ${job.title}, but didn't get it.`);
    applyEffects({ happiness: -3 });
  }
  render();
}

function quitJob() {
  if (!state.job) return;
  log(`You quit your job as a ${state.jobTitle}.`);
  state.job = null; state.jobTitle = 'Unemployed'; state.yearsInJob = 0;
  render();
}

function workYear() {
  if (!state.job) return;
  const job = jobById(state.job);
  const growth = 1 + Math.min(state.yearsInJob * 0.05, 0.6);
  const pay = Math.round(randInt(job.pay[0], job.pay[1]) * growth);
  state.wealth += pay;
  state.yearsInJob++;
  log(`You earned ${pay.toLocaleString()} credits working as a ${state.jobTitle}.`);
  if (state.yearsInJob >= 3 && chance(0.15)) {
    log(`You were promoted! Your title is now Senior ${state.jobTitle}.`);
    state.jobTitle = `Senior ${job.title}`;
    applyEffects({ happiness: 8 });
  } else if (chance(0.03) || (state.stats.happiness < 15 && chance(0.2))) {
    log(`You were let go from your job as a ${state.jobTitle}.`);
    state.job = null; state.jobTitle = 'Unemployed'; state.yearsInJob = 0;
    applyEffects({ happiness: -10 });
  }
}

/* ---------- activities ---------- */
function doActivity(kind) {
  switch (kind) {
    case 'socialize':
      log('You spent time socializing with friends.');
      applyEffects({ happiness: 6 });
      break;
    case 'cantina':
      applyEffects({ happiness: 5, wealth: -80 });
      if (chance(0.15)) { log('A cantina brawl broke out and you got caught in it.'); applyEffects({ health: -10 }); }
      else log('You relaxed at the local cantina.');
      break;
    case 'gamble':
      const bet = Math.min(state.wealth, randInt(50, 400));
      if (chance(0.47)) { state.wealth += bet; log(`You won ${bet.toLocaleString()} credits at sabacc.`); }
      else { state.wealth -= bet; log(`You lost ${bet.toLocaleString()} credits at sabacc.`); }
      break;
    case 'exercise':
      log('You trained your body hard.');
      applyEffects({ health: 6, looks: 2 });
      break;
    case 'study':
      log('You spent the season studying.');
      applyEffects({ smarts: 6 });
      break;
    case 'volunteer':
      log('You volunteered to help those in need.');
      applyEffects({ happiness: 5, wealth: -30 });
      if (state.forcePath) applyEffects({ alignment: 6 });
      break;
    case 'meditate-light':
      log('You meditated, reaching out to the light side of the Force.');
      applyEffects({ forcePower: 8, alignment: 10, happiness: 3 });
      break;
    case 'meditate-dark':
      log('You gave in to your anger, drawing on the dark side of the Force.');
      applyEffects({ forcePower: 10, alignment: -10, health: -2 });
      break;
    case 'meditate-balance':
      log('You meditated in stillness, seeking balance in the Force.');
      applyEffects({ forcePower: 6, happiness: 4 });
      break;
  }
  render();
}

function doCrime(idx) {
  const c = CRIME_ACTIONS[idx];
  if (!c) return;
  if (chance(c.successChance)) {
    log(`You decided to ${c.text} — and got away with it.`);
    applyEffects(c.successEffect);
    if (state.forcePath) applyEffects({ alignment: -4 });
  } else {
    log(`You tried to ${c.text} — and it went badly wrong.`);
    applyEffects(c.failEffect);
  }
  render();
}

/* ---------- relationships ---------- */
function spendTimeWithFamily() {
  log('You spent quality time with your family.');
  applyEffects({ happiness: 6 });
  render();
}
function lookForPartner() {
  if (state.age < 16) return;
  const sp = pick(SPECIES);
  const gender = chance(0.5) ? 'male' : 'female';
  const name = generateName(sp, gender);
  const candidate = { name: name.full, species: sp.name, job: pick(['pilot', 'trader', 'mechanic', 'musician', 'soldier', 'farmer', 'artist']) };
  const successChance = clamp(0.4 + (state.stats.looks - 50) * 0.006, 0.1, 0.9);
  if (chance(successChance)) {
    state.relationships.romanticInterest = candidate;
    log(`You met ${candidate.name}, a ${candidate.species} ${candidate.job}, and hit it off.`);
    applyEffects({ happiness: 8 });
  } else {
    log('You tried to meet someone new, but nothing came of it.');
    applyEffects({ happiness: -2 });
  }
  render();
}
function proposeMarriage() {
  const ri = state.relationships.romanticInterest;
  if (!ri || state.age < 18) return;
  if (chance(0.75)) {
    state.relationships.spouse = ri;
    state.relationships.romanticInterest = null;
    log(`You married ${ri.name} in a small ceremony surrounded by friends.`);
    applyEffects({ happiness: 15 });
  } else {
    log(`You proposed to ${ri.name}, but they turned you down.`);
    state.relationships.romanticInterest = null;
    applyEffects({ happiness: -10 });
  }
  render();
}
function haveChild() {
  const spouse = state.relationships.spouse;
  if (!spouse) return;
  const sp = currentSpecies();
  const gender = chance(0.5) ? 'male' : 'female';
  const name = generateName(sp, gender);
  state.relationships.children.push({ name: name.full, alive: true, age: 0 });
  log(`You and ${spouse.name} welcomed a child, ${name.full}, into the galaxy.`);
  applyEffects({ happiness: 12, wealth: -200 });
  render();
}
function divorce() {
  const spouse = state.relationships.spouse;
  if (!spouse) return;
  log(`You and ${spouse.name} separated.`);
  state.relationships.spouse = null;
  applyEffects({ happiness: -10 });
  render();
}

/* ---------- assets ---------- */
const ASSET_CATALOG = [
  { id: 'speeder', name: 'Speeder Bike', cost: 3000, effects: { happiness: 5 } },
  { id: 'blaster', name: 'Blaster Pistol', cost: 500, effects: { happiness: 2 } },
  { id: 'droid', name: 'Personal Astromech Droid', cost: 4000, effects: { happiness: 6, smarts: 2 } },
  { id: 'home', name: 'Modest Homestead', cost: 12000, effects: { happiness: 10 } },
  { id: 'freighter', name: 'Light Freighter', cost: 30000, effects: { happiness: 12 } },
  { id: 'villa', name: 'Coruscant Sky Apartment', cost: 60000, effects: { happiness: 15, looks: 3 } },
];
function buyAsset(id) {
  const item = ASSET_CATALOG.find(a => a.id === id);
  if (!item || state.wealth < item.cost || state.assets.includes(id)) return;
  state.wealth -= item.cost;
  state.assets.push(id);
  applyEffects(item.effects);
  log(`You purchased ${item.name} for ${item.cost.toLocaleString()} credits.`);
  render();
}

/* ---------- special / choice events ---------- */
function checkSpecialEvent() {
  const era = currentEra();
  const sp = currentSpecies();
  const f = state.flags;

  if (era.hasJedi && ['old-republic', 'fall-of-jedi'].includes(state.eraId) && !state.forcePath && state.forceTier !== 'Average' && state.age >= 1 && state.age <= 9 && chance(tierChance(0.05, 0.12, 0.22))) {
    return {
      title: 'A Visit from the Jedi',
      text: `A traveling Jedi Knight has come to your settlement and senses something unusual in you through the Force.`,
      options: [
        { label: 'Go with the Jedi', run: () => {
          state.forcePath = 'jedi'; state.forceRank = 'Youngling'; state.forceAlignment = 20; f.discoveredByJedi = true;
          log('You said goodbye to your family and left to begin training as a Jedi Youngling.');
          applyEffects({ happiness: -5 });
        } },
        { label: 'Stay with your family', run: () => { log('You chose to stay with your family, and the Jedi departed alone.'); f.declinedJedi = true; } },
      ],
    };
  }

  if (era.hasJedi && ['new-republic', 'new-jedi-order', 'first-order-rise'].includes(state.eraId) && !state.forcePath && state.forceTier !== 'Average' && state.age >= 4 && state.age <= 16 && chance(tierChance(0.03, 0.08, 0.16))) {
    return {
      title: 'The New Jedi Order',
      text: `Word of your abilities has reached a wandering Jedi seeking students for a new generation of the Order.`,
      options: [
        { label: 'Begin training as a Jedi', run: () => {
          state.forcePath = 'jedi'; state.forceRank = state.age < 13 ? 'Youngling' : 'Padawan'; state.forceAlignment = 20; f.discoveredByJedi = true;
          log('You left to train under the New Jedi Order.');
          applyEffects({ happiness: 4 });
        } },
        { label: 'Decline for now', run: () => { log('You decided this was not the right time to leave.'); f.declinedJedi = true; } },
      ],
    };
  }

  if (state.eraId === 'reign-of-empire' && state.forceTier !== 'Average' && state.forcePath !== 'inquisitor' && !f.inquisitorEvent && state.age >= 8 && chance(0.05)) {
    f.inquisitorEvent = true;
    return {
      title: 'The Inquisitorius',
      text: `Imperial Inquisitors have arrived, hunting down anyone with a connection to the Force. They have found you.`,
      options: [
        { label: 'Try to hide your abilities', run: () => {
          const c = clamp(0.3 + state.stats.smarts * 0.006, 0.2, 0.85);
          if (chance(c)) { log('You masked your presence in the Force and the Inquisitors moved on.'); applyEffects({ happiness: -6 }); }
          else { if (chance(0.5)) killCharacter('Captured and executed by the Inquisitorius'); else { log('You were captured, but chose to serve rather than die.'); state.forcePath = 'inquisitor'; state.forceRank = 'Inquisitor'; state.forceAlignment = -50; } }
        } },
        { label: 'Submit and join the Inquisitorius', run: () => {
          state.forcePath = 'inquisitor'; state.forceRank = 'Inquisitor'; state.forceAlignment = -50;
          log('You knelt before the Inquisitors and were taken to be trained in the ways of the dark side.');
        } },
      ],
    };
  }

  if (['old-republic', 'fall-of-jedi'].includes(state.eraId) && ['Gifted', 'Exceptional'].includes(state.forceTier) && !state.forcePath && state.age >= 14 && chance(0.04)) {
    return {
      title: 'A Whisper in the Dark',
      text: `A hooded figure approaches you in the shadows, offering to teach you power beyond anything the Jedi would allow.`,
      options: [
        { label: 'Accept the dark teachings', run: () => {
          state.forcePath = 'sith'; state.forceRank = 'Sith Acolyte'; state.forceAlignment = -50;
          log('You accepted the stranger\'s offer and began your first steps down the path of the dark side.');
        } },
        { label: 'Refuse', run: () => { log('You refused, and the figure vanished into the crowd.'); f.declinedSith = true; } },
      ],
    };
  }

  if (state.eraId === 'first-order-rise' && ['Gifted', 'Exceptional'].includes(state.forceTier) && state.forcePath !== 'ren' && state.age >= 14 && chance(0.04)) {
    return {
      title: 'The Knights of Ren',
      text: `Emissaries of the Knights of Ren seek you out, promising power to those who abandon the old ways of light and dark alike.`,
      options: [
        { label: 'Join the Knights of Ren', run: () => {
          state.forcePath = 'ren'; state.forceRank = 'Knight of Ren'; state.forceAlignment = -60;
          log('You took up a new name and joined the Knights of Ren.');
        } },
        { label: 'Refuse them', run: () => { log('You refused their offer and they melted back into the shadows.'); if (state.forcePath === 'jedi') applyEffects({ alignment: 10 }); } },
      ],
    };
  }

  return null;
}
function tierChance(avg, sensitive, gifted) {
  if (state.forceTier === 'Exceptional') return gifted + 0.1;
  if (state.forceTier === 'Gifted') return gifted;
  if (state.forceTier === 'Force-Sensitive') return sensitive;
  return avg;
}

/* ---------- absolute timeline: global canon events ---------- */
function currentYear() { return state.birthYear + state.age; }

function checkGlobalEvent() {
  const year = currentYear();
  const candidates = GLOBAL_EVENTS.filter(e => e.year <= year && !state.firedGlobalEvents.includes(e.id));
  if (!candidates.length) return null;
  const presentMatch = candidates.find(e => e.presentWorlds.includes(state.homeworld));
  const due = presentMatch || candidates.slice().sort((a, b) => a.year - b.year)[0];
  state.firedGlobalEvents.push(due.id);
  if (due.id === 'GE_ORDER_66') return buildOrder66Choice();
  if (due.id === 'GE_JEDHA' && due.presentWorlds.includes(state.homeworld)) return buildJedhaChoice();
  resolveGlobalEvent(due);
  return 'resolved';
}

function resolveGlobalEvent(event) {
  const present = event.presentWorlds.includes(state.homeworld);
  const variantKey = present ? 'present' : (event.presentWorlds.length ? (chance(0.4) ? 'nearby' : 'distant') : 'distant');
  log(event[variantKey]);
  applyEffects(event.effects);
  if (present && event.instantDeathIfPresent) {
    killCharacter(`Killed in the destruction of ${state.homeworld}`);
  }
}

function buildOrder66Choice() {
  if (state.forcePath === 'jedi') {
    return {
      title: 'Order 66',
      text: "Your commander's comm chirps. He looks at you, and something behind his eyes has changed. 'Good soldiers follow orders.'",
      options: [
        { label: 'Run for the gunship', run: () => {
          if (chance(0.4)) { log('You bolted for the gunship and made it off-world just ahead of blaster fire, one of the fortunate few.'); addFlags(['survived_order_66']); applyEffects({ happiness: -20 }); }
          else killCharacter('Cut down by clone troopers during Order 66');
        } },
        { label: 'Ignite your saber and fight', run: () => {
          if (chance(0.35)) { log('You cut your way clear, but the cost was steep, and the Order you knew is already gone.'); addFlags(['survived_order_66']); applyEffects({ health: -25, happiness: -25 }); }
          else killCharacter('Killed fighting off Order 66');
        } },
        { label: 'Reach out to your clone friend through the Force', run: () => {
          if (chance(0.5)) { log("For one impossible moment, your friend's hand shakes on the trigger, and you run while he still can't fire. You'll never know if he meant to let you go."); addFlags(['survived_order_66']); applyEffects({ happiness: -15 }); }
          else killCharacter('Betrayed by the order in his own soldier\'s mind during Order 66');
        } },
      ],
    };
  }
  if (hasFlag('clone')) {
    return {
      title: 'Order 66',
      text: "Execute Order 66. The words arrive over the comm and your hands are already moving before you've decided anything at all.",
      options: [
        { label: '(Chip intact) Fire', run: () => {
          log('The chip did its work. You fired on your own general without a moment\'s hesitation you can remember.');
          addFlags(['executed_order_66']);
          applyEffects({ alignment: -5, happiness: -10 });
        } },
        { label: '(Chip removed) Refuse and help your general escape', run: () => {
          if (hasFlag('chip_removed')) {
            log('With your chip removed, you refused the order and helped your general escape — a death sentence if anyone ever found out.');
            addFlags(['refused_order_66']);
            applyEffects({ alignment: 10, happiness: 5 });
          } else {
            log('You tried to resist the order, but the chip was still active. Your body obeyed before your mind could catch up.');
            addFlags(['executed_order_66']);
            applyEffects({ alignment: -5, happiness: -15 });
          }
        } },
      ],
    };
  }
  return {
    title: 'Order 66',
    text: "The HoloNet says the Jedi tried to assassinate the Chancellor. Now a wounded Jedi is hiding somewhere in your district, and clone troopers are searching house to house.",
    options: [
      { label: 'Hide them', run: () => { log('You hid the fugitive Jedi at great personal risk.'); addFlags(['hid_a_jedi']); applyEffects({ happiness: -5 }); } },
      { label: 'Turn them in', run: () => { log('You turned the Jedi over to the clone troopers for a reward.'); applyEffects({ wealth: 2000, alignment: -15, happiness: -5 }); } },
      { label: 'Look away', run: () => { log('You looked away and pretended you never saw anything.'); applyEffects({ happiness: -5 }); } },
    ],
  };
}

function buildJedhaChoice() {
  return {
    title: "Jedha City",
    text: "The Empire has tested something terrible on Jedha City. The ground itself seems to be catching fire behind you.",
    options: [
      { label: "Run for Saw's Partisan tunnels", run: () => {
        if (chance(0.65)) { log("You made it into the Partisans' tunnel network moments before the blast wave hit."); addFlags(['fled_jedha']); applyEffects({ happiness: -8 }); }
        else killCharacter('Killed in the destruction of Jedha City');
      } },
      { label: 'Try to reach a ship off-world', run: () => {
        if (chance(0.5)) { log('You threw yourself aboard a departing freighter as Jedha City disappeared behind you.'); addFlags(['fled_jedha']); applyEffects({ happiness: -8, wealth: -200 }); }
        else killCharacter('Killed in the destruction of Jedha City');
      } },
    ],
  };
}

/* ---------- Legend flagship arcs ---------- */
function checkLegendArcBeat() {
  if (state.canonMode !== 'LEGEND') return null;
  const year = currentYear();
  if (!state.activeLegendArc) {
    for (const arcId of Object.keys(LEGEND_ARCS)) {
      if (state.completedLegendArcs.includes(arcId)) continue;
      const arc = LEGEND_ARCS[arcId];
      if (year < arc.triggerYear) continue;
      if (!arc.triggerFlags.some(f => hasFlag(f))) continue;
      state.activeLegendArc = { id: arcId, beatIndex: 0 };
      break;
    }
  }
  if (!state.activeLegendArc) return null;
  const arc = LEGEND_ARCS[state.activeLegendArc.id];
  const beat = arc.beats[state.activeLegendArc.beatIndex];
  if (!beat) { state.completedLegendArcs.push(state.activeLegendArc.id); state.activeLegendArc = null; return null; }
  if (year < beat.year) return null;
  if (beat.requiresFlag && !hasFlag(beat.requiresFlag)) {
    state.completedLegendArcs.push(state.activeLegendArc.id);
    state.activeLegendArc = null;
    return null;
  }
  return {
    title: beat.title,
    text: beat.text,
    options: beat.options.map(opt => ({
      label: opt.label,
      run: () => {
        const success = opt.successChance !== undefined ? chance(opt.successChance) : true;
        const effects = success ? opt.effects : (opt.failEffects || {});
        const message = success ? opt.log : (opt.failLog || opt.log);
        applyEffects(effects);
        log(message);
        if (!success && opt.fatal) { killCharacter('Struck down for reaching beyond your grasp'); }
        if (state.activeLegendArc) state.activeLegendArc.beatIndex++;
      },
    })),
  };
}

/* ---------- condensed origin-driven arcs (slave / mando / clone) ---------- */
const CONDENSED_ARCS = { slave: SLAVE_ARC, mando: MANDO_ARC, clone: CLONE_ARC };
function checkCondensedArcBeat() {
  for (const key of Object.keys(CONDENSED_ARCS)) {
    const idx = state.arcProgress[key];
    if (idx === undefined || idx === null) continue;
    const arc = CONDENSED_ARCS[key];
    const beat = arc.beats[idx];
    if (!beat) { state.arcProgress[key] = null; continue; }
    if (state.age < beat.ageOffset) continue;
    const options = beat.options.filter(o => !o.requiresFlag || hasFlag(o.requiresFlag)).filter(o => !o.requiresNotFlag || !hasFlag(o.requiresNotFlag));
    if (!options.length) { state.arcProgress[key] = idx + 1; continue; }
    return {
      title: beat.title,
      text: beat.text,
      options: options.map(opt => ({
        label: opt.label,
        run: () => {
          const success = opt.successChance !== undefined ? chance(opt.successChance) : true;
          const effects = success ? opt.effects : (opt.failEffects || {});
          const message = success ? opt.log : (opt.failLog || opt.log);
          applyEffects(effects);
          log(message);
          state.arcProgress[key] = idx + 1;
        },
      })),
    };
  }
  return null;
}

/* ---------- named canon character encounters ---------- */
function eligibleCharacters() {
  const year = currentYear();
  return CHARACTERS.filter(c => {
    if (!c.eras.includes(state.eraId)) return false;
    if (c.worlds.length && !c.worlds.includes(state.homeworld)) return false;
    if (c.birthYear !== null && c.birthYear > year) return false;
    if (c.deathYear !== null && c.deathYear < year) return false;
    return true;
  });
}
function meetCharacter(id) {
  const c = CHARACTERS.find(x => x.id === id);
  if (!c) return;
  log(`You crossed paths with ${c.name}.`);
  applyEffects({ happiness: 4 });
  addFlags([`met_${id}`]);
  render();
}
function trainWithCharacter(id) {
  const c = CHARACTERS.find(x => x.id === id);
  if (!c || !c.verbs.train) return;
  log(`You spent time training under ${c.name}.`);
  applyEffects({ forcePower: 6, smarts: 3, happiness: 3 });
  addFlags([`trained_with_${id}`]);
  render();
}
function dateCharacter(id) {
  const c = CHARACTERS.find(x => x.id === id);
  if (!c) return;
  if (!canRomanceCharacter(state.age, state.canonMode, c, currentYear())) {
    log(`It wasn't the right time for that with ${c.name}.`);
    render();
    return;
  }
  state.relationships.romanticInterest = { name: c.name, species: '', job: '', canonId: c.id };
  log(`You and ${c.name} grew close.`);
  applyEffects({ happiness: 8 });
  render();
}
function fightCharacter(id) {
  const c = CHARACTERS.find(x => x.id === id);
  if (!c || !c.verbs.fight) return;
  const win = chance(0.5);
  if (win) {
    log(`You held your own against ${c.name}.`);
    applyEffects({ happiness: 5, forcePower: 3 });
    if (state.canonMode === 'LEGEND' && c.verbs.fight === 'duel' && canKillCharacter(c, state.canonMode, currentYear()) && chance(0.1)) {
      log(`In a shocking turn, you struck down ${c.name}. The galaxy's story bends around what you've done.`);
      addFlags([`killed_${id}`]);
      applyEffects({ alignment: -10 });
    }
  } else {
    log(`${c.name} bested you. You live to tell the story, at least.`);
    applyEffects({ health: -10, happiness: -5 });
  }
  render();
}

/* ---------- death ---------- */
function killCharacter(cause) {
  state.alive = false;
  state.deathAge = state.age;
  state.deathCause = cause;
  log(`${cause}.`);
  saveLegacy();
}
function saveLegacy() {
  try {
    let type = null;
    if (state.forcePath === 'jedi' && (state.forceRank === 'Jedi Master')) type = 'jedi_master';
    else if (state.forcePath === 'sith' && state.forceRank === 'Sith Lord') type = 'sith_lord';
    if (type) localStorage.setItem(LEGACY_KEY, JSON.stringify({ type }));
  } catch (e) { /* ignore */ }
}
function checkDeath() {
  if (!state.alive) return true;
  if (state.age >= state.lifespan) {
    killCharacter(`Died of old age at ${state.age}`);
    return true;
  }
  const job = state.job ? jobById(state.job) : null;
  let incidentChance = 0.003;
  if (state.stats.health < 30) incidentChance += 0.03;
  if (state.stats.health < 10) incidentChance += 0.06;
  if (job && job.risky) incidentChance += 0.015;
  if (['fall-of-jedi', 'reign-of-empire', 'first-order-rise'].includes(state.eraId) && state.age >= 18) incidentChance += 0.004;
  if (state.age >= state.elderStart) incidentChance += (state.age - state.elderStart) * 0.0015;

  if (chance(incidentChance)) {
    const youngCauses = [
      'Succumbed to a sudden childhood illness',
      'Died in a tragic accident',
      'Lost in a starship malfunction while traveling with family',
    ];
    const oldCauses = [
      'Died in a tragic speeder accident',
      'Succumbed to a sudden illness',
      'Killed in a skirmish',
      'Lost in a starship malfunction',
      'Died from injuries sustained in a bar brawl',
      'Never returned from a dangerous job',
      'Perished in a duel',
      'Died of complications from old wounds',
    ];
    const pool = ['baby', 'child', 'preteen'].includes(state.stage) ? youngCauses : oldCauses;
    killCharacter(pick(pool));
    return true;
  }
  if (state.stats.health <= 0) {
    killCharacter('Died from failing health');
    return true;
  }
  return false;
}

/* ---------- age up ---------- */
let pendingChoice = null;

function ageUp() {
  if (!state || !state.alive) return;
  if (pendingChoice) return;

  state.age++;
  state.stage = computeStage(state.age);

  // natural stat drift
  applyEffects({ health: randInt(-1, 1), happiness: randInt(-2, 2) });
  if (state.stats.health < 55 && chance(0.3)) applyEffects({ health: randInt(1, 3) });
  if (state.age >= state.elderStart) applyEffects({ health: -randInt(1, 3), looks: -randInt(0, 2) });

  if (state.job) workYear();
  updateForceRank();

  if (checkDeath()) { render(); save(); return; }

  const globalResult = checkGlobalEvent();
  if (globalResult && globalResult !== 'resolved') {
    pendingChoice = globalResult;
    render();
    save();
    return;
  }
  if (globalResult === 'resolved') {
    if (checkDeath()) { render(); save(); return; }
    render();
    save();
    return;
  }

  const arcBeat = checkLegendArcBeat();
  if (arcBeat) {
    pendingChoice = arcBeat;
    render();
    save();
    return;
  }

  const condensedBeat = checkCondensedArcBeat();
  if (condensedBeat) {
    pendingChoice = condensedBeat;
    render();
    save();
    return;
  }

  const special = checkSpecialEvent();
  if (special) {
    pendingChoice = special;
    render();
    save();
    return;
  }

  const stagePool = FLAVOR_EVENTS.filter(e => e.stages.includes(state.stage));
  const erasPool = (ERA_EVENTS[state.eraId] || []).filter(e => e.stages.includes(state.stage));
  const pool = stagePool.concat(erasPool);
  if (pool.length && chance(0.85)) {
    const ev = pick(pool);
    log(ev.text);
    applyEffects(ev.effects);
  }

  familyDriftCheck();

  if (checkDeath()) { render(); save(); return; }

  render();
  save();
}

function familyDriftCheck() {
  const r = state.relationships;
  if (r.mother.alive && chance(0.006 + (state.age > 40 ? 0.01 : 0))) { r.mother.alive = false; log(`Your mother, ${r.mother.name}, passed away.`); applyEffects({ happiness: -12 }); }
  if (r.father.alive && chance(0.006 + (state.age > 40 ? 0.01 : 0))) { r.father.alive = false; log(`Your father, ${r.father.name}, passed away.`); applyEffects({ happiness: -12 }); }
}

function resolveChoice(idx) {
  if (!pendingChoice) return;
  const opt = pendingChoice.options[idx];
  pendingChoice = null;
  opt.run();
  render();
  save();
}

/* ---------- save / load ---------- */
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ state, pendingChoice })); } catch (e) { /* ignore */ }
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    state = data.state;
    pendingChoice = data.pendingChoice || null;
    return !!state;
  } catch (e) { return false; }
}
function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}

/* ---------- app bootstrap wired in ui.js ---------- */
