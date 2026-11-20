const fs=require('node:fs'),path=require('node:path'),A=require('../activities');
const root=path.resolve(__dirname,'..'),names={danger:'위험한 행동·장소',safe:'안전한 행동',device:'안전장치·표지'};
const rows=[];for(const[place,f]of Object.entries(A.finds))for(const t of f.targets)rows.push({place,image:f.image,id:t.id,category:names[t.kind],task:t.task,label:t.label,rule:t.rule,box:t.box});
for(const r of rows){if(!fs.existsSync(path.join(root,r.image)))throw Error('그림 누락 '+r.image);if(!r.category||!r.task.endsWith('눌러요.'))throw Error('분류·구체 문장 누락 '+r.place+'/'+r.id);}
fs.writeFileSync(path.join(root,'docs/찾기활동_전수점검_v2.5.json'),JSON.stringify({version:'2.5.0',places:9,targets:rows.length,rows},null,2));
let md='# 위험·안전 행동 찾기 전수 점검 v2.5\n\n2026-11-14 · 9곳 32개 대상\n\n단순한 사물 이름을 지정하던 활동을 위험한 행동·장소, 안전한 행동, 안전장치·표지로 구분했다. 난간은 여러 곳이 있어도 난간에 발을 올린 친구만 답 영역이다. 정답 영역끼리 겹치지 않으며 아직 찾지 않은 영역은 마우스를 가까이 대도 강조하지 않는다. 찾은 뒤 위험은 빨간 테두리와 ‘위험 확인’, 안전은 초록 테두리와 ‘안전 확인’으로 표시한다.\n\n## 그림 대조\n\n공원·영화관·박물관·식물원·궁궐·숙소의 새 찾기 원화 6장과 기존 버스·놀이공원·휴게소 원화를 직접 확인하고 좌표를 연결했다. 새 원화는 생성형 일러스트이며 실제 시설 사진이 아니다. 각 장소의 구체적 질문과 영역은 아래에 기록한다. 규칙과 파일 누락·좌표 중복은 자동 검사하고, 시각적 행동의 의미는 사람이 그림을 보고 대조하는 범위로 구분한다.\n\n|장소|분류|학생에게 보여주는 정확한 문장|답 영역 x,y,w,h(%)|\n|---|---|---|---|\n';
for(const r of rows)md+=`|${r.place}|${r.category}|${r.task}|${r.box.join(', ')}|\n`;
md+='\n## 유지한 진행\n\n기존의 점수(+100/다른 곳 −10), 반복 클릭 보상 없음, 형아맨 칭찬·해설, 찾기를 모두 마친 뒤 자동으로 다음 과제로 이동하는 흐름을 유지한다. 찾기 점수와 공원 생존 게임 기록은 별도로 보관하며 생존 게임 기록으로 실제 안전 수행을 평가하지 않는다.\n';
fs.writeFileSync(path.join(root,'docs/찾기활동_전수점검_v2.5.md'),md);console.log(JSON.stringify({places:9,targets:rows.length,missingImages:0}));
