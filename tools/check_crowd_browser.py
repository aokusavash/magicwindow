from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];out=root/'artifacts/crowd';out.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8031/painted/crowd/');page.wait_for_function('CrowdStudy.state().loaded');page.evaluate('CrowdStudy.inspect(0,8)')
    rendering=page.evaluate((root/'tools/crowd_render_checks.js').read_text())
    assert rendering['comparison']['meanChannelError']<2,rendering
    assert rendering['comparison']['largeDifferenceFraction']<.02,rendering
    assert rendering['orderChanged']==0 and rendering['stalePixels']==0,rendering
    assert rendering['hiddenCornerChanged']<20,rendering
    page.evaluate('CrowdStudy.inspect(5,8)');page.locator('[data-count="5"]').click()
    assert page.evaluate('CrowdStudy.state().count===5 && CrowdStudy.state().seconds===5 && CrowdStudy.state().paused')
    page.locator('[data-count="8"]').click();assert page.evaluate('CrowdStudy.state().count')==8
    page.locator('#slow').click();assert page.evaluate('CrowdStudy.state().slow');page.locator('#slow').click()
    page.locator('#pause').click();page.wait_for_timeout(200);assert page.evaluate('CrowdStudy.state().seconds')>5
    page.locator('#pause').click();s=page.evaluate('CrowdStudy.state().seconds');page.wait_for_timeout(100);assert page.evaluate('CrowdStudy.state().seconds')==s
    page.locator('#restart').click();assert page.evaluate('CrowdStudy.state().seconds')==0
    for count in [5,8]:
        page.evaluate('(n)=>CrowdStudy.inspect(0,n)',count);page.locator('#world').screenshot(path=str(out/f'population-{count}.png'))
    for t in [8,18,30,55]:
        page.evaluate('(t)=>CrowdStudy.inspect(t,8)',t);page.locator('#world').screenshot(path=str(out/f'time-{t}.png'))
    mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');mobile.goto('http://127.0.0.1:8031/painted/crowd/');mobile.wait_for_function('CrowdStudy.state().loaded')
    assert mobile.evaluate('CrowdStudy.state().paused && document.documentElement.scrollWidth<=innerWidth')
    mobile.screenshot(path=str(out/'mobile.png'),full_page=True)
    missing=browser.new_page();missing.route('**/directions/rear45.png',lambda r:r.abort());missing.goto('http://127.0.0.1:8031/painted/crowd/');missing.wait_for_function('CrowdStudy.state().failed');assert missing.locator('#loading').is_visible()
    assert not errors,errors
    report={'rendering':rendering,'controls':True,'pause':True,'countChangePreservesTime':True,'mobileReducedMotion':True,'missingArt':True,'browserErrors':errors}
    (out/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));browser.close()
