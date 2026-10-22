# Study 17: walking against a recorded reference

**Latest family review — paving and painted feet:** the user and daughter find the current/adapted walks close but see a landing hesitation in both paintings. Their screenshot shows the separate recorded-source skeleton. That viewer does not share our full adapted stance mechanics, so its smoothness alone cannot isolate a painting defect.

The horizontal crowd lanes, alley street approaches, shop approach/leave paths and reference stage now use the paved sidewalk. Front/back reference views include extra depth clearance for the stride. Raised routes also reduce apparent character size through the existing projection. Route ends extend offscreen to prevent visible wrap jumps after the depth change. Door, seat and indoor anchors stay fixed. The pole-edge raster fixture moves from 16 to 15.6 seconds to test the same overlap on the revised route; its occlusion thresholds remain.

A concrete fitting mismatch was found in the newer women: their posed feet inherited the original shoe dimensions, while their separately rendered shoes used only 35% of the foot roll. Alpha-measured heel/toe bounds now define each shoe’s heel/ball/toe distances at its actual rendered scale; ankle height matches the sole registration. Side shoes use the complete posed roll. A 1,250-sample registration check reports maximum sole-target discrepancy .188 scene pixels, compared with 3.485 pixels from reduced roll using the fitted dimensions. This measures registered points, not every curved alpha contour. The original, man and child retain their foot models.

Silhouette mode uses the same sprite geometry/alpha without painted texture, alongside the fitted skeleton and separate recorded skeleton. It also exposed fine internal seams from undersized source-space padding in the blue portrait warp; the overlap now remains .7 scene pixels after scaling. This is a raster repair, not generated replacement art. The latest work avoids another speculative timing change. Whether these repairs remove the perceived pause still requires human motion review.

Sidewalk support checks cover 777 samples across three lanes/five bodies, maximum support y=727.955 with curb top around y=732. Existing gait, projection, crowd, cast, visit and reference checks protect surrounding behavior. No background replacement or new interaction is included.


The user approved a reference-based study after reviewing established walk-cycle practice. `/painted/reference/` compares the current original/blue-woman gait against a separate capture-informed adaptation, at matched speed and cycle distance. It retains the existing street/paintings and leaves the cast, dining and accepted standalone walking motion unchanged.

The source is CMU Graphics Lab subject 07, trial 04 (slow walk), downloaded as a BVH conversion from a pinned cmubvh mirror because direct CMU data downloads returned HTTP 403. A 176-sample cycle is aligned, drift-corrected and periodically smoothed into tracked joint curves. The source skeleton viewer exposes this loop-prepared recording. [SOURCES.md](dist/painted/reference/SOURCES.md) records attribution, SHA-256, source frames, permitted use, reproduction and teaching references.

The candidate uses captured body rise, restrained fore/aft and lateral balance, projected lean, shoulder offsets, arm directions and swing-foot progress. Ground support remains the existing planted-foot trajectory; swing changes fade out at contact boundaries. Knees use a continuous two-bone solve and a smooth pelvis reach limit instead of holding the landing silhouette. Painted limb lengths and reduced foot clearance are deliberate adaptations. This is not exact mocap retargeting; the 2D torso still approximates depth rotation.

Current is on the left, adapted on the right. Person/view switches preserve phase. Painted, skeleton-overlay and skeleton-only modes, frame stepping, half speed, a cycle scrubber and approximate contact/down/passing/up jumps support review. The stage is explicitly an in-place comparison with moving ground ticks; it does not demonstrate new navigation or shop actions.

Verification covers 3,840 poses across eight headings, support invariance/planted contacts, bounded swing clearance, changing captured arm/swing paths, reachable knees and loop/contact continuity. Browser checks exercise both people, five directions and three drawing modes, pixel changes, phase/step controls, mobile/reduced motion and missing art. Existing cast, accepted gait/projection and meal regressions pass. Screenshots of side/front paintings and skeleton overlays were inspected. Human motion review is still required before accepting or expanding this candidate.

---

# Study 16: a varied cast on the same street

**Latest review — attachment balance and landing flow:** the blue woman’s previous head correction was too far back. Profile correction is now 2.5% of body height (was 4.5%), quarters 1.4% (was 2.8%); her shoulders/arms move forward 1.8%. The yukata man’s shoulders/arms move backward 1.5%, following the facing direction. Lower sleeve placement and the close-reach forearm fit remain. Existing part atlases are unchanged; all adult door and bowl contacts still pass.

The women’s apparent hesitation has a plausible contributor in the authored straight-knee landing hold. The robe conceals that knee transition and the child traverses the cycle faster. Cast-only tuning releases the new women’s hold at 8% of stance instead of 18%, with an 18% release blend instead of 22%. The original woman uses a smaller 12% hold/20% blend adjustment. This changes the knee silhouette after contact, not ground speed, foot paths, stance duration, body bounce or the man/child gait. The old standalone walking and dining studies use unchanged defaults. **Previous step timing** provides an immediate comparison without resetting time or changing the new attachment fit. Whether this fully resolves the perceived pause requires human motion review.

Added checks compare new/old support targets and body paths over both directions, confirm earlier knee release, retain man/child gait equality, mirror the fitted arm shifts, and exercise the timing toggle. Eight-direction cast, adult contacts, meal poses, baseline gait/projection and browser/mobile checks pass.


**Earlier cast fit:** the user likes the man and child. Their artwork/profiles are retained. The blue blouse’s head is translated back as an intact portrait through a short smoothly deformed neck/collar band; the waist stays fixed. Sleeve roots are lowered 1.8% of body height and forearms fitted for comfortable close reaches. Contact checks exposed the old arm lengths’ minimum folding radius after that adjustment; forearm fitting resolves the door reach, and profile-specific bowl grips retain hand contact. This is a local 2D portrait fit, not a new full skeleton or a regenerated action sheet.

The former uniformly scaled tall woman is replaced with independent five-facing art: low bun, cream blouse sleeves, burgundy waistcoat and charcoal trousers, 9% taller with a narrower torso/limbs and shoulder span. Waist pivots are measured from the new body alpha rather than inferred from a hair-inclusive bounding box. Original generated PNG bytes are retained; the painting is cropped/deformed during rendering. Checks include standing portrait visibility in every direction, mirrored head correction with an unchanged waist, narrower proportions, hand contacts and existing walking/meal regressions. Both revised women await human visual review. The background remains deferred.

The user accepted the meal polish and requested a stronger reuse test: a man in substantially different clothing, variations of the woman, and a child around half adult height. Background replacement is explicitly deferred. `/painted/cast/` now compares the original, a distinct 9% taller/slimmer low-bun woman in a burgundy waistcoat, a ponytailed woman in a blue blouse/ochre trousers, a man in a navy yukata and a child in a coral sweatshirt/olive shorts.

Four generated part atlases now supply five canonical facings each, with opposite directions mirrored. Each design has head/arm-free torso, two independent arms and independent leg textures; the yukata also has continuous lower garment panels. Torso cleanup was necessary to remove baked sleeves. The single side-view child leg is reused for both physical legs. No new independent walk/eat/turn action sheets were produced. Atlas alpha and centerlines are measured into tracked registration metadata by `tools/measure_cast.py`; original PNG bytes are retained.

Profiles reuse the accepted gait and visit actions. Body height enters the pose calculation before route projection so stance contacts stay planted. The child has shorter legs, a larger relative head and adjusted arms. Artwork-specific ankle, limb width and shoe width/height registration avoid oversized footwear and below-ground soles. Custom actor buffers include raised seated heads, fixing clipping exposed by the first composite.

The yukata is one deforming painted panel over the moving underlegs, participating in torso coverage and arm depth. Quiet hem sway and shape follow the hips/ankles. This is a garment-specific 2D treatment, not general clothing simulation; compression when seated and larger folds still need artistic review. The child cannot reach the adult handle, so entry is automatic. A raised seat and wider bowl grip adapt dining; the shared seating transition remains and a complete stool-climbing action is not implemented. These constraints are evidence about reuse rather than reasons to pretend every body can use unchanged furniture choreography.

Walk together shows all five profiles. Character selection preserves action time; controls jump to alley turns, entrance, rear-facing counter dining, front-facing interior dining, the broth finish and flowers. The scene and original one-person `/painted/visits/` stay available for comparison. No new background composition or shop mix is built.

Checks cover five bodies across eight headings, finite poses, ground contacts, adult handle contact, child automatic entry/raised seat, both hands following the bowl, visible seated heads, expected relative heights, actual garment compositing, controls, phone/reduced-motion startup and missing art. Existing walk/projection, meal/door and crowd checks protect accepted behavior. Screenshots are inspected at street and close-up size; passing checks alone do not establish naturalness or physical-TV performance.

Next: review the new people, particularly robe folds/stride, child scale and seating, limbs through turns, and whether art/calibration effort is acceptable. Keep the background deferred until this animation study is ready to conclude.

---

# Study 15: posture and a finishing sip

The user liked the arm repair and requested flared elbows, a head dip toward lifted chopsticks, and a final two-handed bowl drink. Seated elbow silhouettes now sit farther outward/down with the hand targets preserved. A small eased head dip follows each bite. The head is articulated from the existing portrait at the neck over the fixed collar, with slight vertical foreshortening; no walking artwork or gait is changed.

The last twelve seconds of each 60-second meal are a single closing action: lay down chopsticks, reach both hands to the bowl, lift it to the lowered mouth, sip, lower it back to its original counter position, release, then settle. Both wrists follow the moving bowl. Bowl tilt and reduced broth/noodles accompany the sip; no more noodle bites begin after the finishing action. Rear-facing hands and food stay hidden by the back. The front-facing interior diner exposes the full action. **Finish the bowl** jumps to one second before this sequence for review.

Hand targets use the existing solver; seated elbow placement is an authored projection correction for foreshortened arms, not a physically simulated 3D elbow. The silhouette and head/neck join still need human review. Original walking, flower and door behavior are preserved; final production and arbitrary action generation remain outside this study.

Verification covers outward bite elbows, visible head articulation, continuous head/bowl motion, both hands staying on the bowl through lift/return, mouth/rim contact at the sip peak, one finish per meal, no subsequent bites, original bowl position after lowering, and seated support. Browser checks cover visible food at its actual moving position, arm layering, front/rear head changes, the finishing control and screenshots through reach/sip/lower. Existing doorway/foreground, phone/reduced-motion, gait/projection and crowd regressions remain the checks for surrounding behavior.

Next: review the meal polish, then retain the agreed pause to evaluate the feasibility study before expanding scope.

---

# Study 14: one pair of dining arms

User review identified resting sleeves still baked into both seated torsos and eating arms hidden behind the front-facing chest. New front/rear torso underpaintings remove those baked sleeves, retaining the same character, collar, waistband and source registration. They apply only during seated actions; walking, flower and door artwork stay as before. The same two independent animated arms supply the entire eating gesture.

Meal depth is now explicit: both arms are on the chest side of the torso, in front for the indoor/front-facing diner and behind for the outside/rear-facing diner. Side-view elbow-bend signs also incorrectly raised the rear diner's elbows; the inward bend now follows each shoulder's side relative to the bowl. The front diner shows the actual scoop/lift/taste gesture. Rear-facing hands, bowl and utensils remain hidden as requested.

Regression checks color only the detached arm pixels to verify visible forearms across the front chest and occlusion by the solid rear back at three points in the meal cycle. The rear collar is open above the arm attachments and is excluded from the solid-back region. Source-alpha checks verify removal at eight former sleeve/cuff locations; route/contact/meal, window/door and walking regressions remain. Browser screenshots of both diners were reviewed. This is still a ramen feasibility refinement, pending human visual acceptance, with the same evaluate-before-expanding checkpoint.

---

# Study 13: ramen facing and layered entrance

The user wants both meals viewed square-on: the counter diner faces directly into the room, with her face, bowl and eating hands hidden; the inside diner faces directly toward the street/viewer. Heading and meal-prop visibility now reflect that. One-minute meals, automatic closing, flowers and accepted walking remain.

The apparent extra arm came from the resting sleeve baked into the rear-quarter torso beneath the separately animated arm. A newly generated opaque, arm-free torso is used only during the door reach, with the original walking art preserved. It is a local corrective asset, not evidence that the whole cast is ready for arbitrary gestures.

The entrance now demonstrates separate scenery assets: an architectural underpainting, clean sliding door leaf, fixed lantern/bracket/vine, and transparent foreground pots/plants. Crops are measured from an original generated atlas; the leaf contains no lantern or foliage. Props remain fixed as the leaf moves. Characters behind their ground-contact row are drawn beneath them; nearby street walkers remain in front. The shop entrance has been locally repainted to make those assets possible; the rest of the town remains flattened. Architectural texture that never changes or occludes a person can remain together. Separate interactive or depth-relevant objects with clean paint beneath them; a completely empty base and hundreds of independent decorative objects are not required.

Source-resolution finding: the scenery is 1672×941. The study renders at 1600×900, and ramen/flower close-ups enlarge a 640×360 crop to that canvas; fullscreen may enlarge it again. Painterly brushwork also softens tiny forms. This batch does not replace the town with higher-resolution art or claim to recover missing detail by sharpening. Recommended later diagnostic: one matching storefront at higher native resolution, with readable flowers/wood and coherent edges, compared at intended TV viewing size. Preserve the warm painted character while testing detail/readability independently.

Verification includes full visit routes/contact/support, direct dining facings, hidden outside food versus visible inside food, colored-hand depth during the slide, invariant foreground landmarks (allowing source-alpha transparency), closed-door coverage, indoor windows/counter occlusion, compositing order/clearing, controls/mobile/reduced motion and missing art. Accepted gait/projection and crowd regressions are retained. Browser screenshots were inspected; physical TV and other browser engines remain unverified.

**Next gate is artistic assessment.** This is still a study. Continue ramen refinements based on review; once accepted, pause to evaluate visual appeal, contact/occlusion quality and asset-preparation cost before deciding whether to conclude the study, improve resolution or move toward production. Do not automatically advance to cast/weather or a full-town layer rebuild.

---

# Study 12: counter and interior dining

The user liked the latest door/flower refinement, then requested automatic door closing and visible seated ramen eating for about a minute. They want the final restaurant to support open-counter stools as well as interior visits. Both are now represented at the same `/painted/visits/` URL: three visitors (two diners plus the flower browser) and five passersby, preserving eight active residents.

The interior diner retains the accepted manual opening. She walks fully clear of the doorway before a 1.1-second automatic close. The door stays shut during her 60-second meal, reopens before her return through the doorway, then closes behind her after exit. These explicit automatic phases require no hand contact. The aperture now draws no interior pixels when fully closed, including the former negative-width edge case.

The counter diner takes an existing painted stool outside, with blended seating/standing transitions, folded legs and feet near its rungs. The indoor diner also settles into a seated pose behind the counter window. A shared meal action moves one hand between bowl and mouth, rests the other by the bowl, lifts noodles and shortens them during a bite, then pauses. A small composited bowl, broth/noodles, garnish, chopsticks and drifting steam complete the action. Meals last 60 seconds with offset bite timing, rather than a static window pause. The stool itself is not pulled or moved, and ordering/serving has not been animated. Source character art and the accepted walking/flower actions remain unchanged.

Counter meal, Interior visit and Inside meal buttons provide review entry points. Node checks cover 16,934 finite poses, 88 manual handle contacts, 7,998 planted contacts, continuous routes/turns, offscreen resets, fixed seated feet, reachable eating gestures, two full-minute meals and closed-door meal timing. Browser checks verify visible food/eating/seated-leg changes, completely closed doorway masking, preserved indoor facade/counter coverage, manual hand overlap, controls/mobile/reduced motion and missing art. Existing gait, screen-position and crowd movement checks pass. Close-up seating, scoop/bite, indoor dining, door-closed and full-town frames were inspected.

This is a reviewable dining study with reused artwork. Stools are fixed, meal props are small canvas drawings, and the authored occupants do not yet use a general seat/door reservation system. Physical-TV performance remains unverified. Next review should focus on sitting/standing transitions, bowl-to-mouth motion and how counter dining reads alongside interior arrivals. CURRENT-STATE.md records this checkpoint.

---

# Study 11: a reason to linger

**Latest review refinement:** the user liked both first attempts and specifically accepted the ramen entry/window sequence and flower-facing turn. Opening is now a stationary gesture near the center of the doorway: a 0.4-second reach, 1.47-second slide and 0.28-second release, roughly twice the previous pace. The palm follows the handle across the body with feet fixed. The gripping wrist/fingers span the vertical handle, allowing the elbow to fold near the chest; rear-view depth correctly hides the arm beneath the torso during the cross-body part. Closing uses the same planted gesture. The flower pause now eases into a roughly 23-degree waist bend, with restrained hip settling, fixed ankles/feet and hanging arms, then returns upright before departure. The accepted flower turn and interior/window sequence remain.

New regressions verify stationary door support throughout both slides, a hand path crossing the torso, the faster timing, a visibly lower/forward head for smelling, and unchanged flower support. A colored-arm raster fixture verifies hand visibility at either end and torso occlusion in the middle. Current visit checks cover 7,824 poses, 176 full-grip contacts and 6,125 planted contacts; browser/mobile, doorway/window coverage and existing gait/screen-position checks pass. Await visual review. CURRENT-STATE.md is the concise continuation checkpoint; this report retains the historical experiments below.

The user authorized the next interaction checkpoint: a ramen-shop visit with the customer visible inside, plus stopping to look at the flowers/produce. Purchasing is explicitly out of scope. Review `/painted/visits/`; the accepted walking, alley and walking-only population studies remain available.

The eight-person scene now contains two visitors and six existing passersby. The ramen visitor slows and turns, reaches the handle, keeps hand contact while sliding the door, releases it, turns into the doorway, walks behind the facade, pauses visibly at the counter window, then returns, closes the door by hand and rejoins the street. The doorway reveals the existing painted interior; window/mullion/sill masks hide the appropriate parts of the same moving character. The flower visitor stops beside the display, turns toward it, settles into a subtle lean, looks for 8.5 seconds, then turns and leaves. No exchange of goods, sitting/eating action, new cast, weather integration or AI planning is claimed.

`visits/world.js` separates authored action timelines, shop anchors and route sampling from rendering. It measures apparent ground travel and facing for these foreground routes, avoiding the off-center scene projection turning a short doorstep approach into a long diagonal shuffle. A denser spline prevents a long departing segment from causing a sharp reversal at a nearby corner. Backward stepping during door closing reverses both cadence and joint sampling so support contacts stay fixed. All loops reset offscreen. `visits/pose.js` layers handle IK and restrained idle lean over the accepted character. The shared actor renderer gains optional pose/lean inputs; its default gait/rendering stays the same. No new artwork is generated.

`visits/renderer.js` draws indoor people behind the facade and outdoor people by depth. It clips indoor figures to the current door aperture and two counter panes, keeps them behind the painted counter, and applies a mild warm tint. Alley occluders apply to alley passersby, not to a customer at an unrelated doorstep. The door stops with its handle still on the visible panel. Ramen/flower jump buttons provide close-ups; Whole street preserves time, with pause, half-speed, restart, fullscreen, reduced-motion startup and missing-art handling.

Validation: `node tools/check_visits.cjs` covers 8,067 poses, 352 full-grip handle contacts, 6,245 planted contacts, continuous routes/turns, offscreen loops, stationary pauses and the eight-person population. `python3 tools/check_visits_browser.py` verifies visible hand/contact pixels during opening and closing, indoor visibility constrained to the doorway/window panes, counter coverage, order-independent compositing, clearing, controls, phone/reduced motion and missing artwork. Door, entry, window, exit, browsing and whole-street frames were inspected. Existing gait, screen-position stride, alley path and crowd checks pass, including the compact/full crowd raster comparison.

This is a bounded interaction review. The same character artwork is reused throughout; views blend and larger arm gestures still rely on deforming painted sleeves. Hand/door choreography, indoor scale, quiet browsing and the overall pacing need user visual acceptance. Physical-TV performance remains unverified. Next: review these two visits, refine observed defects, then test a small varied cast before expanding action types or integrating Seattle lighting/weather.

---

# Study 10: a populated street

**Latest refinement — uneven alternating steps:** user review showed that the hip-only repair below left a growing limp toward the left edge. Per-foot lateral depth was still projected toward the off-center vanishing point, biasing one foot forward and the other backward relative to the flat torso. Character-width offsets now project in the route's local image plane; route position, depth scaling, ground-height separation and depth ordering remain. This also keeps the bag from drifting away from the body. Contacts remain fixed during stance because projection is evaluated at each contact's route position. The accepted gait timing, knee/foot motion, artwork and standalone walking study are unchanged. A new full-cycle check compares both legs relative to the torso at left/center/right, in both directions and four depths (2,880 samples). It fails on the hip-only version and passes now, alongside 2,304 attachment/shape checks, over 19,000 planted-contact checks, and existing crowd/alley browser and overlap regressions. Directional contact sheets and screen-position comparisons were inspected; visual review remains the acceptance gate.

**Previous refinement — legs at the left edge:** the user spotted upper legs separating from the torso on the left and recovering toward the right. The torso is a flat painting, but its hip roots had full off-axis perspective toward the alley's right-hand vanishing point. Hip roots now attach in the torso's camera plane. An affine correction tapers through the knee to zero at the ankle, preserving straight landings and knee bend. This addressed attachment but retained the foot-placement defect described above. This applies to both crowd and alley studies; the accepted side-walk study and source artwork remain unchanged.

The user accepts the coherent town walk as a milestone, with remaining minor blips deferred. They requested five to eight copies to judge population and the overall street experience before further action work.

Review `/painted/crowd/`: eight active copies by default, switchable to five without resetting their schedules. People walk both ways on street lanes and make separate alley trips, with staggered starts, stride phases and route speeds. They enter/leave at screen edges and turn at a hidden alley corner, so the number visible at any instant varies. Pause, half speed, restart, fullscreen, reduced-motion startup and asset-failure handling are included. This is a density/movement review with identical artwork, not a varied cast, character stories, shop visits or a complete ambient simulation.

`crowd/world.js` keeps routes/schedules separate from rendering. `crowd/renderer.js` sorts residents by ground depth and applies scenery masks to each resident's transparent layer, preserving other people. It reuses the same gait, directional paintings, clothing coverage and pole-depth rules. There is no collision-avoidance planner; separate lanes and phase offsets provide a first arrangement, and some passes/occlusions still need visual judgment.

An optional compact mode in the shared actor renderer uses 256×384 buffers instead of whole-scene intermediates. It also collapses mesh subdivisions only where bone weights are constant and the deformation is affine, preserving all changing-weight rows at knees/ankles/toes. It does not change the accepted gait or generate replacement artwork. The existing single-person renderer remains the default; sixteen directional frames were bit-identical to the preceding revision. A 29-pose compact/full comparison found mean channel error below 0.4/255, with about 0.06% of covered pixels showing larger edge/seam differences.

Checks: `node tools/check_crowd.cjs` verifies five/eight residents, finite poses, depth order, fourteen offscreen wraps and over 14,000 planted contacts across the new routes. `python3 tools/check_crowd_browser.py` verifies compact/full rendering, order-independent population compositing, complete hidden-corner masking, no stale people after clearing the population, controls/time preservation, phone/reduced motion and missing art. Existing alley path, hand/clothing, pole and browser regressions pass. Five/eight screenshots and later timeline frames were inspected.

Performance limit: this workspace's headless Chromium measured roughly 37 ms median / 45 ms p95 for an eight-person draw in the render check. This is a local rendering measurement, not physical-TV frame-rate validation or a 60 fps claim. More population or TV deployment may need further profiling/caching or a rendering backend change. The original prototype and accepted walking comparison remain available.

Recommended next milestone, not implemented by this batch: one complete ramen-shop visit using the accepted character construction (approach, stop/turn, hand/door contact, enter and return), then a small varied cast to test reuse, then lighting/weather tied to Seattle. Aim for varied visible reasons to pause and linger as well as walking.

---

# Study 09: alley, turning, and eight-direction movement

**Latest refinement — pole depth at the alley mouth:** the user observed a brief body cutout at the same spot outbound and returning. The foreground group used a shared z=35 gate even though the character was still standing in front of the painted pole's base. The pole is now a separate narrow silhouette anchored at ground row 702; pots/frontage and foliage use their own ground rows (715/711). Occlusion activates only when the projected ground position is behind the corresponding object. This preserves passage in front of the pole near the street and genuine overlap farther down the alley. The path, character, garment coverage and accepted walking study are unchanged.

Validation: a raster comparison of 25 frames in each travel direction reproduced the old defect (six outbound and seven returning frames with clipped character pixels), then found none with the repair. It compares against an unmasked character draw and excludes background-only resampling differences. Ground-contact tests distinguish being in front of the pots, between pots/pole, and behind the pole. Existing distant pole-edge/corner occlusion checks and the full directional clothing/hand/browser checks pass. Close-up frames of both crossings were visually inspected. The scenery contours/ground rows remain calibrated to this particular plate.

**Latest refinement — jacket over trousers:** the user identified the trouser roots alternating over the top as the legs changed depth, especially walking away. Anatomical draw depth alone cannot express clothing worn over another layer. The renderer now draws the same complete torso into a reusable coverage canvas and subtracts its actual alpha silhouette from each leg layer before compositing. Jacket/blouse coverage therefore stays above trousers at every stride phase, while the coherent limb depth ordering, hands, prop, gait and ground targets retain their behavior. This uses the painted silhouette rather than a rectangular waist cutoff or destructive source-art trim; legs remain visible beneath/outside it. Each canonical view supplies its own coverage during a blended turn. Source PNGs and the accepted walking study are unchanged.

Validation: a colored garment-overlap fixture failed on the previous renderer in all eight headings, then passed with the repair. It checks 64 poses across full strides, including over 27,000 opaque torso/trouser overlap pixels, and verifies exposed trousers are retained. Existing chest coverage, near/far hand overlap, pole edges, browser controls/mobile/reduced motion, atlas bounds and planted-foot/gait checks pass. Eight-direction contact sheets and front/rear close-ups were inspected. The added offscreen compositing is a one-character feasibility implementation; population-scale TV performance remains untested.

**Current checkpoint — clipping regression repair:** the user found the first repair improved several views but broke walking right, left odd clipping in multiple views and made the rear shoulders too high. The torso cutout polygons were removing jacket coverage without replacement underpaint; those cutouts are removed. The renderer retains the full source torso beneath moving arms. Individual mesh triangles are no longer interleaved through other body surfaces: complete painted limbs keep their internal triangle order and are sorted as coherent layers using representative joint depth. The restored whole-component atlas bounds are retained.

Both shoulders now share a fore/aft attachment plane. Arm positions use the same local camera plane as the flat painted torso, while keeping world depth for draw order. Applying off-axis perspective to arms alone had displaced far sleeves outside the jacket, to the front when facing right and behind the back when facing left. Ground joints/foot placement still use the existing full perspective projection. Rear-facing arms settle down by 2.5% of baseline height (about 4.6 pixels at height 182), easing to no adjustment toward the front. The accepted walking study is unchanged.

The pole base and flowerpots now have separate lower contours. The earlier combined mask hid exposed pavement down to a blanket y=717 boundary, leaving detached-looking shoes where the trouser was covered by imaginary scenery. The updated mask preserves actual pole/pot overlap and the visible ground between/below them.

Regression checks now compare overlapping arm/leg silhouettes across six stride times in both profiles, covering both a far arm behind a near leg and a near arm in front of a far leg (5,065 overlapping pixels, no wrong order). A body-only raster fixture checks 288 chest/waist samples across eight headings with no missing coverage. Shoulder alignment/height and the pole/pot ground gaps have geometry checks. Existing 5,003 planted-foot samples, atlas completeness, controls, mobile/reduced motion, missing-art and pole-edge checks pass. Eight-direction/four-phase contact sheets, both profile close-ups and near-pole travel were inspected. These are targeted regression checks, not proof of artistic acceptance.

Remaining art limitation: the original torso paintings contain resting sleeves. Keeping their coverage prevents holes but can retain sleeve contours in some poses; large future gestures may need genuinely underpainted torso assets rather than destructive trimming. Whole-limb depth sorting is a controlled 2D approximation, not arbitrary 3D self-occlusion. Review the repaired directional motion before expanding interactions.

**Overlap/cropping follow-up:** user screenshots exposed a shared importer error as well as draw-order errors. The atlas measurer divided generated sheets into equal cells, even though the torso paintings crossed those divisions. For example, the rear-quarter body was cropped to 292 pixels wide instead of its complete 390 pixels, cutting through the head; front/rear bodies were similarly incomplete. `tools/measure_direction_parts.py` now finds whole connected painted components across each sheet before ordering the parts left to right. All 24 measured bounds include the complete components. Source PNGs are unchanged. Torso pivots were recalibrated for the restored widths.

That initial repair carried world depth with projected joints and sorted individual mesh triangles, torso, shoes and bag face by depth. It also trimmed resting sleeves from the torso cells. Those two choices introduced the clipping regression documented above and have been superseded by coherent limb ordering and retained torso coverage. Arm swing still eases out with travel at a stop. Painted front straps are retained without adding a second strap from the neck; missing rear straps are drawn separately. The bag's visible face is sorted with an allowance for its thickness.

The former left occlusion boundary also ran through the middle of the bright pole. `alley/occlusion.js` traces its actual right edge (roughly 10 pixels farther right at head height) and protruding foliage, with depth gates. Legitimate overlap behind the pole remains; the straight artificial cutoff and strip of hair painted over the pole were the defects. The mask remains manually calibrated to this scenery rather than a general scene-depth model.

Follow-up checks: complete-component atlas validation (`python3 tools/measure_direction_parts.py --check`), existing path/ground-contact and accepted-gait checks, opposite-side shoulder/depth checks, colored raster fixtures proving that the far hand is behind the near trouser in both profile directions, and a pole-edge raster check proving that the pole hides the actor while adjacent hair remains visible. Eight-direction/multi-phase contact sheets and turn/depth/return captures were reviewed, with existing controls, mobile/reduced-motion and missing-art checks passing. Visual acceptance of these repairs and the blended turns remains with the user. The accepted side-on study and original prototype are unchanged.

October 22, 2026. The user accepted the walking result and authorized the next test: turning and walking into depth, followed by restaurant interaction. They specifically require diagonal movement toward and away in either direction, with at least 45° facings. Preserve the accepted side-on walk.

Review `/painted/alley/`. The resident follows a curved street-to-alley route, walks into depth, passes behind a building corner, pauses/turns there, returns toward the viewer and turns for the next trip. The full route is about 43 seconds. Individual direction controls cover left/right, front/back and all four 45° diagonals; each short test slows to a stop and can be replayed. Turn into alley and Diagonal return skip to useful review points. Close-up, half-speed, path overlay, reduced-motion startup and asset-failure handling are included.

Reuse and new work: `alley/world.js` defines an arc-length sampled curved ground path, acceleration/deceleration and projection. `alley/actor.js` consumes the accepted Relaxed gait's timing, near-straight landing, quieter body motion and arm swing, then projects its joint targets along that path. Ground foot targets stay planted during steady curved travel; height decreases with depth. Five canonical painted views (front, front quarter, side, rear quarter and rear) plus mirroring cover eight headings. Adjacent views blend through turns. The side artwork/limbs are reused; new directional torso/arm atlases and a four-view single-leg atlas supply the missing angles. The initially generated paired-leg cells are retained in the source sheets but not used for movement. PNG source files remain unchanged; `tools/measure_direction_parts.py` reproduces the measured alpha bounds.

The bag remains an attached prop and is drawn on the appropriate side of the torso. Two foreground masks from the same scenery cover the actor as she passes behind the alley buildings; she does not fade away at the corner. The original `/`, accepted `/painted/walking/` gait/renderer, and older `/painted/` interaction logic are unchanged apart from review links.

**Limits to review:** these are blended painted facings, not arbitrary 3D camera rotation. View consistency, blend silhouettes, projected proportions and stop/pivot behavior need visual acceptance. The new angles use restrained, separately cropped shoe drawings after full mesh projection over-bent the shoes; their contact/roll is an artistic approximation. Math checks verify the ground targets, not perfect raster-shoe contact. Foreground masks and path are hand calibrated to this plate, with no general collision/navigation system. The perspective camera is likewise calibrated for this street. Restaurant entry with the accepted character construction is the next separate interaction test, not implemented by this batch. No live weather, population expansion, or new engine is introduced.

Validation: `node tools/check_alley.cjs` checks eight directions/all four diagonals, continuous route/loop headings, projected joint finiteness, depth scaling, stopping and more than 5,000 steady planted-foot samples along curved travel. Existing gait checks pass. `python3 tools/check_alley_browser.py` checks direction controls, paused inspection, close-up/half-speed/path controls, restart after a completed test, mobile/reduced motion, missing artwork and building occlusion (the hidden actor's projected region matches the scenery). Desktop/mobile screenshots, turning, approach/return and all eight headings were inspected. Physical-TV testing and artistic acceptance of these new actions remain open.

Next review: does the character turn and move diagonally convincingly, stay grounded as she recedes, and retain a coherent identity across views? Freeze the accepted walking work and target observed issues in these new behaviors before restaurant entry.

---

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
