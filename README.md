# magicwindow

A persistent window into a small living pixel world. An artistic experiment for a living-room TV or monitor, developed through conversation and small visual iterations.

## Current prototype

Live: https://little-world-window.racing-dog-8718.chatgpt.site

`dist/index.html` contains the complete application: HTML, styles, procedural canvas artwork, animation, daily rhythms, and a short repeating flower-seller/dog story. No framework, dependencies, backend, or build step is required.

## Run locally

From this folder:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. Use the page's weather, time, next-day, and fullscreen controls to explore. The scene uses the device's local time; the story's starting date is saved in that browser's localStorage.

## Creative direction

See [ROADMAP.md](ROADMAP.md) for the current phase-one target and later vision. Phase one focuses on a beautiful, living neighborhood with local daylight and Seattle weather; persistent characters and an AI director can follow later. The current prototype does not yet meet that target.

- Worth glancing at as ambient art, with pedestrians, traffic, weather, and recognizable places.
- Follow the household's local day/night cycle, even if the setting evokes Tokyo or Paris. Very quiet from midnight to 5 AM.
- Recurring characters and small, visible stories that children can recognize over days.
- Eventually use a director to coordinate routines, events, and character behavior. Dynamic AI planning is an idea, not an implemented feature.
- Weather currently uses a manual demo toggle. Real local weather is a future addition.
- Investigate a packaged Samsung TV app; an HDMI computer remains a fallback. See [SAMSUNG-TV-SPIKE.md](SAMSUNG-TV-SPIKE.md). No TV installation has yet been validated.

## Iterating by voice

Walks are for exploring ideas, reviewing outputs, and setting direction; active build sessions can work through the resulting queue. See [BACKLOG.md](BACKLOG.md) for ready tasks, dependencies, and future ideas. Saving a backlog does not start an unattended coding session.

Describe the outcome you want—for example, “make the street rainy at night” or “have schoolchildren arrive around three.” The agent can inspect this repository, make changes, check them, and publish a new preview when requested. Keep changes small enough to judge visually and preserve a Git checkpoint for each useful iteration. This is a solo project: commit agreed decisions and tangible batches directly to main without pull requests. Conversation is sufficient agreement; do not add a separate commit-approval ceremony. Save durable decisions in ROADMAP.md. Committing source does not automatically deploy a change.

Source repository: https://github.com/aokusavash/magicwindow

The live prototype is hosted through Sites. This checkout runs in the ChatGPT workspace, not automatically on your personal computer. To work on your own machine:

```sh
git clone https://github.com/aokusavash/magicwindow.git
cd magicwindow
python3 -m http.server 8000 --directory dist
```

GitHub is the source home for ongoing work; keep the Sites source synchronized when publishing.

## Technical studies

The separate `/studies/` page compares pixel and illustrated movable-part characters against a near-side-on painted town. It includes a family-and-dog movement rehearsal, a pace comparison, and a text-free fullscreen view. This earlier technical experiment does not select the phase-one art style or replace the original `/` prototype.

See [the implementation preview](IMPLEMENTATION-PREVIEW.md) for scope, verification, and limits. Run `node tools/check_study.cjs` for movement and event checks. Run `python3 tools/export_study.py` for a single-file offline preview, or `python3 tools/package_tv.py` for an **unsigned** offline Samsung widget. Signing and physical-TV testing are still required.
