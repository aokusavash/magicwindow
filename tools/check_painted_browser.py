"""Browser checks against an already running local static server."""
from pathlib import Path
import argparse
import json
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8031/painted/')
parser.add_argument('--browser', default='/usr/bin/chromium')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'artifacts' / 'rig'
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=args.browser, headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1120})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(args.url + '?seed=327')
    page.wait_for_function('window.PaintedStudy && PaintedStudy.state().loaded')
    for name, time, focus in [('walking', 7, ''), ('neighbor', 7, 'neighbor'), ('flower', 15, 'resident'), ('approach', 25, 'resident'), ('opening', 29, 'resident'), ('entry', 34, 'resident')]:
        page.evaluate('([t,f])=>PaintedStudy.inspect(t,"afternoon",f)', [time, focus])
        page.locator('#world').screenshot(path=str(out / (name + '.png')))
    before = page.evaluate('PaintedStudy.state().seconds')
    page.wait_for_timeout(180)
    assert page.evaluate('PaintedStudy.state().seconds') == before
    page.locator('#flower').click()
    assert not page.evaluate('PaintedStudy.state().paused')
    assert page.evaluate('PaintedStudy.state().closeup') == 'resident'
    page.locator('#closeup').click()
    assert page.evaluate('PaintedStudy.state().closeup') == 'neighbor'
    page.locator('#entrance').click()
    assert page.evaluate('PaintedStudy.state().closeup') == 'resident'
    seed = page.evaluate('PaintedStudy.state().seed')
    page.locator('#variation').click()
    assert page.evaluate('PaintedStudy.state().seed') != seed
    page.locator('#pause').click()
    assert page.evaluate('PaintedStudy.state().paused')
    for look in ['evening', 'rain']:
        page.locator('[data-look="' + look + '"]').click()
        assert page.evaluate('PaintedStudy.state().look') == look
    mobile = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    mobile.goto(args.url)
    mobile.wait_for_function('window.PaintedStudy && PaintedStudy.state().loaded')
    assert mobile.evaluate('PaintedStudy.state().paused')
    assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth')
    mobile.screenshot(path=str(out / 'mobile.png'), full_page=True)
    missing = browser.new_page()
    missing.route('**/rig/neighbor.png', lambda route: route.abort())
    missing.goto(args.url)
    missing.wait_for_function('window.PaintedStudy && PaintedStudy.state().failed')
    assert missing.locator('#loading').is_visible()
    embedded = browser.new_page()
    embedded.route('**/*', lambda route: route.abort())
    embedded.set_content((root / 'artifacts' / 'magic-window-painted.html').read_text())
    embedded.wait_for_function('window.PaintedStudy && PaintedStudy.state().loaded')
    assert not errors, errors
    result = dict(browserErrors=errors, controls=True, closeup=True, mobile=True, reducedMotion=True, missingArtwork=True, embeddedExport=True)
    (out / 'browser-checks.json').write_text(json.dumps(result, indent=2))
    print(json.dumps(result))
    browser.close()
