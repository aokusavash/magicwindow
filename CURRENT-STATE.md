# Magic Window: current checkpoint

Updated October 22, 2026. Read this in a fresh chat; update it after a meaningful batch or accepted milestone. Detailed animation history lives in PAINTED-FEASIBILITY.md; product direction lives in ROADMAP.md.

## Product and workflow

- A beautiful ambient painted Japanese neighborhood for the family's TV. Phase one succeeds when they enjoy watching for 5–10 minutes. Neighborhood/people dominate the frame. Seattle daylight/weather are future work.
- The user directs by voice/on dog walks. Implement agreed batches, check them and commit directly to main. No PRs or repeated routine approval. Work needs an active execution session.
- Source: https://github.com/aokusavash/magicwindow. Preserve the owner-private Site identity/audience in `.openai/hosting.json`; use the Sites skill when publishing.

## Current review

- Latest: https://little-world-window.racing-dog-8718.chatgpt.site/painted/visits/ (Study 14).
- The relaxed walk, coherent alley/diagonal movement and population study were accepted. The initial ramen visit and flower turn were well received. Keep the walking baseline frozen.
- Dining-arm follow-up: both seated facings now use sleeve-free torso underpaintings. Real eating arms render on the chest side (in front of a front-facing torso, behind the rear-facing back). Elbows fold inward/down toward the bowl. The front diner visibly eats; the rear diner hides hands/food without another pair of resting sleeves. Await visual review.
- Prior ramen refinement: outside counter diner faces directly into the shop (back to viewer; bowl/face/eating hands intentionally hidden); indoor diner faces directly toward the viewer. Both retain their 60-second seated meals and automatic closing/reopening sequence.
- Door reach uses a newly underpainted, arm-free rear-quarter torso, preventing the baked resting sleeve from reading as a third arm. Ordinary walking keeps the original torso. The local entrance now has separate architecture, clean moving leaf, fixed lantern/vine and foreground pots. Foreground props occlude doorway residents but stay behind people walking in front of their bases.
- UI: Counter meal, Interior visit, Inside meal, Smell flowers and Whole street. Three visitors plus five passersby preserve eight active residents. Flower turn/bend and accepted walking are preserved.
- **Explicit study checkpoint:** continue honing ramen until it feels as good as the walking. Then pause and assess the method, visual quality and preparation cost before declaring feasibility or expanding into final production. Cast/weather are later possibilities, not the automatic next build.
- Softness remains unresolved: scenery is 1672×941, rendered at 1600×900; close-ups enlarge a 640×360 region and fullscreen can magnify further. Do not confuse missing source detail with painterly style. A bounded high-resolution shop comparison is a proposed next diagnostic, not implemented high-resolution scenery.
- Pulling/moving stools, ordering/purchases, a varied cast, live weather and AI planning remain unimplemented. Physical-TV quality/performance is unverified.

## Implementation and constraints

- `dist/painted/visits/`: authored counter/interior dining and flower visits. Close-up buttons jump to each action; Whole street preserves time. `world.js` supplies timelines/route anchors and automatic-door phases, `pose.js` contact IK/bending/seating/eating, `renderer.js` entrance layers, ground-aware foreground ordering, indoor masks and composited bowl/chopsticks/noodles/steam. New source atlases: `assets/rig/entrance-layers.png` and `assets/directions/rear45-contact.png`, plus seated `assets/directions/front-meal.png` and `rear-meal.png`; crops are measured directly in the renderers.
- `/painted/crowd/`: preserved five/eight walking-only comparison. `/painted/alley/`: shared directional actor/depth study, with four diagonals. `/painted/walking/`: accepted gait in `walking/gaits.js` and `layered.js`. Preserve these and the original `/` prototype.
- `alley/actor.js` accepts optional pose/lean, contact-body and dining-body inputs; default rendering is preserved. Original torso paintings include the head and resting sleeves; larger gestures need opaque underpainting rather than drawing another sleeve over them. Avoid destructive torso cutouts or sorting individual limb triangles.
- Keep body-width offsets in the route's camera plane. Full off-axis perspective previously caused a growing left-side limp. Garment coverage is separate from anatomical depth: jacket over trouser roots.
- Foot contacts are evaluated at their route positions. Preserve support during gestures. Alley frontage masks belong to alley residents, not unrelated shop doorsteps.
- Static HTML/JS/canvas, no framework/backend/build step. Larger gestures still deform painted sleeves and need visual review. Physical-TV performance is unverified.

## Verification and fresh-chat entry

Run `node tools/check_visits.cjs`, `node tools/check_leg_projection.cjs` and `node tools/check_gaits.cjs` after relevant movement edits. Serve with `python3 -m http.server 8031 --bind 127.0.0.1 --directory dist`, then run `python3 tools/check_visits_browser.py`. Crowd/alley browser checks cover shared-renderer changes. Screenshots/reports are under ignored `artifacts/`. Checks support visual review; they do not establish naturalness alone.

Fresh-chat prompt: “Open Magic Window, read CURRENT-STATE.md and the repo instructions, and continue from the latest shop-visit review.” Include new visual feedback/screenshots where relevant; the full old transcript is unnecessary.
