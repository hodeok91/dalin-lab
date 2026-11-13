import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}const target=path.resolve(root,'.'+p);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);return res.end();}let file=target;try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const body=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('자료를 찾을 수 없어요.');}});
function openPreview(){if(process.platform==='win32')spawn('cmd.exe',['/c','start','','http://127.0.0.1:4173/'],{windowsHide:true,stdio:'ignore'});}
server.on('error',err=>{if(err.code==='EADDRINUSE'){console.log('4173 포트가 이미 사용 중입니다. 실행 중인 안전의 달인 미리보기를 확인해 주세요.');if(process.argv.includes('--open'))openPreview();}else console.error(err.message);});
server.listen(4173,'127.0.0.1',()=>{console.log('Local: http://127.0.0.1:4173/');if(process.argv.includes('--open'))openPreview();});
