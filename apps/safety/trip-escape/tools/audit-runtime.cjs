const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),C=require('../content'),S=require('../story');
const src=fs.readFileSync(path.join(root,'app.js'),'utf8');const context={};vm.runInNewContext(src.slice(src.indexOf('const questionImages='),src.indexOf('function renderInterlude'))+';globalThis.images=questionImages;',context);
let choices=0;const errors=[];
for(const id of Object.keys(S.chapters))for(const m of S.plan(id,C).missions){if(m.kind!=='choice')continue;choices++;const key=id+'/'+m.question.id,file=context.images[key];if(!file||!fs.existsSync(path.join(root,file)))errors.push(key+': '+file);}
const allImages=[...new Set(Object.values(context.images))];for(const file of allImages)if(!fs.existsSync(path.join(root,file)))errors.push('missing '+file);
for(const id of ['',...Object.keys(C.places)]){const file=path.join(root,id,'index.html');if(!fs.existsSync(file))continue;const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"#]*)?"/g)){const rel=m[1];if(/^(https?:|#)/.test(rel))continue;if(!fs.existsSync(path.join(root,rel)))errors.push(file+' -> '+rel);}if(!html.includes('20261114.5'))errors.push('cache '+file);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(JSON.stringify({choiceMissions:choices,questionImages:allImages.length,entries:15,missing:0,seriousRuntimeImages:allImages.filter(f=>f.includes('-serious.')).length},null,2));
