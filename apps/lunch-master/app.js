(()=>{
"use strict";

const EXTENSIONS=["png","jpg","jpeg","webp","svg"];
const state={
  school:null,
  date:new Date(),
  mealLines:[],
  menus:[],
  customMenus:[],
  choiceGroups:[],
  selectedChoice:null,
  trayMode:"match",
  traySlots:[],
  freeSelected:[],
  writingMode:"whole",
  penColor:"#172033",
  penWidth:6,
  guideType:"cross",
  imageCache:{},
  calendarViewDate:new Date()
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const DAYS=["일","월","화","수","목","금","토"];

const el={
  schoolName:$("#schoolName"),
  dateText:$("#dateText"),
  status:$("#status"),
  mealSummary:$("#mealSummary"),
  calorieBadge:$("#calorieBadge"),
  mealGrid:$("#mealGrid"),
  dynamicTray:$("#dynamicTray"),
  pantry:$("#pantry"),
  pantryCount:$("#pantryCount"),
  trayModeHelp:$("#trayModeHelp"),
  choiceSelector:$("#choiceSelector"),
  completeServingBtn:$("#completeServingBtn"),
  wholeWritingArea:$("#wholeWritingArea"),
  repeatWritingArea:$("#repeatWritingArea"),
  repeatMenuSelect:$("#repeatMenuSelect"),
  repeatLevelSelect:$("#repeatLevelSelect"),
  repeatLayoutSelect:$("#repeatLayoutSelect"),
  repeatBoard:$("#repeatBoard"),
  finishGrid:$("#finishGrid"),
  schoolModal:$("#schoolModal"),
  schoolSearchStatus:$("#schoolSearchStatus"),
  schoolResults:$("#schoolResults"),
  completeModal:$("#completeModal"),
  completeTitle:$("#completeTitle"),
  completeMessage:$("#completeMessage"),
  calendarPopover:$("#calendarPopover"),
  calendarMonthText:$("#calendarMonthText"),
  calendarGrid:$("#calendarGrid")
};

function formatDate(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function formatKoreanDate(date){
  return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일(${DAYS[date.getDay()]})`;
}

function syncDateControls(){
  el.dateText.textContent=formatKoreanDate(state.date);
  state.calendarViewDate=new Date(state.date.getFullYear(),state.date.getMonth(),1);
}

function parseLocalDate(value){
  const match=String(value||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!match)return null;
  const date=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
  return Number.isNaN(date.getTime())?null:date;
}

async function moveToDate(date){
  state.date=date;
  syncDateControls();
  resetDateActivity();
  await loadMeal();
}

function sameDate(a,b){
  return a.getFullYear()===b.getFullYear()&&
    a.getMonth()===b.getMonth()&&
    a.getDate()===b.getDate();
}

function renderCalendar(){
  const view=state.calendarViewDate;
  const year=view.getFullYear();
  const month=view.getMonth();
  el.calendarMonthText.textContent=`${year}년 ${month+1}월`;
  el.calendarGrid.innerHTML="";

  const first=new Date(year,month,1);
  const start=new Date(year,month,1-first.getDay());
  const today=new Date();

  for(let index=0;index<42;index++){
    const date=new Date(start);
    date.setDate(start.getDate()+index);

    const button=document.createElement("button");
    button.type="button";
    button.className="calendar-day";
    button.textContent=date.getDate();

    if(date.getMonth()!==month)button.classList.add("other-month");
    if(sameDate(date,today))button.classList.add("today");
    if(sameDate(date,state.date))button.classList.add("selected");

    button.onclick=async event=>{
      event.stopPropagation();
      el.calendarPopover.classList.add("hidden");
      await moveToDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()));
    };
    el.calendarGrid.append(button);
  }
}

function toggleCalendar(){
  const opening=el.calendarPopover.classList.contains("hidden");
  el.calendarPopover.classList.toggle("hidden",!opening);
  if(opening){
    state.calendarViewDate=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    renderCalendar();
  }
}
function setStatus(message="",type=""){
  el.status.textContent=message;
  el.status.className=type;
}
function normalize(text){
  return String(text||"").replace(/\s+/g,"").trim();
}

function getFoodEmoji(menuName){
  const name=normalize(menuName);

  if(/김치|깍두기|겉절이|석박지|총각무|열무/.test(name))return"🥬";
  if(/밥|덮밥|볶음밥|비빔밥|주먹밥/.test(name))return"🍚";
  if(/국|탕|찌개|전골|장국|스프/.test(name))return"🥣";
  if(/면|국수|우동|라면|쫄면|파스타|스파게티/.test(name))return"🍜";
  if(/빵|토스트|샌드위치|버거/.test(name))return"🍞";
  if(/닭|치킨/.test(name))return"🍗";
  if(/생선|고등어|삼치|갈치|연어|명태|조기/.test(name))return"🐟";
  if(/계란|달걀|오믈렛/.test(name))return"🍳";
  if(/고기|불고기|갈비|함박|스테이크|제육|돼지|소고기|쇠고기/.test(name))return"🍖";
  if(/샐러드|나물|무침/.test(name))return"🥗";
  if(/튀김|돈가스|돈까스|강정/.test(name))return"🍤";
  if(/우유|요구르트|요거트/.test(name))return"🥛";
  if(/주스|쥬스|음료|식혜/.test(name))return"🧃";
  if(/사과/.test(name))return"🍎";
  if(/수박/.test(name))return"🍉";
  if(/과일/.test(name))return"🍎";
  if(/떡/.test(name))return"🍡";
  if(/케이크|쿠키|푸딩|젤리|후식/.test(name))return"🍰";

  return"🍽️";
}

function isKimchiMenu(menuName){
  return /김치|깍두기|겉절이|석박지|총각무|열무/.test(normalize(menuName));
}

function isKnownKimchiMenu(menuName){
  const name=normalize(menuName);
  return [
    "배추김치","포기김치","김장김치",
    "깍두기"
  ].some(keyword=>name.includes(keyword));
}
function allMenus(){
  const map=new Map();
  [...state.menus,...state.customMenus].forEach(menu=>{
    if(menu?.name&&!map.has(menu.name))map.set(menu.name,menu);
  });
  return [...map.values()];
}

function getImageSets(menuName){
  const config=window.FOOD_IMAGE_CONFIG;
  const normalized=normalize(menuName);
  const exactBases=[];
  const fallbackFiles=[];

  const exactKey=Object.keys(config.exact||{}).find(
    key=>normalize(key)===normalized
  );
  if(exactKey){
    exactBases.push(`assets/foods/exact/${config.exact[exactKey]}`);
  }

  (config.similar||[]).forEach(rule=>{
    if(rule.keywords.some(keyword=>normalized.includes(normalize(keyword)))){
      exactBases.push(`assets/foods/exact/${rule.file}`);
    }
  });

  const fallbackExactKey=Object.keys(config.fallbackExact||{}).find(
    key=>normalize(key)===normalized
  );
  if(fallbackExactKey){
    fallbackFiles.push(config.fallbackExact[fallbackExactKey]);
  }

  (config.fallbackRules||[]).forEach(rule=>{
    if(rule.keywords.some(keyword=>normalized.includes(normalize(keyword)))){
      fallbackFiles.push(rule.file);
    }
  });

  const exact=[...new Set(exactBases)]
    .flatMap(base=>EXTENSIONS.map(ext=>`${base}.${ext}`));

  const fallback=[...new Set(fallbackFiles)]
    .map(file=>`${config.fallbackBasePath||"assets/foods/fallback/"}${file}`);

  return{exact,fallback};
}

function getEnglishImageQuery(menuName){
  const normalized=normalize(menuName);
  const rules=window.FOOD_IMAGE_CONFIG.englishQueries||[];
  return rules.find(rule=>
    rule.keywords.some(keyword=>normalized.includes(normalize(keyword)))
  )?.query||`${menuName} food`;
}

const remoteImagePromises=new Map();

async function fetchRemoteImage(menuName){
  if(isKimchiMenu(menuName)){
    return null;
  }

  if(Object.prototype.hasOwnProperty.call(state.imageCache,menuName)){
    return state.imageCache[menuName];
  }

  if(remoteImagePromises.has(menuName)){
    return remoteImagePromises.get(menuName);
  }

  const promise=(async()=>{
    try{
      const response=await fetch(
        `/api/food-image?q=${encodeURIComponent(getEnglishImageQuery(menuName))}`
      );
      const payload=await response.json().catch(()=>({}));
      const image=response.ok&&payload.image?.url ? payload.image : null;

      state.imageCache[menuName]=image;
      localStorage.setItem(
        "foodImageCacheV3",
        JSON.stringify(state.imageCache)
      );
      return image;
    }catch(error){
      console.warn("자동 이미지 검색 실패",error);
      state.imageCache[menuName]=null;
      localStorage.setItem(
        "foodImageCacheV3",
        JSON.stringify(state.imageCache)
      );
      return null;
    }finally{
      remoteImagePromises.delete(menuName);
    }
  })();

  remoteImagePromises.set(menuName,promise);
  return promise;
}

function createFoodVisual(menuName,className="food-image"){
  const wrapper=document.createElement("div");
  wrapper.className="food-visual-holder";

  const img=document.createElement("img");
  img.className=className;
  img.alt=`${menuName} 대표 이미지`;
  img.loading="lazy";
  img.referrerPolicy="no-referrer";

  const placeholder=document.createElement("div");
  placeholder.className="food-placeholder";
  placeholder.textContent=getFoodEmoji(menuName);

  const sets=getImageSets(menuName);
  let exactIndex=0;
  let fallbackIndex=0;
  let remoteTried=false;

  function showEmoji(){
    img.remove();
    if(!wrapper.contains(placeholder)){
      wrapper.append(placeholder);
    }
  }

  async function tryNext(){
    // 1순위: 기존 정확 메뉴 이미지
    if(exactIndex<sets.exact.length){
      img.dataset.source="exact";
      img.src=sets.exact[exactIndex++];
      return;
    }

    // 2순위: 사용자가 저장한 31개 이미지 매핑
    if(fallbackIndex<sets.fallback.length){
      img.dataset.source="saved";
      img.src=sets.fallback[fallbackIndex++];
      return;
    }

    // 3순위: 저장 이미지가 전혀 없을 때만 Unsplash 검색
    if(!remoteTried){
      remoteTried=true;
      const remote=await fetchRemoteImage(menuName);
      if(remote?.url){
        img.dataset.source="remote";
        img.src=remote.url;
        return;
      }
    }

    // 4순위: 검색 결과가 없거나 이미지 로딩 실패
    showEmoji();
  }

  img.addEventListener("error",tryNext);
  wrapper.append(img);
  tryNext();
  return wrapper;
}

function openSchoolModal(){
  el.schoolModal.classList.remove("hidden");
  document.body.style.overflow="hidden";
  setTimeout(()=>$("#schoolSearchInput").focus(),40);
}
function closeSchoolModal(){
  if(!state.school)return;
  el.schoolModal.classList.add("hidden");
  document.body.style.overflow="";
}
function saveSchool(school){
  state.school=school;
  localStorage.setItem("selectedSchool",JSON.stringify(school));
  el.schoolName.textContent=school.schoolName;
}

async function searchSchools(query){
  const response=await fetch(`/api/schools?q=${encodeURIComponent(query)}`);
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(payload.error||"학교 검색 실패");
  return payload.schools||[];
}
function renderSchoolResults(schools){
  el.schoolResults.innerHTML="";
  schools.forEach(school=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="school-result";

    const icon=document.createElement("span");
    icon.textContent="🏫";
    const content=document.createElement("span");
    const strong=document.createElement("strong");
    const address=document.createElement("p");
    const office=document.createElement("p");

    strong.textContent=`${school.schoolName} · ${school.schoolType||"학교"}`;
    address.textContent=school.address||"주소 정보 없음";
    office.textContent=`${school.educationName||"교육청"} (${school.educationCode})`;
    content.append(strong,address,office);
    button.append(icon,content);

    button.onclick=async()=>{
      saveSchool(school);
      closeSchoolModal();
      resetDateActivity();
      await loadMeal();
    };
    el.schoolResults.append(button);
  });
}

async function loadMeal(){
  if(!state.school)return openSchoolModal();
  setStatus("급식 정보를 불러오는 중입니다.");

  try{
    const query=new URLSearchParams({
      educationCode:state.school.educationCode,
      schoolCode:state.school.schoolCode,
      date:formatDate(state.date)
    });
    const response=await fetch(`/api/meals?${query}`);
    const payload=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(payload.error||"급식 조회 실패");

    state.mealLines=payload.meal?.lines||[];
    state.menus=payload.meal?.menus||[];
    state.choiceGroups=payload.meal?.choiceGroups||[];
    state.selectedChoice=state.choiceGroups[0]||null;
    el.mealSummary.textContent=payload.meal
      ? `${state.school.schoolName} · ${formatKoreanDate(state.date)} 중식`
      : "등록된 급식이 없습니다. 직접 단어를 추가할 수 있습니다.";
    el.calorieBadge.textContent=payload.meal?.calorie||"";

    initializeTray();
    renderAll();
    setStatus(payload.meal?"급식을 불러왔습니다.":"급식이 없는 날입니다.",payload.meal?"success":"error");
  }catch(error){
    console.error(error);
    state.mealLines=[];
    state.menus=[];
    state.choiceGroups=[];
    state.selectedChoice=null;
    initializeTray();
    renderAll();
    setStatus(error.message,"error");
  }
}

function activeMenus(){
  const source=state.choiceGroups.length
    ? [
        ...allMenus().filter(menu=>!menu.group),
        ...allMenus().filter(menu=>menu.group===state.selectedChoice)
      ]
    : allMenus();

  const unique=new Map();
  source.forEach(menu=>{
    const key=normalize(menu.name);
    if(key&&!unique.has(key))unique.set(key,menu);
  });
  return [...unique.values()];
}
function renderChoiceSelector(){
  if(!el.choiceSelector)return;
  el.choiceSelector.innerHTML="";
  if(!state.choiceGroups.length){el.choiceSelector.classList.add("hidden");return}
  el.choiceSelector.classList.remove("hidden");
  const title=document.createElement("strong");title.textContent="선택 급식을 골라 주세요";
  const row=document.createElement("div");row.className="choice-selector-row";
  state.choiceGroups.forEach(group=>{
    const button=document.createElement("button");button.type="button";
    button.className="choice-select-btn"+(state.selectedChoice===group?" selected":"");
    button.textContent=group;
    button.onclick=()=>{state.selectedChoice=group;initializeTray();renderChoiceSelector();renderTray();renderPantry();renderWholeWriting();renderRepeatMenuOptions()};
    row.append(button);
  });
  el.choiceSelector.append(title,row);
}

function renderAll(){
  renderMealView();
  renderChoiceSelector();
  renderTray();
  renderPantry();
  renderWholeWriting();
  renderRepeatMenuOptions();
}

function renderMealView(){
  el.mealGrid.innerHTML="";
  allMenus().forEach(menu=>{
    const card=document.createElement("article");
    card.className="menu-card";
    card.append(createFoodVisual(menu.name));

    const content=document.createElement("div");
    content.className="menu-content";
    const strong=document.createElement("strong");
    const small=document.createElement("small");
    strong.textContent=menu.name;
    small.textContent=menu.group?`${menu.group} 메뉴`:"오늘 제공 메뉴";
    content.append(strong,small);
    card.append(content);
    el.mealGrid.append(card);
  });
}

function zoneFor(menu){
  const name=normalize(menu.name);
  if(/밥|덮밥|볶음밥|비빔밥|스테이크/.test(name))return"rice";
  if(/국|탕|찌개|전골|장국|스프/.test(name))return"soup";
  if(/우유|요구르트|요거트|주스|음료|과일|푸딩|젤리|케이크|후식/.test(name))return"dessert";
  return"side";
}
function trayTargets(){
  let side=0;
  return activeMenus().map(menu=>{
    let zone=zoneFor(menu);
    if(zone==="side"){side+=1;zone=`side-${Math.min(side,3)}`}
    return{menu,zone};
  });
}
function initializeTray(){
  state.freeSelected=[];
  state.traySlots=trayTargets().map((target,index)=>({id:`slot-${index}`,...target,placedMenu:null}));
}
function zoneLabel(zone){return zone.startsWith("side")?"반찬":zone==="rice"?"밥":zone==="soup"?"국":"부식·후식"}
function buildTrayZones(){
  el.dynamicTray.innerHTML="";
  ["side-1","side-2","side-3","dessert","soup","rice"].forEach(zone=>{
    const div=document.createElement("div");div.className=`tray-zone ${zone}`;div.dataset.zone=zone;
    const label=document.createElement("span");label.className="zone-label";label.textContent=zoneLabel(zone);div.append(label);
    div.ondragover=e=>e.preventDefault();
    div.ondrop=e=>handleZoneDrop(e,zone);
    el.dynamicTray.append(div);
  });
}
function renderTray(){
  buildTrayZones();
  if(state.trayMode==="match"){
    state.traySlots.forEach(slot=>{
      const zone=el.dynamicTray.querySelector(`[data-zone="${slot.zone}"]`)||el.dynamicTray.querySelector('[data-zone="side-3"]');
      const target=document.createElement("div");
      target.className="target-text"+(slot.placedMenu?" filled":"");
      target.dataset.menu=slot.menu.name;

      const label=document.createElement("span");
      label.className="target-label";
      label.textContent=slot.menu.name;
      target.append(label);

      if(slot.placedMenu){
        const overlay=document.createElement("div");
        overlay.className="target-image-overlay";
        overlay.append(createFoodVisual(slot.placedMenu.name,"slot-image"));

        const remove=document.createElement("button");
        remove.type="button";
        remove.className="target-remove";
        remove.textContent="×";
        remove.onclick=event=>{
          event.stopPropagation();
          slot.placedMenu=null;
          renderTray();
          renderPantry();
        };
        target.append(overlay,remove);
      }
      zone.append(target);
    });
  }else{
    state.freeSelected.forEach(menu=>{
      let zone=zoneFor(menu);if(zone==="side")zone="side-1";
      const zoneEl=el.dynamicTray.querySelector(`[data-zone="${zone}"]`);zoneEl?.append(createTrayEntry(menu,false));
    });
  }
  updateServingButton();
}
function createTrayEntry(menu,imageOnly){
  const entry=document.createElement("div");entry.className="tray-entry"+(imageOnly?" image-only":"");entry.append(createFoodVisual(menu.name,"slot-image"));
  const strong=document.createElement("strong");strong.textContent=menu.name;
  const remove=document.createElement("button");remove.type="button";remove.className="slot-remove";remove.textContent="×";
  remove.onclick=()=>{if(state.trayMode==="match"){const slot=state.traySlots.find(s=>s.menu.name===menu.name);if(slot)slot.placedMenu=null}else state.freeSelected=state.freeSelected.filter(item=>item.name!==menu.name);renderTray();renderPantry()};
  entry.append(strong,remove);return entry;
}
function handleZoneDrop(event,zone){
  event.preventDefault();
  const menuName=event.dataTransfer.getData("text/plain");
  const menu=activeMenus().find(item=>item.name===menuName);if(!menu)return;
  if(state.trayMode==="match"){
    const slot=state.traySlots.find(item=>item.menu.name===menuName);
    if(slot?.zone===zone){slot.placedMenu=menu;speak(menu.name);renderTray();renderPantry()}
    else{speak("다시 생각해 보세요");const zoneEl=el.dynamicTray.querySelector(`[data-zone="${zone}"]`);zoneEl?.animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}],{duration:300})}
  }else if(!state.freeSelected.some(item=>item.name===menuName)){state.freeSelected.push(menu);renderTray();renderPantry()}
}
function renderPantry(){
  el.pantry.innerHTML="";
  const menuMap=new Map();
  activeMenus().forEach(menu=>{
    const key=normalize(menu.name);
    if(key&&!menuMap.has(key))menuMap.set(key,menu);
  });
  const menus=[...menuMap.values()];
  const usedNames=state.trayMode==="match"?new Set(state.traySlots.filter(slot=>slot.placedMenu).map(slot=>slot.menu.name)):new Set(state.freeSelected.map(menu=>menu.name));
  menus.forEach(menu=>{
    const button=document.createElement("button");button.type="button";button.className=`pantry-card ${state.trayMode==="match"?"image-only":""}`+(usedNames.has(menu.name)?" used":"");button.draggable=true;button.append(createFoodVisual(menu.name));
    const strong=document.createElement("strong");strong.textContent=menu.name;button.append(strong);
    button.ondragstart=e=>e.dataTransfer.setData("text/plain",menu.name);
    button.onclick=()=>{if(state.trayMode==="free"&&!state.freeSelected.some(item=>item.name===menu.name)){state.freeSelected.push(menu);renderTray();renderPantry()}};
    el.pantry.append(button);
  });
  el.pantryCount.textContent=`${menus.length}개`;
}
function updateServingButton(){
  const complete=state.trayMode==="match"?state.traySlots.length>0&&state.traySlots.every(slot=>slot.placedMenu?.name===slot.menu.name):state.freeSelected.length>0;
  el.completeServingBtn.disabled=!complete;
}
function setTrayMode(mode){
  state.trayMode=mode;
  $("#trayModeButtons").querySelectorAll("button").forEach(button=>button.classList.toggle("selected",button.dataset.mode===mode));
  el.trayModeHelp.textContent=mode==="match"?"식판의 메뉴 글자를 보고 오른쪽 음식 그림만 알맞은 칸에 모두 올려놓으세요.":"빈 식판에 그림과 글자가 함께 있는 메뉴 카드 중 먹고 싶은 것을 자유롭게 담아 보세요.";
  initializeTray();renderTray();renderPantry();
}

function showServingComplete(){
  if(state.trayMode==="match"){
    el.completeTitle.textContent="배식 완료!";
    el.completeMessage.textContent="오늘 급식의 그림과 글자를 모두 바르게 연결했어요.";
  }else{
    el.completeTitle.textContent="나의 급식판 완성!";
    el.completeMessage.textContent="내가 먹고 싶은 메뉴로 식판을 완성했어요.";
  }
  el.completeModal.classList.remove("hidden");
}

function createSyllableCanvas(char,showGuide=true){
  const wrap=document.createElement("div");wrap.className="syllable-writing-cell";
  const canvasWrap=document.createElement("div");canvasWrap.className="repeat-canvas-wrap";
  const guide=document.createElement("canvas");guide.className="guide-canvas";
  const draw=document.createElement("canvas");draw.className="draw-canvas";
  const label=document.createElement("span");label.className="syllable-label";label.textContent=char;
  canvasWrap.append(guide,draw);wrap.append(canvasWrap,label);
  requestAnimationFrame(()=>setupWritingCanvas(draw,guide,char,showGuide).resize());
  return wrap;
}
function renderWholeWriting(){
  el.wholeWritingArea.innerHTML="";
  activeMenus().forEach((menu,index)=>{
    const card=document.createElement("article");card.className="menu-writing-card";
    const header=document.createElement("div");header.className="repeat-header";header.append(createFoodVisual(menu.name));
    const info=document.createElement("div");const title=document.createElement("h3");title.textContent=`${index+1}. ${menu.name}`;const speakBtn=document.createElement("button");speakBtn.className="secondary";speakBtn.textContent="🔊 듣기";speakBtn.onclick=()=>speak(menu.name);info.append(title,speakBtn);header.append(info);
    const row=document.createElement("div");row.className="syllable-writing-row";[...menu.name].filter(char=>char.trim()).forEach(char=>row.append(createSyllableCanvas(char,true)));
    card.append(header,row);el.wholeWritingArea.append(card);
  });
}
function renderRepeatMenuOptions(){
  const current=el.repeatMenuSelect.value;el.repeatMenuSelect.innerHTML="";
  activeMenus().forEach(menu=>{const option=document.createElement("option");option.value=menu.name;option.textContent=menu.name;el.repeatMenuSelect.append(option)});
  if([...el.repeatMenuSelect.options].some(option=>option.value===current))el.repeatMenuSelect.value=current;
  renderRepeatBoard();
}
function renderRepeatBoard(){
  el.repeatBoard.innerHTML="";const menuName=el.repeatMenuSelect.value||activeMenus()[0]?.name;if(!menuName)return;
  const level=el.repeatLevelSelect.value;
  const header=document.createElement("div");header.className="repeat-header";header.append(createFoodVisual(menuName));
  const textWrap=document.createElement("div");const title=document.createElement("h3");title.textContent=menuName;const speakBtn=document.createElement("button");speakBtn.className="secondary";speakBtn.textContent="🔊 메뉴 듣기";speakBtn.onclick=()=>speak(menuName);textWrap.append(title,speakBtn);header.append(textWrap);
  const grid=document.createElement("div");grid.className="repeat-grid";
  for(let i=0;i<10;i++){
    const item=document.createElement("article");item.className="repeat-item";const num=document.createElement("span");num.className="repeat-number";num.textContent=`${i+1}번 쓰기`;item.append(num);
    const showGuide=level==="trace10"||(level==="trace5free5"&&i<5);const row=document.createElement("div");row.className="syllable-repeat";
    [...menuName].filter(char=>char.trim()).forEach(char=>row.append(createSyllableCanvas(char,showGuide)));item.append(row);grid.append(item);
  }
  el.repeatBoard.append(header,grid);
}

function setupWritingCanvas(drawCanvas,guideCanvas,text,showTextGuide){
  const drawContext=drawCanvas.getContext("2d");
  const guideContext=guideCanvas.getContext("2d");
  let drawing=false,pointerId=null,last=null;

  function resizeCanvas(canvas,preserve=false){
    const rect=canvas.getBoundingClientRect();
    const ratio=Math.max(1,window.devicePixelRatio||1);
    let snapshot=null;
    if(preserve&&canvas.width&&canvas.height){
      snapshot=document.createElement("canvas");
      snapshot.width=canvas.width;
      snapshot.height=canvas.height;
      snapshot.getContext("2d").drawImage(canvas,0,0);
    }
    canvas.width=Math.round(rect.width*ratio);
    canvas.height=Math.round(rect.height*ratio);
    if(snapshot){
      canvas.getContext("2d").drawImage(snapshot,0,0,snapshot.width,snapshot.height,0,0,canvas.width,canvas.height);
    }
  }

  function drawGuide(){
    const ratio=Math.max(1,window.devicePixelRatio||1);
    guideContext.clearRect(0,0,guideCanvas.width,guideCanvas.height);
    guideContext.save();
    guideContext.strokeStyle="#d9e4f1";
    guideContext.lineWidth=ratio;
    guideContext.setLineDash([5*ratio,5*ratio]);

    if(state.guideType==="cross"){
      guideContext.beginPath();
      guideContext.moveTo(guideCanvas.width/2,0);
      guideContext.lineTo(guideCanvas.width/2,guideCanvas.height);
      guideContext.moveTo(0,guideCanvas.height/2);
      guideContext.lineTo(guideCanvas.width,guideCanvas.height/2);
      guideContext.stroke();
    }else if(state.guideType==="line"){
      [0.35,0.7].forEach(pos=>{
        guideContext.beginPath();
        guideContext.moveTo(0,guideCanvas.height*pos);
        guideContext.lineTo(guideCanvas.width,guideCanvas.height*pos);
        guideContext.stroke();
      });
    }

    if(showTextGuide){
      guideContext.setLineDash([]);
      let size=Math.min(guideCanvas.height*.55,guideCanvas.width/Math.max(2,[...text].length*.75));
      size=Math.max(size,28*ratio);
      guideContext.font=`800 ${size}px "Noto Sans KR",sans-serif`;
      guideContext.textAlign="center";
      guideContext.textBaseline="middle";
      guideContext.fillStyle="#e0e7ef";
      guideContext.fillText(text,guideCanvas.width/2,guideCanvas.height/2);
    }
    guideContext.restore();
  }

  function resize(){
    resizeCanvas(guideCanvas,false);
    resizeCanvas(drawCanvas,true);
    drawGuide();
  }

  function point(event){
    const rect=drawCanvas.getBoundingClientRect();
    return {
      x:(event.clientX-rect.left)*(drawCanvas.width/rect.width),
      y:(event.clientY-rect.top)*(drawCanvas.height/rect.height)
    };
  }

  drawCanvas.onpointerdown=e=>{
    drawing=true;
    pointerId=e.pointerId;
    last=point(e);
    drawCanvas.setPointerCapture(e.pointerId);
  };
  drawCanvas.onpointermove=e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    const current=point(e);
    const ratio=Math.max(1,window.devicePixelRatio||1);
    drawContext.save();
    drawContext.strokeStyle=state.penColor;
    drawContext.lineWidth=state.penWidth*ratio;
    drawContext.lineCap="round";
    drawContext.lineJoin="round";
    drawContext.beginPath();
    drawContext.moveTo(last.x,last.y);
    drawContext.lineTo(current.x,current.y);
    drawContext.stroke();
    drawContext.restore();
    last=current;
  };
  function end(e){
    if(e.pointerId!==pointerId)return;
    drawing=false;
    pointerId=null;
    last=null;
  }
  drawCanvas.onpointerup=end;
  drawCanvas.onpointercancel=end;
  return{resize};
}

function renderFinish(){
  el.finishGrid.innerHTML="";
  const menus=state.trayMode==="free"&&state.freeSelected.length
    ? state.freeSelected
    : activeMenus();

  menus.forEach(menu=>{
    const card=document.createElement("article");
    card.className="menu-card";
    card.append(createFoodVisual(menu.name));
    const content=document.createElement("div");
    content.className="menu-content";
    const strong=document.createElement("strong");
    strong.textContent=menu.name;
    content.append(strong);
    card.append(content);
    el.finishGrid.append(card);
  });
}

function changeStep(step){
  if(["tray","write","finish"].includes(step)&&!allMenus().length){
    return setStatus("먼저 급식을 불러오거나 단어를 추가해 주세요.","error");
  }
  $$(".step-nav button").forEach(button=>button.classList.toggle("active",button.dataset.step===step));
  $$(".step-panel").forEach(panel=>panel.classList.toggle("active",panel.id===step));
  if(step==="tray"){renderTray();renderPantry();}
  if(step==="write"){renderWholeWriting();renderRepeatMenuOptions();}
  if(step==="finish")renderFinish();
  window.scrollTo({top:230,behavior:"smooth"});
}

function speak(text){
  if(!("speechSynthesis" in window))return;
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang="ko-KR";
  utterance.rate=.82;
  speechSynthesis.speak(utterance);
}

function resetDateActivity(){
  state.mealLines=[];
  state.menus=[];
  state.customMenus=[];
  state.choiceGroups=[];
  state.selectedChoice=null;
  initializeTray();
}

$("#schoolSearchForm").onsubmit=async e=>{
  e.preventDefault();
  const query=$("#schoolSearchInput").value.trim();
  if(!query)return el.schoolSearchStatus.textContent="학교 이름을 입력해 주세요.";
  el.schoolSearchStatus.textContent="검색 중입니다.";
  el.schoolResults.innerHTML="";
  try{
    const schools=await searchSchools(query);
    el.schoolSearchStatus.textContent=schools.length?`검색결과 (${schools.length}건)`:"검색 결과가 없습니다.";
    renderSchoolResults(schools);
  }catch(error){
    console.error(error);
    el.schoolSearchStatus.textContent=error.message;
  }
};

$("#changeSchoolBtn").onclick=openSchoolModal;
$("#closeSchoolBtn").onclick=closeSchoolModal;
$("#prevDate").onclick=()=>{
  const date=new Date(state.date);
  date.setDate(date.getDate()-1);
  moveToDate(date);
};
$("#nextDate").onclick=()=>{
  const date=new Date(state.date);
  date.setDate(date.getDate()+1);
  moveToDate(date);
};
$("#todayBtn").onclick=()=>moveToDate(new Date());

el.dateText.onclick=event=>{
  event.stopPropagation();
  toggleCalendar();
};

$("#calendarPrevMonth").onclick=event=>{
  event.stopPropagation();
  state.calendarViewDate.setMonth(state.calendarViewDate.getMonth()-1);
  renderCalendar();
};
$("#calendarNextMonth").onclick=event=>{
  event.stopPropagation();
  state.calendarViewDate.setMonth(state.calendarViewDate.getMonth()+1);
  renderCalendar();
};
$("#calendarTodayBtn").onclick=async event=>{
  event.stopPropagation();
  el.calendarPopover.classList.add("hidden");
  await moveToDate(new Date());
};

document.addEventListener("click",event=>{
  if(!event.target.closest(".date-picker-wrap")){
    el.calendarPopover.classList.add("hidden");
  }
});

$("#customMenuForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("#customMenuInput").value.trim();
  if(!name)return setStatus("단어를 입력해 주세요.","error");
  if([...name].length>14)return setStatus("14글자 이내로 입력해 주세요.","error");
  if(allMenus().some(menu=>menu.name===name))return setStatus("이미 있는 단어입니다.","error");
  state.customMenus.push({name,group:null,original:name});
  $("#customMenuInput").value="";
  initializeTray();
  renderAll();
};

$("#trayModeButtons").onclick=e=>{
  const button=e.target.closest("[data-mode]");
  if(button)setTrayMode(button.dataset.mode);
};
$("#resetTrayBtn").onclick=()=>{
  initializeTray();
  renderTray();
  renderPantry();
};
$("#completeServingBtn").onclick=showServingComplete;
$("#closeCompleteBtn").onclick=()=>el.completeModal.classList.add("hidden");
$("#completeToWriteBtn").onclick=()=>{
  el.completeModal.classList.add("hidden");
  changeStep("write");
};

$("#writingModeButtons").onclick=e=>{
  const button=e.target.closest("[data-writing-mode]");
  if(!button)return;
  state.writingMode=button.dataset.writingMode;
  $("#writingModeButtons").querySelectorAll("button").forEach(item=>item.classList.toggle("selected",item===button));
  el.wholeWritingArea.classList.toggle("hidden",state.writingMode!=="whole");
  el.repeatWritingArea.classList.toggle("hidden",state.writingMode!=="repeat");
  if(state.writingMode==="repeat")renderRepeatBoard();
};
el.repeatMenuSelect.onchange=renderRepeatBoard;
el.repeatLevelSelect.onchange=renderRepeatBoard;
el.repeatLayoutSelect.onchange=renderRepeatBoard;

$("#colorTools").onclick=e=>{
  const button=e.target.closest("[data-color]");
  if(!button)return;
  state.penColor=button.dataset.color;
  $("#colorTools").querySelectorAll("button").forEach(item=>item.classList.toggle("selected",item===button));
};
$("#widthTools").onclick=e=>{
  const button=e.target.closest("[data-width]");
  if(!button)return;
  state.penWidth=Number(button.dataset.width);
  $("#widthTools").querySelectorAll("button").forEach(item=>item.classList.toggle("selected",item===button));
};
$("#guideTools").onclick=e=>{
  const button=e.target.closest("[data-guide]");
  if(!button)return;
  state.guideType=button.dataset.guide;
  $("#guideTools").querySelectorAll("button").forEach(item=>item.classList.toggle("selected",item===button));
  if($("#write").classList.contains("active")){
    renderWholeWriting();
    renderRepeatBoard();
  }
};

$("#goTrayBtn").onclick=()=>changeStep("tray");
$("#goWriteBtn").onclick=()=>changeStep("write");
$("#goFinishBtn").onclick=()=>changeStep("finish");
$$("[data-go]").forEach(button=>button.onclick=()=>changeStep(button.dataset.go));
$$(".step-nav button").forEach(button=>button.onclick=()=>changeStep(button.dataset.step));
$("#speakAllBtn").onclick=()=>speak(activeMenus().map(menu=>menu.name).join(", "));
$("#restartBtn").onclick=()=>{
  initializeTray();
  changeStep("meal");
};

try{state.imageCache=JSON.parse(localStorage.getItem("foodImageCacheV3")||"{}")}catch{state.imageCache={}}

syncDateControls();
setTrayMode("match");

try{
  const saved=JSON.parse(localStorage.getItem("selectedSchool")||"null");
  if(saved?.schoolCode){
    saveSchool(saved);
    loadMeal();
  }else{
    openSchoolModal();
  }
}catch(error){
  localStorage.removeItem("selectedSchool");
  openSchoolModal();
}
})();
