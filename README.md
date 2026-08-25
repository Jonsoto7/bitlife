# Star Wars: A Galaxy Life

A browser-based, Star Wars–themed life simulation in the spirit of BitLife. Play directly in your browser — no installation, no build step, no backend.

Content (species, eras, planets, career paths) draws on the broad strokes of Star Wars lore as documented by sources like StarWars.com's Databank, Wookieepedia, and TheForce.net — all flavor text here is original writing, not copied from those sites.

---

## How it works

Before your life begins you pick the normal stuff, just like BitLife: your first and last name (or randomize them) and your gender. Everything else about who you are is left to the galaxy:

- **A random era** — from the ancient Old Republic through the Clone Wars, the height of the Empire, the New Republic, and the rise of the First Order.
- **A random species** — nearly 40 options, from Human, Twi'lek, and Wookiee to Hutt, Miraluka, and a vanishingly rare shot at Yoda's own unnamed species.
- **A random homeworld**, drawn from worlds appropriate to your species.
- **A random family** — parents, and possibly siblings.
- **A random midichlorian count.** Every character is born with *some* midichlorian count — nobody is ever a flat zero — but only a fortunate few roll high enough to be Force-Sensitive, Gifted, or truly Exceptional. If your count is high enough and your era has an active Jedi Order (or darker forces looking for recruits), you may be found and offered a very different life: Padawan, Jedi Knight, Sith Acolyte, Imperial Inquisitor, or Knight of Ren — complete with a light/dark alignment meter and, if you lived through the Clone Wars as a Jedi, a shot at surviving Order 66.

From there, you age up year by year through a life full of randomized events, a career system spanning smugglers to senators to stormtroopers, romance and family, crime, gambling, and assets to buy — all the way to an eventual, inevitable end, with a full life summary at your death.

Progress auto-saves to your browser's local storage, so you can close the tab and pick your life back up later.

## Running it

Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `style.css` — theme and layout
- `data.js` — eras, species, jobs, names, and event content
- `game.js` — game state, character generation, and simulation logic
- `ui.js` — DOM rendering and event wiring

The old `Build/`, `TemplateData/`, and `logo.png` assets are leftovers from a previous Unity WebGL build and are no longer used by the game.
