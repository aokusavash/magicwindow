#!/usr/bin/env python3
"""Export the review study as one offline HTML file, without build dependencies."""
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def export(output=None):
    study = ROOT / "dist" / "studies"
    output = output or ROOT / "artifacts" / "magic-window-study.html"
    html = (study / "index.html").read_text()
    html = html.replace('<link rel="stylesheet" href="study.css">', '<style>' + (study / "study.css").read_text() + '</style>')
    for filename in ("motion.js", "study.js"):
        code = (study / filename).read_text()
        if filename == "study.js":
            data = base64.b64encode((study / "assets" / "town-background.jpg").read_bytes()).decode()
            code = code.replace("background.src='assets/town-background.jpg';", "background.src='data:image/jpeg;base64," + data + "';")
        html = html.replace('<script src="' + filename + '"></script>', '<script>' + code + '</script>')
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html)
    return output


if __name__ == "__main__":
    print(f"Created {export().name}; open it in a browser to review offline.")
