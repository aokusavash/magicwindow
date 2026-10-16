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

- Worth glancing at as ambient art, with pedestrians, traffic, weather, and recognizable places.
- Follow the household's local day/night cycle, even if the setting evokes Tokyo or Paris. Very quiet from midnight to 5 AM.
- Recurring characters and small, visible stories that children can recognize over days.
- Eventually use a director to coordinate routines, events, and character behavior. Dynamic AI planning is an idea, not an implemented feature.
- Weather currently uses a manual demo toggle. Real local weather is a future addition.
- Aim for a Raspberry Pi running a fullscreen browser over HDMI. Samsung Art Mode and a TV app-store release are unnecessary.

## Iterating by voice

Describe the outcome you want—for example, “make the street rainy at night” or “have schoolchildren arrive around three.” The agent can inspect this repository, make changes, check them, and publish a new preview when requested. Keep changes small enough to judge visually and preserve a Git checkpoint for each useful iteration.

Source repository: https://github.com/aokusavash/magicwindow

The live prototype is hosted through Sites. This checkout runs in the ChatGPT workspace, not automatically on your personal computer. To work on your own machine:

```sh
git clone https://github.com/aokusavash/magicwindow.git
cd magicwindow
python3 -m http.server 8000 --directory dist
```

GitHub is the source home for ongoing work; keep the Sites source synchronized when publishing.
