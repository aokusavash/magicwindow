# magicwindow

A persistent window into a small living pixel world. An artistic experiment for a living-room TV or monitor, developed through conversation and small visual iterations.

Starting a fresh chat? Read [CURRENT-STATE.md](CURRENT-STATE.md) for the accepted baseline, latest review and implementation entry points.

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

Current art priority (October 21): test **painted animation** first, with storybook as a close alternative. The next checkpoint is a small coherent animated scene that preserves the concept artwork's appeal; the final production method is not yet proven. See the roadmap and backlog for the feasibility criteria.

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

## Painted animation feasibility preview

Study 02 is now built at `/painted/`: two painted characters share a reusable rig with planted-foot walking, persistent bags, rear/front turns, hand-to-handle door contact, a warm interior, and a flower-smelling interaction. Entrance, flower, and close-up controls make those behaviors easy to review. A cook, steam, and manual lighting/rain studies remain. It is a review preview, separate from the original prototype. See [PAINTED-FEASIBILITY.md](PAINTED-FEASIBILITY.md) for findings and limits. The original style survey is preserved at [art/reference/style-survey.png](art/reference/style-survey.png).

Run `node tools/check_painted.cjs` for activity checks and `python3 tools/export_painted.py` for a single-file offline export. Joint deformation, turns, and convincing relighting still need visual iteration; no live weather or runtime generation service is claimed.

Current motion experiment: [stride comparison](https://little-world-window.racing-dog-8718.chatgpt.site/painted/walking/). The user accepted the current side-on walk. Study 08 adds Relaxed at 10% slower pace and 10% less body bounce, preserving the accepted Everyday walk plus Stroll and Brisk. Near-straight landings, soft transitions, heel/toe roll and restrained arm swing are retained. Single views, the previous stride, knee/arm toggles and half-speed inspection are available. This remains a walking study separate from the interaction rig. See the feasibility report for findings.

Accepted movement milestone: [alley and diagonals](https://little-world-window.racing-dog-8718.chatgpt.site/painted/alley/). Study 09 adds curved turns, depth/foreground overlap, and eight directions including all four 45° diagonals. The user considers the walk coherent enough to move on, with minor blips deferred. Run `node tools/check_alley.cjs` for route/pose checks.

Population comparison: [a populated street](https://little-world-window.racing-dog-8718.chatgpt.site/painted/crowd/). Study 10 reuses the resident as eight independent walkers, with a five-person comparison, street/alley routes and per-person occlusion. People enter/leave the view; this tests density rather than cast variety or shop activity. Run `node tools/check_crowd.cjs` and, with a local server on port 8031, `python3 tools/check_crowd_browser.py`. Physical-TV performance still needs testing.

Newest preview: [a reason to linger](https://little-world-window.racing-dog-8718.chatgpt.site/painted/visits/). Study 11 adds a ramen visit (hand on sliding door, entry, visible counter-window pause, exit and closing) and browsing the flower display among six passersby. Buttons jump to either visit with a close-up; Whole street returns to the ambient view. These are authored interaction sequences using the accepted character, with no purchases or meal animation. Run `node tools/check_visits.cjs` and, with the local server on port 8031, `python3 tools/check_visits_browser.py`.

## Technical studies

The separate `/studies/` page compares pixel and illustrated movable-part characters against a near-side-on painted town. It includes a family-and-dog movement rehearsal, a pace comparison, and a text-free fullscreen view. This earlier technical experiment does not select the phase-one art style or replace the original `/` prototype.

See [the implementation preview](IMPLEMENTATION-PREVIEW.md) for scope, verification, and limits. Run `node tools/check_study.cjs` for movement and event checks. Run `python3 tools/export_study.py` for a single-file offline preview, or `python3 tools/package_tv.py` for an **unsigned** offline Samsung widget. Signing and physical-TV testing are still required.
