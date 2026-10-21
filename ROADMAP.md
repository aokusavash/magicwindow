# Magic Window roadmap

Working notes from the October 17, October 19, and October 21, 2026 design conversations. This roadmap is deliberately adaptable before the living-room installation.

## Purpose and working style

Magic Window is a persistent window into a neighborhood with a life of its own. It should be enjoyable as ambient art and reward closer observation with recognizable people, routines, and gradual changes.

Development is also an experiment in what AI can and cannot reliably do. Dog walks of roughly 45–60 minutes can be sustained design and technical conversations, with decisions captured here and concrete implementation tasks emerging from them. Progress is not limited to one tiny change per walk.

"Launch" means installing it in the living room. Broad changes are welcome before then; continuity and smaller increments become more valuable afterward. The aim is to develop something interesting over the coming weeks, without a fixed delivery date.

## Phase one: a beautiful living neighborhood

Agreed during the October 19 walk. This sets the immediate priority ahead of the earlier family-and-dog continuity experiment. These are product targets, not implemented changes.

- **Success test:** the user's daughters or wife enjoy voluntarily watching for more than five minutes, ideally around ten, noticing details and activity. The scene should feel aesthetically pleasing and more interesting than a still picture without manufacturing constant excitement.
- **Scope:** establish the art style, overall ambiance, believable varied ambient activity, local day/night cycle, and real local weather. Recurring character identities, persistent stories, and an AI director remain part of the future vision and are not prerequisites for phase one.
- **Setting and framing:** retain the rural Japanese neighborhood direction. Buildings, streets, and people occupy most of the frame; around 80 percent or more is an initial guess to adjust visually. Mountains, forest, and sky are supporting background rather than the main view. The user welcomed a fixed, slightly raised, mostly side-on view with readable shopfronts, entrances, walking areas, and some shallow depth.
- **Art exploration:** compare multiple visual directions, including different pixel-art treatments and non-pixel illustration. A four-panel concept survey was generated and shown in the October 19 chat: cozy pixel, detailed pixel, painted animation, and storybook. The user wants input from their daughters. At that point no style had been selected. On October 21 the user chose painted animation as the lead feasibility direction, with storybook as the close alternative (see below). These are still-image concepts, not animation-ready layered assets. The comparison image is now preserved at `art/reference/style-survey.png`.
- **Activity level:** a relaxed, steady trickle rather than a tourist crowd. Rough daytime target is 10–12 visible people, perhaps roughly twice that during morning commuting, and close to nobody in the middle of the night. These are visual starting points, not exact quotas. Activity can include lingering or visiting places as well as crossing the scene.
- **Local conditions:** daylight follows the household's actual local day/night cycle, initially Seattle. Weather should reflect actual Seattle conditions rather than independent fictional weather, within the spatial and update limits of weather reports. This requires a future integration; the current prototype still uses a manual demo toggle.
- **Future-ready foundation:** phase-one activity may be chosen procedurally from prepared possibilities. Define places, paths, entrances, and reusable actions, and keep activity selection separate from animation so a later director can choose actions using persistent identities and world history. This is an architectural direction, not a reason to build the full director now.
- **Art feasibility:** preserve the high visual quality the user liked. Detailed scenery can be mostly static, with separately prepared interactive elements and foreground layers where needed. Actual compatibility still requires testing people, entrances, scale, and movement together. A restaurant-entry test is a candidate technical experiment, not the entire product goal or an approved final scene.

## Art direction: painted animation first

Agreed October 21, 2026, after reviewing the four-style survey. The user finds painted animation and storybook the most beautiful, magical, and ambitious directions, slightly preferring painted animation. Lead with painted animation for a bounded feasibility study; retain storybook as a close alternative. Pixel styles remain acceptable fallbacks if evidence warrants reconsideration, rather than the default merely because they look easier. This chooses an experimental direction, not approval of unseen final assets or a claim that the production pipeline is solved.

The comparison labels are descriptive, not rigid technical categories. In the existing sheet, painted animation emphasizes soft edges, atmospheric light, material richness, and depth; storybook emphasizes visible ink contours, paper-like texture, and a flatter illustrative finish. Both can use layered 2D scenery with frame-based or articulated character animation. The first test can retain painterly scenery with readable, simplified character shapes; exact animation method remains to be evaluated.

The next meaningful checkpoint is a small coherent animated scene that preserves the still artwork's appeal: a representative street section with separately prepared layers, at least one genuinely articulated or frame-animated walking character (not just a still sprite sliding across), a visible shop interaction/occlusion, and modest environmental movement. A lighting/weather study should expose baked-lighting limitations. Vary activity timing/routes using reusable behaviors to demonstrate dynamic activity, rather than presenting a prerecorded video as a simulated world.

Check character identity, body motion, contact with the ground, scale/perspective, lighting, occlusion, and readability at the intended TV size. Prepare only enough assets to establish feasibility before mass-producing the neighborhood. Keep animation quality, dynamic behavior selection, and generation of new assets as separate claims: a coherent animation does not demonstrate arbitrary on-demand creation of new interactions. Recording the preference itself did not implement the scene. A subsequent October 21 build now provides the first painted feasibility preview at `/painted/`; see [PAINTED-FEASIBILITY.md](PAINTED-FEASIBILITY.md) for what works, browser checks, and limitations. Generated walk-cycle consistency and day/night relighting remain to be improved; visual acceptance is pending.

## Animation feedback and shared-rig iteration

On October 21 the user reviewed the first painted preview and identified disappearing/inconsistent props, incomplete stride phases and sliding, missing rear views, an untouched automatically opening door, and an unconvincing black interior. They requested another iteration and a flower-smelling action, and proposed reusing actions through composable character parts rather than generating every character/action combination independently.

Study 02 at `/painted/` now tests that direction: shared continuous walking and target-driven arm poses, separate persistent bags, front/rear/side views, coordinated hand/door contact, a painted interior, and the flower action. See [PAINTED-FEASIBILITY.md](PAINTED-FEASIBILITY.md) for current evidence and limits. This is a rigid-part 2D rig, not completed mesh deformation or proof of unrestricted action generation. Keep reusable character art, shared actions, and scene-specific contact targets separate as the project develops.

## Neighborhood places: current direction

Further October 19 discussion: optimize the limited street frontage for **visual variety, coziness, and things children find interesting**. Do not frame the choice primarily as everyday errands or reproduce the real-world proportion of restaurants. Four or five buildings is a working composition guess, not a fixed limit.

- The user likes a flower-and-produce shop: colorful plants and outdoor displays provide a different visual texture and activity.
- Include a restaurant, with a ramen shop as the leading idea. A visible counter could show seated customers eating, with reusable motions varied by appearance and timing. Exact layout and animation have not been implemented or approved.
- A small dessert shop is a favored additional candidate, perhaps ice cream or mochi. It can add playful color and child-interest without occupying a large frontage. Exact dessert type remains open.
- A bus stop is a promising example of visual variety: a larger moving vehicle and varied groups arriving and departing, potentially including schoolchildren. The user offered it as an illustration, not a settled implementation requirement.
- Further user-suggested candidates: a Japanese convenience store (konbini), for its recognizable Japanese character and frequent arrivals/departures; a bookstore, for coziness and a relaxing atmosphere; and a coffee shop, for a cute, visually appealing frontage and people sitting inside, by windows, or out front. These are alternatives for remaining frontage, not three additional approved buildings.
- A school gate or side street, bakery, repair shop, and homes remain possibilities rather than committed building choices.

## Future idea: a mountain revealed on clear days

Explicitly deferred by the user on October 19; not a phase-one requirement and not implemented.

A distinctive far-distant mountain, perhaps Fuji-like, is usually obscured by cloud or haze. On rare exceptionally clear days it becomes sharply visible, beautiful, and worth pointing out. Its purpose is the natural variation of living somewhere beautiful: familiar on ordinary days, occasionally striking. Keep it a supporting backdrop within the neighborhood-dominant composition.

A candidate approach is a separate distant-scenery layer with gradually changing haze/cloud occlusion, using Seattle cloud cover and reported visibility as approximate cues. Reports do not establish actual mountain-specific visibility, and tuning remains necessary. Keeping the distant scenery separate should make later addition relatively contained, but effort is not yet validated. Leave an appropriate sightline in future composition studies without prioritizing this effect over the core street.

## Walk-to-build cycle

Agreed October 19: use walks to discuss many ideas, collect feedback, and prepare a substantial queue of concrete work. Implementation sessions can then produce iterations and reviewable outputs between walks, potentially over the following day or two, with later walks reviewing and advancing the product. See [BACKLOG.md](BACKLOG.md) for ready items, dependencies, and future ideas. This is the desired working rhythm, not a configured unattended coding system; continuing work requires an active execution task/session. No background coding schedule has been set up.

## Repository workflow

Agreed October 19: this is a solo project for now. Commit tangible batches of work and settled decisions directly to main; no pull-request process is needed. Agreement in conversation is sufficient. Use small, descriptive, reversible checkpoints and appropriate verification, and keep this roadmap current so fresh chats do not depend on an inaccessible earlier conversation. Source commits and release of changes to the displayed world are separate; the existing visual-review workflow for new displayed additions still applies.

## Confirmed experience direction

- No text in the displayed experience. Stories should be understandable through visible activity and changes, without captions, announcements, or story counters. Any development controls need a separate treatment.
- Mostly ordinary neighborhood life. A viewer can ignore it for hours without losing the experience.
- Familiar recurring characters and routines, with subtle developments unfolding over days. Attentive children might notice patterns that a busy adult misses.
- Occasional more noticeable moments are welcome, but the world should not manufacture constant excitement.
- More noticeable developments should tend toward household-local morning hours of approximately 7–9 and evening hours of approximately 5–9. These are opportunities, not a quota of events. Ordinary ambient activity continues outside them, with overnight quiet.
- Changes may last for days or become permanent. A flower shop could gradually begin selling books and remain a flower-and-book shop, with corresponding objects and customer behavior.
- Visible consequences can outlast the moment that introduced them, so observation need not happen at an exact time.
- Painted animation is the lead feasibility direction as of October 21, with storybook a close alternative. Final production style depends on the animation test; pixel art is an acceptable fallback.

## Current implementation

The prototype in dist/index.html draws scenery and people procedurally on a canvas. It includes ambient pedestrians and traffic, local day/night changes, shop opening hours, manual weather and time previews, and a five-day repeating flower-seller/dog story with captions.

It does not yet implement a persistent evolving neighborhood, an AI director, generated asset production, or automatic capability expansion. Its existing captions and repeating story are provisional and differ from the direction above.

## Initial prototype feedback

Recorded during the October 17 walk; these are directions for future previews, not implemented changes.

- The high-level concept works. Preserve the appealing everyday pedestrian movement and ambient character.
- Pedestrians feel slightly slow. Try approximately 25–30% faster walking as an initial comparison, not a final fixed value.
- The street framing feels too close. Try approximately 30% wider framing, revealing one or two additional buildings. The visual outcome matters more than an exact camera calculation: expose more neighborhood rather than merely shrinking the existing canvas.
- Current artwork is adequate for the proof of concept but too basic for the living-room installation. The goal is a charming city street with beautiful, intricately detailed buildings.
- Establish an explicit visual quality benchmark before settling on one consistent style and producing many assets. Art quality is a core requirement, not only final polish.
- Evaluate building detail alongside wider framing so people and observable changes remain readable across a room.

Suggested planning implication: include a representative wider street composition and visual quality review in the early art-and-animation comparison. Reassess perceived walking pace in that composition. The final style and quality benchmark still need exploration with the user.

## Initial visual direction

The user selected a rural Japanese town with the visual atmosphere of Spirited Away as the starting point, explicitly distinguishing it from downtown Tokyo. The setting should feel like a small town rather than a dense modern urban center. Treat this as an initial art reference to explore, alongside the requested richer architecture and wider street framing.

Suggested visual qualities for the first comparison: richly painted backgrounds, layered and intricately detailed shopfronts, weathered wood, tiled roofs, plants, and warm light. These are interpretations to review, not individually confirmed requirements.

This reference does not by itself change the established ordinary-life premise or approve fantasy events, specific film characters, or a final animation technique. Pixel sprites and illustrated movable characters remain candidates until evaluated against the same street view and family-and-dog example.

## First agreed experiment: the family and the new dog

Status: a movement-only technical rehearsal is now built; see [implementation preview](IMPLEMENTATION-PREVIEW.md). Story continuity and persistent family development remain unimplemented. The October 19 phase-one decision still prioritizes art, ambiance, and ambient activity first; this earlier rehearsal does not select a final art style or replace that priority.

An existing child and parent regularly walk along the street. On a later day the family has a dog, which joins their walk and remains part of their routine.

Compare two visual approaches using the same scene and actions:

1. Pixel sprites with walking animation frames.
2. Illustrated 2D characters assembled from movable parts with reusable animation.

Judge natural movement, consistent character identity, readability from across a room, visual fit with the scenery, and the effort needed to introduce another variation. Do not select an approach solely because one still image looks appealing.

The example also tests the boundary between recombining existing abilities and adding a genuinely new interaction. A hypothetical world without dogs would need dog artwork, suitable animation, attachment points for the hand and collar, leash rendering, and coordinated group movement. The current prototype already has a simple dog drawing; that does not mean it supports this interaction.

Useful preview cases include walking, stopping, and changing direction. The parent, child, and dog should remain recognizable, grounded, and appropriately spaced; the leash should connect sensibly. New artwork and behavior should be checked before the permanent change enters the neighborhood.

## Proposed architecture to investigate

These are working recommendations, not a finalized design.

- **World memory:** persistent identities, relationships, routines, shop attributes, and a history of changes that survives restarts.
- **Director:** periodically proposes developments using that history and available abilities. A daily planning opportunity need not produce a new event or new artwork every day.
- **Asset workshop:** produces missing artwork ahead of use, guided by visual references and explicit requirements such as scale, perspective, palette, frame layout, and attachment points.
- **Runtime:** renders the neighborhood and executes supported behavior using prepared assets, continuing normal life if generation is unavailable.
- **Capability development:** introduces and checks genuinely new interactions before the director can use them. The long-term goal may include AI-assisted or largely automated expansion; reliability remains to be established.

A fixed-camera, layered 2D scene with reusable character animation is the provisional starting recommendation. Pixel appearance and animation implementation are separate choices. Movable parts can reduce frame-generation problems, but new bodies and interactions still require appropriate artwork and behavior.

Generating a plausible story, producing coherent artwork, and implementing reliable behavior are distinct problems. An attractive generated image alone does not supply a working interaction. Automated checks can catch structural failures; visual coherence and unattended publication need empirical testing, with human review during early development.

## Agreed review loop for new additions

The system may periodically propose a small batch of new animations, variations, or interactions and attempt to produce them. Daily or weekly cadence was discussed as a possibility; no cadence or automation has been configured.

The initial workflow is: propose the change, generate the required artwork and behavior, preview it, obtain human approval, then release it. New additions require human visual review before entering the displayed world. Existing approved routines continue while proposals await review.

Start with a simple repository checklist for each candidate rather than assuming a review dashboard already exists:

- [ ] Proposal describes the visible change and any lasting world effects.
- [ ] Required assets and behavior are prepared.
- [ ] Preview demonstrates the addition in context and relevant movement cases.
- [ ] Human reviewer approves its appearance and behavior.
- [ ] Approved addition is released.

The family-and-dog comparison remains a candidate test case for this process after the initial art-and-ambiance work. A release follows approval; this planning conversation does not approve unseen generated additions.

## Candidate progression after the first experiment

Order and scope remain open. The October 19 phase-one plan above now takes priority; this list preserves the longer-term candidates.

1. Choose a visual and animation approach, informed by the art survey and movement tests; the family-and-dog comparison can provide a later continuity test.
2. Establish recognizable recurring residents and reliable everyday routines.
3. Add saved world changes and demonstrate one development that persists across days and restarts.
4. Apply the no-text presentation and household timing to the evolving experience.
5. Introduce a director that composes supported developments while respecting continuity and quiet periods.
6. Trial generated assets and new capabilities through previews and checks before introduction.
7. Prepare the living-room installation and evaluate whether it remains pleasant over extended use.

## Candidate simulation and presentation refinements

- Explore a near-side-on street view with shallow depth to simplify consistent movement and compositing.
- Consider gentle slopes as part of the walking paths. Stairs and more complex elevation changes need separate animation work.
- Evaluate richly painted scenery separately from character animation; an attractive still does not establish the final animated rendering approach.
- Investigate a finite population of persistent, visually recognizable residents with saved routines, relationships, preferences, and circumstances.
- Separate persistent world data, routine scheduling, occasional AI planning, and on-screen animation. Offscreen residents do not require continuous rendering or individual continuous LLM calls.
- Investigate scheduled roadmap reviews separately from unattended coding runs. Scheduling alone does not establish a working integration with a coding runner. Reviewable changes and previews remain the goal.

## Future possibility: contributions to the neighborhood

Priority: exploratory, beyond the immediate visual and simulation experiments.

An optional contribution mechanism could introduce gifts, decorations, or new objects into the neighborhood. Residents would respond through their existing routines and supported interactions, while the display remains ambient.

Examples include a gift for a resident, a small statue, or an amusement machine inside a shop. Adding a decorative object is simpler than introducing an object that requires a new behavior. New assets and interactions would follow the proposal, preview, and human-review workflow before release.

Direct control of characters or playing an embedded game is outside this concept. Input method and review interface remain undecided.

## Display platform investigation

Avoiding an external display computer is a product goal worth testing. The documentation spike in [Samsung TV feasibility](SAMSUNG-TV-SPIKE.md) finds a packaged Samsung Tizen Web application plausible, while a simple remotely hosted website wrapper faces explicit submission restrictions.

An initial unsigned development widget now packages the movement study with local artwork and code. Next platform experiment: sign it and test installation, animation performance, remote controls, state recovery, passive-viewing/screensaver behavior, and supported startup behavior. No physical-TV testing or store submission has been completed. An HDMI computer remains a fallback rather than an assumed requirement.

## Questions still open

- Whether the painted-animation feasibility test meets the visual benchmark; final production style, exact composition, character scale, and depth of movement.
- Persistence, hosting, generation services, costs, and generation cadence.
- How much autonomous permanent change is desirable, and how to prevent visual clutter or incoherent growth.
- Which checks are sufficient for generated assets and interactions, and when human review can be reduced.
- How to preview several days efficiently while still assessing the real ambient experience.

No implementation or deployment is implied by recording these notes.
