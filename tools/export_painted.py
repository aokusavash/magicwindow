"""Export the painted study as one offline HTML file; original assets are unchanged."""
from pathlib import Path
import base64

ROOT = Path(__file__).resolve().parents[1]
STUDY = ROOT / 'dist' / 'painted'
html = (STUDY / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="painted.css">', '<style>' + (STUDY / 'painted.css').read_text() + '</style>')
for name in ('world.js', 'frames.js', 'painted.js'):
    code = (STUDY / name).read_text()
    if name == 'painted.js':
        for image in (STUDY / 'assets').glob('*.png'):
            uri = 'data:image/png;base64,' + base64.b64encode(image.read_bytes()).decode()
            code = code.replace('assets/' + image.name, uri)
    html = html.replace('<script src="' + name + '"></script>', '<script>' + code + '</script>')
destination = ROOT / 'artifacts' / 'magic-window-painted.html'
destination.parent.mkdir(exist_ok=True)
destination.write_text(html)
print(destination)
