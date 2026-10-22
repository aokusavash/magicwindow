# Walk reference study: provenance and reproduction

Study 17 is a separate review at `/painted/reference/`. The original and blue-blouse women compare the current cast gait against a capture-informed adaptation at the same travel speed and cycle distance. It does not replace accepted cast/shop motion.

## Recorded reference

- Original collection: [CMU Graphics Lab Motion Capture Database, subject 07](https://mocap.cs.cmu.edu/search.php?subjectnumber=7), trial **07_04, slow walk**, approximately 120 samples/second.
- BVH conversion used: [cmubvh mirror, pinned revision](https://github.com/Shriinivas/cmubvh/blob/55588035783a3a6d57a1bb213770c3e18b3e12ee/Sequence-001-009/07/Data/07_04.zip). The CMU server returned HTTP 403 for direct ASF/AMC downloads in this environment; the BVH mirror supplied the recording.
- Extracted BVH SHA-256: `320fceb9f8269b8d44f5142385e98e236eccc24cee3728d8227a4933abb82564`.
- Source frames 56–232 (one-based, end boundary included during extraction), 176 samples per loop, 1.466661 seconds in the recording. This is a short steady-cycle selection, not the complete performance.
- [CMU usage FAQ](https://mocap.cs.cmu.edu/faqs.php) permits copying, modifying and redistributing motion data. The [collection homepage](https://mocap.cs.cmu.edu/) permits inclusion in commercial products but forbids selling the data directly. This project uses a short derived cycle as part of an animation study.

The data used in this project was obtained from mocap.cs.cmu.edu.
The database was created with funding from NSF EIA-0196217.

## Teaching and rig design references

- [Animation Mentor: Animating a Basic Human Walk Cycle](https://www.animationmentor.com/blog/tutorial-animating-human-walk-cycle/): contact/down/passing/up review poses, body coordination, arm overlap, curve review and foot translation.
- [Spineboy example: hip and leg setup](https://esotericsoftware.com/spine-examples-spineboy): independent foot targets and pelvis, leg/foot constraints. This is an architectural reference; no Spine code or example artwork is embedded.
- [Spine skins](https://esotericsoftware.com/spine-skins): shared motion with fitted character attachments. The study continues to use its own browser renderer and existing generated paintings.

## Extraction

Download only the single pinned ZIP above and extract `07_04.bvh`. Then run from the repository root:

```sh
python3 tools/prepare_walk_reference.py /absolute/path/to/07_04.bvh
node tools/check_reference.cjs
```

The optional preparation tool needs NumPy. It parses BVH channel order and forward kinematics, selects the cycle, aligns forward/lateral axes to the recorded travel direction, removes endpoint drift, and fits a periodic low-pass loop retaining twelve harmonics. It writes `capture.js` with measured joint positions and source metadata. The runtime has no Python or network dependency.

## Adaptation and limits

`motion.js` uses captured pelvic rise/fore-aft residual, lateral balance, projected torso lean, shoulder offsets, arm directions and swing-foot progress. Limb lengths, stance paths, heel/toe support and character artwork remain fitted to this study. Swing correction fades smoothly to zero at contact boundaries; clearance is scaled down/capped for the small painted scene. Knees use a continuous two-bone solve, replacing the held landing silhouette only in the candidate. A smooth reach limit prevents the pelvis from stretching either leg.

This is **not exact motion-capture retargeting**. The source skeleton and painted adaptation have different proportions, travel distances and timing. The current/candidate comparison shares speed and cycle distance; recorded motion is retimed to that cycle. The torso is a 2D painting; depth rotation is represented by small projected lean/attachment offsets. Approximate review-pose labels are not force-plate contact measurements. In-place views use moving ground ticks; they do not demonstrate world navigation, turns, stopping or shop interactions.

Skeleton, overlay and painted modes expose the current fitting. The small source viewer shows the loop-prepared capture before character fitting. No new art/background was generated. Original walking, cast and meals retain their default behavior.

## Verification

`node tools/check_reference.cjs` checks finite poses across eight headings, planted support, bounded swing clearance, actual capture-driven arm/swing changes, reachable knees and continuous loop/contact joins. `python3 tools/check_reference_browser.py` against a local server on port 8031 checks both characters, five viewing directions, three drawing modes, actual changing pixels, source/phase controls, stepping, scrubber, reduced motion/mobile and missing-art failure. Existing cast/gait/projection/meal checks protect accepted behavior. These checks support human visual review, not a claim that the candidate is artistically superior.
