# Magic Window: current checkpoint

Updated October 22, 2026. Read this in a fresh chat; update it after a meaningful batch or accepted milestone. Detailed animation history lives in PAINTED-FEASIBILITY.md; product direction lives in ROADMAP.md.

## Product and workflow

- A beautiful ambient painted Japanese neighborhood for the family's TV. Phase one succeeds when they enjoy watching for 5–10 minutes. Neighborhood/people dominate the frame. Seattle daylight/weather are future work.
- The user directs by voice/on dog walks. Implement agreed batches, check them and commit directly to main. No PRs or repeated routine approval. Work needs an active execution session.
- Source: https://github.com/aokusavash/magicwindow. Preserve the owner-private Site identity/audience in `.openai/hosting.json`; use the Sites skill when publishing.

## Current review

- Latest: https://little-world-window.racing-dog-8718.chatgpt.site/painted/visits/
- The relaxed walk, coherent alley/diagonal movement and population study were accepted. The initial ramen/window visit and flower turn were well received.
- The user liked the planted door gesture and flower bend. Latest request: close the door automatically after entry, show a roughly one-minute seated meal, and support both open-counter dining and walking into the interior. Both options are implemented together for review (Study 12).
- The interior visitor opens manually with the accepted 1.47-second planted slide, clears the doorway, then the closer shuts it in 1.1 seconds. It stays closed during her 60-second meal, reopens for exit, and closes again after she leaves. There is no manual closing gesture now.
- A second diner walks to an existing outside stool, settles into a bent-leg sitting pose and eats for 60 seconds. Both diners lift noodles, taste and pause, with separate timing. UI: Counter meal, Interior visit, Inside meal, Smell flowers and Whole street. Three visitors plus five passersby preserve eight active residents.
- The accepted flower stop keeps its turn and roughly 23-degree waist bend. Await visual review of seating/eating and automatic-door timing. Pulling/moving a stool, ordering/purchases, a varied cast, live weather and AI planning are not implemented. Proposed next steps remain cast variation, then Seattle lighting/weather.

## Implementation and constraints

- `dist/painted/visits/`: authored counter/interior dining and flower visits. Close-up buttons jump to each action; Whole street preserves time. `world.js` supplies timelines/route anchors and automatic-door phases, `pose.js` contact IK/bending/seating/eating, `renderer.js` indoor masks and composited bowl/chopsticks/noodles/steam.
- `/painted/crowd/`: preserved five/eight walking-only comparison. `/painted/alley/`: shared directional actor/depth study, with four diagonals. `/painted/walking/`: accepted gait in `walking/gaits.js` and `layered.js`. Preserve these and the original `/` prototype.
- `alley/actor.js` accepts optional pose/lean inputs; default rendering is preserved. The torso painting includes the head and resting sleeves. Avoid destructive torso cutouts or sorting individual limb triangles.
- Keep body-width offsets in the route's camera plane. Full off-axis perspective previously caused a growing left-side limp. Garment coverage is separate from anatomical depth: jacket over trouser roots.
- Foot contacts are evaluated at their route positions. Preserve support during gestures. Alley frontage masks belong to alley residents, not unrelated shop doorsteps.
- Static HTML/JS/canvas, no framework/backend/build step. Larger gestures still deform painted sleeves and need visual review. Physical-TV performance is unverified.

## Verification and fresh-chat entry

Run `node tools/check_visits.cjs`, `node tools/check_leg_projection.cjs` and `node tools/check_gaits.cjs` after relevant movement edits. Serve with `python3 -m http.server 8031 --bind 127.0.0.1 --directory dist`, then run `python3 tools/check_visits_browser.py`. Crowd/alley browser checks cover shared-renderer changes. Screenshots/reports are under ignored `artifacts/`. Checks support visual review; they do not establish naturalness alone.

Fresh-chat prompt: “Open Magic Window, read CURRENT-STATE.md and the repo instructions, and continue from the latest shop-visit review.” Include new visual feedback/screenshots where relevant; the full old transcript is unnecessary.
