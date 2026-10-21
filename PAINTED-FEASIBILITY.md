# Accepted walking checkpoint and relaxed variant

October 21, 2026. The user accepted the Study 07 walk as visually successful, describing it as purposeful/businesslike rather than a casual stroll. This acceptance applies to the current character's side-on walking, not the full interaction scene or every future body type.

Added **Relaxed** as a separate profile and default review view: 10% slower travel/cadence than the accepted Everyday profile, with 10% less vertical body travel. It inherits the same step length, foot clearance/roll, near-straight landing correction and arm-swing shape. The accepted Everyday profile remains intact; Stroll and Brisk also remain selectable. The three-way comparison now shows Relaxed, Everyday and Brisk. No new artwork was needed.

Verification: existing geometry checks now include Relaxed in both directions, including foot planting, bounded limb deformation, landing extension and smooth transitions. A numerical comparison confirms precisely 0.90× travel speed and 0.90× vertical excursion relative to Everyday. Browser controls and mobile/reduced-motion checks cover the new default and selection. Relaxed's feel still needs user review.

---

# Study 07: near-straight landing pose

October 21, 2026. The user found the walk close to the target but identified continuously bent knees as the remaining hiking-like quality. They requested a nearly straight leading knee after the foot comes forward, and proposed bounded, persistent differences between residents and activity-dependent changes in pace/style.

At `/painted/walking/`, **Straighter landing** is on by default and can be toggled at the same paused time against the previous soft-knee pose. The leading leg extends during late swing, holds a 6°/7°/9° knee bend for Stroll/Everyday/Brisk through early stance, and eases back to the shared bend solver as weight transfers. This is deliberately short of a locked or hyperextended knee. The earlier 1.25% root alignment, quiet body-height path, foot/heel/toe targets, cadence, and arm swing are retained.

This is an authored 2D silhouette correction. Blending the knee joint within a complete painted leg allows a small amount of limb-length flexibility; the tested full-leg drawing stays within 4% of the nominal length. It is not a rigid-body biomechanics model. Attempts to get the same near extension exclusively by raising the pelvis increased body travel or sharpened support transitions; they were not retained. The current correction leaves the body and planted-foot paths identical when toggled.

The gait profiles now expose landing-knee bend and arm amplitude alongside speed, step length, support duration, lift and foot roll. These provide a foundation for variation, not a claim that persistent resident traits or context switching are already implemented. Future direction: assign each resident a stable, bounded baseline, then apply coherent activity adjustments for browsing, commuting or hurrying. Keep step timing synchronized with travel speed; do not reroll parameters every step or assume every person in an age group walks identically. Evaluate ranges across multiple body proportions before treating them as approved production limits.

Checks: existing gait, foot-contact, reachability, transition smoothness and body-motion checks pass in both directions. Added checks verify early-stance knee bends below 12°, bounded limb-length change, and identical body/foot paths with the correction on/off. Browser checks verify the new toggle preserves paused time plus the existing controls, mobile/reduced-motion behavior, and asset failures. Paired screenshots of the same landing were visually inspected. Artistic acceptance and retargeting remain under review; original `/` and full `/painted/` interactions are unchanged.

---

# Study 06: softer timing, hip alignment, and arm swing

Follow-up tuning: the user liked the new arm walk but found the backward leg shift a little excessive and the overall walk slightly too bouncy. Halved the backward offset to 1.25% of body height and reduced the pelvis vertical travel by 20%, settling slightly lower to keep the leg targets reachable. Foot paths, cadence, eased timing, and arm swing are retained.

October 21, 2026. The user liked all three strides and the foot-roll improvement, but found reversals jolty/robotic and the legs slightly too far forward. They also suggested arm swing as the next step toward convincing motion.

Updated `/painted/walking/` retains Stroll, Everyday and Brisk. It now opens in single Everyday view to reduce rendering work when judging softness; the three-way comparison remains available. The swing now matches position, velocity and acceleration at its joins, with a clearance curve that also eases out of and into contact. Foot-pivot and forefoot transitions during swing are blended. A smooth conservative support envelope replaces the abrupt maximum used to place the pelvis; this retains reachability and body rise/fall while removing the support-switch velocity cusp. Leg roots and foot paths are now shifted backward by 1.25% of body height relative to the torso, mirrored with direction. Planted heel/ball contacts remain stationary in world space.

A new generated upper-body atlas (`assets/skin/resident-arms.png`) supplies the torso/head and two complete painted arm layers. Arms use smooth shoulder oscillation, opposite to the corresponding leg, with a small elbow bend and phase lag. The joint deformation blends within a continuous arm painting rather than exposing separate upper/lower-arm cutouts. The Arm swing toggle compares moving and resting arms using the same artwork. The previous-stride reference retains its old upper-body treatment. This is a walking-only experiment; door/flower scenes and the original prototype keep their existing implementations.

The mesh sampling was reduced where extra subdivisions did not add needed shape control, lowering Canvas draw calls while retaining the continuous silhouette. Close-up sleeve/waist joins and the replacement upper-body proportions still need visual review; passing geometry checks do not establish artistic acceptance. No physical-TV performance claim is made.

Checks: updated gait tests retain ground-contact, reachability, toe flex and transition checks; add mirrored root-offset checks, arm swing/rest and finite arm-mesh checks, plus a dense pelvis-velocity check that catches the former support-switch cusp (position continuity alone did not). At 4,000 samples/cycle, the peak per-sample change in pelvis velocity fell from approximately 26/41/61 px/s to 0.23/0.32/0.63 px/s for Stroll/Everyday/Brisk; this is a numerical comparison, not a perceptual smoothness score. Existing layered/skin/full-interaction geometry checks pass. Browser checks include the arm toggle, the new asset's failure state, paused comparisons, mobile stacking/reduced motion, and earlier controls. Support and passing-pose screenshots were inspected.

Next review: whether transitions feel softer at normal speed, whether the legs now sit under the torso, and whether restrained arm motion helps without reintroducing a puppet-like silhouette. No preferred gait has been selected.

---

# Study 05: stride and foot-roll comparison

October 21, 2026. The user found Study 04 promising, with stiff feet and an overly deliberate/hiking stride. They asked about comparing multiple people or continuing to tune one. This batch compares **three strides on the same character/artwork first**, avoiding appearance and body-proportion differences while choosing the movement. After motion review, retarget the preferred family of strides onto a small set of different bodies.

Review `/painted/walking/`: A Stroll, B Everyday, C Brisk run together by default. Select one to inspect it alone; Previous stride retains the flat-footed controller as a reference. Pause, half-speed, close-up/full-street, and restart are available. Phone comparisons stack vertically. Cameras follow the walkers against repeating scenery, a diagnostic setup rather than a new town activity system.

New gait profiles in `walking/gaits.js` vary step length, speed/cadence, ground-support duration, foot clearance, and roll angles. At the current resident height, the candidates are approximately 92, 102 and 114 steps/minute. Each has a brief overlap in ground support. Swing trajectories join the planted-foot velocity continuously instead of abruptly beginning a high lift. Clearance is 1.4–2.6% of body height versus the previous 4.5%. The body still rises/falls according to leg extension. The foot rolls from heel contact to full support to push-off; a small separate forefoot influence lets the toe remain down while the heel lifts. The same painted leg layers are reused, with no new person assets.

This is target-driven 2D choreography, not a physics simulation or anatomically modeled shoe. The toe bend is a simple mesh deformation, and shoe/ankle shape still needs visual acceptance. Arms remain at rest in the connected upper painting. The complete door/flower scene keeps its existing rig; the original `/` is unchanged. Earlier artwork controls are retained under a disclosure and use the previous controller.

Verification: `node tools/check_gaits.cjs` checks both directions, grounded support throughout, stationary heel/ball contact during stance, forefoot flex, lower clearance, overlapping support, body motion, reachable joints, finite rendered meshes, and continuity at swing/contact transitions. Updated layered/skin checks and full-scene geometry checks pass. Browser checks cover three-way and individual views, prior reference, paused comparison time, half-speed control, mobile stacking, reduced motion, asset failure, and prior artwork controls. Desktop/phone screenshots of support and passing poses were inspected. These establish implementation behavior; preferred naturalness remains a user visual decision, and physical-TV performance is untested.

---

# Study 04: independent whole-leg paintings

October 21, 2026. Feedback on Study 03: the subtle whole-body vertical movement works, but thighs look frozen and motion appears restricted to stretching below the knee. Preserve the rise/fall while fixing full-leg articulation.

Implemented at `/painted/walking/`, default **Whole-leg layers · new**, for the resident only. A newly generated transparent atlas supplies one connected upper body and two complete, independently painted legs from hip to shoe. Each leg has its own smooth thigh/knee/shin/foot weights; neither shares vertices or texture with the opposite leg. This replaces the previous shared trouser surface and its torso-bound upper thighs for this treatment. Pose timing, planted-foot targets, and body rise/fall are unchanged. The upper body is one rigid painting with resting arms; arm swing is explicitly unresolved. The bag remains a separate persistent object.

The previous stretched painting and rigid-cutout reference remain selectable at the same time/pose. Selecting the new treatment selects the resident; selecting the neighbor switches to the previous painting. The full `/painted/` interactions and original `/` prototype are unchanged. Source atlas is `assets/skin/resident-layered.png`; measured crop bounds and weights are in `walking/layered.js`. Source artwork is not retouched by production scripts. The mesh renderer now supports a reference height independent of the cropped layer's height, maintaining leg width and foot size.

Checks: `node tools/check_layered.cjs` verifies independent leg influences, rotation of actual rendered upper-leg edges through a stride, finite deformations, and retained body rise/fall. Existing skin and interaction checks still pass. Updated browser checks exercise new/old comparison, character fallback, preserved paused time, mobile/reduced motion, and failure when the new atlas cannot load. Stride and passing-pose screenshots were visually inspected; triangle edge overlap was adjusted for the new layers to remove visible mesh gaps. These checks do not establish artistic acceptance or physical-TV performance.

Review remaining waist joins, knee shape, proportions and full-street readability. No claim of finished animation or arbitrary action reuse is made. This is a more suitable asset construction for walking, not a completed replacement for door-reaching, turning or flower poses. Do not expand the population before motion review.

---

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
