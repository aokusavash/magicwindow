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
