"""Browser review checks against a running local static server."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

out=Path(__file__).resolve().parents[1]/'artifacts'/'alley'
out.mkdir(exist_ok=True,parents=True)
url='http://127.0.0.1:8031/painted/alley/'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1100})
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(url);page.wait_for_function('AlleyStudy.state().loaded')
    for heading in [-135,-90,-45,0,45,90,135,180]:
        page.locator('[data-heading="'+str(heading)+'"]').click()
        assert page.evaluate('AlleyStudy.state().mode')==heading
        page.evaluate('(h)=>AlleyStudy.inspect(1.4,h)',heading)
        page.locator('#world').screenshot(path=str(out/('direction-'+str(heading)+'.png')))
    rendering=page.evaluate((Path(__file__).parent/'alley_render_checks.js').read_text())
    assert all(s['covered']>50 and s['bad']==0 for s in rendering['overlaps']),rendering
    assert rendering['chest']['missing']==0,rendering
    before=page.evaluate('AlleyStudy.state().seconds');page.wait_for_timeout(120)
    assert page.evaluate('AlleyStudy.state().seconds')==before
    for button,state in [('closeup','closeup'),('slow','slow'),('guides','guides')]:
        page.locator('#'+button).click();assert page.evaluate('AlleyStudy.state().'+state)
        page.locator('#'+button).click();assert not page.evaluate('AlleyStudy.state().'+state)
    page.locator('#turn').click();assert not page.evaluate('AlleyStudy.state().paused')
    assert page.evaluate('AlleyStudy.state().mode')=='alley'
    page.locator('#return').click();assert page.evaluate('AlleyStudy.state().seconds')>20
    for label,time in [('turn',5.5),('depth',11),('occlusion',17),('return',34),('pivot',41.5)]:
        page.evaluate('(t)=>AlleyStudy.inspect(t)',time)
        page.locator('#world').screenshot(path=str(out/(label+'-review.png')))
    # At the former bad cutoff, hair beside the pole stays visible while the
    # pole face itself matches the untouched background. This catches a mask
    # displaced left as well as an over-wide mask that simply hides the head.
    page.evaluate('AlleyStudy.inspect(16)')
    pole=page.evaluate('''async()=>{
      const img=new Image();img.src='../assets/street.png';await img.decode();
      const c=document.createElement('canvas');c.width=1600;c.height=900;c.getContext('2d').drawImage(img,0,0,1600,900);
      const bg=c.getContext('2d').getImageData(0,0,1600,900).data,a=document.getElementById('world').getContext('2d').getImageData(0,0,1600,900).data;
      let covered=0,open=0;for(let y=540;y<560;y++)for(let x=1154;x<1176;x++){let i=(y*1600+x)*4;
        if(Math.abs(a[i]-bg[i])+Math.abs(a[i+1]-bg[i+1])+Math.abs(a[i+2]-bg[i+2])>6){if(x<1159)covered++;if(x>1165)open++;}}
      return {covered,open};
    }''')
    assert pole['covered']==0 and pole['open']>50,pole
    # The far corner hides the actor behind unchanged scenery; there is no fade.
    page.evaluate('AlleyStudy.inspect(21)')
    changed=page.evaluate('''async()=>{
      const img=new Image();img.src='../assets/street.png';await img.decode();
      const c=document.createElement('canvas');c.width=1600;c.height=900;c.getContext('2d').drawImage(img,0,0,1600,900);
      const a=c.getContext('2d').getImageData(0,0,1600,900).data,b=document.getElementById('world').getContext('2d').getImageData(0,0,1600,900).data;
      let n=0;for(let y=450;y<660;y++)for(let x=1060;x<1140;x++){const i=(y*1600+x)*4;if(Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])>6)n++;}return n;
    }''')
    assert changed<20,changed
    page.evaluate('AlleyStudy.inspect(4,45)');page.locator('#pause').click()
    page.wait_for_timeout(100);assert not page.evaluate('AlleyStudy.state().paused')
    assert page.evaluate('AlleyStudy.state().seconds')<1
    mobile=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    mobile.goto(url);mobile.wait_for_function('AlleyStudy.state().loaded')
    assert mobile.evaluate('AlleyStudy.state().paused && document.documentElement.scrollWidth<=innerWidth')
    mobile.screenshot(path=str(out/'mobile-review.png'),full_page=True)
    missing=browser.new_page();missing.route('**/directions/rear45.png',lambda route:route.abort())
    missing.goto(url);missing.wait_for_function('AlleyStudy.state().failed')
    assert missing.locator('#loading').is_visible()
    assert not errors,errors
    report=dict(browserErrors=errors,eightDirections=True,surfaceRendering=rendering,controls=True,pause=True,endReplay=True,buildingOcclusion=True,poleEdge=pole,hiddenCornerChangedPixels=changed,mobile=True,reducedMotion=True,missingArtwork=True)
    (out/'browser-checks.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));browser.close()
