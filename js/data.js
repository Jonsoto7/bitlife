/* ============================================================
   HOLONET ARCHIVES — Star Wars BitLife data tables
   All content here is original flavor text written in the style
   of Star Wars lore (species, planets, eras, careers, events).
   ============================================================ */

/* ---------- ERAS ---------- */
const ERAS = [
  {
    id: "high_republic",
    name: "The High Republic",
    range: "500-100 BBY",
    start: -232, end: -100,
    blurb: "The Golden Age of the Jedi. The Republic's light reaches farthest to the Outer Rim, and hundreds of Jedi keep the peace across the galaxy.",
    factions: ["jedi", "republic", "independent", "hutt_cartel"]
  },
  {
    id: "fall_of_jedi",
    name: "Fall of the Jedi",
    range: "32-19 BBY",
    start: -32, end: -19,
    blurb: "The Clone Wars rage between the Republic and the Separatist Alliance. Jedi Generals lead clone armies as the Republic slides toward Empire.",
    factions: ["jedi", "republic", "separatist", "independent", "hutt_cartel", "bounty_hunter_guild"]
  },
  {
    id: "empire",
    name: "Reign of the Empire",
    range: "19 BBY - 4 ABY",
    start: -19, end: 4,
    blurb: "The Jedi are all but extinct. Emperor Palpatine's Galactic Empire rules with an iron fist, while a fledgling Rebel Alliance dares to resist.",
    factions: ["empire", "rebellion", "sith", "inquisitorius", "independent", "hutt_cartel", "bounty_hunter_guild"]
  },
  {
    id: "new_republic",
    name: "Age of the New Republic",
    range: "5-34 ABY",
    start: 5, end: 34,
    blurb: "The Empire has fallen. Luke Skywalker rebuilds the Jedi Order in secret as the New Republic struggles to govern a war-weary galaxy.",
    factions: ["new_republic", "jedi", "independent", "hutt_cartel", "bounty_hunter_guild", "mandalorian"]
  },
  {
    id: "first_order",
    name: "Age of the First Order",
    range: "34-45 ABY",
    start: 34, end: 45,
    blurb: "From the ashes of the Empire, the First Order rises. The Resistance, backed by General Organa, is all that stands against total conquest.",
    factions: ["first_order", "resistance", "knights_of_ren", "independent", "hutt_cartel", "mandalorian"]
  }
];

/* ---------- FACTIONS ---------- */
const FACTIONS = {
  jedi: { name: "Jedi Order", alignment: "light" },
  sith: { name: "Sith Order", alignment: "dark" },
  inquisitorius: { name: "Inquisitorius", alignment: "dark" },
  knights_of_ren: { name: "Knights of Ren", alignment: "dark" },
  republic: { name: "Galactic Republic", alignment: "neutral" },
  separatist: { name: "Confederacy of Independent Systems", alignment: "neutral" },
  empire: { name: "Galactic Empire", alignment: "neutral" },
  rebellion: { name: "Rebel Alliance", alignment: "neutral" },
  new_republic: { name: "New Republic", alignment: "neutral" },
  first_order: { name: "First Order", alignment: "neutral" },
  resistance: { name: "Resistance", alignment: "neutral" },
  hutt_cartel: { name: "Hutt Cartel", alignment: "neutral" },
  bounty_hunter_guild: { name: "Bounty Hunters' Guild", alignment: "neutral" },
  mandalorian: { name: "Mandalorians", alignment: "neutral" },
  independent: { name: "Independent", alignment: "neutral" }
};

/* ---------- HOMEWORLDS ---------- */
const HOMEWORLDS = [
  { id: "coruscant", name: "Coruscant", region: "Core Worlds", blurb: "An entire planet blanketed by a single cityscape, seat of galactic government." },
  { id: "tatooine", name: "Tatooine", region: "Outer Rim", blurb: "A harsh desert world of twin suns, moisture farms, and Hutt-controlled spaceports." },
  { id: "naboo", name: "Naboo", region: "Mid Rim", blurb: "A lush, peaceful world of rolling plains, plasma mines, and an underwater Gungan civilization." },
  { id: "alderaan", name: "Alderaan", region: "Core Worlds", blurb: "A idyllic, pacifist world of mountains and art, beloved across the galaxy.", destroyedYear: 0 },
  { id: "corellia", name: "Corellia", region: "Core Worlds", blurb: "A shipbuilding powerhouse world famous for producing daring pilots and smugglers." },
  { id: "kashyyyk", name: "Kashyyyk", region: "Mid Rim", blurb: "A dense wroshyr-tree forest world, homeworld of the Wookiees." },
  { id: "ryloth", name: "Ryloth", region: "Outer Rim", blurb: "A rugged world of canyons and underground cities, homeworld of the Twi'leks." },
  { id: "mon_cala", name: "Mon Cala", region: "Outer Rim", blurb: "An ocean world of coral cities, home to the Mon Calamari and Quarren." },
  { id: "sullust", name: "Sullust", region: "Outer Rim", blurb: "A volcanic world whose people, the Sullustans, live mostly in vast underground cave-cities." },
  { id: "bothawui", name: "Bothawui", region: "Mid Rim", blurb: "Homeworld of the Bothans, masters of information and the galaxy's spy networks." },
  { id: "duro", name: "Duro", region: "Core Worlds", blurb: "A once-poisoned world of the Duros, pioneers of galactic space travel." },
  { id: "csilla", name: "Csilla", region: "Unknown Regions", blurb: "A frozen world beyond the Chiss Ascendancy's icy borders." },
  { id: "glee_anselm", name: "Glee Anselm", region: "Mid Rim", blurb: "A water-world of tranquil seas, home to the Nautolans." },
  { id: "ithor", name: "Ithor", region: "Mid Rim", blurb: "A garden world revered by the peaceful, herd-dwelling Ithorians." },
  { id: "devaron", name: "Devaron", region: "Outer Rim", blurb: "A rugged, forested world home to the horned Devaronians." },
  { id: "zeltros", name: "Zeltros", region: "Outer Rim", blurb: "A pleasure world famed for its hedonistic, empathic Zeltron people." },
  { id: "nal_hutta", name: "Nal Hutta", region: "Outer Rim", blurb: "A swampy, polluted world ruled by the Hutt Grand Council." },
  { id: "mirial", name: "Mirial", region: "Outer Rim", blurb: "A dry, harsh world of the tattooed, disciplined Mirialans." },
  { id: "kamino", name: "Kamino", region: "Wild Space", blurb: "A stormy ocean world hidden from most star charts, famous for its cloners." },
  { id: "dathomir", name: "Dathomir", region: "Outer Rim", blurb: "A blood-red world of rancors, dark magick, and the Nightsisters." },
  { id: "mandalore", name: "Mandalore", region: "Outer Rim", blurb: "A war-scarred world of warrior clans bound by the Resol'nare." },
  { id: "lothal", name: "Lothal", region: "Outer Rim", blurb: "A quiet farming world of grasslands, later a hotbed of early rebellion." },
  { id: "jakku", name: "Jakku", region: "Western Reaches", blurb: "A desert junkyard world littered with the wreckage of a galaxy-altering battle." },
  { id: "jedha", name: "Jedha", region: "Outer Rim", blurb: "A holy moon of ancient temples and kyber crystal mines.", destroyedYear: 0 },
  { id: "hoth", name: "Hoth", region: "Outer Rim", blurb: "A remote ice world, home to wampas and, briefly, a hidden Rebel base." },
  { id: "bespin", name: "Bespin", region: "Outer Rim", blurb: "A gas giant famous for Cloud City, a tibanna-gas mining colony." },
  { id: "geonosis", name: "Geonosis", region: "Outer Rim", blurb: "A dry, rocky world of hive-minded insectoid Geonosians and droid foundries." },
  { id: "nar_shaddaa", name: "Nar Shaddaa", region: "Hutt Space", blurb: "The 'Smuggler's Moon,' a lawless, neon-lit den of scum and villainy." },
  { id: "onderon", name: "Onderon", region: "Inner Rim", blurb: "A walled-city world once torn between monarchy and Separatist rebellion." },
  { id: "chandrila", name: "Chandrila", region: "Core Worlds", blurb: "A pastoral, democratic world that became the first capital of the New Republic." },
  { id: "hosnian_prime", name: "Hosnian Prime", region: "Hosnian System", blurb: "A shining capital world of the New Republic Senate.", destroyedYear: 34 },
  { id: "takodana", name: "Takodana", region: "Outer Rim", blurb: "A green, forested world hosting Maz Kanata's ancient neutral-ground castle." },
  { id: "batuu", name: "Batuu", region: "Outer Rim", blurb: "A frontier trading outpost on the edge of Wild Space, far from the Core's laws." },
  { id: "exegol", name: "Exegol", region: "Unknown Regions", blurb: "A hidden Sith world shrouded by a dark-side nexus and a shroud of secrecy." },
  { id: "concord_dawn", name: "Concord Dawn", region: "Mandalore Sector", blurb: "A harsh homeworld of warrior clans within the Mandalore system." },
  { id: "utapau", name: "Utapau", region: "Outer Rim", blurb: "A world of vast sinkholes housing cities and Pau'an elders." },
  { id: "cato_neimoidia", name: "Cato Neimoidia", region: "Colonies", blurb: "A world of bridge-cities suspended over deep canyons, home of the Neimoidians." },
  { id: "felucia", name: "Felucia", region: "Outer Rim", blurb: "A vivid, fungal jungle world of bioluminescent color and hidden dangers." }
];

/* ---------- SPECIES ---------- */
const SPECIES = [
  { id: "human", name: "Human", homeworlds: ["coruscant","corellia","alderaan","chandrila","naboo","tatooine","lothal","jakku"], lifespan: 85, mods: { health:0, smarts:0, looks:0, discipline:0 }, forceChance: 0.05, blurb: "Found on nearly every world in the galaxy, adaptable and ambitious." },
  { id: "twilek", name: "Twi'lek", homeworlds: ["ryloth"], lifespan: 80, mods: { health:0, smarts:2, looks:8, discipline:-2 }, forceChance: 0.04, blurb: "Recognized by their colorful skin and sensitive head-tails, or lekku." },
  { id: "zabrak", name: "Zabrak", homeworlds: ["dathomir"], lifespan: 90, mods: { health:6, smarts:0, looks:0, discipline:6 }, forceChance: 0.06, blurb: "A hardy, horned species known for iron will and endurance." },
  { id: "togruta", name: "Togruta", homeworlds: ["naboo"], lifespan: 90, mods: { health:2, smarts:3, looks:4, discipline:2 }, forceChance: 0.07, blurb: "Montral-and-lekku-crowned people with a strong sense of community." },
  { id: "rodian", name: "Rodian", homeworlds: ["nal_hutta"], lifespan: 75, mods: { health:2, smarts:0, looks:-4, discipline:0 }, forceChance: 0.03, blurb: "Green-skinned hunters from Rodia, prized as trackers and bounty hunters." },
  { id: "trandoshan", name: "Trandoshan", homeworlds: ["nal_hutta"], lifespan: 65, mods: { health:10, smarts:-2, looks:-6, discipline:2 }, forceChance: 0.01, blurb: "Reptilian, regenerating hunters who worship the Scorekeeper." },
  { id: "wookiee", name: "Wookiee", homeworlds: ["kashyyyk"], lifespan: 400, mods: { health:15, smarts:-2, looks:-4, discipline:4 }, forceChance: 0.02, blurb: "Towering, fur-covered warriors of immense strength and loyalty." },
  { id: "mon_calamari", name: "Mon Calamari", homeworlds: ["mon_cala"], lifespan: 90, mods: { health:0, smarts:8, looks:-4, discipline:4 }, forceChance: 0.02, blurb: "Amphibious master shipwrights and strategists." },
  { id: "sullustan", name: "Sullustan", homeworlds: ["sullust"], lifespan: 80, mods: { health:0, smarts:4, looks:-4, discipline:0 }, forceChance: 0.02, blurb: "Big-eared, night-adapted pilots and navigators." },
  { id: "bothan", name: "Bothan", homeworlds: ["bothawui"], lifespan: 65, mods: { health:-2, smarts:8, looks:0, discipline:2 }, forceChance: 0.02, blurb: "Fur-covered information brokers whose spy networks span the galaxy." },
  { id: "duros", name: "Duros", homeworlds: ["duro"], lifespan: 70, mods: { health:0, smarts:6, looks:-4, discipline:2 }, forceChance: 0.02, blurb: "Blue-skinned, red-eyed explorers among the galaxy's first spacefarers." },
  { id: "chiss", name: "Chiss", homeworlds: ["csilla"], lifespan: 80, mods: { health:2, smarts:10, looks:6, discipline:8 }, forceChance: 0.01, blurb: "Blue-skinned, red-eyed strategists of the secretive Chiss Ascendancy." },
  { id: "nautolan", name: "Nautolan", homeworlds: ["glee_anselm"], lifespan: 70, mods: { health:4, smarts:2, looks:2, discipline:2 }, forceChance: 0.06, blurb: "Tendriled, empathic amphibians attuned to their surroundings." },
  { id: "keldor", name: "Kel Dor", homeworlds: ["glee_anselm"], lifespan: 90, mods: { health:2, smarts:6, looks:-2, discipline:4 }, forceChance: 0.05, blurb: "Orange-skinned, antigen-mask-wearing natives of a toxic homeworld." },
  { id: "gungan", name: "Gungan", homeworlds: ["naboo"], lifespan: 85, mods: { health:4, smarts:-6, looks:-6, discipline:-4 }, forceChance: 0.01, blurb: "Amphibious swamp-dwellers of Naboo's hidden underwater cities." },
  { id: "ithorian", name: "Ithorian", homeworlds: ["ithor"], lifespan: 85, mods: { health:2, smarts:4, looks:-6, discipline:6 }, forceChance: 0.01, blurb: "Hammerhead-shaped, peace-loving herd beings devoted to nature." },
  { id: "devaronian", name: "Devaronian", homeworlds: ["devaron"], lifespan: 80, mods: { health:4, smarts:2, looks:-2, discipline:-2 }, forceChance: 0.02, blurb: "Horned wanderers with a reputation as roguish spacefarers." },
  { id: "zeltron", name: "Zeltron", homeworlds: ["zeltros"], lifespan: 75, mods: { health:0, smarts:0, looks:12, discipline:-6 }, forceChance: 0.02, blurb: "Pink-skinned empaths famed for their magnetic charisma." },
  { id: "quarren", name: "Quarren", homeworlds: ["mon_cala"], lifespan: 85, mods: { health:2, smarts:4, looks:-6, discipline:0 }, forceChance: 0.01, blurb: "Squid-faced denizens of Mon Cala's ocean floor." },
  { id: "mirialan", name: "Mirialan", homeworlds: ["mirial"], lifespan: 85, mods: { health:0, smarts:4, looks:4, discipline:8 }, forceChance: 0.06, blurb: "Tattooed ascetics known for discipline and skilled hands." },
  { id: "kaminoan", name: "Kaminoan", homeworlds: ["kamino"], lifespan: 95, mods: { health:-4, smarts:12, looks:-4, discipline:6 }, forceChance: 0.0, blurb: "Tall, slender masters of cloning science." },
  { id: "jawa", name: "Jawa", homeworlds: ["tatooine"], lifespan: 70, mods: { health:-6, smarts:6, looks:-8, discipline:0 }, forceChance: 0.01, blurb: "Small, robed scavengers of Tatooine who trade in salvaged droids." },
  { id: "ewok", name: "Ewok", homeworlds: ["hoth"], lifespan: 60, mods: { health:-4, smarts:-2, looks:2, discipline:0 }, forceChance: 0.02, blurb: "Small, furry forest-dwellers, fierce despite their size." },
  { id: "toydarian", name: "Toydarian", homeworlds: ["tatooine"], lifespan: 80, mods: { health:-2, smarts:6, looks:-8, discipline:0 }, forceChance: 0.0, blurb: "Hover-winged traders with an innate resistance to mind tricks." },
  { id: "chagrian", name: "Chagrian", homeworlds: ["naboo"], lifespan: 80, mods: { health:0, smarts:6, looks:-2, discipline:4 }, forceChance: 0.02, blurb: "Blue-skinned amphibious diplomats and administrators." },
  { id: "pau_an", name: "Pau'an", homeworlds: ["utapau"], lifespan: 700, mods: { health:-4, smarts:8, looks:-8, discipline:6 }, forceChance: 0.01, blurb: "Gaunt, long-lived elders who dwell in Utapau's sinkhole cities." },
  { id: "hutt", name: "Hutt", homeworlds: ["nal_hutta"], lifespan: 1000, mods: { health:8, smarts:10, looks:-15, discipline:-6 }, forceChance: 0.0, blurb: "Slow-moving, slug-like crime lords with centuries of cunning." },
  { id: "droid", name: "Droid (Self-Aware)", homeworlds: ["coruscant"], lifespan: 500, mods: { health:10, smarts:8, looks:-2, discipline:8 }, forceChance: 0.0, blurb: "A manufactured being whose programming somehow blossomed into true sentience." },
  { id: "near_human", name: "Unknown Species (Ancient Bloodline)", homeworlds: ["dathomir"], lifespan: 900, mods: { health:2, smarts:10, looks:-10, discipline:10 }, forceChance: 0.9, blurb: "A vanishingly rare, small green-skinned being of an unrecorded species — deeply attuned to the Force from birth." }
];

/* ---------- NAMES ---------- */
const NAME_POOLS = {
  human: {
    male: ["Kael","Doran","Berrin","Wesley","Talon","Roan","Garrick","Adren","Corwin","Merrick","Bastian","Tavik","Renn","Halden","Jace","Corvid","Draven","Endric","Marec","Silas"],
    female: ["Sera","Larra","Mira","Ellyn","Torra","Naris","Cira","Adalyn","Rosetta","Vashti","Kestra","Iolanthe","Talia","Brynn","Corin","Selara","Mona","Ithara","Delyn","Varra"],
    surnames: ["Verrin","Halcyon","Draye","Ostrander","Karrde","Solaan","Beskiir","Norrath","Quell","Ardellian","Vantor","Rennick","Calder","Marrow","Yavor","Threxx","Belden","Corrin","Amidan","Fenn"]
  },
  twilek: { male: ["Nix","Dray","Vorn","Feylo","Tass","Orn","Kelo"], female: ["Sya","Numa","Reeva","Tyla","Ayvi","Lyssa","Zeela"], surnames: [] },
  zabrak: { male: ["Rask","Dorn","Kadan","Vex","Torvin","Maul'ka","Bren"], female: ["Kira","Sabex","Nyla","Draza","Venn","Ashka","Ryza"], surnames: ["Ke'gan","Thul","Ashad","Verrix"] },
  togruta: { male: ["Kolan","Tarn","Reshu","Vahl"], female: ["Ashla","Suri","Nima","Tano'ri","Shaeed","Vessa"], surnames: [] },
  rodian: { male: ["Greeso","Tyzz","Ponku","Wollo"], female: ["Neeva","Skree","Tassi"], surnames: [] },
  trandoshan: { male: ["Krssantan","Boskk","Zuggo","Dothrek"], female: ["Sssa","Threxi"], surnames: [] },
  wookiee: { male: ["Rrargh","Chukka","Tarrak","Grahwuul","Kelgarrik"], female: ["Sslar","Mallawuul","Vazhka"], surnames: [] },
  mon_calamari: { male: ["Mothi","Reeth","Aalak"], female: ["Cora'lin","Nessa"], surnames: [] },
  sullustan: { male: ["Nunb'ren","Ohno","Sallo"], female: ["Ellie","Vessin"], surnames: [] },
  bothan: { male: ["Borsk","Fenn","Kael'bo"], female: ["Tara'bo","Lira"], surnames: ["Fey'lya","Threk","Vantessa"] },
  duros: { male: ["Rugor","Dessin","Vhek"], female: ["Naara","Sila"], surnames: [] },
  chiss: { male: ["Vellin","Thraskar","Mitrek"], female: ["Vekka","Faelyn"], surnames: ["Vekk'ar","Nuruodo","Sabosen"] },
  nautolan: { male: ["Kajin","Ressan"], female: ["Bindi","Naala"], surnames: [] },
  keldor: { male: ["Torvin","Plaristes"], female: ["Sha'ela"], surnames: [] },
  gungan: { male: ["Boss Yarno","Rugor Nass II","Tinto"], female: ["Peppi","Mishka"], surnames: [] },
  ithorian: { male: ["Momaw","Turahide"], female: ["Vethari"], surnames: [] },
  devaronian: { male: ["Kardue","Vellon"], female: ["Sethryn"], surnames: [] },
  zeltron: { male: ["Dray","Ravos"], female: ["Rae'lynn","Sable"], surnames: [] },
  quarren: { male: ["Tessek","Meeneen"], female: ["Sha'lah"], surnames: [] },
  mirialan: { male: ["Kadeer","Vhon"], female: ["Luminel","Barisi"], surnames: [] },
  kaminoan: { male: ["Lama","Taun"], female: ["Nala","Shu Mai II"], surnames: [] },
  jawa: { male: ["Utinnii","Jaka"], female: ["Weeta"], surnames: [] },
  ewok: { male: ["Wicko","Teeb","Chirp"], female: ["Kip","Nubi"], surnames: [] },
  toydarian: { male: ["Watto'n","Sebbik"], female: ["Nezra"], surnames: [] },
  chagrian: { male: ["Mas Aeli","Ronjek"], female: ["Ceyra"], surnames: [] },
  pau_an: { male: ["Tion Medon II","Grekkus"], female: ["Sael"], surnames: [] },
  hutt: { male: ["Grobbo","Zavo","Ganno"], female: ["Grezza"], surnames: [] },
  droid: { male: ["Unit-7","BX-2","VT-90","R2 series"], female: ["Unit-7","BX-2","VT-90"], surnames: [] },
  near_human: { male: ["Aavos"], female: ["Yssa"], surnames: [] }
};

/* ---------- FORCE POWERS & LIGHTSABER FORMS ---------- */
const FORCE_POWERS = ["Telekinesis","Mind Trick","Force Push","Force Pull","Force Choke","Force Lightning","Precognition","Force Healing","Battle Meditation","Force Stealth","Tutaminis (energy resistance)","Force Bond"];
const LIGHTSABER_FORMS = ["Shii-Cho (Form I)","Makashi (Form II)","Soresu (Form III)","Ataru (Form IV)","Shien/Djem So (Form V)","Niman (Form VI)","Juyo/Vaapad (Form VII)"];

/* ---------- CAREER TRACKS ---------- */
const CAREERS = [
  { id:"jedi", name:"Jedi Order", force:true, alignment:"light", eras:["high_republic","fall_of_jedi","new_republic"],
    ranks:[
      {title:"Youngling", minAge:5, salary:0},
      {title:"Padawan", minAge:13, salary:0},
      {title:"Jedi Knight", minAge:20, salary:2000},
      {title:"Jedi Master", minAge:35, salary:5000},
      {title:"Jedi Council Member", minAge:45, salary:8000}
    ]},
  { id:"sith", name:"Sith Order", force:true, alignment:"dark", eras:["high_republic","fall_of_jedi","empire","new_republic","first_order"],
    ranks:[
      {title:"Force Acolyte", minAge:10, salary:0},
      {title:"Sith Apprentice", minAge:16, salary:1000},
      {title:"Sith Lord", minAge:25, salary:6000},
      {title:"Dark Lord of the Sith", minAge:35, salary:15000}
    ]},
  { id:"grey", name:"Independent Force Adept", force:true, alignment:"grey", eras:null,
    ranks:[
      {title:"Wandering Force Sensitive", minAge:12, salary:200},
      {title:"Force Adept", minAge:20, salary:1500},
      {title:"Grey Jedi Sage", minAge:35, salary:3000}
    ]},
  { id:"inquisitor", name:"Inquisitorius", force:true, alignment:"dark", eras:["empire"],
    ranks:[
      {title:"Inquisitor Trainee", minAge:16, salary:2000},
      {title:"Imperial Inquisitor", minAge:20, salary:5000},
      {title:"Grand Inquisitor", minAge:30, salary:10000}
    ]},
  { id:"ren", name:"Knights of Ren", force:true, alignment:"dark", eras:["first_order"],
    ranks:[
      {title:"Ren Initiate", minAge:14, salary:1000},
      {title:"Knight of Ren", minAge:20, salary:6000},
      {title:"Master of the Knights of Ren", minAge:30, salary:12000}
    ]},
  { id:"republic_military", name:"Republic Military", force:false, eras:["high_republic","fall_of_jedi"],
    ranks:[ {title:"Cadet",minAge:16,salary:500},{title:"Trooper",minAge:18,salary:1500},{title:"Lieutenant",minAge:22,salary:3000},{title:"Captain",minAge:28,salary:5000},{title:"General",minAge:36,salary:9000} ]},
  { id:"separatist_command", name:"Separatist Droid Command", force:false, eras:["fall_of_jedi"],
    ranks:[ {title:"Techno Union Engineer",minAge:18,salary:1500},{title:"Droid Battalion Officer",minAge:22,salary:3500},{title:"Separatist Commander",minAge:28,salary:6000},{title:"Separatist General",minAge:36,salary:9500} ]},
  { id:"imperial_military", name:"Imperial Military", force:false, eras:["empire"],
    ranks:[ {title:"Academy Cadet",minAge:16,salary:500},{title:"Stormtrooper",minAge:18,salary:2000},{title:"Lieutenant",minAge:22,salary:4000},{title:"Commander",minAge:28,salary:7000},{title:"Moff",minAge:38,salary:14000} ]},
  { id:"rebellion", name:"Rebel Alliance", force:false, eras:["empire"],
    ranks:[ {title:"Rebel Recruit",minAge:15,salary:200},{title:"Rebel Soldier",minAge:18,salary:800},{title:"Squadron Leader",minAge:23,salary:2000},{title:"Rebel Commander",minAge:28,salary:4000},{title:"Alliance General",minAge:36,salary:7000} ]},
  { id:"new_republic_military", name:"New Republic Defense Fleet", force:false, eras:["new_republic"],
    ranks:[ {title:"Fleet Recruit",minAge:16,salary:600},{title:"Officer",minAge:20,salary:2500},{title:"Commander",minAge:26,salary:5000},{title:"Admiral",minAge:35,salary:9000} ]},
  { id:"first_order_military", name:"First Order Military", force:false, eras:["first_order"],
    ranks:[ {title:"Cadet",minAge:14,salary:0},{title:"Stormtrooper",minAge:18,salary:2000},{title:"Officer",minAge:22,salary:4500},{title:"Captain",minAge:28,salary:7500},{title:"General",minAge:38,salary:15000} ]},
  { id:"resistance", name:"The Resistance", force:false, eras:["first_order"],
    ranks:[ {title:"Resistance Recruit",minAge:15,salary:100},{title:"Resistance Fighter",minAge:18,salary:600},{title:"Squadron Leader",minAge:23,salary:1500},{title:"Resistance General",minAge:32,salary:4000} ]},
  { id:"bounty_hunter", name:"Bounty Hunter", force:false, eras:null,
    ranks:[ {title:"Guild Initiate",minAge:14,salary:400},{title:"Bounty Hunter",minAge:18,salary:2000},{title:"Elite Hunter",minAge:26,salary:6000},{title:"Guild Leader",minAge:35,salary:12000} ]},
  { id:"smuggler", name:"Smuggler", force:false, eras:null,
    ranks:[ {title:"Cargo Runner",minAge:14,salary:300},{title:"Smuggler",minAge:18,salary:1800},{title:"Ace Smuggler",minAge:25,salary:5000},{title:"Legendary Smuggler",minAge:35,salary:11000} ]},
  { id:"politician", name:"Galactic Politician", force:false, eras:null,
    ranks:[ {title:"Local Representative",minAge:22,salary:1500},{title:"Senator",minAge:30,salary:6000},{title:"Chancellor/Supreme Leader",minAge:45,salary:20000} ]},
  { id:"hutt_cartel", name:"Hutt Cartel", force:false, eras:null,
    ranks:[ {title:"Errand Runner",minAge:12,salary:200},{title:"Cartel Enforcer",minAge:18,salary:2500},{title:"Majordomo",minAge:26,salary:6000},{title:"Cartel Underboss",minAge:35,salary:13000} ]},
  { id:"moisture_farmer", name:"Moisture Farmer", force:false, eras:null,
    ranks:[ {title:"Farmhand",minAge:12,salary:200},{title:"Moisture Farmer",minAge:18,salary:900},{title:"Farm Owner",minAge:28,salary:2000} ]},
  { id:"mechanic", name:"Mechanic / Engineer", force:false, eras:null,
    ranks:[ {title:"Apprentice Mechanic",minAge:14,salary:400},{title:"Mechanic",minAge:18,salary:1500},{title:"Master Engineer",minAge:26,salary:4000},{title:"Chief Engineer",minAge:34,salary:7500} ]},
  { id:"medic", name:"Doctor / Medic", force:false, eras:null,
    ranks:[ {title:"Medical Student",minAge:16,salary:300},{title:"Field Medic",minAge:20,salary:2000},{title:"Doctor",minAge:26,salary:4500},{title:"Chief Surgeon",minAge:34,salary:8000} ]},
  { id:"slicer", name:"Slicer (Hacker)", force:false, eras:null,
    ranks:[ {title:"Data Runner",minAge:12,salary:300},{title:"Slicer",minAge:16,salary:1800},{title:"Master Slicer",minAge:24,salary:5000},{title:"Ghost of the HoloNet",minAge:32,salary:10000} ]},
  { id:"podracer", name:"Podracer", force:false, eras:null,
    ranks:[ {title:"Rookie Racer",minAge:9,salary:100},{title:"Podracer",minAge:14,salary:2000},{title:"Champion Racer",minAge:22,salary:8000} ]},
  { id:"musician", name:"Cantina Musician", force:false, eras:null,
    ranks:[ {title:"Street Performer",minAge:12,salary:100},{title:"Cantina Musician",minAge:16,salary:800},{title:"Touring Bandleader",minAge:24,salary:3000} ]},
  { id:"chef", name:"Chef", force:false, eras:null,
    ranks:[ {title:"Kitchen Hand",minAge:12,salary:200},{title:"Cook",minAge:16,salary:900},{title:"Master Chef",minAge:24,salary:3000} ]},
  { id:"journalist", name:"HoloNet Journalist", force:false, eras:null,
    ranks:[ {title:"Stringer",minAge:16,salary:400},{title:"HoloNet Reporter",minAge:20,salary:1500},{title:"Senior Correspondent",minAge:28,salary:4000} ]},
  { id:"mandalorian", name:"Mandalorian Warrior", force:false, eras:null,
    ranks:[ {title:"Foundling",minAge:6,salary:0},{title:"Mandalorian Warrior",minAge:16,salary:2000},{title:"Clan Leader",minAge:28,salary:5000},{title:"Mand'alor",minAge:38,salary:12000} ]}
];

/* ---------- CRIMES ---------- */
const CRIMES = [
  { id:"spice_smuggling", name:"Smuggle spice through a blockade", risk:0.35, payout:[500,4000], jail:[1,4] },
  { id:"pickpocket", name:"Pick pockets in a cantina", risk:0.2, payout:[20,300], jail:[0,1] },
  { id:"grand_theft_speeder", name:"Steal a landspeeder", risk:0.4, payout:[300,1500], jail:[1,3] },
  { id:"slice_imperial_db", name:"Slice into an Imperial database", risk:0.5, payout:[1000,8000], jail:[2,6] },
  { id:"podrace_fixing", name:"Fix a podrace", risk:0.3, payout:[500,5000], jail:[1,2] },
  { id:"bounty_fraud", name:"Fake a bounty kill for a lazy hunter's pay", risk:0.45, payout:[400,3000], jail:[1,3] },
  { id:"tax_evasion", name:"Dodge Imperial/Republic taxes", risk:0.25, payout:[200,2000], jail:[0,2] },
  { id:"weapons_running", name:"Run illegal weapons to the Outer Rim", risk:0.4, payout:[800,6000], jail:[2,5] }
];

/* ---------- ASSETS ---------- */
const ASSETS = {
  droids: [
    { id:"astromech", name:"Astromech Droid", cost:1500, upkeep:20 },
    { id:"protocol", name:"Protocol Droid", cost:2500, upkeep:30 },
    { id:"battle_droid", name:"Refurbished Battle Droid", cost:1000, upkeep:10 },
    { id:"medical_droid", name:"Medical Droid", cost:4000, upkeep:40 }
  ],
  vehicles: [
    { id:"speeder_bike", name:"Speeder Bike", cost:2500, upkeep:50 },
    { id:"landspeeder", name:"Landspeeder", cost:4000, upkeep:80 },
    { id:"light_freighter", name:"YT-Series Light Freighter", cost:60000, upkeep:1200 },
    { id:"starfighter", name:"Personal Starfighter", cost:120000, upkeep:2500 }
  ],
  property: [
    { id:"apartment", name:"Coruscant Apartment", cost:15000, upkeep:300 },
    { id:"homestead", name:"Moisture Farm Homestead", cost:8000, upkeep:150 },
    { id:"cantina", name:"Cantina Business", cost:50000, upkeep:900 }
  ]
};

/* ---------- DEATH CAUSES (flavor, non-combat/old age) ---------- */
const DEATH_CAUSES = {
  oldAge: [
    "passed peacefully in your sleep, watching the twin suns set one last time.",
    "died of old age, surrounded by generations of family.",
    "quietly slipped away after a long, storied life among the stars."
  ],
  health: [
    "succumbed to a rare Outer Rim fever.",
    "died from complications after a botched bacta treatment.",
    "was lost to a degenerative illness no medical droid could cure."
  ],
  accident: [
    "died when an airlock malfunctioned aboard a transport.",
    "was lost in a speeder crash on a busy skylane.",
    "fell into a sarlacc pit and was slowly digested over a thousand years.",
    "was crushed in a hyperdrive malfunction.",
    "died when a podracer engine exploded mid-race."
  ],
  violence: [
    "was gunned down by a rival bounty hunter.",
    "was executed for crimes against the state.",
    "died in a blaster duel outside a cantina.",
    "was struck down in a lightsaber duel.",
    "was Force-choked by a superior for failure."
  ],
  catastrophe: [
    "died when Alderaan was obliterated by the Death Star's superlaser.",
    "was lost when the Death Star destroyed Jedha City.",
    "was killed when Starkiller Base annihilated the Hosnian system."
  ]
};

/* ---------- TITLE / FLAVOR QUOTES for loading ---------- */
const LOADING_QUOTES = [
  "The Force will be with you, always.",
  "Do. Or do not. There is no try.",
  "In my experience, there's no such thing as luck.",
  "Great, kid. Don't get cocky.",
  "This is the way.",
  "Your focus determines your reality.",
  "Fear is the path to the dark side.",
  "I have a bad feeling about this."
];
