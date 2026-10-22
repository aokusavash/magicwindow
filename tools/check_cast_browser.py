from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];out=root/'artifacts/cast';out.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':1150});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8031/painted/cast/');page.wait_for_function('CastStudy.state().loaded');page.evaluate("CastStudy.inspect(0,'walk')")
 result=page.evaluate((root/'tools/cast_render_checks.js').read_text())
 assert all(s['pixels']>(180 if s['id']=='child' else 800) for s in result['directions']),result
 assert all(s['pixels']>(35 if s['id']=='child' else 130) for s in result['standingHeads']),result
 # Affine triangle edges and a direct blit have slightly different filtering.
 assert all(s['headBack']>5 and s['waistAlphaError']<.003 for s in result['blousePosture']),result
 assert result['heights']['tall']>result['heights']['original']*1.05 and .44<result['heights']['child']/result['heights']['original']<.62,result
 assert all(s['pixels']>(50 if s['id']=='child' else 100) for s in result['seatedHeads']),result
 assert result['robe']['covered']>100 and result['robe']['changedPixels']>150,result
 for person in ['original','tall','blouse','yukata','child']:
  page.locator(f'[data-person="{person}"]').click();assert page.evaluate('CastStudy.state().person')==person
  for action in ['turns','ramen','counter','meal','broth','flowers','street','walk']:
   page.locator(f'[data-action="{action}"]').click();assert not page.evaluate('CastStudy.state().paused')
   page.locator('#pause').click();t=page.evaluate('CastStudy.state().seconds');page.wait_for_timeout(30);assert page.evaluate('CastStudy.state().seconds')==t
   if action in ['turns','counter','meal','broth','walk']:
    target=t+(7 if action=='broth' else 5 if action=='turns' else 2)
    page.evaluate('t=>CastStudy.inspect(t)',target);page.locator('#world').screenshot(path=str(out/f'{person}-{action}.png'))
 page.evaluate("CastStudy.inspect(3,'walk','yukata','')");page.locator('#world').screenshot(path=str(out/'walk.png'))
 page.locator('#slow').click();assert page.evaluate('CastStudy.state().slow');page.locator('#restart').click();assert page.evaluate('CastStudy.state().seconds')==0
 mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');mobile.goto('http://127.0.0.1:8031/painted/cast/');mobile.wait_for_function('CastStudy.state().loaded');assert mobile.evaluate('CastStudy.state().paused && document.documentElement.scrollWidth<=innerWidth');mobile.locator('[data-person="child"]').click();mobile.locator('[data-action="broth"]').click();assert mobile.evaluate('CastStudy.state().paused');mobile.screenshot(path=str(out/'mobile.png'),full_page=True)
 missing=browser.new_page();missing.route('**/assets/cast/child.png',lambda r:r.abort());missing.goto('http://127.0.0.1:8031/painted/cast/');missing.wait_for_function('CastStudy.state().failed');assert missing.locator('#loading').is_visible()
 assert not errors,errors
 report={'rendering':result,'controls':True,'pause':True,'mobileReducedMotion':True,'missingArt':True,'browserErrors':errors};(out/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));browser.close()
