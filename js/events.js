/* ============================================================
   LIFE EVENT POOLS
   Flavor events auto-apply. Choice events pause for player input.
   effects(state) mutates stats directly; may return a log string
   (falls back to the event's own text if not provided).
   ============================================================ */

function clampStat(v){ return Math.max(0, Math.min(100, v)); }

/* ---------- FLAVOR EVENTS (no choice, just happen) ---------- */
const FLAVOR_EVENTS = [
  // Infant / Child (0-7)
  { min:0, max:2, text:"You took your first steps and immediately fell into a potted Bafforr sapling.", effects:s=>{s.stats.health=clampStat(s.stats.health+1);} },
  { min:0, max:2, text:"You babbled your first words — sounded suspiciously like Shyriiwook.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+1);} },
  { min:1, max:4, text:"A street performer's pit droid made you laugh until you hiccupped.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+1);} },
  { min:2, max:6, text:"You got lost in a crowded market and were found napping in a fruit stall.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+1);} },
  { min:3, max:7, text:"You built a small tower out of old droid parts. It only fell over twice.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+2);} },
  { min:3, max:7, text:"You were scared by a HoloNet news report about pirates and had nightmares for a week.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline-2);} },
  { min:4, max:8, text:"You learned to ride a hoverboard, wobbling the whole way.", effects:s=>{s.stats.health=clampStat(s.stats.health+2);} },
  { min:4, max:9, text:"You asked your parents a thousand questions about the stars.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+2);} },
  { min:5, max:10, text:"You got into a scuffle with another kid over a broken toy speeder.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline-1);} },
  { min:5, max:10, text:"A traveling storyteller told you tales of ancient Jedi. You were mesmerized.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+1);} },

  // Kid / Preteen (7-13)
  { min:7, max:13, text:"You aced a school exam on galactic history.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+3);} },
  { min:7, max:13, text:"You skipped class to watch a podrace and got caught.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline-3);} },
  { min:7, max:13, text:"You made a lifelong friend on the playground.", effects:s=>{} },
  { min:7, max:13, text:"You tinkered with an old astromech and actually got it to whistle a tune.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+3);} },
  { min:8, max:14, text:"You caught a nasty case of Bota flu and were bedridden for weeks.", effects:s=>{s.stats.health=clampStat(s.stats.health-5);} },
  { min:8, max:14, text:"You won a school swoop-racing competition.", effects:s=>{s.stats.looks=clampStat(s.stats.looks+2);s.stats.discipline=clampStat(s.stats.discipline+1);} },
  { min:9, max:14, text:"You spent a summer working the docks and came back stronger.", effects:s=>{s.stats.health=clampStat(s.stats.health+3);} },
  { min:9, max:14, text:"You got a bad haircut before a big holo-photo. Painful.", effects:s=>{s.stats.looks=clampStat(s.stats.looks-3);} },
  { min:10, max:15, text:"You started reading about the great pilots of the galaxy and dreamed of the stars.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+2);} },
  { min:10, max:15, text:"You got into your first real fistfight and held your own.", effects:s=>{s.stats.health=clampStat(s.stats.health+1);s.stats.discipline=clampStat(s.stats.discipline-1);} },

  // Teen (13-18)
  { min:13, max:18, text:"You attended your first cantina show and loved every second.", effects:s=>{s.stats.looks=clampStat(s.stats.looks+1);} },
  { min:13, max:18, text:"You crammed for finals and pulled through with excellent marks.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+4);} },
  { min:13, max:18, text:"You got a nasty rash from Devaronian pollen at a school trip.", effects:s=>{s.stats.health=clampStat(s.stats.health-2);s.stats.looks=clampStat(s.stats.looks-1);} },
  { min:14, max:19, text:"You spent your credits on flashy new clothes.", effects:s=>{s.stats.looks=clampStat(s.stats.looks+3);s.wealth=Math.max(0,s.wealth-150);} },
  { min:14, max:19, text:"You snuck out to a street race and nearly got caught by local security.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline-2);} },
  { min:15, max:19, text:"You took up training with a training remote — reflexes sharpened.", effects:s=>{s.stats.health=clampStat(s.stats.health+2);s.stats.discipline=clampStat(s.stats.discipline+2);} },
  { min:15, max:20, text:"You had your heart broken for the first time.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline-3);} },
  { min:15, max:20, text:"You worked odd jobs at the spaceport and saved up some credits.", effects:s=>{s.wealth+=Math.floor(100+Math.random()*400);} },

  // Adult (18-65)
  { min:18, max:65, text:"You had a great year — friends, credits, and good health all around.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+3);} },
  { min:18, max:65, text:"You caught a bug going around the ship's recycled air system.", effects:s=>{s.stats.health=clampStat(s.stats.health-4);} },
  { min:18, max:65, text:"You invested some credits with a smooth-talking Muun banker. It actually paid off.", effects:s=>{s.wealth+=Math.floor(200+Math.random()*1500);} },
  { min:18, max:65, text:"You invested some credits with a smooth-talking Muun banker. He vanished with your credits.", effects:s=>{s.wealth=Math.max(0,s.wealth-Math.floor(200+Math.random()*1200));s.stats.discipline=clampStat(s.stats.discipline-2);} },
  { min:18, max:65, text:"You spent a quiet year enjoying the simple pleasures of life.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+2);} },
  { min:18, max:65, text:"A HoloNet gossip rag ran an unflattering story about you.", effects:s=>{s.stats.looks=clampStat(s.stats.looks-2);s.stats.discipline=clampStat(s.stats.discipline-1);} },
  { min:18, max:65, text:"You picked up a new hobby restoring old droids.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+2);} },
  { min:18, max:65, text:"You got food poisoning from a shady street vendor's nerf skewers.", effects:s=>{s.stats.health=clampStat(s.stats.health-3);} },
  { min:20, max:70, text:"You threw a memorable party that people still talk about.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+2);s.wealth=Math.max(0,s.wealth-300);} },
  { min:20, max:70, text:"You took a long solo trip across the Outer Rim to clear your head.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+3);s.wealth=Math.max(0,s.wealth-500);} },
  { min:25, max:70, text:"You started feeling the aches of frequent hyperspace jumps.", effects:s=>{s.stats.health=clampStat(s.stats.health-2);} },
  { min:25, max:75, text:"Old friends threw you a surprise gathering. It meant more than you let on.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+3);} },

  // Elder (65+)
  { min:65, max:150, text:"You spent the year telling stories of your youth to anyone who'd listen.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+2);} },
  { min:65, max:150, text:"Your joints ache more than they used to.", effects:s=>{s.stats.health=clampStat(s.stats.health-3);} },
  { min:65, max:150, text:"You watched a new generation set out for adventures you once dreamed of.", effects:s=>{s.stats.discipline=clampStat(s.stats.discipline+1);} },
  { min:70, max:200, text:"You began writing your memoirs for whoever might read them someday.", effects:s=>{s.stats.smarts=clampStat(s.stats.smarts+1);} }
];

/* ---------- SPECIAL / CHOICE EVENTS ---------- */
/* Each: id, once, condition(state), text, choices:[{label, effect(state,engine)}] */
const SPECIAL_EVENTS = [
  {
    id:"force_awakening",
    once:true,
    condition: s => s.forceSensitive && !s.forceDiscovered && s.age>=4 && s.age<=12 && Math.random()<0.5,
    text: s => `Something strange happened. ${s.name.first} moved an object across the room without touching it. The Force is strong in you.`,
    choices:[
      { label:"Tell your family", effect:(s,e)=>{ s.forceDiscovered=true; e.log("Your family was stunned, but supportive. Word may spread..."); } },
      { label:"Keep it secret", effect:(s,e)=>{ s.forceDiscovered=true; s.stats.discipline=clampStat(s.stats.discipline+2); e.log("You decided to keep your gift hidden, for now."); } }
    ]
  },
  {
    id:"jedi_recruitment",
    once:true,
    condition: s => s.forceSensitive && s.forceDiscovered && !s.career && ["high_republic","fall_of_jedi"].includes(s.era.id) && s.age>=5 && s.age<=13,
    text: s => "A Jedi Knight has come to test you for sensitivity to the Force. They offer to take you to the Jedi Temple on Coruscant to begin training.",
    choices:[
      { label:"Go with the Jedi", effect:(s,e)=>{ e.startCareer("jedi"); s.alignment+=10; e.log("You said goodbye to your family and left for the Jedi Temple."); } },
      { label:"Stay with your family", effect:(s,e)=>{ e.log("You chose to stay home. The Jedi Knight nodded respectfully and departed."); } }
    ]
  },
  {
    id:"sith_temptation",
    once:true,
    condition: s => s.forceSensitive && s.forceDiscovered && s.career?.id!=="jedi" && s.alignment<20 && s.age>=14 && s.age<=40 && Math.random()<0.15,
    text: s => "A cloaked figure senses your potential and your pain. They offer to teach you the ways of the dark side — power beyond your imagining.",
    choices:[
      { label:"Accept the dark path", effect:(s,e)=>{ e.startCareer("sith"); s.alignment-=25; e.log("You knelt before your new master and swore yourself to the dark side."); } },
      { label:"Refuse", effect:(s,e)=>{ s.alignment+=5; e.log("You refused. The figure smiled coldly and vanished into the shadows."); } }
    ]
  },
  {
    id:"order66",
    once:true,
    condition: s => s.career?.id==="jedi" && s.era.id==="fall_of_jedi" && s.year>=-19 && s.year<-18.9 && !s.order66,
    text: s => "Order 66 has been issued. Clone troopers you trusted turn their weapons on you without warning.",
    choices:[
      { label:"Fight for your life", effect:(s,e)=>{ s.order66=true; if(Math.random()<0.4){ e.die("violence","was cut down during Order 66, betrayed by soldiers you once called brothers."); } else { e.log("You narrowly escaped, your life as a hunted fugitive beginning tonight."); s.hunted=true; } } },
      { label:"Flee into hiding", effect:(s,e)=>{ s.order66=true; s.hunted=true; e.startCareer(null); e.log("You went into hiding, burying your lightsaber and your name."); } }
    ]
  },
  {
    id:"duel_challenge",
    once:false,
    condition: s => s.forceTrained && s.age>=18 && Math.random()<0.06,
    text: s => "A rival duelist challenges you to a lightsaber duel to settle a dispute.",
    choices:[
      { label:"Accept the duel", effect:(s,e)=>{
          const win = Math.random() < (0.4 + s.stats.discipline/250);
          if(win){ s.stats.looks=clampStat(s.stats.looks+2); s.wealth += 500; e.log("You won the duel decisively, your reputation growing."); }
          else if(Math.random()<0.2){ e.die("violence","fell in a lightsaber duel, outmatched by a superior blade."); }
          else { s.stats.health=clampStat(s.stats.health-15); e.log("You lost the duel and were badly wounded, but survived."); }
        } },
      { label:"Walk away", effect:(s,e)=>{ s.stats.discipline=clampStat(s.stats.discipline-2); e.log("You walked away. Some call it wisdom; others, cowardice."); } }
    ]
  },
  {
    id:"romance_offer",
    once:false,
    condition: s => s.age>=16 && !s.partner && Math.random()<0.18,
    text: s => "You've been spending a lot of time with someone special lately. They ask if you'd like to make it official.",
    choices:[
      { label:"Start a relationship", effect:(s,e)=>{ e.startRelationship(); } },
      { label:"Not right now", effect:(s,e)=>{ e.log("You decided you weren't ready. Maybe next time."); } }
    ]
  },
  {
    id:"marriage_proposal",
    once:false,
    condition: s => s.age>=18 && s.partner && !s.partner.married && s.partner.closeness>=70 && Math.random()<0.25,
    text: s => `${s.partner.name} gets down on one knee and offers you a small kyber-set ring. Will you marry them?`,
    choices:[
      { label:"Yes!", effect:(s,e)=>{ s.partner.married=true; s.stats.discipline=clampStat(s.stats.discipline+10); e.log(`You married ${s.partner.name} in a small ceremony.`); } },
      { label:"Not yet", effect:(s,e)=>{ s.partner.closeness-=10; e.log("You said not yet. They took it better than expected."); } }
    ]
  },
  {
    id:"have_child",
    once:false,
    condition: s => s.age>=20 && s.age<=55 && s.partner && s.partner.married && Math.random()<0.15,
    text: s => `You and ${s.partner.name} are expecting a child.`,
    choices:[
      { label:"Wonderful news", effect:(s,e)=>{ e.addChild(); } }
    ]
  },
  {
    id:"crime_caught",
    once:false,
    condition: s => s.wantedLevel>0 && Math.random()<0.12,
    text: s => "Local security forces corner you, acting on a tip about your recent activities.",
    choices:[
      { label:"Try to talk your way out", effect:(s,e)=>{
          if(Math.random() < 0.3 + s.stats.smarts/300){ e.log("Smooth talking got you out of it this time."); s.wantedLevel=Math.max(0,s.wantedLevel-1); }
          else { e.jail(); }
        } },
      { label:"Run for it", effect:(s,e)=>{
          if(Math.random() < 0.35 + s.stats.health/300){ e.log("You escaped through the crowded market, heart pounding."); }
          else { e.jail(); }
        } }
    ]
  },
  {
    id:"faction_mission",
    once:false,
    condition: s => s.career && ["jedi","sith","rebellion","imperial_military","resistance","first_order_military","republic_military","new_republic_military","bounty_hunter","mandalorian","inquisitor","ren"].includes(s.career.id) && Math.random()<0.14,
    text: s => "Your superiors assign you to a dangerous mission.",
    choices:[
      { label:"Carry out the mission", effect:(s,e)=>{
          const success = Math.random() < 0.55 + s.stats.discipline/300;
          if(success){ const reward = Math.floor(300+Math.random()*2000); s.wealth+=reward; s.stats.discipline=clampStat(s.stats.discipline+3); e.log(`Mission successful. You were paid ${reward.toLocaleString()} credits and commended.`); }
          else if(Math.random()<0.15){ e.die("violence","was killed in action during a mission."); }
          else { s.stats.health=clampStat(s.stats.health-20); e.log("The mission went sideways. You barely made it out alive."); }
        } },
      { label:"Refuse the mission", effect:(s,e)=>{ s.stats.discipline=clampStat(s.stats.discipline-5); e.log("You refused. Your superiors are not pleased."); } }
    ]
  },
  {
    id:"alderaan_destroyed",
    once:true,
    condition: s => s.homeworld.id==="alderaan" && s.currentPlanet==="alderaan" && s.year>=-0.4 && s.year<=0.4,
    text: s => "Word spreads of an unimaginable weapon. Moments later, the sky itself seems to scream.",
    choices:[
      { label:"...", effect:(s,e)=>{ e.die("catastrophe","died when Alderaan was obliterated by the Death Star's superlaser."); } }
    ]
  },
  {
    id:"hosnian_destroyed",
    once:true,
    condition: s => s.homeworld.id==="hosnian_prime" && s.currentPlanet==="hosnian_prime" && s.year>=33.6 && s.year<=34.4,
    text: s => "A beam of unnatural light streaks across the sky from an unknown direction.",
    choices:[
      { label:"...", effect:(s,e)=>{ e.die("catastrophe","was killed when Starkiller Base annihilated the Hosnian system."); } }
    ]
  },
  {
    id:"fall_to_dark_side",
    once:false,
    condition: s => s.career?.id==="jedi" && s.alignment<-30 && Math.random()<0.2,
    text: s => "Doubt and anger have been gnawing at you. The Jedi Council notices a darkness growing in you.",
    choices:[
      { label:"Embrace the dark side and leave the Order", effect:(s,e)=>{ e.startCareer("sith"); s.alignment-=20; e.log("You turned your back on the Jedi and walked into shadow."); } },
      { label:"Meditate and recommit to the light", effect:(s,e)=>{ s.alignment+=20; s.stats.discipline=clampStat(s.stats.discipline+5); e.log("You meditated for days and found your center again."); } }
    ]
  },
  {
    id:"redemption",
    once:false,
    condition: s => s.career?.id==="sith" && s.alignment>30 && Math.random()<0.15,
    text: s => "Memories of who you once were resurface. A flicker of light remains in you.",
    choices:[
      { label:"Turn back to the light", effect:(s,e)=>{ e.startCareer("grey"); s.alignment+=25; e.log("You broke from the Sith, hunted now by your former master."); } },
      { label:"Suppress the feeling", effect:(s,e)=>{ s.alignment-=10; e.log("You pushed the feeling down, deeper into the dark."); } }
    ]
  },
  {
    id:"cybernetic_offer",
    once:false,
    condition: s => s.stats.health<30 && s.wealth>3000 && Math.random()<0.3,
    text: s => "A back-alley cybernetics surgeon offers to replace your failing limb with a durasteel prosthetic.",
    choices:[
      { label:"Get the cybernetic implant (3,000 credits)", effect:(s,e)=>{ if(s.wealth>=3000){ s.wealth-=3000; s.stats.health=clampStat(s.stats.health+30); e.log("The surgery was a success. You feel stronger, if a little more machine than before."); } } },
      { label:"Decline", effect:(s,e)=>{ e.log("You declined. Cybernetics aren't for everyone."); } }
    ]
  },
  {
    id:"holocron_discovery",
    once:true,
    condition: s => s.forceSensitive && s.age>=18 && Math.random()<0.08,
    text: s => "Buried in the ruins of an old temple, you discover a Jedi holocron humming with ancient knowledge.",
    choices:[
      { label:"Study it", effect:(s,e)=>{ s.stats.smarts=clampStat(s.stats.smarts+10); s.alignment+=5; e.log("The holocron's teachings expanded your understanding of the Force."); } },
      { label:"Sell it on the black market", effect:(s,e)=>{ const pay=Math.floor(2000+Math.random()*4000); s.wealth+=pay; s.alignment-=5; e.log(`You sold the holocron to a collector for ${pay.toLocaleString()} credits.`); } }
    ]
  }
];
