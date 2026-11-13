(function(root){
'use strict';
const validTypes=new Set(['day','overnight','halfday']);
const aliases={monthly:'halfday',schoolTrip:'overnight',retreat:'overnight',indoorPlayground:'sports',room:'lodging',outdoor:'park',arboretum:'garden'};
function normalize(config,content){
 const type=aliases[config.type]||config.type;
 const place=aliases[config.place]||config.place;
 const scope=config.scope==='lesson'?'lesson':'place';
 return {type:validTypes.has(type)?type:'halfday',place:content.places[place]?place:null,move:config.move==='bus'||scope==='lesson'&&config.move!=='none'?'bus':'none',rest:type==='overnight'&&(config.rest===true||config.rest==='1'),scope};
}
function routeFor(config,content){
 const c=normalize(config,content);if(!c.place)return [];
 if(c.place==='homecoming')return ['homecoming'];
 if(c.scope==='place')return [c.place];
 const route=[];if(c.move==='bus'||c.place==='bus')route.push('bus');
 if(c.type==='overnight'&&(c.rest||c.place==='rest'))route.push('rest');
 if(c.type==='overnight'){
  if(!['bus','rest','lodging','night','escape'].includes(c.place))route.push(c.place);
  route.push('lodging','escape');
 }else if(c.place!=='bus')route.push(c.place);
 if(c.place!=='homecoming')route.push('homecoming');
 return [...new Set(route)];
}
function parseLocation(location,content){
 const u=new URL(location),p=u.searchParams;
 const segment=u.pathname.replace(/\/index\.html$/,'/').split('/').filter(Boolean).at(-1);
 const place=p.get('place')||(content.places[segment]?segment:null);
 return normalize({type:p.get('type')||(place==='lodging'||place==='night'||place==='escape'?'overnight':'halfday'),place,scope:p.get('scope')||'place',move:p.get('move'),rest:p.get('rest')},content);
}
function shareURL(base,config,content,view){
 const c=normalize(config,content);const u=new URL(c.place?`${c.place}/`:'./',base);
 u.searchParams.set('type',c.type);if(c.scope==='lesson'){u.searchParams.set('scope','lesson');u.searchParams.set('move',c.move);if(c.rest)u.searchParams.set('rest','1');}
 if(view)u.searchParams.set('view',view);return u.href;
}
function createSession(config,content){const c=normalize(config,content);return {config:c,route:routeFor(c,content),index:0,phase:'explore',spotIds:[],gameCards:[],gameNotice:'',questionIndex:0,records:[],completed:[],startedAt:new Date().toISOString(),supportChoice:null,reported:[]};}
function recordAttempt(session,moduleId,itemId,correct,{assisted=false,kind='choice'}={}){
 let r=session.records.find(r=>r.module===moduleId&&r.item===itemId&&r.kind===kind);
 if(!r){r={module:moduleId,item:itemId,kind,firstCorrect:!!correct,attempts:0,assisted:false,complete:false};session.records.push(r);}
 r.attempts++;r.assisted=r.assisted||assisted||!correct;r.complete=r.complete||!!correct;return r;
}
function completeModule(session,id){if(!session.completed.includes(id))session.completed.push(id);}
function summary(session){const r=session.records.filter(r=>r.kind==='choice'||r.kind==='quiz');return {total:r.length,independent:r.filter(r=>r.firstCorrect&&!r.assisted&&r.complete).length,guided:r.filter(r=>r.complete&&(!r.firstCorrect||r.assisted)).length,completed:session.completed.length,modules:session.route.length};}
function filterVideos(videos,{place='',domain='',level='',query=''}={}){
 const q=query.trim().toLocaleLowerCase('ko');return videos.filter(v=>(!place||(v.venues||[]).includes(place))&&(!domain||v.domain===domain)&&(!level||(v.levels||[]).includes(level))&&(!q||[v.title,v.keyword,v.topic,v.provider].join(' ').toLocaleLowerCase('ko').includes(q)));
}
function safeURL(value){try{const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:'?u.href:null;}catch{return null;}}
const api={normalize,routeFor,parseLocation,shareURL,createSession,recordAttempt,completeModule,summary,filterVideos,safeURL};root.TripModel=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
