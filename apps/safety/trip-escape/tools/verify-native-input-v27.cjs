const {chromium}=require(process.env.SAFETY_PLAYWRIGHT||'E:/안전교육/개발도구/browser-tests/node_modules/playwright-core');
const fs=require('fs');
const out='E:/안전교육/미리보기/v27';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.SAFETY_EDGE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const report=[];
 try{for(const viewport of [{width:1440,height:1080},{width:1024,height:768},{width:390,height:844}]){
  const context=await browser.newContext({viewport,hasTouch:true,locale:'ko-KR'});await context.addInitScript(()=>localStorage.setItem('safetyMasterSettings',JSON.stringify({voice:false,effects:false,music:false})));
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?view=free');
  await page.locator('[data-action=free-mode][data-id=games]').click();await page.locator('[data-action=free-place][data-id=park]').click();await page.locator('[data-action=free-game][data-kind=dodge]').click();
  await page.screenshot({path:out+'/노말선택_'+viewport.width+'.png',fullPage:true});
  const before=await page.locator('#survival-field').boundingBox();
  await page.locator('[data-action=dodge-start]').click();
  await page.evaluate(()=>{window.__samples=[];window.__sampling=true;function sample(){const b=document.querySelector('#survival-field');if(b)window.__samples.push({at:performance.now(),x:Number(b.dataset.x),y:getComputedStyle(b.querySelector('.survival-ground')).backgroundPositionY});if(window.__sampling)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
  await page.locator('#survival-field').focus();await page.keyboard.down('ArrowRight');await page.waitForTimeout(400);await page.keyboard.up('ArrowRight');
  const keyboard=await page.locator('#survival-field').getAttribute('data-x');await page.waitForTimeout(120);const stopped=await page.locator('#survival-field').getAttribute('data-x');
  const left=await page.locator('[data-action=dodge-left]').boundingBox();await page.mouse.move(left.x+left.width/2,left.y+left.height/2);await page.mouse.down();await page.waitForTimeout(400);await page.mouse.up();
  const mouse=await page.locator('#survival-field').getAttribute('data-x');
  // Native Chromium touch events, not synthetic DOM pointer events.
  const right=await page.locator('[data-action=dodge-right]').boundingBox(),cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:right.x+right.width/2,y:right.y+right.height/2,id:1}]});await page.waitForTimeout(300);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const touch=await page.locator('#survival-field').getAttribute('data-x');await page.waitForTimeout(120);const touchStopped=await page.locator('#survival-field').getAttribute('data-x');
  await page.screenshot({path:out+'/산책길_'+viewport.width+'.png',fullPage:true});
  const metrics=await page.evaluate(()=>{window.__sampling=false;const a=window.__samples;return {frames:a.length,uniqueX:new Set(a.map(v=>v.x.toFixed(5))).size,maxStep:Math.max(...a.slice(1).map((v,i)=>Math.abs(v.x-a[i].x))),groundFrames:new Set(a.map(v=>v.y)).size,overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('.survival-key')].map(e=>({x:e.getBoundingClientRect().x,bottom:e.getBoundingClientRect().bottom,width:e.getBoundingClientRect().width}))};});
  await page.locator('[data-action=mini-replay]').click();const reset=await page.locator('#survival-field').getAttribute('data-phase');
  await page.locator('[data-action=dodge-mode][data-id=challenge]').click();await page.screenshot({path:out+'/도전선택_'+viewport.width+'.png',fullPage:true});
  report.push({viewport,before,ratio:before.width/before.height,keyboard,stopped,mouse,touch,touchStopped,metrics,reset,errors});await context.close();
 }
 fs.writeFileSync(out+'/native-input-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
