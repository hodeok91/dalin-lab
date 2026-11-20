const assert=require('node:assert/strict');
function playArcade(a,kind){
 const doc=a.doc,w=a.w,click=(action,value)=>a.click('ar-'+action,value===undefined?'':'[data-value="'+value+'"]');
 if(kind==='path'){click('start');for(let n=0;n<22;n++){const f=doc.querySelector('[data-ar-field]');click('step',f.dataset.next===f.dataset.facing?'climb':'turn');}click('finish');}
 if(kind==='sort'){click('start');for(let n=0;n<24;n++)click('classify',doc.querySelector('[data-ar-field]').dataset.bin);click('finish');}
 if(kind==='whack'){click('wait-mode');click('start');for(let n=0;n<10;n++){const t=doc.querySelector('[data-danger="true"]');assert.ok(t);t.click();}click('finish');}
 if(kind==='dress'){for(const t of w.SafetyPlaceGames.gear.filter(t=>t.zone)){click('select',t.id);click('drop',t.zone);}}
 if(kind==='wash'){
  function hold(ms){const hands=doc.querySelector('[data-ar-rub]');hands.focus();hands.dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true}));a.tick(ms);doc.dispatchEvent(new w.KeyboardEvent('keyup',{key:' ',code:'Space',bubbles:true}));}
  hold(1700);click('soap');for(let n=0;n<6;n++)hold(5100);hold(1700);click('dry');
 }
 if(kind==='call-order'){for(const n of ['1','1','9'])click('digit',n);click('call');a.tick(1400);for(let n=0;n<3;n++)click('answer','aac');a.tick(2400);}
 if(['ride-order','evac-order'].includes(kind)){const count=kind==='ride-order'?6:3;for(let n=0;n<count;n++){click('select',n);click('place',n);}click('check');}
}
module.exports={playArcade};