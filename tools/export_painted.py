"""Export the painted study as one offline HTML file; original assets are unchanged."""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parents[1]
STUDY = ROOT / 'dist' / 'painted'
html = (STUDY / 'index.html').read_text()
html = re.sub(r'<link rel="stylesheet" href="painted.css(?:\?[^"]*)?">', lambda _: '<style>' + (STUDY / 'painted.css').read_text() + '</style>', html)
for name in ('world.js', 'frames.js', 'rig-frames.js', 'rig.js', 'painted.js'):
    code = (STUDY / name).read_text()
    if name == 'painted.js':
        for image in (STUDY / 'assets').rglob('*.png'):
            uri = 'data:image/png;base64,' + base64.b64encode(image.read_bytes()).decode()
            code = code.replace(image.relative_to(STUDY).as_posix(), uri)
    html = re.sub(r'<script src="'+re.escape(name)+r'(?:\?[^"]*)?"></script>', lambda _: '<script>' + code + '</script>', html)
destination = ROOT / 'artifacts' / 'magic-window-painted.html'
destination.parent.mkdir(exist_ok=True)
destination.write_text(html)
print(destination)
