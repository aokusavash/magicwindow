"""Checks the isolated walking comparison against the local review server."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(__file__).resolve().parents[1] / 'artifacts' / 'skin'
out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1400, 'height': 1100})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto('http://127.0.0.1:8031/painted/walking/')
    page.wait_for_function('WalkingStudy.state().loaded')
    assert not page.evaluate('WalkingStudy.state().compare')
    assert page.evaluate('WalkingStudy.state().gait') == 'everyday'
    page.locator('#compare').click()
    assert page.evaluate('WalkingStudy.state().compare')
    page.locator('#pause').click()
    before = page.evaluate('WalkingStudy.state().seconds')
    for key in ['stroll','everyday','brisk','previous']:
        page.locator('[data-gait="' + key + '"]').click()
        assert page.evaluate('WalkingStudy.state().gait') == key
        assert not page.evaluate('WalkingStudy.state().compare')
        assert page.evaluate('WalkingStudy.state().seconds') == before
    page.locator('#compare').click()
    assert page.evaluate('WalkingStudy.state().compare')
    page.wait_for_timeout(80)
    page.locator('#world').screenshot(path=str(out / 'three-gaits.png'))
    page.locator('#arms').click()
    assert not page.evaluate('WalkingStudy.state().armSwing')
    assert page.evaluate('WalkingStudy.state().seconds') == before
    page.locator('#arms').click()
    assert page.evaluate('WalkingStudy.state().armSwing')
    page.locator('#slow').click()
    assert page.evaluate('WalkingStudy.state().slow')
    page.locator('#slow').click()
    page.evaluate('WalkingStudy.inspect(.25,"resident","skin")')
    page.get_by_text('Earlier artwork comparisons', exact=True).click()
    before = page.evaluate('WalkingStudy.state().seconds')
    page.locator('[data-surface="layered"]').click()
    page.wait_for_timeout(60)
    assert page.evaluate('WalkingStudy.state().surface') == 'layered'
    page.locator('#world').screenshot(path=str(out / 'resident-layered.png'))
    page.locator('[data-person="neighbor"]').click()
    assert page.evaluate('WalkingStudy.state().surface') == 'skin'
    page.locator('[data-surface="layered"]').click()
    assert page.evaluate('WalkingStudy.state().person') == 'resident'
    assert page.locator('[data-person="resident"]').get_attribute('aria-pressed') == 'true'
    for who in ['resident', 'neighbor']:
        page.locator('[data-person="' + who + '"]').click()
        for method in ['parts', 'skin']:
            page.locator('[data-surface="' + method + '"]').click()
            page.wait_for_timeout(60)
            assert page.evaluate('WalkingStudy.state().seconds') == before
            page.locator('#world').screenshot(path=str(out / (who + '-' + method + '.png')))
    page.locator('#closeup').click()
    assert not page.evaluate('WalkingStudy.state().closeup')
    page.locator('#pause').click()
    page.wait_for_timeout(1000)
    assert page.evaluate('WalkingStudy.state().seconds') > before
    page.locator('[data-surface="layered"]').click()
    page.wait_for_timeout(1000)
    timing = page.evaluate('WalkingStudy.state().averageDrawMs')
    page.locator('#pause').click()
    page.locator('#restart').click()
    assert page.evaluate('WalkingStudy.state().seconds') == 0
    mobile = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    mobile.goto('http://127.0.0.1:8031/painted/walking/')
    mobile.wait_for_function('WalkingStudy.state().loaded')
    assert mobile.evaluate('WalkingStudy.state().paused && document.documentElement.scrollWidth <= innerWidth')
    assert mobile.locator('#world').get_attribute('height') == '900'
    mobile.locator('#compare').click()
    mobile.wait_for_timeout(60)
    assert mobile.locator('#world').get_attribute('height') == '2700'
    mobile.screenshot(path=str(out / 'gaits-mobile.png'), full_page=True)
    mobile.locator('[data-gait="everyday"]').click()
    mobile.wait_for_timeout(60)
    assert mobile.locator('#world').get_attribute('height') == '900'
    missing = browser.new_page()
    missing.route('**/skin/resident-arms.png', lambda route: route.abort())
    missing.goto('http://127.0.0.1:8031/painted/walking/')
    missing.wait_for_function('WalkingStudy.state().failed')
    assert missing.locator('#loading').is_visible()
    assert not errors, errors
    report = dict(browserErrors=errors, controls=True, threeGaits=True, singleGait=True, halfSpeed=True, armSwingToggle=True, pausePreservesComparison=True, mobile=True, reducedMotion=True, missingArtwork=True, oneActorAverageDrawMs=round(timing, 2))
    (out / 'browser-checks.json').write_text(json.dumps(report, indent=2))
    print(json.dumps(report))
    browser.close()
