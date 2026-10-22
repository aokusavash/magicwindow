# Magic Window: current checkpoint

Updated October 22, 2026. Read this in a fresh chat; update it after a meaningful batch or accepted milestone. Detailed animation history lives in PAINTED-FEASIBILITY.md; product direction lives in ROADMAP.md.

## Product and workflow

- A beautiful ambient painted Japanese neighborhood for the family's TV. Phase one succeeds when they enjoy watching for 5–10 minutes. Neighborhood/people dominate the frame. Seattle daylight/weather are future work.
- The user directs by voice/on dog walks. Implement agreed batches, check them and commit directly to main. No PRs or repeated routine approval. Work needs an active execution session.
- Source: https://github.com/aokusavash/magicwindow. Preserve the owner-private Site identity/audience in `.openai/hosting.json`; use the Sites skill when publishing.

## Current review

- Latest: https://little-world-window.racing-dog-8718.chatgpt.site/painted/cast/ (Study 16). Accepted one-character meals remain at `/painted/visits/` (Study 15). The user liked that meal polish and authorized the varied-character study next.
- Five profiles: original woman; the same woman 9% taller; a ponytailed woman in a blue blouse/ochre trousers; a man in an indigo yukata; and a child at half body scale with shorter legs/larger relative head. The three new designs have measured five-facing, transparent part atlases. Opposite facings mirror those views.
- Same walking, alley turns, flower bend, door visit, seating/eating and final two-handed broth action are reused. Walk together shows the group. Select a neighbor, then choose Alley & turns, Enter ramen, Counter meal, Inside meal, Finish the bowl or Smell flowers. Whole street restores mixed activity. Character changes preserve the review time.
- The yukata has a continuous lower garment mesh over both legs. It is an authored 2D cloth treatment, not a general cloth simulator. Larger folds and poses need visual review.
- The child uses automatic entry instead of stretching to the adult handle, plus raised seats and a wider two-handed bowl grip. The portrait/limbs have child proportions. The shared sit/stand blend is retained; a fully choreographed climb onto the tall stool is not implemented.
- Preserve the accepted original walk and meals. The cast study needs visual review of clothing, foot placement, proportions, hands and directional transitions before expanding actions or characters further. It demonstrates reuse with prepared art/calibration, not arbitrary clothing automatically working.
- **Background explicitly deferred:** keep this existing street throughout the current animation study. A replacement composition/shop mix/high-resolution foundation can be discussed later; no new background is part of this batch.
- Native scenery remains 1672×941; enlarged close-ups/fullscreen expose limited detail. Live weather, varied persistent identities, AI planning and physical-TV validation remain future work.

## Implementation and constraints

- `dist/painted/cast/`: `world.js` profiles/adaptation, `actor.js` measured custom skins and continuous robe, `frames.js` tracked atlas bounds/bone registration, `cast.js` UI. Original generated PNG bytes are in `assets/cast/`; `tools/measure_cast.py` reads alpha and writes metadata without retouching artwork. The side child leg reuses one source leg for both physical legs.
- Shared `alley/actor.js` accepts optional body scale/proportions, prepared views, garment painting and shoe registration. Defaults preserve accepted art/motion. Child cadence uses physical body height before projection; do not scale an already projected adult pose, which slides stance contacts. Custom actor buffers account for a raised seated head.
- `skin.js` has an optional limb-width calibration. New feet use measured ankle positions plus separate width/height calibration so source-art shoe proportions do not extend below the ground.
- `visits/pose.js` accepts optional seat raise and bowl grip radius. `visits/renderer.js` accepts optional actor/seat hooks and a camera crop; its default path is retained. Seated heads nod at the neck, hands follow bowl/door targets, clothing covers leg roots and arms sort on the chest side.
- `/painted/crowd/`, `/painted/alley/`, `/painted/walking/` and the original `/` prototype remain available. Keep body-width offsets in the route camera plane and foot contacts evaluated at their route positions. Avoid destructive torso cuts or sorting individual limb triangles.
- Static HTML/JS/canvas, no framework/backend/build step. Five facings blend during turns. Masks, retargeting and garment deformation remain study techniques needing human review.

## Verification and fresh-chat entry

Run `node tools/check_cast.cjs`, `node tools/check_visits.cjs`, `node tools/check_leg_projection.cjs` and `node tools/check_gaits.cjs` after relevant movement edits. Serve with `python3 -m http.server 8031 --bind 127.0.0.1 --directory dist`, then run `python3 tools/check_cast_browser.py` and `python3 tools/check_visits_browser.py`. Crowd/alley browser checks cover shared-renderer changes. Screenshots/reports are under ignored `artifacts/`. Checks support visual review; they do not establish naturalness alone.

Fresh-chat prompt: “Open Magic Window, read CURRENT-STATE.md and the repo instructions, and continue from the latest shop-visit review.” Include new visual feedback/screenshots where relevant; the full old transcript is unnecessary.
