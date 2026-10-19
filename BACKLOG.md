# Magic Window build backlog

Updated October 19, 2026. This queue supports a walk → build → review cycle. See [ROADMAP.md](ROADMAP.md) for product decisions and [AGENTS.md](AGENTS.md) for working instructions.

## How to use this queue

Walks can explore many ideas and settle several decisions; they are not limited to choosing one tiny task. Turn concrete decisions into reviewable batches with an outcome and a readiness state. During an active execution session, work through ready items without repeatedly asking for permission already given in conversation. Commit useful batches directly to main, with appropriate checks and concise reports. Keep art and working previews easy to review at the next walk or whenever looking at the screen is convenient.

A saved backlog is not an execution service. No unattended coding runner or schedule has been configured. Work between walks needs an active execution task or session; do not imply that saving this file starts days of autonomous work. Record completed outputs and blockers here so another session can resume.

“Ready” means sufficiently specified to attempt, not completed or released. “Waiting” names a real dependency. “Future” preserves an idea without making it an immediate requirement. Review of new displayed art and behavior remains distinct from committing source.

## Phase-one target

A cozy, beautiful rural Japanese neighborhood that the user's daughters or wife voluntarily enjoy watching for more than five minutes, ideally about ten. Rich architecture, readable people, believable varied ambient activity, household-local daylight, and real Seattle weather are the focus. Permanent character identities and AI-directed stories can follow.

Working composition: a fixed, slightly raised, mostly side-on view; roughly 80 percent or more buildings, street, and people, with modest distant scenery. This ratio and four-or-five-building estimate are flexible visual hypotheses.

Visual variety and coziness guide business selection, rather than a realistic business mix or an “everyday errands” category. Current anchors are a flower-and-produce shop and a restaurant, with ramen the leading restaurant idea. A small dessert shop is favored, with ice cream versus mochi open. A bus stop is a promising candidate, not a required feature. Other buildings remain open.

## Ready for an active work session

### Develop independently viewable art options

- Produce a small, labeled design survey spanning coarse/cozy pixel art, detailed pixel art, painted animation, and illustrated storybook art.
- A first four-panel comparison already exists in the October 19 conversation. It has not been checked into the repository. Recover and preserve it if accessible; do not claim it is available from this repo.
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

Dependency: one or more family-selected art directions and appropriately prepared assets.

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

- **Clear-day mountain reveal:** a distant peak usually hidden by haze/cloud becomes striking on very clear days. Explicitly deferred; keep distant scenery separable and a possible sightline, but do not prioritize the effect now.
- **Bus stop:** a larger moving vehicle, arrivals/departures, and varied groups including possible schoolchildren; discuss placement and desired prominence before treating it as required.
- **Additional frontage:** bakery, repair shop, school gate/side street, homes and domestic details are possibilities, not settled building choices.
- **Persistent residents and world memory:** recognizable identities, routines, relationships, and changes that survive restarts.
- **Family and new dog:** retain the earlier continuity/animation test; it is no longer the prerequisite for phase one.
- **Director:** deliberate choices using history, supported actions, and prepared assets, building on the initial procedural activity selector.
- **Asset/capability workshop:** proposed additions follow preparation, preview, human visual review, and release.
- **Display platform:** packaged Samsung TV feasibility and actual device testing; HDMI computer remains a fallback.
- **Optional contributions:** gifts, objects, and resident responses, as an exploratory later possibility.

## Completed checkpoints

- Current prototype and earlier design roadmap existed before this walk.
- October 19: generated and displayed an initial four-style art comparison in the conversation; no style selected.
- October 19: committed phase-one targets and the direct-to-main workflow.
- October 19: committed shop-selection direction and deferred the clear-day mountain idea.
- October 19: created this actionable backlog and recorded the between-walk workflow. No unattended executor has been configured.
