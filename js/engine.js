/* ============================================================
   GAME ENGINE — Star Wars BitLife
   ============================================================ */

function rand(min, max){ return Math.floor(min + Math.random()*(max-min+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function fmtYear(y){
  if (y < 0) return `${Math.abs(Math.round(y*10)/10)} BBY`;
  if (y === 0) return "Battle of Yavin (0)";
  return `${Math.round(y*10)/10} ABY`;
}

class Game {
  constructor(ui){
    this.ui = ui;
    this.state = null;
    this.pending = null; // pending choice event
  }

  /* ---------------- LIFE CREATION ---------------- */
  newLife(opts){
    const era = ERAS.find(e=>e.id===opts.eraId) || ERAS[2];
    let species = SPECIES.find(s=>s.id===opts.speciesId);
    if(!species) species = pick(SPECIES);
    let homeworld = HOMEWORLDS.find(h=>h.id===opts.homeworldId);
    if(!homeworld || !species.homeworlds.includes(homeworld.id)) {
      homeworld = HOMEWORLDS.find(h=>h.id===species.homeworlds[0]) || HOMEWORLDS[0];
    }
    const gender = opts.gender || pick(["male","female"]);
    const pool = NAME_POOLS[species.id] || NAME_POOLS.human;
    const first = opts.firstName || pick(pool[gender] && pool[gender].length ? pool[gender] : NAME_POOLS.human[gender]);
    const last = opts.lastName || (pool.surnames && pool.surnames.length ? pick(pool.surnames) : (Math.random()<0.5 ? pick(NAME_POOLS.human.surnames) : ""));

    const forceSensitive = Math.random() < (species.forceChance + (opts.forceLuck||0));

    this.state = {
      alive: true,
      era, year: era.start + rand(0,3),
      age: 0,
      name: { first, last },
      gender, species, homeworld,
      currentPlanet: homeworld.id,
      stats: {
        health: clampStat(50 + rand(-10,10) + (species.mods.health||0)),
        smarts: clampStat(50 + rand(-10,10) + (species.mods.smarts||0)),
        looks:  clampStat(50 + rand(-10,10) + (species.mods.looks||0)),
        discipline: clampStat(50 + rand(-10,10) + (species.mods.discipline||0))
      },
      wealth: rand(50, 400),
      forceSensitive, forceDiscovered:false, forceTrained:false,
      alignment: 0,
      order66:false, hunted:false,
      career: null,
      wantedLevel: 0,
      jailYearsLeft: 0,
      partner: null,
      children: [],
      parents: this.genParents(species, homeworld, era),
      siblings: [],
      assetsOwned: [],
      traits: [],
      log: []
    };
    const s = this.state;
    if(Math.random()<0.4){
      const sibGender = pick(["male","female"]);
      const sp = NAME_POOLS[species.id] || NAME_POOLS.human;
      s.siblings.push({ name: pick(sp[sibGender]&&sp[sibGender].length?sp[sibGender]:NAME_POOLS.human[sibGender]), gender: sibGender });
    }
    this.log(`You were born ${fmtYear(s.year)} on ${homeworld.name} to ${s.parents.father.name} and ${s.parents.mother.name}. You are a ${species.name}.`);
    this.pending = null;
    this.save();
    return s;
  }

  genParents(species, homeworld, era){
    const pool = NAME_POOLS[species.id] || NAME_POOLS.human;
    const fatherName = pick(pool.male && pool.male.length ? pool.male : NAME_POOLS.human.male) + (pool.surnames&&pool.surnames.length?" "+pick(pool.surnames):"");
    const motherName = pick(pool.female && pool.female.length ? pool.female : NAME_POOLS.human.female) + (pool.surnames&&pool.surnames.length?" "+pick(pool.surnames):"");
    const jobs = ["moisture farmer","mechanic","merchant","pilot","clerk","cantina owner","spice miner","dock worker","teacher","medic"];
    return {
      father: { name: fatherName, job: pick(jobs), alive:true },
      mother: { name: motherName, job: pick(jobs), alive:true }
    };
  }

  /* ---------------- LOGGING ---------------- */
  log(text){
    const s = this.state;
    s.log.unshift({ age: s.age, year: fmtYear(s.year), text });
    if(s.log.length>300) s.log.pop();
  }

  /* ---------------- AGE UP ---------------- */
  ageUp(){
    const s = this.state;
    if(!s.alive || this.pending) return;

    if(s.jailYearsLeft>0){
      s.jailYearsLeft--;
      s.age++; s.year += 1;
      this.log(`Year ${s.jailYearsLeft>0?"":"final "}served in detention. ${s.jailYearsLeft>0?s.jailYearsLeft+" year(s) remaining.":"You were released."}`);
      if(s.jailYearsLeft<=0) s.wantedLevel = Math.max(0, s.wantedLevel-2);
      this.checkDeath();
      this.save();
      return;
    }

    s.age++;
    s.year += 1;

    // advance era as in-universe time passes
    const newEra = ERAS.find(e => s.year >= e.start && s.year <= e.end) ||
                   (s.year > ERAS[ERAS.length-1].end ? ERAS[ERAS.length-1] : s.era);
    if (newEra && newEra.id !== s.era.id) {
      s.era = newEra;
      this.log(`The galaxy has changed. You now live in the era of ${newEra.name} (${newEra.range}).`);
    }

    // career salary + progression
    if(s.career){
      const track = CAREERS.find(c=>c.id===s.career.id);
      if(track){
        const rank = track.ranks[s.career.rankIndex];
        s.wealth += rank.salary;
        s.career.yearsInRank = (s.career.yearsInRank||0)+1;
        const next = track.ranks[s.career.rankIndex+1];
        if(next && s.age>=next.minAge && s.career.yearsInRank>=2){
          const chance = 0.25 + s.stats.discipline/300 + s.stats.smarts/400;
          if(Math.random()<chance){
            s.career.rankIndex++;
            s.career.yearsInRank = 0;
            this.log(`You were promoted to ${next.title} in the ${track.name}!`);
          }
        }
      }
    }

    // asset upkeep
    let upkeep = 0;
    s.assetsOwned.forEach(a=>upkeep+=a.upkeep);
    if(upkeep>0){ s.wealth = Math.max(0, s.wealth-upkeep); }

    // relationship aging
    if(s.partner) s.partner.closeness = Math.min(100, s.partner.closeness + rand(-5,8));
    s.children.forEach(c=>c.age++);

    // catastrophic homeworld events checked as special events below

    // pick a special (choice) event first
    const specials = SPECIAL_EVENTS.filter(ev=>{
      if(ev.once && s.traits.includes("done:"+ev.id)) return false;
      try { return ev.condition(s); } catch(e){ return false; }
    });
    if(specials.length>0){
      const ev = pick(specials);
      if(ev.once) s.traits.push("done:"+ev.id);
      this.pending = ev;
      this.log(typeof ev.text==="function" ? ev.text(s) : ev.text);
      this.save();
      this.ui.render();
      return;
    }

    // flavor events (1-2)
    const flavorPool = FLAVOR_EVENTS.filter(ev=>s.age>=ev.min && s.age<=ev.max);
    const count = rand(1,2);
    for(let i=0;i<count;i++){
      if(flavorPool.length===0) break;
      const ev = pick(flavorPool);
      ev.effects(s);
      this.log(typeof ev.text==="function" ? ev.text(s) : ev.text);
    }

    this.checkDeath();
    this.save();
    this.ui.render();
  }

  resolveChoice(idx){
    if(!this.pending) return;
    const choice = this.pending.choices[idx];
    this.pending = null;
    if(choice) choice.effect(this.state, this);
    this.checkDeath();
    this.save();
    this.ui.render();
  }

  /* ---------------- DEATH ---------------- */
  mortalityChance(){
    const s = this.state;
    const ratio = s.age / s.species.lifespan;
    let chance = 0;
    if(ratio>0.45) chance += Math.pow(Math.max(0,(ratio-0.45)*1.8), 3) * 0.2;
    chance += (100-s.stats.health)/100 * 0.025;
    if(s.age<1) chance += 0.003;
    return Math.min(chance, 0.92);
  }

  checkDeath(){
    const s = this.state;
    if(!s.alive) return;
    if(s.stats.health<=0){ this.die("health", pick(DEATH_CAUSES.health)); return; }
    const chance = this.mortalityChance();
    if(Math.random() < chance){
      const ratio = s.age/s.species.lifespan;
      let cat = "accident";
      if(ratio>0.75) cat="oldAge";
      else if(s.stats.health<30) cat="health";
      this.die(cat, pick(DEATH_CAUSES[cat]));
    }
  }

  die(category, text){
    const s = this.state;
    if(!s.alive) return;
    s.alive = false;
    s.deathCategory = category;
    s.deathText = text;
    this.log(`${s.name.first} ${text}`);
    this.pending = null;
    this.save();
  }

  /* ---------------- CAREER ---------------- */
  startCareer(id){
    const s = this.state;
    if(id===null){ s.career = null; return; }
    const track = CAREERS.find(c=>c.id===id);
    if(!track) return;
    s.career = { id, rankIndex:0, yearsInRank:0 };
    if(track.force) s.forceTrained = true;
    if(track.id==="jedi") s.lightsaberForm = pick(LIGHTSABER_FORMS);
    if(track.id==="sith") s.lightsaberForm = pick(LIGHTSABER_FORMS);
    this.log(`You began your career as a ${track.ranks[0].title} (${track.name}).`);
  }

  availableCareers(){
    const s = this.state;
    return CAREERS.filter(c=>{
      if(c.eras && !c.eras.includes(s.era.id)) return false;
      if(c.force && !s.forceSensitive) return false;
      if(s.age < c.ranks[0].minAge) return false;
      return true;
    });
  }

  quitCareer(){ this.log(`You left your career behind.`); this.state.career=null; this.save(); this.ui.render(); }

  /* ---------------- CRIME ---------------- */
  commitCrime(id){
    const s = this.state;
    const crime = CRIMES.find(c=>c.id===id);
    if(!crime) return;
    if(Math.random() < crime.risk){
      s.wantedLevel = Math.min(5, s.wantedLevel+1);
      this.jail(rand(crime.jail[0], crime.jail[1]));
      this.log(`You were caught committing: ${crime.name}.`);
    } else {
      const pay = rand(crime.payout[0], crime.payout[1]);
      s.wealth += pay;
      s.wantedLevel = Math.min(5, s.wantedLevel + (Math.random()<0.3?1:0));
      this.log(`You got away with it: ${crime.name}. Earned ${pay.toLocaleString()} credits.`);
    }
    this.save();
    this.ui.render();
  }

  jail(years){
    const s = this.state;
    s.jailYearsLeft = years || rand(1,3);
    this.log(`You were sentenced to ${s.jailYearsLeft} year(s) in detention.`);
  }

  /* ---------------- RELATIONSHIPS ---------------- */
  startRelationship(){
    const s = this.state;
    const sp = NAME_POOLS[s.species.id] || NAME_POOLS.human;
    const g = pick(["male","female"]);
    const name = pick(sp[g]&&sp[g].length?sp[g]:NAME_POOLS.human[g]) + (sp.surnames&&sp.surnames.length?" "+pick(sp.surnames):"");
    s.partner = { name, gender:g, closeness: rand(40,70), married:false };
    this.log(`You started a relationship with ${name}.`);
  }

  breakUp(){
    if(this.state.partner){ this.log(`You and ${this.state.partner.name} went your separate ways.`); this.state.partner=null; this.save(); this.ui.render(); }
  }

  addChild(){
    const s = this.state;
    const sp = NAME_POOLS[s.species.id] || NAME_POOLS.human;
    const g = pick(["male","female"]);
    const name = pick(sp[g]&&sp[g].length?sp[g]:NAME_POOLS.human[g]);
    s.children.push({ name, gender:g, age:0 });
    this.log(`You welcomed a child, ${name}, into the galaxy.`);
  }

  /* ---------------- ASSETS ---------------- */
  buyAsset(category, id){
    const s = this.state;
    const item = ASSETS[category].find(a=>a.id===id);
    if(!item) return;
    if(s.wealth < item.cost){ this.log(`You can't afford a ${item.name} yet.`); this.ui.render(); return; }
    s.wealth -= item.cost;
    s.assetsOwned.push({ ...item, category });
    this.log(`You purchased a ${item.name} for ${item.cost.toLocaleString()} credits.`);
    this.save();
    this.ui.render();
  }

  sellAsset(idx){
    const s = this.state;
    const item = s.assetsOwned[idx];
    if(!item) return;
    const refund = Math.floor(item.cost*0.5);
    s.wealth += refund;
    s.assetsOwned.splice(idx,1);
    this.log(`You sold your ${item.name} for ${refund.toLocaleString()} credits.`);
    this.save();
    this.ui.render();
  }

  /* ---------------- TRAVEL ---------------- */
  travelTo(homeworldId){
    const s = this.state;
    const dest = HOMEWORLDS.find(h=>h.id===homeworldId);
    if(!dest) return;
    const cost = 200;
    if(s.wealth<cost){ this.log(`Not enough credits to book passage to ${dest.name}.`); this.ui.render(); return; }
    s.wealth -= cost;
    s.currentPlanet = dest.id;
    this.log(`You traveled to ${dest.name}.`);
    this.save();
    this.ui.render();
  }

  /* ---------------- HEALTH ---------------- */
  visitMedic(){
    const s = this.state;
    const cost = 300;
    if(s.wealth<cost){ this.log(`Can't afford medical treatment.`); this.ui.render(); return; }
    s.wealth -= cost;
    s.stats.health = clampStat(s.stats.health + rand(10,25));
    this.log(`You visited a medical droid for treatment.`);
    this.save();
    this.ui.render();
  }

  gymTrain(){
    const s = this.state;
    s.stats.health = clampStat(s.stats.health + rand(2,6));
    s.stats.discipline = clampStat(s.stats.discipline + rand(1,3));
    this.log(`You trained hard to improve your physical condition.`);
    this.save();
    this.ui.render();
  }

  study(){
    const s = this.state;
    s.stats.smarts = clampStat(s.stats.smarts + rand(2,6));
    this.log(`You spent time studying and expanding your knowledge.`);
    this.save();
    this.ui.render();
  }

  meditate(){
    const s = this.state;
    if(!s.forceSensitive){ this.log("You have no connection to the Force to meditate on."); this.ui.render(); return; }
    s.stats.discipline = clampStat(s.stats.discipline + rand(2,5));
    s.alignment += rand(-2,4);
    this.log(`You meditated, feeling the currents of the Force flow around you.`);
    this.save();
    this.ui.render();
  }

  /* ---------------- SAVE / LOAD ---------------- */
  save(){
    try{ localStorage.setItem("swbitlife_save", JSON.stringify(this.state)); }catch(e){}
  }
  loadSave(){
    try{
      const raw = localStorage.getItem("swbitlife_save");
      if(!raw) return false;
      const parsed = JSON.parse(raw);
      // re-hydrate class refs not needed since we store plain data + refetch era/species/homeworld by id
      parsed.era = ERAS.find(e=>e.id===parsed.era.id) || parsed.era;
      parsed.species = SPECIES.find(sp=>sp.id===parsed.species.id) || parsed.species;
      parsed.homeworld = HOMEWORLDS.find(h=>h.id===parsed.homeworld.id) || parsed.homeworld;
      this.state = parsed;
      return true;
    }catch(e){ return false; }
  }
  clearSave(){ try{ localStorage.removeItem("swbitlife_save"); }catch(e){} }
}
