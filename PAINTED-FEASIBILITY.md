# Study 03: connected-surface walking experiment

October 21, 2026. The user found Study 02 visibly assembled from separately animated parts. That is a construction problem, not simply a shortage of frames. The rigid piece rotations expose joint transitions, disconnected shoulders/neck, and an overly bent supporting leg.

Review the separate `/painted/walking/` comparison. It uses newly generated whole-figure painted references and a measured, weighted Canvas triangle mesh. The controls compare connected painting and rigid cutouts using the same underlying pose and timing, with both characters selectable. Pause preserves the exact pose when switching treatments. Bags remain independent props. The original `/` stays unchanged, and `/painted/` retains its full interaction rig.

**Outcome: not yet visually successful.** Keeping the upper painting together improves the torso silhouette, but the side-view legs overlap in the source image and cannot separate cleanly under deformation. Cloth stretches and mesh artifacts remain. Broad mesh deformation also failed for door-reaching poses; that trial was not integrated into the interaction scene. Arm motion in the walking comparison is deliberately restrained rather than presented as solved.

Small corrections retained in the shared rig: shorter stride, lower swing-foot clearance, quieter arm swing, proper shoe-to-ankle offset when placing the pelvis, corrected limb pivots, and a neck bridge. These improve the mechanical setup but do not resolve the user's artistic objection by themselves.

The next production experiment should use **one carefully prepared, layered character**, with hidden areas underpainted behind limbs, calibrated pivots, smooth local skin weights, and authored contact/passing poses. Blend shared actions on that construction, with corrective drawings for difficult bends and view changes. Do not generate the whole population yet. Runtime activity selection can remain procedural; achieving coherent drawing and motion is the current bottleneck. A specialist skeletal renderer may help tooling/performance later, but cannot manufacture missing artwork or fix unreviewed weights.

Reproduction: `python3 tools/build_painted_skin.py` measures unchanged source PNGs and writes `skin-data.js` (optional Pillow/NumPy/SciPy production dependencies). `skin.js` deforms and renders the triangles at runtime without a new app dependency. `node tools/check_skin.cjs` checks finite deformations and normalized weights through walking poses; `python3 tools/check_walking_browser.py` checks loading, comparison controls, pause, mobile/reduced-motion behavior and missing assets. The desktop timing in that report is a one-character diagnostic, not evidence of TV or full-population performance. Geometry/browser checks are not artistic acceptance.

---

# Painted animation: reusable-rig revision

Current revision: Study 02, October 21, 2026. Review `/painted/`. The original prototype and earlier movement study are unchanged. The first-build report below is archived context; current residents no longer use its generated walk-cycle frames.

## User feedback motivating this revision

The first attempt had inconsistent or missing bag artwork, insufficient passing/swing poses, apparent moonwalking and sliding, no convincing weight transfer, profile-only movement into depth, a door that opened without visible touch, and a black interior. The user requested further iteration and a flower-smelling interaction, and correctly identified the scaling problem of independent per-character action sheets.

## Implemented in Study 02

- Two painted character-part atlases plus replacement clothing bodies; one shared procedural skeleton and action logic for both residents. The generated first-attempt sheets remain in source as references, but are not loaded for resident movement.
- Continuous stance and swing phases with bent-knee passing poses, foot clearance, opposite arm movement, and body rise/fall derived from weight transfer. Stance targets remain fixed in world space while the body advances.
- Props are separate persistent objects: the tote attaches to the near hand, the red crossbody bag attaches to the body with a rendered strap. No pose depends on a generator remembering to redraw the bag.
- Separate side, rear, and front heads and clothing views. Turns precede movement toward and away from the doorway. Rear/front leg projection is handled separately to avoid exaggerated sideways knee bends.
- An explicit reach, grip, slide, release sequence. The arm uses a two-bone target solver; the near hand and moving door handle share the same target position throughout opening and closing. It is choreographed contact, not a force-based physics simulation.
- A painted warm restaurant interior behind the opening, a threshold, foreground jamb masking, and a short turn into the interior before the resident goes out of view. The door stays open during the visit and is closed by the resident after leaving; it does not slide unattended while she is hidden.
- A flower interaction: settle, bend knees and torso, lower/tilt the head toward a blossom target, pause with subtle breathing, and recover before walking on.
- Flower test and a cycling Close-up control for the resident, neighbor, and full street. Entrance/flower tests follow the resident if close-up was active.

The cook still uses the original two serving poses. Lighting/rain are unchanged manual studies, with the same baked-sunlight limitations. Live weather, a director, runtime art generation, and the full phase-one population remain unimplemented.

## Reuse model and limits

Independent action sheets scale roughly as characters × actions × directions, not exponentially. With a compatible shared rig, character-specific art and shared action controllers are largely separated. Adding a character requires painted body parts/views, attachment metadata, and fitting. Adding an action can reuse those parts and target solvers across compatible characters.

This does not make arbitrary actions free. Very different bodies need retargeting; hands, facial expressions, clothing deformation, bikes, seating, and unusual perspectives may need new art and constraints. This revision uses rigid painted pieces, not mesh-deformed clothing or a professional skeletal authoring system. Joint overlaps and the limited three-view turning treatment are still visible at close range. A narrowed frontal clothing piece is used for side movement because generated side clothing retained a baked sleeve. These are artistic production issues to evaluate rather than hide behind passing geometry tests.

## Checks for this revision

- `node tools/check_painted.cjs`: repeated planted-foot checks during travel; swing clearance; body rise/fall; hand-to-handle agreement during opening/closing; persistent bag attachment and render calls across all visible poses; rear/front approach views; face proximity to the flower target; seeded variation and continuous activity routes.
- `node tools/check_study.cjs`: earlier study regression checks remain passing.
- `python3 tools/check_painted_browser.py` against an already running local server: desktop and mobile Chromium, no page errors, pause, variations, entrance/flower/close-up controls, lighting controls, reduced-motion startup, missing-artwork failure, and a fully embedded export loaded with external requests blocked.
- Browser screenshots inspected, then corrected for joint gaps and exaggerated rear-view knee spread. The optional close-up intentionally magnifies limitations. No physical-TV or other-browser-engine validation is claimed.
- Checks establish structural properties and interaction controls; they do not establish that the character motion meets the user's artistic quality bar.

## Reproduction

The app remains buildless Canvas/JavaScript. `rig.js` contains the shared pose and drawing code; `world.js` schedules target-driven actions; `rig-frames.js` stores measured atlas bounds. PNG source assets remain unchanged in `dist/painted/assets/rig/`. `python3 tools/measure_rig_parts.py` remeasures the largest connected alpha component in each cell without retouching images (Pillow, NumPy, and SciPy are optional production-tool dependencies, not runtime dependencies). `python3 tools/export_painted.py` embeds the current scripts, styles, and assets in a standalone HTML preview.

Next checkpoint: review walking, the persistent tote, body weight, flower behavior, and hand contact in Close-up. Further mesh deformation, turn poses, and action tuning should follow observed visual weaknesses. Reverting to mass-generating independent action sheets is not the default approach.

---

## Archived first-build report

# Painted animation: first feasibility build

Built October 21, 2026. Review `/painted/`; the original `/` prototype and earlier `/studies/` remain separate. This is an experiment for visual review, not the finished living-room experience.

## What is working

- A newly generated clean painted street plate, referencing the painted-animation panel of the original survey. No people are baked into the scenery.
- Two distinct generated eight-pose walking sheets, plus separate standing poses. Frames use measured alpha bounds and head anchors. Left-facing movement mirrors the right-facing source art.
- Resident activity is chosen procedurally with reproducible seeded variation: changing speeds, browsing pauses, restaurant visits, time inside, and offscreen pauses. New variation selects another seed. Playback is rendered in the browser, not a looping video.
- A measured restaurant entrance with a sliding panel, a simple dark interior, clipping at the threshold, and foreground jamb occlusion. The resident approaches, enters, remains inside briefly, exits, and resumes walking. Entrance test skips ahead for review.
- A cook with two serving poses behind the counter, contact shadows, chimney/cooking steam, rain and ground ripples, and manual afternoon/evening/rain visual treatments.
- Pause, reduced-motion startup, visibility-aware time, mobile layout, and scene-only fullscreen controls. Controls and explanatory text stay outside the scene.

The sketch demonstrates dynamic selection of prepared activity. It does not demonstrate generating new art, new action code, or arbitrary interactions during playback.

## What the visual checks established

The painted background remains detailed and attractive when composited with separately animated residents. An initial character scale was too small relative to the architecture and was increased after inspecting browser screenshots. The composite is viable enough to review in motion; this is not a claim that all generated frames meet a finished animation standard.

Frame generation remains the main artistic uncertainty. Walking poses vary, but stride phases, silhouettes, anatomy, and bag placement are not perfectly consistent. Alpha-bound alignment reduces registration jitter; it does not repair an imperfect walk cycle or guarantee that feet plant without sliding. The next art iteration should evaluate the actual motion, repair or regenerate weak poses, and consider a reusable articulated rig if necessary. Mirroring also reverses painted light direction.

The entrance uses a deliberately simple interior. Counter service is a two-pose demonstration, not a complete seated eating interaction. Only two visiting residents are present; this is not the ten-to-twelve-person phase-one population or a ten-minute repertoire of finished shop behaviors.

Evening and rain expose the limitations of relighting one afternoon painting. Cloudless sky, directional highlights, and shadows are baked into the plate; color treatments and window glows cannot fully resolve them. Better day/night/weather art will need prepared lighting layers or geometrically matched variants. Real Seattle weather and local daylight are not connected in this study.

## Verification

- `node tools/check_painted.cjs`: reproducible/new seed variations, continuous routes, bounded doorway state, enter/inside/exit/browsing behavior through a simulated ten minutes, and frame manifest structure.
- `node tools/check_study.cjs`: earlier study regression checks remain passing.
- Headless Chromium: artwork loading, no page JavaScript errors, pause, entrance control, new variations, mobile layout without horizontal overflow, reduced-motion startup, and visible failure when an asset is unavailable.
- Browser screenshots inspected for afternoon, entrance, evening, rain, and mobile. Code and screenshots do not replace user judgment of motion quality.
- The standalone export's embedded artwork and scripts were loaded successfully with network requests blocked. Direct `file://` navigation was blocked by this environment's browser policy, so direct-file opening was not verified here.
- No physical Samsung TV, other browser engine, or target-device performance validation. The existing Samsung package continues to package the earlier study; it does not include this preview.

## Source and reproduction

`dist/painted/` is buildless HTML, CSS, and JavaScript with local PNG assets. No new rendering dependency, framework, backend, or runtime AI service was added. `world.js` separates activity choice from drawing; `painted.js` composites the prepared layers. `frames.js` is tracked, so the app requires no asset-processing build step.

Original generated PNG bytes are retained in `dist/painted/assets/`. Source-frame selection/cropping happens during canvas rendering; the images were not painted over or retouched by processing scripts. `python3 tools/measure_painted_frames.py` remeasures pose bounds (Pillow required for this optional production tool). `python3 tools/export_painted.py` creates `artifacts/magic-window-painted.html` with all assets embedded. The original comparison sheet is now preserved at `art/reference/style-survey.png`.

Next checkpoint: human review of overall appeal, character integration, walking quality, entrance behavior, and lighting limitations. Continue the painted direction if that result is promising; storybook remains an alternative. New production-world release is separate from this review preview.
