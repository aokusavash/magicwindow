# Magic Window: current checkpoint

Updated October 22, 2026. Read this in a fresh chat; update it after a meaningful batch or accepted milestone. Detailed animation history lives in PAINTED-FEASIBILITY.md; product direction lives in ROADMAP.md.

## Product and workflow

- A beautiful ambient painted Japanese neighborhood for the family's TV. Phase one succeeds when they enjoy watching for 5–10 minutes. Neighborhood/people dominate the frame. Seattle daylight/weather are future work.
- The user directs by voice/on dog walks. Implement agreed batches, check them and commit directly to main. No PRs or repeated routine approval. Work needs an active execution session.
- Source: https://github.com/aokusavash/magicwindow. Preserve the owner-private Site identity/audience in `.openai/hosting.json`; use the Sites skill when publishing.

## Current review

- Latest: https://little-world-window.racing-dog-8718.chatgpt.site/painted/visits/
- The relaxed walk, coherent alley/diagonal movement and population study were accepted. The initial ramen/window visit and flower turn were well received.
- Latest refinement is implemented for review: stand near the door's center with planted feet and slide it with one hand across the body, roughly twice as fast; bend at the waist to smell flowers while preserving the turn.
- Opening/closing now take 1.47 seconds each, with a 0.4-second reach and 0.28-second release. Palm contact follows the handle. From the rear camera angle the arm passes behind the torso as it crosses the chest.
- The flower stop bends about 23 degrees, eases into/out of the pose, keeps feet fixed and lets arms hang. Window/interior behavior is preserved.
- Await visual review of this refinement. Proposed next steps: a few distinct people sharing these actions, then Seattle lighting/weather. Purchases, seated eating, live weather and AI planning are not implemented.

## Implementation and constraints

- `dist/painted/visits/`: two authored shop visits and six passersby. Ramen/flower buttons jump to close-ups; Whole street preserves time. `world.js` supplies action timelines/route anchors, `pose.js` contact IK/bending, `renderer.js` door and indoor/window masks.
- `/painted/crowd/`: preserved five/eight walking-only comparison. `/painted/alley/`: shared directional actor/depth study, with four diagonals. `/painted/walking/`: accepted gait in `walking/gaits.js` and `layered.js`. Preserve these and the original `/` prototype.
- `alley/actor.js` accepts optional pose/lean inputs; default rendering is preserved. The torso painting includes the head and resting sleeves. Avoid destructive torso cutouts or sorting individual limb triangles.
- Keep body-width offsets in the route's camera plane. Full off-axis perspective previously caused a growing left-side limp. Garment coverage is separate from anatomical depth: jacket over trouser roots.
- Foot contacts are evaluated at their route positions. Preserve support during gestures. Alley frontage masks belong to alley residents, not unrelated shop doorsteps.
- Static HTML/JS/canvas, no framework/backend/build step. Larger gestures still deform painted sleeves and need visual review. Physical-TV performance is unverified.

## Verification and fresh-chat entry

Run `node tools/check_visits.cjs`, `node tools/check_leg_projection.cjs` and `node tools/check_gaits.cjs` after relevant movement edits. Serve with `python3 -m http.server 8031 --bind 127.0.0.1 --directory dist`, then run `python3 tools/check_visits_browser.py`. Crowd/alley browser checks cover shared-renderer changes. Screenshots/reports are under ignored `artifacts/`. Checks support visual review; they do not establish naturalness alone.

Fresh-chat prompt: “Open Magic Window, read CURRENT-STATE.md and the repo instructions, and continue from the latest shop-visit review.” Include new visual feedback/screenshots where relevant; the full old transcript is unnecessary.
