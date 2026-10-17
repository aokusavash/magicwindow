# Magic Window roadmap

Working notes from the October 17, 2026 design conversation. This roadmap is deliberately adaptable before the living-room installation.

## Purpose and working style

Magic Window is a persistent window into a neighborhood with a life of its own. It should be enjoyable as ambient art and reward closer observation with recognizable people, routines, and gradual changes.

Development is also an experiment in what AI can and cannot reliably do. Dog walks of roughly 45–60 minutes can be sustained design and technical conversations, with decisions captured here and concrete implementation tasks emerging from them. Progress is not limited to one tiny change per walk.

"Launch" means installing it in the living room. Broad changes are welcome before then; continuity and smaller increments become more valuable afterward. The aim is to develop something interesting over the coming weeks, without a fixed delivery date.

## Confirmed experience direction

- No text in the displayed experience. Stories should be understandable through visible activity and changes, without captions, announcements, or story counters. Any development controls need a separate treatment.
- Mostly ordinary neighborhood life. A viewer can ignore it for hours without losing the experience.
- Familiar recurring characters and routines, with subtle developments unfolding over days. Attentive children might notice patterns that a busy adult misses.
- Occasional more noticeable moments are welcome, but the world should not manufacture constant excitement.
- More noticeable developments should tend toward household-local morning hours of approximately 7–9 and evening hours of approximately 5–9. These are opportunities, not a quota of events. Ordinary ambient activity continues outside them, with overnight quiet.
- Changes may last for days or become permanent. A flower shop could gradually begin selling books and remain a flower-and-book shop, with corresponding objects and customer behavior.
- Visible consequences can outlast the moment that introduced them, so observation need not happen at an exact time.
- Art style is open. Pixel art was an initial assumption, not a requirement.

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

Status: agreed as the first concrete test case; not implemented.

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

The family-and-dog comparison is the first test case for this process. A release follows approval; this planning conversation does not approve unseen generated additions.

## Candidate progression after the first experiment

Order and scope remain open.

1. Choose a visual and animation approach using the family-and-dog comparison.
2. Establish recognizable recurring residents and reliable everyday routines.
3. Add saved world changes and demonstrate one development that persists across days and restarts.
4. Apply the no-text presentation and household timing to the evolving experience.
5. Introduce a director that composes supported developments while respecting continuity and quiet periods.
6. Trial generated assets and new capabilities through previews and checks before introduction.
7. Prepare the living-room installation and evaluate whether it remains pleasant over extended use.

## Questions still open

- Final art style, scene composition, character scale, and depth of movement.
- Persistence, hosting, generation services, costs, and generation cadence.
- How much autonomous permanent change is desirable, and how to prevent visual clutter or incoherent growth.
- Which checks are sufficient for generated assets and interactions, and when human review can be reduced.
- How to preview several days efficiently while still assessing the real ambient experience.

No implementation or deployment is implied by recording these notes.
