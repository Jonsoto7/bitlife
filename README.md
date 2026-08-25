# A Galactic Life — Star Wars BitLife

A browser-based Star Wars life simulator in the spirit of BitLife. Live an entire
life somewhere in the galaxy far, far away — from birth to death — across five
eras of Star Wars history.

100% original code: a single-page vanilla HTML/CSS/JavaScript app with no build
step, no backend, and no external dependencies. Everything runs client-side and
progress auto-saves to your browser's local storage.

## Features

- **5 playable eras**: The High Republic, Fall of the Jedi (Clone Wars), Reign
  of the Empire, Age of the New Republic, and Age of the First Order. Your
  character's era advances automatically as in-universe years pass.
- **29 species** (Human, Twi'lek, Wookiee, Zabrak, Togruta, Hutt, Droid, and
  more), each with its own homeworlds, lifespan, stat modifiers, and Force
  sensitivity odds.
- **37 homeworlds** across the Core, Mid Rim, and Outer Rim — including
  Alderaan and Hosnian Prime, which meet their canon fates if you're still
  there when disaster strikes.
- **25 career paths**: Jedi Order, Sith Order, Inquisitorius, Knights of Ren,
  Grey Force Adept, Bounty Hunter, Smuggler, Mandalorian Warrior, Republic /
  Imperial / Rebel / First Order / Resistance military ladders, Hutt Cartel,
  Politician, and various civilian trades — each with multiple ranks to climb.
- **Force powers & light/dark alignment** — get discovered as a Force
  sensitive as a child, get recruited by the Jedi, get tempted by the Sith,
  fall to the dark side, or find your way back to the light.
- **Branching life events**: duels, romance, marriage, children, crime and
  capture, faction missions, holocron discoveries, cybernetic surgery, and
  Order 66 if you're a Jedi living through the Clone Wars.
- **Relationships, assets, crime, and travel** systems — buy droids, starships
  and property, commit (and get away with, or caught for) crimes, and travel
  between worlds.
- Auto-saves to `localStorage` so you can pick up a life where you left off.

## Playing

Just open `index.html` in any modern browser — no installation or server
required. To host it online, upload the files to GitHub Pages, Netlify,
Vercel, or any static host.

## Structure

```
index.html      Page shell / layout
style.css       Theming
js/data.js      Eras, species, homeworlds, careers, names, lore tables
js/events.js    Random & branching life event pools
js/engine.js    Game state and simulation logic
js/ui.js        DOM rendering and input wiring
```
