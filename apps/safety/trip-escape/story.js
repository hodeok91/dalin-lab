/* 이야기를 따라 단서를 모으는 스테이지. 미니게임은 이야기 안의 과제입니다. */
(function(root){
'use strict';
const task=(kind,title,story,clue,item)=>({kind,title,story,clue,item,id:kind+(item?'-'+item:'')});
const q=(item,title,story,clue)=>task('choice',title,story,clue,item);
const chapters={
 bus:{title:'출발의 문 · 버스 안전 점검',intro:'버스가 출발을 기다리고 있어요. 형아맨과 안전장치를 찾고, 이동할 때의 약속을 해결하면 출발의 문이 열려요.',missions:[
  task('find','버스에서 위험한 행동과 안전한 준비 찾기','서 있는 친구와 벨트를 매고 앉은 형아맨을 찾아요. 소화기와 비상망치 위치도 확인해요.','출발 전 안전 점검'),
  q('stand','달리는 버스 안의 부탁','안전 점검을 마치고 출발했어요. 친구에게 가고 싶을 때 어떻게 할까요?','앉아서 이동하기'),
  q('cross','도착! 내린 뒤의 갈림길','목적지에 도착했어요. 버스에서 내린 다음에도 안전한 길을 찾아야 해요.','함께 길 건너기'),
  task('quiz','출발의 문 암호 확인','찾은 단서를 떠올려 안전 약속을 확인해요. 모두 확인하면 다음 장소가 열려요.','버스 안전 열쇠')
 ]},
 sports:{title:'점핑파크 · 내 차례의 문',intro:'신나는 놀이 공간에 도착했어요. 준비·차례·내 몸의 신호, 세 가지 약속을 기억하며 미션을 해결해요.',missions:[
  task('prep','놀이 준비 사물함','가방과 긴 끈을 정리하고 이용 안내를 확인해요. 한 장면에서 안전 행동 세 곳과 위험 행동 두 곳을 모두 찾아요.','놀이 준비'),
  task('jump','안전 리듬 점프','노래가 끝날 때까지 점프 노트는 기준선에서 누르고 멈춰요 노트는 꼬리 끝까지 누른 채 유지해요. 틀려도 다음 노트에서 다시 해봐요.','차례와 휴식'),
  q('injury','친구가 넘어졌어요','놀이 중 친구가 넘어졌어요. 안전하게 도움을 부르는 행동을 찾아요.','멈추고 도움 요청'),
  q('tired','내 몸의 신호','이번에는 내가 어지럽고 힘들어요. 마지막 단서는 내 몸을 지키는 표현이에요.','불편함 알리기')
 ]},
 cinema:{title:'영화관 · 어두운 통로의 문',intro:'영화 시작 전이에요. 출구를 찾고 통로를 살펴본 뒤, 불편할 때와 대피 안내가 나올 때의 미션을 해결해요.',missions:[
  task('find','상영 전 안전 행동 찾기','계단에서 뛰는 친구와 선생님과 걷는 형아맨을 찾아요. 문 위 비상구 표지도 확인해요.','출구 위치'),
  task('memory','안전 그림 기억하기','출구·도움·천천히 그림의 같은 짝을 찾아 상영 전 약속을 기억해요.','안전 그림 기억'),
  task('path','어두운 통로 건너기','통로가 어두워졌어요. 천천히 다음 안전 지점을 골라 선생님과 출구 쪽에 도착해요.','천천히 이동'),
  q('noise','소리가 너무 커요','영화를 보다가 소리가 힘들어졌어요. 혼자 나가지 않고 내 마음을 알려요.','함께 쉬기'),
  q('alarm','상영관의 안내 방송','이번 장면은 대피 연습이에요. 경보와 안내가 나오면 어떤 행동을 할까요?','안내 따라 대피')
 ]},
 museum:{title:'박물관 · 전시실의 숨은 약속',intro:'새 전시실로 가는 미션문이 있어요. 관람선과 이용 안내, 일행과 함께하는 방법을 차례로 알아봐요.',missions:[
  task('find','전시실 속 행동 찾기','빨간 줄을 넘는 친구와 줄 밖에서 선생님과 관람하는 형아맨을 찾아요. 초록색 출구 표지도 확인해요.','관람 구역'),
  q('touch','만져도 되는 전시물일까요?','신기한 전시물이 눈앞에 있어요. 안내를 확인하는 행동이 다음 단서예요.','이용 안내 확인'),
  task('matching','안전 행동 짝의 상자','전시 관람·이동·불편함 상황을 알맞은 행동과 연결하면 단서 상자가 열려요.','상황에 맞는 도움'),
  q('lost','친구들이 보이지 않아요','전시를 보다가 일행이 보이지 않아요. 혼자 돌아다니지 않는 방법을 찾아요.','멈추고 도움 요청'),
  q('voice','이야기하고 싶어요','친구에게 말하고 싶거나 도움이 필요할 수 있어요. 안내와 내 표현을 함께 생각해요.','서로 배려하기'),
  task('quiz','다음 전시실의 암호','촬영·음식·이동 안내를 확인해 마지막 미션문을 열어요.','관람 약속 열쇠')
 ]},
 experience:{title:'체험관 · 도구 상자의 문',intro:'새로운 체험이 기다려요. 안내를 듣고, 도구와 필요한 도움을 확인해야 체험 미션을 마칠 수 있어요.',missions:[
  task('prep','체험실의 안전·위험 행동 찾기','시작 안내·도구·재료를 살펴 안전 행동 세 곳과 위험 행동 두 곳을 찾아요.','시작 전 확인'),
  q('tool','뜨거운 도구의 비밀','도구 상자를 열자 뜨거운 도구가 보여요. 바로 만지기 전에 할 일을 찾아요.','도구 사용 도움'),
  task('matching','도움 표현 연결하기','방법을 모르거나 몸이 불편할 때 쓸 표현을 상황과 연결해요.','도움을 말하는 방법'),
  q('unknown','다음 방법을 모르겠어요','설명을 다시 확인하고 싶은 순간이에요. 마지막 단서는 다시 물어보는 용기예요.','다시 보여 주세요')
 ]},
 'theme-park':{title:'놀이공원 · 네 가지 안전 단서',intro:'놀이기구 앞에 도착했어요. 그림 속 행동을 살피고 이용 안내와 안전장치를 확인해 미션문을 열어요.',missions:[
  task('find','안전하게 바꿀 행동 찾기','친구 밀기·자리에서 일어나기·울타리 너머 손 뻗기·뛰기의 위험한 행동과 선생님 곁에 있는 형아맨을 찾아요.','놀이공원 점검'),
  q('item','울타리 안으로 떨어진 모자','모자가 울타리 안쪽으로 떨어졌어요. 안전한 곳에서 해결할 방법이 있어요.','직원에게 알리기'),
  task('matching','탑승 약속의 짝','물건·탑승·이용 조건 상황과 안전 행동을 맞춰요.','탑승 전 확인'),
  q('ride','아직 움직이고 있어요','놀이가 끝나가요. 안전하게 내릴 수 있는 때를 생각해요.','멈출 때까지 앉기'),
  q('lost','일행을 찾는 마지막 단서','주변에 우리 반이 보이지 않아요. 혼자 출구로 가지 않는 방법을 골라요.','안전한 도움 요청')
 ]},
 park:{title:'공원 · 산책길의 안전 단서',intro:'호수와 풀숲이 있는 산책길이에요. 물가·자연·내 몸을 살피며 여러 갈림길의 미션을 해결해요.',missions:[
  task('find','산책길의 위험한 행동과 안전한 행동','난간을 넘으려는 친구를 찾아요. 선생님과 걷는 형아맨, 그늘에서 물 마시는 친구도 찾아요.','산책 안전 지도'),
  q('lake','물가에 떨어진 물건','물건이 호수 가까이에 떨어졌어요. 물가로 내려가지 않고 해결할 방법을 찾아요.','물가에서 떨어지기'),
  task('path','만나는 곳으로 가는 길','정해진 산책로를 따라 안전 지점을 차례로 지나 만나는 곳에 도착해요.','정해진 길'),
  q('grass','풀숲 옆에서 가려워요','풀숲 옆을 지난 뒤 팔이 가려워요. 풀숲에서 떨어져 선생님께 알리는 방법을 골라요.','풀숲 피하기'),
  task('dodge','공원 안전 피하기 기록 도전','앞에 보이는 위험을 피해 빈 산책길로 이동해요. 실제 벌·뱀은 거리를 두고 선생님께 알려요.','안전 거리'),
  q('snake','생태공원에서 만난 뱀과 벌','길옆에 뱀이나 벌이 보여요. 잡거나 건드리지 않는 행동을 찾아요.','건드리지 않고 알리기'),
  q('heat','더워서 어지러워요','산책하다 몸이 힘들어졌어요. 쉬는 것도 안전 미션이에요.','휴식과 도움'),
  q('drowning','호수에 사람이 빠진 것 같아요','마지막은 구조 도움을 요청하는 연습이에요. 직접 물에 들어가지 않는 행동을 골라요.','어른과 119 도움')
 ]},
 garden:{title:'식물원 · 관찰로의 문',intro:'온실과 열매가 있는 관찰로예요. 눈으로 관찰하고 길을 지키며 자연을 안전하게 만나요.',missions:[
  task('find','열매와 바닥의 숨은 단서','빨간 열매를 따려는 친구와 바닥의 물기를 찾아요. 관찰로에서 선생님과 보는 형아맨도 찾아요.','먼저 살펴보기'),
  q('berry','예쁜 열매를 발견했어요','맛을 보고 싶은 열매가 보여요. 모르는 식물을 대하는 행동을 골라요.','먹지 않고 관찰'),
  task('path','관찰 계단 기록 도전','게임 속 계단을 오르기·방향 전환 두 버튼으로 올라요. 실제 계단에서는 서두르지 않고 천천히 걸어요.','관찰로 지키기'),
  q('bee','가까이에 벌이 있어요','벌을 발견했어요. 곤충을 건드리지 않고 거리를 두는 행동을 찾아요.','자연과 거리 두기')
 ]},
 heritage:{title:'궁궐 · 관람길의 문',intro:'궁궐의 오래된 길을 둘러봐요. 관람 구역과 돌계단을 살피고 내게 맞는 경로를 찾는 미션이에요.',missions:[
  task('find','관람 구역의 숨은 표식','관람 제한 줄을 넘는 친구와 계단에서 뛰는 친구를 찾아요. 선생님과 관람로에서 걷는 형아맨도 찾아요.','관람 구역 확인'),
  task('path','안전한 관람길 완성','이용 가능한 길을 확인하고 일행과 함께 목적지로 가요.','함께 관람하기'),
  q('threshold','높은 문턱이 앞을 막아요','혼자 넘기 어려운 문턱을 만났어요. 내게 맞는 도움이나 다른 길을 찾아요.','다른 경로 요청'),
  q('photo','사진 찍고 싶은 곳','멋진 건물이 보여요. 출입 제한을 지키는 장소에서 마지막 단서를 얻어요.','문화유산과 안전')
 ]},
 lodging:{title:'숙소 · 우리 방의 안전 열쇠',intro:'숙소에 도착했어요. 방의 안전 지점을 찾고 통로를 정리한 뒤, 밤에 생길 상황을 해결해요.',missions:[
  task('find','방 안 안전 점검','침대에서 뛰기, 창문에 몸 내밀기, 콘센트에 열쇠 대기의 위험한 행동을 찾아요. 가방을 정리하는 형아맨도 찾아요.','숙소 안전 점검'),
  task('difference','정리 전후 다른 곳 세 가지','두 그림의 가방·침대 위 물건·물기를 비교해 안전하게 바뀐 곳을 찾아요.','통로와 물건 정리'),
  q('door','누군가 문을 두드려요','방문 밖에서 문을 열어 달라고 해요. 담당 선생님께 확인하는 행동을 찾아요.','출입 확인'),
  task('matching','밤의 도움 연결하기','화장실·건강·통로 정리 상황을 도움과 안전 행동에 연결해요.','도움 요청 방법'),
  q('hurt','밤에 몸이 불편해요','잠들기 전 몸이 아파요. 마지막 단서는 참지 않고 알리는 표현이에요.','담당 선생님께 알리기')
 ]},
 night:{title:'밤 미션 · 잠들기 전 세 가지',intro:'불을 끄기 전이에요. 이동할 길과 선생님을 부르는 방법을 준비하고 밤의 상황을 해결해요.',missions:[
  task('prep','남학생 방의 안전·위험 행동 찾기','안전하게 도움을 요청하고 통로를 정리하는 친구 세 명과 침대에서 뛰거나 혼자 나가는 친구 두 명을 찾아요.','밤의 안전 준비'),
  q('toilet','밤에 화장실에 가고 싶어요','어두운 복도로 나가기 전에 학교에서 정한 동행과 지원을 떠올려요.','알리고 함께 이동'),
  q('medicine','친구가 약을 나누어 준대요','친구가 약을 권해요. 나에게 정해진 건강 지원을 확인해요.','약은 담당자와 확인')
 ]},
 escape:{title:'대피 훈련 · 안전한 집결지의 문',intro:'이번 스테이지는 실제 화재가 아닌 대피 연습이에요. 먼저 안전장치 위치를 알아보고, 이동할 수 있을 때와 어려울 때를 나누어 해결해요.',missions:[
  task('torch','손전등으로 복도 살피기','불이 나기 전에 미리 살피는 복도예요. 손전등으로 소화기·경보기·유도등 세 곳을 찾아요.','안전장치 위치'),
  q('alarm','대피 연습 경보가 울려요','경보를 듣는 장면을 연습해요. 주변과 선생님께 알리고 안내를 확인해요.','주변에 알리기'),
  q('clear','안전한 경로가 확인됐어요','선생님이 이동 가능한 경로를 확인했어요. 물건보다 안전한 이동이 먼저예요.','안내 따라 이동'),
  q('mobility','나에게 필요한 이동 도움','같은 길도 학생마다 필요한 도움이 달라요. 나에게 맞는 지원을 알려요.','이동 지원 요청'),
  task('evac-order','대피 행동 순서 열쇠','안전 경로가 확인된 장면에서 알림·이동·집결 순서의 카드를 놓아요.','대피 행동 순서'),
  q('blocked','다른 장면: 복도에 연기가 있어요','이번에는 나갈 수 없는 다른 상황이에요. 연기 속으로 들어가지 않고 도움을 요청해요.','무리하지 않고 구조 요청'),
  task('call-order','119 구조 요청 순서','실제 전화를 걸지 않는 연습이에요. 연결·필요한 내용·안내 기다리기 순서를 놓아요.','구조 요청 순서'),
  q('call','구조대에 알릴 단서','위치·상황·필요한 도움을 골라요. 이 화면에서는 실제 신고가 연결되지 않아요.','위치와 상황 알리기'),
  q('assembly','안전한 집결지에 도착했어요','구조대와 담당자의 도움으로 안전한 집결지에 나왔어요. 함께 인원을 확인하고, 물건을 찾으러 건물에 다시 들어가지 않아요.','집결지에서 기다리기')
 ]},
 rest:{title:'휴게소 · 다시 만나는 문',intro:'이번 숙박형 일정에는 휴게소가 있어요. 식사·화장실·차량 통로와 함께 만나는 약속을 해결해요.',missions:[task('find','휴게소에서 위험한 행동과 안전한 동행','뜨거운 음식을 들고 뛰는 친구, 혼자 멀어지는 친구, 젖은 바닥으로 가는 친구를 찾아요. 선생님 곁의 형아맨도 찾아요.','휴게소 점검'),q('alone','화장실에 가고 싶어요','누구와 어디로 이동할지 알리는 약속을 떠올려요.','동행 약속'),q('lost','버스가 보이지 않아요','혼자 주차장으로 가지 않고 도움을 요청해요.','안전한 곳에서 도움'),q('friend','친구가 몰래 가자고 해요','친구도 혼자 보내지 않고 선생님께 알리는 행동을 찾아요.','함께 알리기')]},
 homecoming:{title:'귀교 · 안전하게 돌아오는 문',intro:'오늘의 현장학습을 마쳤어요. 돌아오는 길과 내린 뒤의 인원 확인까지 해결하면 여행이 끝나요.',missions:[q('stop','학교가 보여도 기다려요','돌아오는 버스에서 학교가 보여요. 안전하게 일어날 수 있는 때를 확인해요.','완전히 멈춘 뒤 이동'),q('count','돌아온 뒤에도 함께해요','도착했어요. 선생님과 인원을 확인하고 다음 안내를 기다려요.','인원 확인과 마무리')]}
};
chapters.lodging.missions.push(...chapters.night.missions.filter(m=>m.kind==='choice'));
/* 게임을 채우기 위한 반복은 빼고, 그 장소에서 필요한 행동을 남깁니다. */
chapters.cinema.missions=chapters.cinema.missions.filter(m=>!['memory','path'].includes(m.kind)&&m.item!=='alarm');
chapters.experience.missions=chapters.experience.missions.filter(m=>m.kind!=='matching');
chapters['theme-park'].missions=chapters['theme-park'].missions.filter(m=>m.kind!=='matching');
chapters.park.missions=chapters.park.missions.filter(m=>m.kind!=='path');
chapters.rest.missions=chapters.rest.missions.filter(m=>m.item!=='friend');
chapters.bus.missions[0].title='잘못된 행동과 안전장치 찾기';
chapters.bus.missions[0].story='출발 전 한 장면을 살펴요. 위험한 행동 1곳과 안전장치인 소화기·비상망치 2곳을 찾아요.';
const incident=(id,title,prompt,options,correct,why,signal,group)=>({...task('choice',title,'이번은 '+title+' 상황을 연습하는 장면이에요.',title,id),incident:group,incidentTitle:title,question:{id,prompt:prompt.endsWith('?')?prompt:prompt+' 어떻게 할까요?',options,correct,why,signal}});
const incidents={
 cinema:[
  incident('cinema-fire','영화관 화재 경보','영화관에 화재경보와 대피 안내가 나와요. 직원이 안전한 출구를 확인했어요. 어떻게 할까요?',['물건을 찾으러 좌석으로 돌아가요.','물건을 두고 선생님·직원의 안내에 따라 확인된 안전한 출구로 이동해요.'],1,'영화관의 안내를 확인하고 함께 이동해요. 일반 엘리베이터는 이용하지 않아요. 이동이 어렵다면 필요한 도움을 즉시 알려요.','exit','fire'),
  incident('cinema-smoke','영화관의 막힌 통로','다른 화재 연습 장면이에요. 나가려는 영화관 통로에 연기가 많아요.',['연기 속으로 혼자 뛰어가요.','멈추고 선생님·직원에게 알려 다른 안전 경로와 필요한 구조 도움을 확인해요.'],1,'연기 속으로 무리하게 들어가지 않아요. 담당자와 사전에 확인한 안전한 대피·대기 방법을 따르고, 위치와 상황을 알려 구조 도움을 요청해요.','help','fire'),
  incident('cinema-quake','영화관 지진 발생','새로운 연습 장면이에요. 영화관에서 앉아 있는데 바닥이 흔들려요.',['출구로 한꺼번에 뛰어요.','가방이나 손 등으로 머리와 몸을 보호하며 흔들림이 멈출 때까지 자리에 있어요.'],1,'극장에서는 흔들림이 계속될 때 출구로 몰려가지 않아요. 머리와 몸을 보호하고, 혼자 보호 자세를 취하기 어렵다면 바로 도움을 알려요.','stop','quake'),
  incident('cinema-quake-exit','흔들림이 멈춘 영화관','영화관의 흔들림이 멈췄어요. 이제 어떻게 할까요?',['선생님·직원의 안내에 따라 서로 밀지 않고 안전한 경로로 대피해요.','주변을 밀치며 혼자 빨리 나가요.'],0,'흔들림이 멈추면 영화관의 안내에 따라 침착하게 대피해요. 군중에 휩쓸리지 않도록 함께 이동하고 필요한 지원을 알려요.','together','quake')
 ],
 sports:[
  incident('sports-fire','스포츠 시설 화재 안내','놀이 중 화재 대피 안내가 나와요. 직원이 안전한 이동 경로를 확인했어요.',['점프를 멈추고 안내에 따라 놀이 구역에서 나와 함께 대피해요.','가방을 챙긴 뒤 다시 점프해요.'],0,'놀이를 멈추고 직원에게 필요한 도움을 알려요. 확인된 안전 경로로 이동하고 물건을 찾으러 돌아가지 않아요.','exit','fire'),
  incident('sports-quake','스포츠 시설의 흔들림','뛰려고 하는데 시설이 흔들려요. 어떻게 할까요?',['계속 높이 뛰어요.','놀이를 멈추고 떨어질 수 있는 기구를 주의하며 몸을 보호하고 직원의 안내를 확인해요.'],1,'흔들릴 때 놀이를 계속하지 않아요. 머리와 몸을 보호하고, 흔들림이 멈추면 확인된 경로로 직원과 함께 이동해요.','stop','quake')
 ],
 museum:[
  incident('museum-fire','전시관 화재 안내','전시실에서 화재 대피 안내가 나와요. 안전한 경로가 확인됐어요.',['전시물 사진을 더 찍고 나가요.','관람을 멈추고 선생님·직원의 안내에 따라 함께 대피해요.'],1,'전시물을 보거나 소지품을 찾느라 지체하지 않아요. 안전한 경로로 이동하고, 이동이 어렵거나 통로에 연기가 있으면 즉시 알려요.','exit','fire'),
  incident('museum-quake','전시실 지진 발생','전시실에서 흔들림이 느껴져요. 유리 진열장과 큰 전시물이 가까이 있어요.',['전시물이 쓰러지지 않게 혼자 붙잡아요.','떨어질 수 있는 물건에 주의하며 머리와 몸을 보호하고 선생님께 알려요.'],1,'전시물이나 진열장을 붙잡으러 가지 않아요. 떨어지는 물건으로부터 몸을 보호하고, 흔들림이 멈추면 직원의 안내에 따라 안전한 경로로 대피해요.','help','quake')
 ],
 experience:[
  incident('experience-fire','체험관 화재 안내','도구를 사용하던 중 화재 대피 안내가 나와요.',['체험을 멈추고 선생님·직원의 안내에 따라 안전하게 이동해요.','작품을 끝내려고 계속 도구를 사용해요.'],0,'작품이나 재료보다 안전이 먼저예요. 체험을 멈추고 필요한 도움을 알린 뒤 확인된 경로로 함께 이동해요.','exit','fire'),
  incident('experience-quake','체험 중 지진 발생','체험관이 흔들려요. 뜨거운 도구와 떨어질 수 있는 재료가 있어요.',['도구를 들고 혼자 뛰어요.','활동을 멈추고 위험한 도구·낙하물에 주의하며 몸을 보호하고 도움을 요청해요.'],1,'뜨겁거나 날카로운 도구를 들고 이동하지 않아요. 머리와 몸을 보호하고, 흔들림이 멈추면 담당자의 안내에 따라 함께 이동해요.','stop','quake')
 ],
 'theme-park':[
  incident('ride-quake','놀이기구에서 지진 안내','놀이기구가 멈추고 지진 안내가 나와요. 어떻게 할까요?',['혼자 안전장치를 풀고 뛰어내려요.','안전장치를 유지하고 위험하거나 불편한 점을 직원에게 알리며 안전한 하차 안내를 따라요.'],1,'직원이 안전하게 내리는 방법을 알려 줄 때까지 안전장치를 유지하고 앉아 있어요. 도움이 필요하면 직원에게 알려요.','help','quake')
 ],
 heritage:[
  incident('heritage-quake','궁궐 관람 중 지진','궁궐을 걷다가 흔들림이 느껴져요. 담장과 지붕 가까이에 있어요.',['머리와 몸을 보호하고 떨어지는 물건·담장에 주의하며 선생님께 알려요.','담장에 바짝 기대어 있어요.'],0,'오래된 담장·지붕·간판 등에서 떨어질 수 있는 물건을 주의해요. 무리해서 혼자 이동하지 말고 필요한 도움을 알려요.','help','quake'),
  incident('heritage-open','궁궐의 안전한 집결 장소','흔들림이 멈췄어요. 선생님이 안전한 이동 경로를 확인했어요.',['건물과 담장에서 떨어진 안전한 넓은 공간으로 함께 이동해요.','건물 안에 물건을 찾으러 혼자 들어가요.'],0,'확인된 경로로 넓고 안전한 공간에 함께 이동해요. 떨어지는 물건과 차량 통행을 피하고 인원을 확인해요.','together','quake')
 ]
};
function plan(id,content,selection){const c=chapters[id];if(!c)throw Error('없는 스테이지: '+id);return {...c,missions:[...c.missions,...(incidents[id]||[])].map(m=>{const natural=id==='park'&&m.item==='drowning'?{incident:'water-rescue',incidentTitle:'호수공원 익수 목격'}:id==='park'&&m.item==='snake'?{incident:'wildlife',incidentTitle:'생태공원의 뱀과 벌'}:id==='garden'&&m.item==='bee'?{incident:'insect',incidentTitle:'식물원에서 만난 벌'}:{};return {...m,...natural,question:m.question||(m.kind==='choice'?(id==='escape'?content.evacuation:content.places[id].choices).find(q=>q.id===m.item):null)};}).filter(m=>!selection||!m.incident||selection[id]===m.incident)};}
function chooseIncidents(route,content,rng=Math.random){const chosen={};for(const id of route){const groups=[...new Set(plan(id,content).missions.map(m=>m.incident).filter(Boolean))];if(groups.length)chosen[id]=groups[Math.min(groups.length-1,Math.floor(rng()*groups.length))];}return chosen;}
function create(config,content,model){const s=model.createSession(config,content);s.incidentChoices=chooseIncidents(s.route,content);s.story=true;s.missionIndex=0;s.missionRecords=[];s.phase='stage-intro';s.review=false;s.score=0;s.scoreEvents=0;s.emergencyUnlocked=config.scope!=='lesson'||!s.route.includes('escape');return s;}
function current(s,content){return plan(s.route[s.index],content,s.incidentChoices).missions[s.missionIndex];}
function complete(s,content,assisted=false){const m=current(s,content);if(!m)return false;const key=s.index+':'+s.missionIndex;if(s.missionRecords.some(r=>r.key===key))return false;s.missionRecords.push({key,module:s.route[s.index],mission:m.id,title:m.title,clue:m.clue,assisted:!!assisted});s.phase='mission-done';return true;}
function advance(s,content,model){const m=current(s,content),key=s.index+':'+s.missionIndex;if(!m||!s.missionRecords.some(r=>r.key===key))return false;if(s.missionIndex+1<plan(s.route[s.index],content,s.incidentChoices).missions.length){s.missionIndex++;s.phase='mission-intro';}else{model.completeModule(s,s.route[s.index]);s.phase='module-done';}return true;}
function interlude(s,content){const id=s.route[s.index],next=s.route[s.index+1];if(!next||next==='escape'||s.review)return null;const key=id+'->'+next;if(s.interludesDone?.includes(key))return null;if(id==='rest')return {key,kind:'choice',question:content.places.rest.choices.find(q=>q.id==='friend')};if(id==='bus')return {key,kind:'choice',question:{id:'arrival-group',prompt:'목적지에 도착했어요. 친구가 먼저 가자고 해요. 어떻게 할까요?',options:['선생님께 알리지 않고 먼저 가요.','정해진 곳에서 함께 인원을 확인하고 안내를 기다려요.'],correct:1,why:'목적지에 도착해도 일행과 함께해요. 선생님의 안내와 학교의 인원 확인 약속을 따라요.',signal:'together'}};if(content.destinations.includes(id)&&id!=='lodging'){const quiz=content.places[id].quizzes[0];if(quiz)return {key,kind:'quiz',question:{...quiz,id:'surprise-'+quiz.id}};}return null;}

chapters.bus.missions[0].story='서 있는 친구의 위험한 행동과 벨트를 매고 앉은 형아맨의 안전한 행동을 찾아요. 소화기와 비상망치도 확인해요.';
chapters.sports.missions.push(task('quiz','점핑파크 안전 약속 확인','위험한 공중제비 그림과 몸이 아플 때의 약속을 다시 확인해요.','안전한 놀이 열쇠'));
chapters.cinema.missions.splice(1,0,task('maze','상영 뒤 출구 통로 미로','상영이 끝나고 불이 켜졌어요. 의자와 벽을 지나가지 않고 빈 통로를 따라 선생님이 있는 출구로 가요.','출구까지 안전 이동'));
chapters.museum.missions.splice(1,0,task('compare','안전하게 달라진 전시실','두 그림에서 관람 줄을 넘는 다리, 전시물로 뻗은 손, 바닥의 음료를 비교해 찾아요.','관람 행동 비교'));
chapters.experience.missions.splice(1,0,task('sort','오늘 사용할 도구','오늘은 나무 블록과 보호 안경을 함께 사용해요. 뜨거운 글루건과 커터 칼 작업은 선생님 담당이에요. 도구를 알맞은 바구니에 놓아요.','도구 담당 확인'));
chapters.heritage.missions.splice(1,0,task('matching','안전 표지의 뜻','출입 제한, 계단 주의, 비상구 표지를 알맞은 행동에 선으로 연결해요.','안전 표지 이해'));
chapters['theme-park'].missions.splice(1,0,task('ride-order','놀이기구 탑승 준비','이용 안내 확인부터 완전히 멈춘 뒤 하차까지, 지금 할 일을 차례대로 골라요.','탑승 순서'));
for(const [id,kind,title,story]of [['playground','whack','공원에서 위험을 발견했어요','젖은 바닥, 풀숲, 물가처럼 가까이 가지 않을 곳을 발견하면 그림을 눌러 선생님께 알려요. 안전하게 쉬고 함께 걷는 그림은 그대로 두어요.'],['eco-park','signal','탐방 안내자의 신호','안내자의 초록색 걷기 신호에는 걷기 버튼을 누르고 빨간색 멈춤 신호에는 손을 떼어요. 일행과 함께 도착해요.'],['farm','wash','동물 체험 뒤 깨끗한 손','동물 체험이 끝났어요. 간식을 먹기 전에 물과 비누로 손을 씻어요. 여섯 부위를 골고루 문지르는 순서를 함께 연습해요.'],['water','dress','물놀이 준비 확인','오늘 이 시설의 준비물은 수영모, 수영복, 구명조끼예요. 준비 칸에 놓고 선생님의 착용 확인을 기다려요.'],['library','voice','관람할 때의 목소리','친구들이 책을 읽거나 공연을 보고 있어요. 작은 목소리를 연습해요. 마이크는 선택이고 그림 버튼으로도 할 수 있어요.']]){const p=root.TripContent?.places[id];chapters[id]={title:(p?.title||id)+' · 안전 미션',intro:story,missions:[task(kind,title,story,title),...(p?.choices||[]).map(c=>q(c.id,c.prompt,c.prompt,'안전한 행동')),task('quiz','안전 약속 확인','이 장소에서 연습한 안전 약속을 확인해요.','안전 열쇠')]};}
const api={chapters,plan,chooseIncidents,create,current,complete,advance,interlude};root.SafetyStory=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
