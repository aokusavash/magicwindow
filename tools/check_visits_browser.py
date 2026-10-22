from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];out=root/'artifacts/visits';out.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8031/painted/visits/');page.wait_for_function('VisitStudy.state().loaded');page.evaluate('VisitStudy.inspect(0)')
    rendering=page.evaluate((root/'tools/visit_render_checks.js').read_text())
    assert all(x['visiblePixels']>1000 and x['handPixels']>8 for x in rendering['door']),rendering
    assert all(x['coloredHandPixels']>8 for x in rendering['handLayering'] if x['progress']!=.5),rendering
    assert next(x['coloredHandPixels'] for x in rendering['handLayering'] if x['progress']==.5)<3,rendering
    assert all(x['outsidePixels']==0 and x['counterPixels']==0 for x in rendering['interior']),rendering
    assert all(x['windowPixels']>250 for x in rendering['interior'] if x['action']=='at-counter'),rendering
    assert rendering['browsePixels']>1500 and rendering['orderChanged']==0 and rendering['stalePixels']==0,rendering
    assert rendering['closedDoorBodyPixels']==0,rendering
    assert all(x['hidden'] and x['heading']==0 and x['bowlPixels']==0 and x['eatingPixels']==0 and x['seatedLegPixels']>150 for x in rendering['meals'] if x['table']=='outside'),rendering
    assert all(not x['hidden'] and abs(x['heading']-3.141592653589793)<1e-8 and x['bowlPixels']>25 and x['eatingPixels']>100 for x in rendering['meals'] if x['table']=='inside'),rendering
    assert rendering['fixedForeground']['checked']>3000 and rendering['fixedForeground']['changed']==0,rendering
    page.locator('#counter').click();assert page.evaluate("Math.abs(VisitStudy.state().seconds-VisitWorld.counterTime)<.2 && VisitStudy.state().focus==='ramen'")
    page.locator('#meal').click();assert page.evaluate("Math.abs(VisitStudy.state().seconds-(VisitWorld.windowTime+2))<.2")
    page.locator('#ramen').click();assert page.evaluate("VisitStudy.state().focus==='ramen' && !VisitStudy.state().paused")
    page.locator('#pause').click();t=page.evaluate('VisitStudy.state().seconds');page.wait_for_timeout(150);assert page.evaluate('VisitStudy.state().seconds')==t
    page.locator('#flowers').click();assert page.evaluate("VisitStudy.state().focus==='flowers'");page.locator('#pause').click()
    page.locator('#wide').click();assert page.evaluate("VisitStudy.state().focus==='' && VisitStudy.state().paused")
    page.locator('#slow').click();assert page.evaluate('VisitStudy.state().slow');page.locator('#slow').click()
    page.locator('#restart').click();assert page.evaluate('VisitStudy.state().seconds')==0
    for action in ['open-door','enter','auto-close','inside-walk','at-counter','auto-open-exit','exit','auto-close-exit']:
        t=page.evaluate("a=>{let s=VisitWorld.ramen.segments.find(s=>s.action===a);return s.start+s.duration*.5-VisitWorld.ramen.offset}",action)
        page.evaluate("t=>VisitStudy.inspect(t,'ramen')",t);page.locator('#world').screenshot(path=str(out/(action+'.png')))
    for offset in [1.5,3.5,6]:
        page.evaluate("t=>VisitStudy.inspect(VisitWorld.mealTime+t,'ramen')",offset);page.locator('#world').screenshot(path=str(out/f'counter-meal-{offset}.png'))
    page.evaluate("VisitStudy.inspect(VisitWorld.flowerTime+5,'flowers')");page.locator('#world').screenshot(path=str(out/'browse.png'))
    page.evaluate("VisitStudy.inspect(15,'')");page.locator('#world').screenshot(path=str(out/'town.png'))
    mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');mobile.goto('http://127.0.0.1:8031/painted/visits/');mobile.wait_for_function('VisitStudy.state().loaded')
    assert mobile.evaluate('VisitStudy.state().paused && document.documentElement.scrollWidth<=innerWidth');mobile.locator('#ramen').click();assert mobile.evaluate('VisitStudy.state().paused');mobile.screenshot(path=str(out/'mobile.png'),full_page=True)
    missing=browser.new_page();missing.route('**/rig/interior.png',lambda r:r.abort());missing.goto('http://127.0.0.1:8031/painted/visits/');missing.wait_for_function('VisitStudy.state().failed');assert missing.locator('#loading').is_visible()
    assert not errors,errors
    report={'rendering':rendering,'controls':True,'pause':True,'mobileReducedMotion':True,'missingArt':True,'browserErrors':errors};(out/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));browser.close()
