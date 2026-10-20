#!/usr/bin/env python3
"""Create an unsigned, offline TV study; signing requires Samsung tooling."""
import argparse
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
STUDY = ROOT / "dist" / "studies"


def package(output: Path):
    output.parent.mkdir(parents=True, exist_ok=True)
    entry = (STUDY / "index.html").read_text()
    entry = entry.replace("<body>", '<body data-tv="">')
    entry = entry.replace('<script src="motion.js">', '<script src="$WEBAPIS/webapis/webapis.js"></script>\n  <script src="motion.js">')
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("index.html", entry)
        archive.write(ROOT / "samsung" / "config.xml", "config.xml")
        for relative in ("study.css", "motion.js", "study.js", "assets/town-background.jpg"):
            archive.write(STUDY / relative, relative)
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "artifacts" / "magic-window-unsigned.wgt")
    result = package(parser.parse_args().output)
    print(f"Created {result.name}. UNSIGNED: Samsung signing and physical-TV validation are still required.")
