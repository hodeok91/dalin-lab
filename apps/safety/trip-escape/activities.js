/* 장소별 활동 편성. 모든 장소에 같은 절차를 강제하지 않습니다. */
(function(root){
'use strict';
const a=(id,title,goal,icon='play',kind=id)=>({id,title,goal,icon,kind});
const plans={
 bus:[a('find','출발 전 안전장치 찾기','그림 속 안전벨트·소화기·비상망치를 직접 찾아요.','search'),a('choice','버스가 멈추면 어떻게 할까요?','이동·승하차 상황에서 안전한 행동을 골라요.','select'),a('quiz','버스 약속 다시 확인','안전벨트와 승하차 약속을 확인해요.','review')],
 sports:[a('jump','형아맨의 안전 리듬 점프','점프·기다림·멈춤 박자를 지키고 쉬고 싶다고 표현해요.'),a('prep','놀이 전 준비 카드','소지품·이용 안내·차례를 준비해요.','goal'),a('choice','넘어졌어요 · 어지러워요','놀이를 멈추고 도움을 요청해요.','help'),a('memory','같은 안전 그림 찾기','기다림·멈춤·휴식 그림 세 쌍을 찾아요.','picture')],
 cinema:[a('find','영화 시작 전 표지 찾기','비상구와 이동 통로, 도움을 요청할 선생님을 찾아요.','search'),a('path','어두운 통로 천천히 걷기','다음 지점을 골라 출구 쪽으로 이동해요.','start'),a('choice','소리가 너무 커요','불편함을 알리고 함께 쉬는 상황을 연습해요.','help'),a('memory','안전 그림 같은 짝 찾기','출구·도움·천천히 그림을 기억해요.','picture')],
 museum:[a('find','전시실 속 약속 찾기','관람선·출구 표지·선생님을 그림에서 찾아요.','search'),a('matching','이럴 땐 이렇게! 짝맞추기','전시 관람·이동·휴식 상황을 안전 행동과 연결해요.','select'),a('choice','전시물을 만져도 될까요?','전시물 이용 안내와 도움 요청을 살펴봐요.','teacher'),a('quiz','관람 약속 그림 O·X','관람선과 함께 이동하기를 다시 확인해요.','review')],
 experience:[a('prep','체험 준비물과 행동 모으기','안내·도구·재료를 확인하는 카드를 골라요.','goal'),a('matching','도구 사용 도움 짝맞추기','모르는 방법·불편함을 도움 표현과 연결해요.','select'),a('choice','뜨거운 도구가 보여요','사용하기 전에 멈추고 물어보는 연습을 해요.','help')],
 'theme-park':[a('find','놀이공원 안전 지점 찾기','줄·안전장치·울타리·이동 길을 살펴봐요.','search'),a('matching','떨어진 모자, 어떻게 할까요?','울타리와 탑승 상황을 안전 행동과 연결해요.','select'),a('choice','멈출 때까지 기다려요','탑승·하차와 직원에게 도움 요청을 연습해요.','teacher')],
 park:[a('dodge','공원 안전 피하기 기록 도전','위에서 내려오는 위험 그림을 좌우로 피하고 생존 기록을 겨뤄요.'),a('find','호수공원 안전 지점 찾기','물가·난간·산책로·쉬는 곳을 살펴봐요.','search'),a('choice','물에 빠짐 · 뱀과 벌','물에 들어가지 않고 어른에게 알리는 상황을 연습해요.','help'),a('path','약속 장소까지 안전한 길','정해진 산책로로 함께 이동해요.','start')],
 garden:[a('find','관찰로와 쉬는 곳 찾기','식물·곤충과 거리를 두고 눈으로 관찰해요.','search'),a('path','온실 산책로 완성하기','정해진 길로 관찰하고 일행과 만나요.','start'),a('choice','열매와 벌을 발견했어요','먹거나 만지지 않고 도움을 요청해요.','help')],
 heritage:[a('path','궁궐 관람길 찾기','문턱·계단에서는 내게 맞는 길과 도움을 확인해요.','start'),a('find','관람 구역의 숨은 표식','줄·돌계단·쉼터를 그림에서 찾아요.','search'),a('choice','높은 문턱, 어떻게 할까요?','무리하지 않고 다른 경로와 도움을 요청해요.','help')],
 lodging:[a('find','우리 방 안전 점검','침대·창문·콘센트·소지품 위치를 찾아요.','search'),a('difference','정리 전후 다른 그림 찾기','안전하게 정리된 곳이 어디인지 찾아요.','picture'),a('matching','숙소에서 도움이 필요해요','밤의 건강·화장실·통로 정리 상황을 연결해요.','select'),a('choice','누군가 방문을 두드려요','담당 선생님에게 확인하는 연습을 해요.','help')],
 rest:[a('find','휴게소에서 살펴볼 곳','뜨거운 음식·화장실 이동·차량 통로를 찾아요.','search'),a('choice','일행과 떨어졌어요','혼자 주차장으로 가지 않고 도움을 요청해요.','help')],
 night:[a('prep','잠들기 전 방 정리','통로·연락 방법·화장실 경로를 확인해요.','goal'),a('choice','밤에도 말해도 괜찮아요','아픔·화장실·도움 요청을 연습해요.','help')],
 escape:[a('torch','손전등으로 안전장치 찾기','불이 나기 전에 복도의 소화기·경보기·유도등 위치를 알아봐요.','search'),a('evac-order','대피 행동 순서 놓기','안전 경로가 확인된 상황에서 알림·이동·집결을 연습해요.','select'),a('call-order','119 구조 요청 연습','실제 전화 없이 연결·내용 확인·안내 기다리기를 연습해요.','help'),a('choice','나갈 수 있을 때 · 어려울 때','이동 지원과 대피할 수 없는 상황을 나누어 생각해요.','teacher')]
};
plans.homecoming=[a('choice','안전한 귀교 마무리','완전히 멈춘 뒤 이동하고 인원을 확인해요.','teacher'),a('quiz','돌아올 때도 안전 약속','귀교 승하차 약속을 다시 확인해요.','review')];
const hit=(id,label,rule,signal,box)=>({id,label,rule,signal,box});
const finds={
 bus:{title:'버스 안전장치 세 가지를 찾아요',targets:[hit('belt','안전벨트','자리에 앉아 안전벨트를 매요. 휠체어 고정장치와 안전벨트는 담당자가 확인해요.','seatbelt',[16,42,25,33]),hit('ext','소화기','소화기 위치를 미리 알아둬요. 실제 위험에서는 선생님·기사님의 안내를 따라요.','fire',[82,16,8,19]),hit('hammer','비상망치','비상망치 위치를 알아둬요. 평소에는 꺼내 장난치지 않고 위험하면 어른에게 알려요.','teacher',[75,17,6,16])],egg:{label:'창밖의 나무',box:[1,3,10,25]}},
 cinema:{title:'출구와 안전하게 이동할 곳을 찾아요',targets:[hit('exit','비상구 표지','영화 시작 전 출구·비상구를 선생님과 확인해요.','exit',[77,3,15,15]),hit('aisle','이동 통로','어두운 통로는 천천히, 도움이 필요하면 요청해요.','slow',[64,55,26,22]),hit('teacher','함께 갈 선생님','소리·화면이 불편하면 알려요. 혼자 나가지 않고 함께 쉬어요.','help',[32,21,25,73])]},
 museum:{title:'빨간 관람 줄·초록색 출구 표지·선생님을 찾아요',targets:[hit('line','빨간 관람 줄','빨간 줄을 넘지 않고 전시물을 봐요. 만져도 되는 체험물인지 안내를 확인해요.','stop',[40,55,55,20]),hit('exit','출구 표지','들어가기 전에 출구·비상구를 함께 확인해요.','exit',[86,6,12,12]),hit('teacher','선생님','다른 전시실은 선생님께 알리고 함께 이동해요.','together',[25,15,25,74])],egg:{label:'왼쪽 전시장의 투구',box:[0,23,11,27]}},
 'theme-park':{title:'놀이공원의 안전 지점 네 곳을 찾아요',targets:[hit('queue','차례 기다리는 길','줄을 서고 친구를 밀거나 앞지르지 않아요.','wait',[3,53,14,23]),hit('ride','놀이기구 안전장치','이용 조건과 안전장치를 직원과 확인하고 완전히 멈춘 뒤 내려요.','sit',[61,28,34,20]),hit('fence','울타리와 떨어진 모자','물건이 떨어져도 울타리를 넘지 않고 직원에게 알려요.','help',[78,51,12,19]),hit('walk','이동하는 길','앞을 보며 천천히 걸어요.','slow',[41,85,34,13])],egg:{label:'회전목마의 깃발',box:[47,15,10,13]}},
 park:{title:'호수공원에서 안전한 산책 약속을 찾아요',targets:[hit('water','물가와 난간','난간을 넘거나 물가로 내려가지 않아요. 물에 빠진 사람을 봐도 직접 들어가지 말고 어른에게 즉시 알려요.','stop',[78,43,21,25]),hit('path','산책로','풀숲을 피하고 정해진 길로 함께 가요.','together',[34,88,47,11]),hit('rest','그늘 쉼터','덥거나 힘들면 알려요. 안전한 곳에서 쉬고 물을 마셔요.','rest',[0,45,26,31])],egg:{label:'쉼터의 물병',box:[12,54,5,13]}},
 lodging:{title:'우리 방에서 점검할 네 곳을 찾아요',targets:[hit('bed','침대','침대에서 뛰지 않아요. 침대는 쉬는 곳이에요.','rest',[0,70,25,30]),hit('window','창문','창문에 기대거나 몸을 내밀지 않아요.','stop',[7,2,27,38]),hit('plug','콘센트','콘센트에 물건을 넣지 않아요. 충전기와 뜨거운 물은 선생님과 확인해요.','teacher',[15,53,5,10]),hit('bag','가방 정리','가방·신발이 이동 통로를 막지 않도록 정해진 곳에 놓아요.','bag',[66,40,10,16])]},
 rest:{title:'휴게소에서 함께 확인할 곳을 찾아요',targets:[hit('food','뜨거운 음식','뜨거운 음식은 정해진 자리에서 앉아서 먹어요.','sit',[51,72,28,16]),hit('toilet','화장실 방향','선생님께 알리고 학교의 동행 약속을 지켜요.','together',[84,15,10,8]),hit('traffic','버스와 차량','주차장을 혼자 건너지 않고 일행과 함께 이동해요.','slow',[34,19,22,10])]},
 garden:{title:'식물원에서 관찰할 곳과 이동할 곳을 찾아요',targets:[hit('fruit','모르는 열매','모르는 열매는 먹거나 만지지 않고 눈으로 관찰해요.','stop',[77,30,13,15]),hit('wet','젖은 바닥','젖은 바닥은 피하고 정해진 관찰로에서 천천히 이동해요.','slow',[0,62,10,23]),hit('path','정해진 관찰로','관찰로를 벗어나지 않고 일행과 함께 가요.','together',[27,85,43,14])]},
 heritage:{title:'궁궐 관람 구역을 살펴봐요',targets:[hit('boundary','출입 제한 줄','줄을 넘거나 건물 위로 올라가지 않아요.','stop',[72,51,25,18]),hit('steps','돌계단','높은 문턱·돌계단은 혼자 무리하지 않고 도움이나 다른 길을 확인해요.','help',[61,41,14,13]),hit('path','관람하는 길','정해진 길에서 함께 이동하고 힘들면 쉬고 싶다고 알려요.','rest',[45,80,40,15])],egg:{label:'궁궐 지붕 끝 장식',box:[89,0,10,15]}}
};
/* 원본의 위험 행동 찾기는 별도 활동 원화의 실제 위치와 함께 복원합니다. */
finds.bus={title:'출발 전, 잘못된 행동과 안전장치를 찾아요',instruction:'위험한 행동 1곳과 안전장치 2곳을 한 장면에서 찾아요.',image:'media/game/bus-find.webp',targets:[
 hit('belt','일어나 있는 친구와 풀린 벨트','출발 전에 자리에 앉아 안전벨트를 매요. 차가 움직일 때는 앉아 있어요. 휠체어 고정장치와 안전벨트는 담당자가 확인해요.','seatbelt',[4,33,32,64]),
 hit('ext','소화기','버스 안 소화기 위치를 미리 알아둬요. 실제 위험에서는 선생님·기사님의 안내를 따라요.','fire',[81,17,9,21]),
 hit('hammer','비상망치','비상망치 위치를 미리 알아둬요. 평소에는 꺼내 장난치지 않고 비상 시에는 담당자의 안내를 따라요.','teacher',[14,12,8,20])]};
finds['theme-park']={title:'안전하게 바꿀 행동 네 곳을 찾아요',image:'media/game/theme-park-find.webp',targets:[
 hit('queue','줄에서 친구 밀기','줄에서는 친구를 밀거나 앞지르지 않고 차례를 기다려요.','wait',[5,27,25,40]),
 hit('ride','놀이기구에서 일어나기','직원이 안내하기 전에 일어나지 않아요. 이용 조건과 안전장치를 확인하고 안내에 따라 타고 내려요.','sit',[44,12,20,29]),
 hit('fence','울타리 너머로 손 뻗기','물건이 떨어져도 울타리를 넘거나 손을 뻗지 않고 직원에게 알려요.','help',[71,23,27,33]),
 hit('walk','사람들 사이에서 뛰기','이동하는 길에서는 앞을 보고 천천히 걸어요.','slow',[64,58,23,40])],egg:{label:'뒤쪽 관람차',box:[80,1,15,24]}};
finds.rest={title:'휴게소에서 함께 고칠 상황 세 곳을 찾아요',image:'media/game/rest-find.webp',targets:[
 hit('food','뜨거운 음식 들고 뛰기','뜨거운 음식은 정해진 자리에서 앉아서 먹어요. 옮기기 어렵다면 도움을 요청해요.','sit',[3,34,24,44]),
 hit('group','혼자 일행에서 멀어지기','화장실·매점으로 갈 때 선생님께 알리고 학교의 동행 약속을 지켜요.','together',[83,23,11,30]),
 hit('floor','젖은 바닥으로 걷기','미끄럼 주의 표지와 물기를 살펴요. 젖은 곳은 피하고 천천히 이동해요.','slow',[63,54,36,43])]};
/* 찾을 대상은 사물 이름 대신 그림에 보이는 행동·위험 상태로 명시합니다. */
const behavior=(id,label,task,kind,rule,signal,box)=>({...hit(id,label,rule,signal,box),task,kind});
finds.park={title:'공원에서 위험한 행동과 안전한 행동을 찾아요',image:'media/game/park-find-v25.webp',targets:[
 behavior('water','난간에 발을 올린 친구','난간을 넘으려고 발을 올린 친구를 눌러요.','danger','난간에 올라가거나 넘지 않아요. 물에 빠진 사람을 봐도 들어가지 않고 어른에게 즉시 알려요.','stop',[77,38,17,40]),
 behavior('path','선생님과 걷는 형아맨','산책로에서 선생님과 함께 걷는 형아맨을 눌러요.','safe','물가·풀숲에 들어가지 않고 정해진 산책로에서 함께 걸어요.','together',[29,25,43,67]),
 behavior('rest','그늘에서 물 마시는 친구','그늘의 벤치에 앉아 물을 마시는 친구를 눌러요.','safe','덥거나 힘들면 알려요. 그늘에서 쉬고 물을 마셔요.','rest',[4,40,22,43])]};
finds.cinema={title:'영화관에서 위험한 행동과 안전한 행동·표지를 찾아요',image:'media/game/cinema-find-v25.webp',targets:[
 behavior('aisle','계단에서 뛰는 친구','계단에서 뛰어 내려오는 친구를 눌러요.','danger','어두운 통로와 계단에서는 뛰지 않고 천천히 이동해요. 필요하면 도움을 요청해요.','slow',[76,28,18,41]),
 behavior('teacher','선생님과 걷는 형아맨','통로에서 선생님과 함께 걷는 형아맨을 눌러요.','safe','혼자 나가지 않고 선생님께 알린 뒤 함께 이동해요.','together',[11,18,49,78]),
 behavior('exit','문 위 초록색 비상구 표지','문 위에서 사람이 나가는 그림이 있는 초록색 표지를 눌러요.','device','영화가 시작하기 전에 출구와 비상구 위치를 함께 확인해요.','exit',[77,4,15,14])]};
finds.museum={title:'박물관에서 위험한 행동과 안전한 행동·표지를 찾아요',image:'media/game/museum-find-v25.webp',targets:[
 behavior('line','빨간 줄을 넘는 친구','전시물 앞 빨간 줄을 넘으려는 친구를 눌러요.','danger','관람 줄을 넘지 않아요. 만져도 되는 체험물인지 안내를 먼저 확인해요.','stop',[72,30,26,61]),
 behavior('teacher','선생님과 관람하는 형아맨','빨간 줄 밖에서 선생님과 전시물을 보는 형아맨을 눌러요.','safe','정해진 관람 구역에서 선생님과 함께 보고 이동해요.','together',[10,14,36,75]),
 behavior('exit','오른쪽 위 비상구 표지','오른쪽 위 초록색 비상구 표지를 눌러요.','device','처음 들어갈 때 출구와 비상구 위치를 함께 확인해요.','exit',[88,8,8,9])]};
finds.garden={title:'식물원에서 위험한 행동·장소와 안전한 행동을 찾아요',image:'media/game/garden-find-v25.webp',targets:[
 behavior('fruit','열매에 손을 뻗는 친구','울타리 너머 빨간 열매에 손을 뻗는 친구를 눌러요.','danger','모르는 열매나 식물은 따거나 먹지 않고 눈으로 관찰해요.','stop',[58,34,27,56]),
 behavior('wet','바닥에 고인 물','왼쪽 아래 길바닥에 고인 물을 눌러요.','danger','젖은 바닥을 피하고 천천히 이동해요. 물기는 선생님께 알려요.','slow',[0,77,15,16]),
 behavior('path','관찰로에 있는 형아맨','울타리 밖 관찰로에서 선생님과 보는 형아맨을 눌러요.','safe','정해진 관찰로에서 식물을 보고 일행과 함께 이동해요.','together',[19,12,33,70])]};
finds.heritage={title:'궁궐에서 위험한 행동과 안전한 행동을 찾아요',image:'media/game/heritage-find-v25.webp',targets:[
 behavior('boundary','관람 제한 줄을 넘는 친구','오른쪽에서 관람 제한 줄을 넘는 친구를 눌러요.','danger','출입 제한 줄을 넘지 않고 관람 구역 안에서 이동해요.','stop',[70,44,22,41]),
 behavior('steps','돌계단에서 뛰는 친구','돌계단에서 뛰어 내려오는 친구를 눌러요.','danger','계단에서는 뛰지 않아요. 도움이 필요하면 선생님께 알려요.','help',[59,28,10,22]),
 behavior('path','관람로에서 함께 걷는 형아맨','관람로에서 선생님과 걷는 형아맨을 눌러요.','safe','정해진 관람로에서 함께 걷고 힘들면 쉬고 싶다고 알려요.','together',[14,18,40,64])]};
finds.lodging={title:'숙소에서 위험한 행동과 안전한 정리 행동을 찾아요',image:'media/game/lodging-find-v25.webp',targets:[
 behavior('bed','침대에서 뛰는 친구','왼쪽 침대에서 뛰는 친구를 눌러요.','danger','침대는 쉬는 곳이에요. 침대 위에서 뛰거나 장난치지 않아요.','rest',[6,38,21,46]),
 behavior('window','창문에 몸을 내미는 친구','열린 창문에 몸을 내민 친구를 눌러요.','danger','창문에 기대거나 몸을 밖으로 내밀지 않아요.','stop',[11,10,19,28]),
 behavior('plug','콘센트에 열쇠를 대는 친구','오른쪽 아래에서 콘센트에 열쇠를 대는 친구를 눌러요.','danger','콘센트 구멍에 물건을 넣지 않고 충전기는 선생님과 확인해요.','teacher',[73,54,26,34]),
 behavior('bag','가방을 선반에 넣는 형아맨','파란 가방을 선반에 넣는 형아맨을 눌러요.','safe','가방과 신발을 정해진 곳에 정리해서 통로를 비워요.','bag',[49,23,22,59])]};
finds.bus.targets[0].kind='danger';finds.bus.targets[0].task='안전벨트를 매지 않고 서 있는 친구를 눌러요.';
finds.bus.targets[1].kind='device';finds.bus.targets[1].task='오른쪽 벽에 걸린 빨간 소화기를 눌러요.';
finds.bus.targets[2].kind='device';finds.bus.targets[2].task='왼쪽 창문 위 빨간 비상망치를 눌러요.';
finds.bus.targets.push(behavior('safe','벨트를 맨 형아맨','자리에 앉아 안전벨트를 맨 형아맨을 눌러요.','safe','출발 전에 안전벨트를 매고 차가 완전히 멈출 때까지 앉아 있어요.','seatbelt',[40,29,24,66]));
finds['theme-park'].targets[0].box=[5,27,23,40];
finds['theme-park'].targets.push(behavior('safe','선생님과 함께 있는 형아맨','선생님 곁에서 안내를 듣는 형아맨을 눌러요.','safe','일행과 함께 이동하고 직원·선생님의 안내를 확인해요.','together',[29,47,31,50]));
finds.rest.targets.push(behavior('safe','선생님과 함께 있는 형아맨','선생님 곁에 서 있는 형아맨을 눌러요.','safe','화장실이나 매점에 갈 때는 알리고 학교의 동행 약속을 지켜요.','together',[28,33,32,64]));
for(const id of ['theme-park','rest'])for(const t of finds[id].targets){t.kind??='danger';t.task??=t.label+' 행동을 하는 친구를 눌러요.';}
finds['theme-park'].targets[0].task='줄에서 앞 친구를 미는 친구를 눌러요.';
finds['theme-park'].targets[2].task='울타리 너머 모자를 잡으려고 손을 뻗는 친구를 눌러요.';
finds['theme-park'].targets[3].task='사람들 사이에서 뛰는 친구를 눌러요.';
finds.rest.targets[0].task='뜨거운 음식이 담긴 쟁반을 들고 뛰는 친구를 눌러요.';
finds.rest.targets[1].task='혼자 출구 쪽으로 멀어지는 친구를 눌러요.';
finds['theme-park'].targets[1].task='놀이기구 안에서 자리에서 일어나려는 친구를 눌러요.';
finds.rest.targets[2].task='물기가 고인 바닥으로 걸어가는 친구를 눌러요.';
for(const f of Object.values(finds)){f.title=f.title.replace('잘못된','위험한');f.instruction=f.targets.map(t=>t.task).join(' ');}
const worlds={cinema:{title:'형아맨의 영화관 탐험',activities:['find','path','choice']},sports:{title:'형아맨의 스포츠 시설 탐험',activities:['prep','jump','choice']},park:{title:'형아맨의 호수공원 탐험',activities:['find','dodge','choice']}};

for(const f of Object.values(finds)){if(!f.instruction)f.instruction=f.targets.map(t=>t.label).join(' · ')+' — '+f.targets.length+'곳을 그림에서 찾아 눌러요.';}
for(const[id,f]of Object.entries(finds)){const entry=plans[id].find(a=>a.kind==='find');if(entry){entry.title=f.title;entry.goal=f.targets.map(t=>t.label).join(' · ')+'을 구분해 찾아요.';}}
const api={plans,finds,worlds};root.SafetyActivities=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
