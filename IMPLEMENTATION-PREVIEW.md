# Movement and Samsung packaging studies

This batch completes the earlier October 17 movement and packaging experiments. It leaves the existing live prototype unchanged. The October 19 phase-one art survey and varied ambient-activity priorities remain in effect; the background and characters here do not select a final style or satisfy the full phase-one composition/activity target.

## Built

- A separate near-side-on painted rural street study with six facades and no baked-in people.
- Switchable pixel characters and illustrated characters animated from movable canvas-drawn parts, using the same background, identities, route, and simulation time.
- A parent, child, and dog walking together, pausing, and reversing direction; the leash is drawn between attachment points.
- A pace toggle comparing the prototype's middle walking speed at the new canvas scale with a 27.5% increase. Changing pace does not move characters abruptly.
- An ordinary passersby layer and a shallow ground-height variation within the sidewalk. This is not a finalized sloping-town composition.
- A text-free fullscreen view. Labels and controls belong to the review page, not the displayed scene.
- An offline Samsung TV package preparation script, fullscreen TV entry, remote key handling, state save/restore, and screensaver requests.

The pixel characters are drawn with discrete blocks; the illustrated option uses procedural articulated parts. These are animation-method studies, not finished generated character assets or a full skeletal-animation editor. The painted background establishes a candidate visual target; it has not been approved as the final style. Representative frames were also rendered with a canvas library and inspected; this is separate from browser or physical-TV validation.

## Review

Run the repository's local static server and open `/studies/`. The first study is separate from the original `/` prototype. Compare movement styles and pace, then view without controls from across a room. Routes are intentionally slow enough to remain ambient and include a brief pause at each end.

For a single downloadable offline page, run `python3 tools/export_study.py` and open `artifacts/magic-window-study.html` in a browser. It embeds the background and scripts without a server.

Questions: Are the people readable? Do the two animation treatments fit the painted scenery? Is the pace suitable? Does the wider near-side-on camera preserve the town's charm?

## Samsung status

`python3 tools/package_tv.py` prepares `artifacts/magic-window-unsigned.wgt`. It is an unsigned ZIP-format widget, not an installable signed release. The same study is packaged with local artwork, so it does not depend on loading a hosted website or external executable code.

Samsung's TV signing tools are not installed in this environment. A certificate, appropriate Samsung developer tooling, and a physical supported TV are still needed to sign, install, and validate the package. No store submission or certification claim is made.

In the TV study, Left/Right switches the animation method, Enter or Play/Pause toggles movement, and Back exits. Startup mode hides review text and controls. Confirm those keys, passive-viewing behavior, state recovery, and rendering on the target device; the development package does not integrate with Art Mode or implement power-on autostart.

## Verification and limits

`node tools/check_study.cjs` checks route continuity, foot positions, leash bounds, speed ratio, both render paths, blocked storage, missing artwork, reduced motion, visibility changes, and TV exit behavior using a simulated canvas environment. These checks do not establish visual quality or actual browser/TV compatibility.

The scene is a rehearsal. It does not yet have resident persistence, a database, a director, local-time routines, dynamic artwork generation, a contribution UI, or a scheduled build worker. The existing prototype's local-time day/night behavior remains unchanged.
