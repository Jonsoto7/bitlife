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

### The canon timeline

At character creation you also pick a mode:

- **Canon Lock** — the big galactic events happen exactly when and how they did on screen (Order 66, the destruction of Alderaan, the Battle of Endor...). You can live through them, but you can't change who lives or dies.
- **Legend Mode** — unlocks alternate paths, including training Anakin Skywalker, Luke Skywalker, or Ben Solo yourself instead of their canon masters, or becoming Vader's secret apprentice.

Every life runs on the real BBY/ABY calendar, so ~45 canon events fire on their actual year no matter where you are in the galaxy — you'll experience them differently depending on whether you're standing on the world where it happens, nearby, or just hearing about it over the HoloNet. You'll also encounter dozens of named characters from the films and shows (with Meet/Train/Date/Fight options, era- and world-gated), plus dedicated origin-driven storylines for slaves, clones, and Mandalorians. Romance with a named character is hard-gated in code — it only unlocks once both you and they are 18 or older in that in-game year, never just suggested in flavor text.

`ai_expand`-style branching moments from the design doc are hand-authored here rather than generated live, since this is a static site with no backend to safely call an AI model.

## Running it

Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure
- `style.css` — theme and layout
- `data.js` — eras, species, jobs, names, and generic event content
- `nodes.js` — the canon timeline system: global events, origins, worlds, named characters, and Legend-mode arcs
- `game.js` — game state, character generation, and simulation logic
- `ui.js` — DOM rendering and event wiring

The old `Build/`, `TemplateData/`, and `logo.png` assets are leftovers from a previous Unity WebGL build and are no longer used by the game.
