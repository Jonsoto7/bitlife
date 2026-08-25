/* ============================================================
   UI LAYER — Star Wars BitLife
   ============================================================ */

const UI = {
  game: null,
  activeTab: "life",

  init(){
    this.game = new Game(this);
    document.getElementById("loading-quote").textContent = "“" + pick(LOADING_QUOTES) + "”";
    this.populateCreationForm();
    this.wireCreationEvents();
    this.wireGameEvents();

    if(localStorage.getItem("swbitlife_save")){
      document.getElementById("btn-continue").hidden = false;
    }
    document.getElementById("btn-continue").onclick = ()=>{
      if(this.game.loadSave()){
        this.showGameScreen();
        this.render();
      }
    };
  },

  /* ---------- CREATION SCREEN ---------- */
  populateCreationForm(){
    const eraSel = document.getElementById("sel-era");
    eraSel.innerHTML = ERAS.map(e=>`<option value="${e.id}">${e.name} (${e.range})</option>`).join("");
    const speciesSel = document.getElementById("sel-species");
    speciesSel.innerHTML = SPECIES.map(sp=>`<option value="${sp.id}">${sp.name}</option>`).join("");
    this.updateSpeciesBlurb();
    this.updateEraBlurb();
    this.populateHomeworlds();
  },

  populateHomeworlds(){
    const speciesId = document.getElementById("sel-species").value;
    const species = SPECIES.find(s=>s.id===speciesId);
    const hwSel = document.getElementById("sel-homeworld");
    const worlds = species.homeworlds.map(id=>HOMEWORLDS.find(h=>h.id===id)).filter(Boolean);
    const list = worlds.length ? worlds : HOMEWORLDS;
    hwSel.innerHTML = list.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");
    this.updateHomeworldBlurb();
  },

  updateEraBlurb(){
    const era = ERAS.find(e=>e.id===document.getElementById("sel-era").value);
    document.getElementById("era-blurb").textContent = era ? era.blurb : "";
  },
  updateSpeciesBlurb(){
    const sp = SPECIES.find(s=>s.id===document.getElementById("sel-species").value);
    document.getElementById("species-blurb").textContent = sp ? sp.blurb : "";
  },
  updateHomeworldBlurb(){
    const hw = HOMEWORLDS.find(h=>h.id===document.getElementById("sel-homeworld").value);
    document.getElementById("homeworld-blurb").textContent = hw ? hw.blurb : "";
  },

  wireCreationEvents(){
    document.getElementById("sel-era").onchange = ()=>this.updateEraBlurb();
    document.getElementById("sel-species").onchange = ()=>{ this.updateSpeciesBlurb(); this.populateHomeworlds(); };
    document.getElementById("sel-homeworld").onchange = ()=>this.updateHomeworldBlurb();
    document.getElementById("btn-start").onclick = ()=>{
      const opts = {
        eraId: document.getElementById("sel-era").value,
        speciesId: document.getElementById("sel-species").value,
        homeworldId: document.getElementById("sel-homeworld").value,
        gender: document.getElementById("sel-gender").value,
        firstName: document.getElementById("inp-first").value.trim(),
        lastName: document.getElementById("inp-last").value.trim()
      };
      this.game.newLife(opts);
      this.showGameScreen();
      this.render();
    };
    document.getElementById("btn-new-life").onclick = ()=>{
      if(confirm("Abandon your current life and return to character creation?")){
        this.showCreationScreen();
      }
    };
    document.getElementById("btn-restart").onclick = ()=>{
      this.game.clearSave();
      document.getElementById("death-screen").hidden = true;
      this.showCreationScreen();
    };
  },

  showCreationScreen(){
    document.getElementById("creation-screen").hidden = false;
    document.getElementById("game-screen").hidden = true;
    document.getElementById("death-screen").hidden = true;
  },
  showGameScreen(){
    document.getElementById("creation-screen").hidden = true;
    document.getElementById("game-screen").hidden = false;
  },

  /* ---------- GAME EVENTS ---------- */
  wireGameEvents(){
    document.getElementById("btn-age-up").onclick = ()=>this.game.ageUp();
    document.querySelectorAll(".tab-btn").forEach(btn=>{
      btn.onclick = ()=>{
        document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.dataset.tab;
        this.renderTab();
      };
    });
  },

  /* ---------- MAIN RENDER ---------- */
  render(){
    const s = this.game.state;
    if(!s) return;

    if(!s.alive){
      this.renderDeath();
      return;
    }

    document.getElementById("char-name").textContent = `${s.name.first} ${s.name.last}`.trim();
    document.getElementById("char-sub").textContent = `${s.species.name} · Age ${s.age} · ${fmtYear(s.year)} · ${s.era.name}`;
    document.getElementById("char-credits").textContent = `⌘ ${Math.floor(s.wealth).toLocaleString()} credits`;

    const bars = [
      ["Health", s.stats.health, "#3fbf5f"],
      ["Smarts", s.stats.smarts, "#3f8fd8"],
      ["Looks", s.stats.looks, "#d8973f"],
      ["Discipline", s.stats.discipline, "#a25fd8"]
    ];
    document.getElementById("stat-bars").innerHTML = bars.map(([label,val,color])=>`
      <div class="stat-row">
        <span class="stat-label">${label}</span>
        <div class="stat-track"><div class="stat-fill" style="width:${val}%;background:${color}"></div></div>
        <span class="stat-val">${Math.round(val)}</span>
      </div>`).join("");

    if(s.forceSensitive && s.forceDiscovered){
      document.getElementById("align-bar-wrap").style.display = "";
      const pct = (s.alignment+100)/2;
      document.getElementById("align-fill").style.width = pct+"%";
      document.getElementById("align-marker").style.left = pct+"%";
    } else {
      document.getElementById("align-bar-wrap").style.display = "none";
    }

    document.getElementById("btn-age-up").disabled = !!this.game.pending;
    this.renderTab();

    if(this.game.pending){
      this.renderChoice();
    } else {
      document.getElementById("choice-modal").hidden = true;
    }
  },

  renderChoice(){
    const ev = this.game.pending;
    const s = this.game.state;
    document.getElementById("choice-text").textContent = typeof ev.text==="function" ? ev.text(s) : ev.text;
    const opts = document.getElementById("choice-options");
    opts.innerHTML = "";
    ev.choices.forEach((c,idx)=>{
      const b = document.createElement("button");
      b.className = "btn-primary";
      b.textContent = c.label;
      b.onclick = ()=>this.game.resolveChoice(idx);
      opts.appendChild(b);
    });
    document.getElementById("choice-modal").hidden = false;
  },

  renderDeath(){
    document.getElementById("game-screen").hidden = true;
    document.getElementById("choice-modal").hidden = true;
    const s = this.game.state;
    document.getElementById("death-summary").innerHTML =
      `<strong>${s.name.first} ${s.name.last}</strong> lived to age <strong>${s.age}</strong> (${fmtYear(s.year)}).<br><br>
       ${s.name.first} ${s.deathText}`;
    const careerTxt = s.career ? CAREERS.find(c=>c.id===s.career.id).ranks[s.career.rankIndex].title + " in the " + CAREERS.find(c=>c.id===s.career.id).name : "No formal career";
    document.getElementById("death-stats").innerHTML = `
      <div class="bio-grid">
        <div><span>Species</span><b>${s.species.name}</b></div>
        <div><span>Homeworld</span><b>${s.homeworld.name}</b></div>
        <div><span>Career</span><b>${careerTxt}</b></div>
        <div><span>Wealth at death</span><b>${Math.floor(s.wealth).toLocaleString()} credits</b></div>
        <div><span>Force Sensitive</span><b>${s.forceSensitive ? "Yes" : "No"}</b></div>
        ${s.forceSensitive ? `<div><span>Alignment</span><b>${s.alignment>10?"Light Side":s.alignment<-10?"Dark Side":"Balanced"}</b></div>` : ""}
        <div><span>Children</span><b>${s.children.length}</b></div>
      </div>`;
    document.getElementById("death-screen").hidden = false;
  },

  /* ---------- TAB CONTENT ---------- */
  renderTab(){
    const s = this.game.state;
    const el = document.getElementById("tab-content");
    if(this.activeTab==="life") el.innerHTML = this.tabLife(s);
    else if(this.activeTab==="career") el.innerHTML = this.tabCareer(s);
    else if(this.activeTab==="force") el.innerHTML = this.tabForce(s);
    else if(this.activeTab==="relationships") el.innerHTML = this.tabRelationships(s);
    else if(this.activeTab==="assets") el.innerHTML = this.tabAssets(s);
    else if(this.activeTab==="crime") el.innerHTML = this.tabCrime(s);
    else if(this.activeTab==="travel") el.innerHTML = this.tabTravel(s);
    else if(this.activeTab==="bio") el.innerHTML = this.tabBio(s);
    this.wireTabButtons();
  },

  tabLife(s){
    if(s.jailYearsLeft>0){
      return `<div class="panel"><h3>In Detention</h3><p>You are serving time. ${s.jailYearsLeft} year(s) remaining. Age up to continue your sentence.</p></div>
        <div class="log-feed">${this.logHTML(s)}</div>`;
    }
    return `
      <div class="panel actions-grid">
        <button data-act="study">Study</button>
        <button data-act="gym">Train Body</button>
        <button data-act="meditate">Meditate</button>
        <button data-act="medic">Visit Medic (300cr)</button>
      </div>
      <div class="log-feed">${this.logHTML(s)}</div>`;
  },
  logHTML(s){
    return s.log.slice(0,60).map(l=>`<div class="log-entry"><span class="log-age">Age ${l.age} · ${l.year}</span>${l.text}</div>`).join("");
  },

  tabCareer(s){
    let html = "";
    if(s.career){
      const track = CAREERS.find(c=>c.id===s.career.id);
      const rank = track.ranks[s.career.rankIndex];
      html += `<div class="panel">
        <h3>${track.name}</h3>
        <p>Current Rank: <b>${rank.title}</b></p>
        <p>Salary: ${rank.salary.toLocaleString()} credits/year</p>
        ${s.lightsaberForm ? `<p>Lightsaber Form: <b>${s.lightsaberForm}</b></p>` : ""}
        <button data-act="quitcareer" class="btn-danger">Leave this path</button>
      </div>`;
    } else {
      html += `<div class="panel"><h3>Unemployed</h3><p>Choose a path below.</p></div>`;
    }
    const avail = this.game.availableCareers().filter(c=>!s.career || c.id!==s.career.id);
    html += `<div class="panel"><h3>Available Paths</h3><div class="career-list">`;
    avail.forEach(c=>{
      html += `<button class="career-item" data-startcareer="${c.id}">
        <b>${c.name}</b><span>${c.force?"Force-sensitive path":"Open career"}</span>
      </button>`;
    });
    html += `</div></div>`;
    return html;
  },

  tabForce(s){
    if(!s.forceSensitive){
      return `<div class="panel"><h3>The Force</h3><p>You have no connection to the Force in this life. Some are simply not born with it.</p></div>`;
    }
    if(!s.forceDiscovered){
      return `<div class="panel"><h3>The Force</h3><p>You may be Force-sensitive, but it hasn't awakened yet. Keep aging up... something may happen.</p></div>`;
    }
    const align = s.alignment>10?"Light Side":s.alignment<-10?"Dark Side":"Balanced";
    return `<div class="panel">
      <h3>The Force</h3>
      <p>Alignment: <b>${align}</b> (${s.alignment})</p>
      <p>Force Trained: <b>${s.forceTrained ? "Yes" : "No"}</b></p>
      ${s.lightsaberForm ? `<p>Lightsaber Form: <b>${s.lightsaberForm}</b></p>` : ""}
      <p class="blurb">Known Force Powers manifest through training and life experience. Keep progressing your career and aging up to grow stronger.</p>
      <div class="power-list">${FORCE_POWERS.slice(0, s.forceTrained?FORCE_POWERS.length:3).map(p=>`<span class="power-chip">${p}</span>`).join("")}</div>
    </div>`;
  },

  tabRelationships(s){
    let html = `<div class="panel"><h3>Family</h3>
      <div class="rel-item"><b>${s.parents.father.name}</b><span>Father · ${s.parents.father.job} · ${s.parents.father.alive?"Alive":"Deceased"}</span></div>
      <div class="rel-item"><b>${s.parents.mother.name}</b><span>Mother · ${s.parents.mother.job} · ${s.parents.mother.alive?"Alive":"Deceased"}</span></div>
      ${s.siblings.map(sib=>`<div class="rel-item"><b>${sib.name}</b><span>Sibling</span></div>`).join("")}
    </div>`;

    html += `<div class="panel"><h3>Partner</h3>`;
    if(s.partner){
      html += `<div class="rel-item"><b>${s.partner.name}</b><span>${s.partner.married?"Spouse":"Partner"} · Closeness ${s.partner.closeness}</span></div>
        <button data-act="breakup" class="btn-danger">${s.partner.married?"Separate":"Break Up"}</button>`;
    } else {
      html += `<p class="blurb">You're not seeing anyone right now. Life events may present opportunities.</p>`;
    }
    html += `</div>`;

    if(s.children.length){
      html += `<div class="panel"><h3>Children</h3>${s.children.map(c=>`<div class="rel-item"><b>${c.name}</b><span>Age ${c.age}</span></div>`).join("")}</div>`;
    }
    return html;
  },

  tabAssets(s){
    let html = `<div class="panel"><h3>Owned</h3>`;
    if(s.assetsOwned.length===0) html += `<p class="blurb">You own nothing yet.</p>`;
    s.assetsOwned.forEach((a,idx)=>{
      html += `<div class="rel-item"><b>${a.name}</b><span>Upkeep ${a.upkeep}/yr</span><button data-sell="${idx}" class="btn-danger small">Sell</button></div>`;
    });
    html += `</div>`;
    ["droids","vehicles","property"].forEach(cat=>{
      html += `<div class="panel"><h3>${cat[0].toUpperCase()+cat.slice(1)}</h3><div class="career-list">`;
      ASSETS[cat].forEach(item=>{
        html += `<button class="career-item" data-buy="${cat}|${item.id}">
          <b>${item.name}</b><span>${item.cost.toLocaleString()} credits · ${item.upkeep}/yr upkeep</span>
        </button>`;
      });
      html += `</div></div>`;
    });
    return html;
  },

  tabCrime(s){
    let html = `<div class="panel"><h3>Wanted Level</h3><p>${"★".repeat(s.wantedLevel)}${"☆".repeat(5-s.wantedLevel)}</p></div>`;
    html += `<div class="panel"><h3>Opportunities</h3><div class="career-list">`;
    CRIMES.forEach(c=>{
      html += `<button class="career-item" data-crime="${c.id}">
        <b>${c.name}</b><span>Risk ${Math.round(c.risk*100)}% · Payout ${c.payout[0]}-${c.payout[1]} credits</span>
      </button>`;
    });
    html += `</div></div>`;
    return html;
  },

  tabTravel(s){
    let html = `<div class="panel"><h3>Current Location</h3><p>${HOMEWORLDS.find(h=>h.id===s.currentPlanet)?.name || s.currentPlanet}</p></div>`;
    html += `<div class="panel"><h3>Book Passage (200 credits)</h3><div class="career-list">`;
    HOMEWORLDS.filter(h=>h.id!==s.currentPlanet).forEach(h=>{
      const destroyed = h.destroyedYear!==undefined && s.year>=h.destroyedYear;
      html += `<button class="career-item" data-travel="${h.id}" ${destroyed?"disabled":""}>
        <b>${h.name}</b><span>${h.region}${destroyed?" · DESTROYED":""}</span>
      </button>`;
    });
    html += `</div></div>`;
    return html;
  },

  tabBio(s){
    return `<div class="panel"><h3>Character Sheet</h3>
      <div class="bio-grid">
        <div><span>Name</span><b>${s.name.first} ${s.name.last}</b></div>
        <div><span>Species</span><b>${s.species.name}</b></div>
        <div><span>Homeworld</span><b>${s.homeworld.name}</b></div>
        <div><span>Gender</span><b>${s.gender}</b></div>
        <div><span>Era</span><b>${s.era.name}</b></div>
        <div><span>Age</span><b>${s.age}</b></div>
        <div><span>Wealth</span><b>${Math.floor(s.wealth).toLocaleString()} cr</b></div>
        <div><span>Force Sensitive</span><b>${s.forceSensitive?"Yes":"No"}</b></div>
        <div><span>Hunted</span><b>${s.hunted?"Yes":"No"}</b></div>
        <div><span>Wanted Level</span><b>${s.wantedLevel}/5</b></div>
      </div>
      <p class="blurb">${s.species.blurb}</p>
      <p class="blurb">${s.homeworld.blurb}</p>
    </div>`;
  },

  wireTabButtons(){
    const el = document.getElementById("tab-content");
    el.querySelectorAll("[data-act]").forEach(b=>{
      b.onclick = ()=>{
        const act = b.dataset.act;
        if(act==="study") this.game.study();
        else if(act==="gym") this.game.gymTrain();
        else if(act==="meditate") this.game.meditate();
        else if(act==="medic") this.game.visitMedic();
        else if(act==="quitcareer") this.game.quitCareer();
        else if(act==="breakup") this.game.breakUp();
      };
    });
    el.querySelectorAll("[data-startcareer]").forEach(b=>{
      b.onclick = ()=>{ this.game.startCareer(b.dataset.startcareer); this.game.save(); this.render(); };
    });
    el.querySelectorAll("[data-buy]").forEach(b=>{
      b.onclick = ()=>{ const [cat,id] = b.dataset.buy.split("|"); this.game.buyAsset(cat,id); };
    });
    el.querySelectorAll("[data-sell]").forEach(b=>{
      b.onclick = ()=>{ this.game.sellAsset(parseInt(b.dataset.sell,10)); };
    });
    el.querySelectorAll("[data-crime]").forEach(b=>{
      b.onclick = ()=>{ this.game.commitCrime(b.dataset.crime); };
    });
    el.querySelectorAll("[data-travel]").forEach(b=>{
      b.onclick = ()=>{ this.game.travelTo(b.dataset.travel); };
    });
  }
};

document.addEventListener("DOMContentLoaded", ()=>UI.init());
