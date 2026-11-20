import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

// 읽기 전용: 업로드 후보의 크기를 확인하며 commit/push나 파일 수정은 하지 않습니다.
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repo=path.resolve(app,'../../..');
const relative=path.relative(repo,app).replaceAll(path.sep,'/');
const git=(...args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const files=[...new Set(git('ls-files','-z','--cached','--others','--exclude-standard','--',relative).split('\0').filter(Boolean))]
  .map(name=>({name,file:path.join(repo,name)})).filter(f=>fs.existsSync(f.file))
  .map(f=>({path:f.name,bytes:fs.statSync(f.file).size}));
const MiB=1024*1024;
const report={
  repository:git('remote','get-url','origin'),branch:git('branch','--show-current'),
  files:files.length,totalBytes:files.reduce((n,f)=>n+f.bytes,0),
  browserBatchLimit:100,browserFileLimitMiB:25,gitFileLimitMiB:100,
  browserTooLarge:files.filter(f=>f.bytes>25*MiB),
  gitTooLarge:files.filter(f=>f.bytes>100*MiB),
  largest:files.toSorted((a,b)=>b.bytes-a.bytes).slice(0,5)
};
console.log(JSON.stringify(report,null,2));
if(report.gitTooLarge.length)process.exitCode=1;
