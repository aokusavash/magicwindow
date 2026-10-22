from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];out=root/'artifacts/reference';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page(viewport={'width':1440,'height':1150});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8031/painted/reference/');page.wait_for_function('ReferenceStudy.state().loaded');renders=0
 for person in ['original','blouse']:
  page.locator(f'[data-person="{person}"]').click();assert page.evaluate('ReferenceStudy.state().person')==person
  for angle in [90,-90,180,0,135]:
   page.locator(f'[data-angle="{angle}"]').click();assert page.evaluate('ReferenceStudy.state().angle')==angle
   for style in ['painted','overlay','skeleton']:
    page.locator(f'[data-style="{style}"]').click();assert page.evaluate('ReferenceStudy.state().style')==style
    page.evaluate('(v)=>ReferenceStudy.inspect(.25,v.person,v.angle,v.style)',{'person':person,'angle':angle,'style':style});renders+=1
    if angle in [90,180]:page.locator('#world').screenshot(path=str(out/f'{person}-{angle}-{style}.png'))
 # Actual output must change between poses, between drawing modes, and on
 # both comparison panes. A non-empty background alone is insufficient.
 pixels=page.evaluate('''()=>{let c=document.getElementById('world'),ctx=c.getContext('2d');function frame(u,style){ReferenceStudy.inspect(u,'blouse',90,style);return ctx.getImageData(0,0,1600,900).data;}function diff(a,b,x0,x1){let n=0;for(let y=150;y<840;y++)for(let x=x0;x<x1;x++){let i=(y*1600+x)*4;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>40)n++;}return n;}let a=frame(.02,'painted'),b=frame(.3,'painted'),s=frame(.3,'skeleton');return {leftMotion:diff(a,b,150,650),rightMotion:diff(a,b,950,1450),skeletonChange:diff(b,s,950,1450)};}''')
 assert pixels['leftMotion']>1000 and pixels['rightMotion']>1000 and pixels['skeletonChange']>1000,pixels
 for phase in [0,.1,.25,.4,.5]:
  page.locator(f'[data-phase="{phase if phase==0 else str(phase)[1:]}"]').click();assert page.evaluate('ReferenceStudy.state().paused')
 page.locator('#phase').evaluate("el=>{el.value='730';el.dispatchEvent(new Event('input',{bubbles:true}));}");assert page.locator('#phase-text').text_content()=='73%'
 before=page.evaluate('ReferenceStudy.state().seconds');page.locator('#next').click();assert abs(page.evaluate('ReferenceStudy.state().seconds')-before-1/60)<1e-9;page.locator('#back').click();assert abs(page.evaluate('ReferenceStudy.state().seconds')-before)<1e-9
 page.locator('#slow').click();assert page.evaluate('ReferenceStudy.state().slow');page.locator('#restart').click();page.wait_for_timeout(60);assert page.evaluate('ReferenceStudy.state().seconds')==0
 page.locator('#pause').click();page.wait_for_timeout(80);assert not page.evaluate('ReferenceStudy.state().paused') and page.evaluate('ReferenceStudy.state().seconds')>0;page.locator('#pause').click()
 mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce');mobile.goto('http://127.0.0.1:8031/painted/reference/');mobile.wait_for_function('ReferenceStudy.state().loaded');assert mobile.evaluate('ReferenceStudy.state().paused && document.documentElement.scrollWidth<=innerWidth');mobile.locator('[data-style="skeleton"]').click();mobile.screenshot(path=str(out/'mobile.png'),full_page=True)
 missing=browser.new_page();missing.route('**/assets/cast/blouse.png',lambda r:r.abort());missing.goto('http://127.0.0.1:8031/painted/reference/');missing.wait_for_function('ReferenceStudy.state().failed');assert missing.locator('#loading').is_visible()
 assert not errors,errors
 report={'renders':renders,'pixels':pixels,'poseControls':True,'frameStepping':True,'scrubber':True,'pause':True,'mobileReducedMotion':True,'missingArt':True,'browserErrors':errors};(out/'checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));browser.close()
