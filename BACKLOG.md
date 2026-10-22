# Magic Window build backlog

Updated October 22, 2026. This queue supports a walk → build → review cycle. See [ROADMAP.md](ROADMAP.md) for product decisions and [AGENTS.md](AGENTS.md) for working instructions.

## How to use this queue

Walks can explore many ideas and settle several decisions; they are not limited to choosing one tiny task. Turn concrete decisions into reviewable batches with an outcome and a readiness state. During an active execution session, work through ready items without repeatedly asking for permission already given in conversation. Commit useful batches directly to main, with appropriate checks and concise reports. Keep art and working previews easy to review at the next walk or whenever looking at the screen is convenient.

A saved backlog is not an execution service. No unattended coding runner or schedule has been configured. Work between walks needs an active execution task or session; do not imply that saving this file starts days of autonomous work. Record completed outputs and blockers here so another session can resume.

“Ready” means sufficiently specified to attempt, not completed or released. “Waiting” names a real dependency. “Future” preserves an idea without making it an immediate requirement. Review of new displayed art and behavior remains distinct from committing source.

## Current priority: painted-animation feasibility

October 21 user decision: try the ambitious painted-animation direction first, with storybook as a close alternative. Both are preferred over defaulting to pixel art for ease; all four remain acceptable if evidence guides a change. This experimental choice removes the need to wait for an initial style preference before preparing a small painted study. Final visual acceptance and release remain separate.

The existing October 20 movement study is a technical rehearsal, not evidence that the new visual-quality target has been met. Consult its implementation notes and reuse useful foundations, preserving the existing prototype and unrelated work. Phaser is still a candidate, not a selected dependency.

### First painted scene built: awaiting visual review

Status October 21: the initial feasibility preview has been implemented at `/painted/`, with actual browser checks and screenshot inspection. See [PAINTED-FEASIBILITY.md](PAINTED-FEASIBILITY.md) for scope and limitations. The next work is visual feedback and targeted motion/lighting refinement, not another initial-preference gate. The criteria below remain the reference for evaluating the preview.

- Use a representative rural Japanese street section consistent with the neighborhood-dominant view and agreed shop direction. Preserve the quality that made the still appealing.
- Prepare clean scenery, separate moving elements, and foreground/entrance masks rather than animating a flattened concept image as though its painted people were usable sprites.
- Show genuinely animated walking and one simple visible shop interaction/occlusion, plus modest environmental motion such as steam. Begin with enough people to test the method; the eventual full scene still targets the agreed population rhythm.
- Vary route/timing/action choices to show dynamic behavior with reusable assets. Do not pass off a looping video or sliding still character as proof of the intended system.
- Include a lighting/weather comparison sufficient to identify baked shadows/highlights and asset-preparation needs; this need not implement live weather.
- Verify grounding, scale, consistent identity, matching light/style, foreground ordering, and readability at TV scale. Report actual checks and remaining visual concerns.
- Outcome: a reviewable feasibility preview and a clear assessment of what works, what needs another iteration, and whether to continue painted animation or test storybook. Do not manufacture a pass based only on code checks.
- Generating novel assets and arbitrary interactions is a separate later capability test. The earlier preference-recording update did not implement motion; the subsequent October 21 build now provides the initial preview described above.

### Current blocker: convincing character construction

Study 03 `/painted/walking/` records the user's disjointed-body feedback and a bounded continuous-mesh comparison. Whole-figure references, mesh metadata, conservative walking, A/B controls and checks are implemented. Visual acceptance failed: legs distort from overlapping source artwork, and large reaches stretch clothing. The interaction scene keeps its rigid rig with small gait/joint repairs.

Study 04 now supplies independent complete leg paintings for one resident at the same walking URL. The user liked the body rise/fall, so it is preserved; the thigh now visibly rotates instead of remaining bound to the torso. New and previous treatments are selectable. Ready next batch: visually review full-leg movement and waist/knee shape, then add coherent arm motion and authored corrections before testing contact and turn poses or producing more residents/actions. Preserve style and action reuse; add corrective artwork where the shared rig cannot maintain the silhouette. Do not treat more automated geometry checks as proof of animation quality.

Study 05 responds to stiff feet/hiking feedback with a three-stride comparison on the same resident, including heel/toe roll, lower lift, and support overlap. It preserves earlier treatment controls, adds half-speed and phone stacking, and is ready for motion preference feedback. After selection, refine shoe/ankle and resting arms, then trial the shared gait on two or three body types before mass asset generation. No preferred gait has been selected yet.

Study 06 addresses the next review: all three walks were promising but jolty, with slightly forward legs. Softer acceleration/support transfer, a mirrored 2.5% backward root adjustment and complete painted arm layers are implemented in the walking comparison. Arm swing is switchable. Next visual checkpoint is motion softness, waist alignment and coherent shoulder/sleeve motion before retargeting more people.

Study 07 adds a switchable near-straight leading knee during landing, then a relaxed bend through weight transfer. Tests preserve the previous body/foot paths and bound the corrective pose's small limb-length variation. Review Straighter landing on/off before expanding people. Future variation should combine stable resident traits with coherent activity adjustments; validate ranges on several bodies, rather than randomizing each step.

Walking checkpoint accepted: the user approved Study 07's motion for this character and asked for a calmer alternative. Relaxed is added at 90% Everyday pace and 90% vertical travel, preserving the accepted Everyday walk. Review this small variant, then use the accepted gait foundation for bounded multi-body retargeting and interaction work.

### Current checkpoint: alley and diagonal movement

The user accepted the walking quality and requested moving on, including all four 45° diagonals toward/away. Study 09 `/painted/alley/` implements the first next-stage test with eight facings, a curved out/back route, depth scale, building occlusion, and individual direction/close-up controls. Existing walking assets/controller remain frozen. Review the new views/turns and projected shoe contact. Then upgrade restaurant entry using the accepted character construction, rather than relying on the older interaction rig as proof. See the current feasibility report for actual checks and limits.

First-review repairs are implemented for the shared directional problems: whole-component atlas bounds restore cropped heads/bodies; calibrated torso/shoulder attachments and depth-sorted surfaces correct arm/trouser/bag overlap; the foreground edge follows the actual pole and foliage. Source-bound, mirrored hand-overlap and pole-edge raster regression checks pass alongside existing movement/browser checks. Next: user review of the repaired alley preview before restaurant entry. The painted view blends and hand-calibrated masks are still visual-review items.

## Next build-session kickoff

At the end of the October 19 walk, the user asked how to begin work from their computer. No further product decision is needed before starting the ready items above.

1. Open this repository in an active coding session and read README.md, AGENTS.md, ROADMAP.md, and this queue.
2. As of October 21, begin with the painted-animation feasibility batch above, grounded in an audit of the existing prototype and technical study. The ten-minute activity plan remains ready supporting work.
3. Prepare reviewable outputs, commit useful batches directly to main, and record what was completed or blocked here.
4. The user has supplied the initial style preference: painted animation first, storybook second. Seek feedback on the motion result before committing to a final production method or producing a large asset set.
5. Use the shortlisted style for a representative movement/lighting/weather test. Evaluate an engine if the audit supports it; Phaser is a candidate, not an adopted dependency.
6. Keep real weather integration, display-device testing, and later director/persistence work at their stated dependencies. Source commits do not automatically authorize publishing new displayed additions.

Nothing in this kickoff note launches a background task. No between-walk coding executor has been started from this conversation. The active desktop coding session is the practical next execution entry point.

## Phase-one target

A cozy, beautiful rural Japanese neighborhood that the user's daughters or wife voluntarily enjoy watching for more than five minutes, ideally about ten. Rich architecture, readable people, believable varied ambient activity, household-local daylight, and real Seattle weather are the focus. Permanent character identities and AI-directed stories can follow.

Working composition: a fixed, slightly raised, mostly side-on view; roughly 80 percent or more buildings, street, and people, with modest distant scenery. This ratio and four-or-five-building estimate are flexible visual hypotheses.

Visual variety and coziness guide business selection, rather than a realistic business mix or an “everyday errands” category. Current anchors are a flower-and-produce shop and a restaurant, with ramen the leading restaurant idea. A small dessert shop is favored, with ice cream versus mochi open. A bus stop is a promising candidate, not a required feature. Other buildings remain open.

## Ready for an active work session

### Supporting art studies (no longer a blocking four-way survey)

The initial preference is now known. Prioritize the painted feasibility preview; independent painted/storybook studies can support it. Further pixel comparisons are optional fallback work, not a prerequisite.

- Produce a small, labeled design survey spanning coarse/cozy pixel art, detailed pixel art, painted animation, and illustrated storybook art.
- A first four-panel comparison already exists in the October 19 conversation. It is now preserved at `art/reference/style-survey.png` as part of the October 21 feasibility build.
- Next useful outputs are independently viewable widescreen studies, maintaining comparable viewpoint, daylight, character scale, and frontage so style is the main variable.
- Reflect the emerging flower/produce, ramen, and compact dessert-shop direction, while leaving unselected frontage flexible.
- Keep doorways, paths, and small people legible from TV distance. Preserve high visual quality; do not assume a detailed image is automatically animation-ready.
- Done when the family has clearly distinguishable, accessible options to compare, with no style silently selected for them.
- This item is art exploration, not authorization to publish new artwork to the displayed world.

### Specify a varied ten-minute ambient activity sample

- Prepare a concrete activity plan using the current shop anchors, without requiring persistent character identities.
- Cover different visible actions and objects: tending outdoor displays, carrying produce or flowers, entering/leaving, counter seating/eating/service, and dessert handoffs or short pauses.
- Use about 10–12 visible people as an adjustable daytime starting point; spread activity between walking and lingering. Account for a potentially busier morning and nearly empty overnight period.
- Avoid synchronizing reused motions or turning every moment into a conspicuous event.
- Include clear observable outcomes at TV-viewing scale and mark optional vehicle/bus ideas as candidates.
- Done when the plan can guide implementation and a ten-minute preview without another broad product-definition conversation.
- No moving artwork or working scene has been produced by writing this backlog.

### Audit the prototype for the phase-one transition

- Inspect the existing single-file canvas implementation and actual hosting configuration before proposing code changes.
- Identify reusable time/weather/activity/rendering logic, limitations in paths/entrances/layering, and the smallest sensible module boundaries.
- Assess whether the current renderer can support the art shortlist; document where a 2D engine would offer concrete benefit.
- Phaser was discussed as a promising candidate, not selected or installed. Keep a migration evaluation separate from a decision to migrate.
- Done when there is a grounded implementation outline tied to the existing code, with risks and dependencies stated.
- Do not introduce an engine, framework, backend, or build pipeline merely to perform this audit.

## Waiting on visual selection or technical evaluation

### Validate a shortlisted style in motion

Initial art preference supplied October 21: painted animation, with storybook as the alternative. Preparing the necessary assets is part of the next ready feasibility batch above; this item is no longer blocked on an initial preference.

Produce a representative neighborhood preview showing readable movement and ambient activity with layered scenery. A visible entrance/counter can test integration, but the goal is the overall living-scene experience. Judge character scale, perspective, motion quality, and visual coherence; one attractive still does not establish those.

### Compare daylight, night, and rain

Dependency: a shortlisted composition/style.

Show the same neighborhood under those conditions without changing its identity. Weather and lighting should affect the whole scene. Presentation artwork is not yet live weather integration.

### Evaluate Phaser with a small representative scene

Dependency: the art-stage work reaching a useful point; user explicitly deferred a deeper engine discussion while still exploring art.

Test movement, animation, layering/entrances, asset handling, and weather effects against the current canvas approach. Consider browser and possible Samsung TV performance; do not report physical-TV validation without a device test. A prototype is not a commitment to migrate the app.

### Connect Seattle weather and household daylight

Dependency: a runtime approach and suitable weather data source.

Replace the manual-weather demo with actual Seattle conditions at a reasonable refresh cadence. Use an explicit household location/timezone approach rather than assuming the development machine's timezone. Reflect clouds/rain/wind and local daylight in presentation and activity where supported. Establish behavior for stale or unavailable weather data. Weather reports approximate conditions; they do not establish exact rainfall at the user's home. Assess whether a protected credential requires a small server component.

### Family review of a five-to-ten-minute preview

Dependency: a coherent animated scene.

Gather what the family enjoys looking at, what they notice, whether people/actions remain readable, and where repetition becomes obvious. The target is voluntary enjoyment, not a demand for constant excitement. Revise density, pace, composition, and activity from actual feedback.

## Future ideas and later vision

- **Small shrine or temple, explicitly deferred:** the user suggested a small shrine/temple with a quiet offering or incense-related interaction, and confirmed it belongs in future ideas. No addition to the initial street is approved or required.

Scope clarification from the user: brainstorming is a way to preserve possibilities, not a request to add every idea to the scene. The street risks becoming crowded; keep unselected establishments optional and avoid expanding the initial composition simply because more ideas were mentioned.

- **Street vendors, explicitly deferred:** possible taiyaki or takoyaki stalls, a seasonal roasted-sweet-potato cart/truck, or a compact yatai-style food stall. These were discussed as examples after the user suggested street food. Preserve them as future options only; none is selected or required for the initial street. Revisit if more activity or frontage is wanted later.

- **Clear-day mountain reveal:** a distant peak usually hidden by haze/cloud becomes striking on very clear days. Explicitly deferred; keep distant scenery separable and a possible sightline, but do not prioritize the effect now.
- **Bus stop:** a larger moving vehicle, arrivals/departures, and varied groups including possible schoolchildren; discuss placement and desired prominence before treating it as required.
- **Additional user-suggested establishments:** a Japanese convenience store (konbini), offering recognizable Japanese character and frequent customer arrivals/departures; a cozy, relaxing bookstore; and a cute coffee shop with customers seated indoors, by the window, or out front. Compare their visual character and activities against the other candidates when choosing the limited remaining frontage. None has been selected for implementation.
- **Additional frontage:** bakery, repair shop, school gate/side street, homes and domestic details are possibilities, not settled building choices.
- **Persistent residents and world memory:** recognizable identities, routines, relationships, and changes that survive restarts.
- **Family and new dog:** retain the earlier continuity/animation test; it is no longer the prerequisite for phase one.
- **Director:** deliberate choices using history, supported actions, and prepared assets, building on the initial procedural activity selector.
- **Asset/capability workshop:** proposed additions follow preparation, preview, human visual review, and release.
- **Display platform:** packaged Samsung TV feasibility and actual device testing; HDMI computer remains a fallback.
- **Optional contributions:** gifts, objects, and resident responses, as an exploratory later possibility.

## Completed checkpoints

- October 21, Study 02: responded to the first motion review by replacing resident frame playback with shared painted-part rigs, planted feet and body bounce, persistent props, rear/front views, explicit reach/grip/door choreography, a warm interior, and a flower-smelling interaction. Added close-up controls and targeted contact/foot/prop tests. Desktop/mobile Chromium checks and earlier regressions pass; artistic acceptance is pending. Prioritize observed joint/turn/contact weaknesses over producing independent sprite sheets for every new action.

- October 21: built the first painted feasibility preview at `/painted/`, preserved the original survey, and added a standalone export. Desktop/mobile Chromium checks, pure activity checks, and earlier-study regressions passed. Generated gait consistency and baked afternoon lighting remain known artistic limitations; no final visual approval, live weather connection, runtime asset generation, or physical-TV validation is claimed. See [PAINTED-FEASIBILITY.md](PAINTED-FEASIBILITY.md).

- October 20: recovered and completed the earlier movement-and-Samsung technical batch after an interrupted asset upload. The `/studies/` page now compares procedural pixel and articulated illustrated characters, family/dog leash movement, and original versus faster pacing. Offline HTML export and unsigned Samsung widget preparation are available; see [implementation preview](IMPLEMENTATION-PREVIEW.md). Motion/event checks and canvas-rendered frame inspection were completed. No browser/physical-TV validation, signed installation, deployment, or final style selection is claimed. This is not the full art survey or varied ten-minute phase-one scene, which remain the ready priorities above.
- Current prototype and earlier design roadmap existed before this walk.
- October 19: generated and displayed an initial four-style art comparison in the conversation; no style selected at that time.
- October 21: user chose painted animation as the lead feasibility direction, storybook as a close alternative, and an ambitious motion test ahead of defaulting to pixel art. Recorded the decision and advanced the bounded feasibility batch; no new animation or deployment is claimed.
- October 19: committed phase-one targets and the direct-to-main workflow.
- October 19: committed shop-selection direction and deferred the clear-day mountain idea.
- October 19: created this actionable backlog and recorded the between-walk workflow. No unattended executor has been configured.
