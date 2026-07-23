const URL="https://open.neis.go.kr/hub/mealServiceDietInfo";

exports.handler=async event=>{
  if(event.httpMethod!=="GET")return json(405,{error:"GET 요청만 사용할 수 있습니다."});
  const q=event.queryStringParameters||{};
  const educationCode=String(q.educationCode||"").trim();
  const schoolCode=String(q.schoolCode||"").trim();
  const date=String(q.date||"").trim();
  if(!educationCode||!schoolCode||!/^\d{4}-\d{2}-\d{2}$/.test(date)){
    return json(400,{error:"학교 코드와 날짜를 올바르게 전달해 주세요."});
  }
  const key=process.env.NEIS_API_KEY;
  if(!key)return json(500,{error:"NEIS_API_KEY 환경변수가 등록되지 않았습니다."});

  try{
    const params=new URLSearchParams({
      KEY:key,Type:"json",pIndex:"1",pSize:"20",
      ATPT_OFCDC_SC_CODE:educationCode,
      SD_SCHUL_CODE:schoolCode,
      MMEAL_SC_CODE:"2",
      MLSV_YMD:date.replaceAll("-","")
    });
    const response=await fetch(`${URL}?${params}`);
    if(!response.ok)throw Error(`급식 API 오류 (${response.status})`);
    const data=await response.json();
    if(data?.RESULT?.CODE==="INFO-200")return json(200,{meal:null});
    if(data?.RESULT&&data.RESULT.CODE!=="INFO-000")throw Error(data.RESULT.MESSAGE);

    const rows=data?.mealServiceDietInfo?.[1]?.row??[];
    const lunch=rows.find(row=>row.MMEAL_SC_CODE==="2")??rows[0];
    if(!lunch)return json(200,{meal:null});

    const parsed=parseMeal(lunch.DDISH_NM);
    return json(200,{meal:{
      schoolName:lunch.SCHUL_NM||"",
      mealType:lunch.MMEAL_SC_NM||"중식",
      date:lunch.MLSV_YMD||"",
      calorie:lunch.CAL_INFO||"",
      lines:parsed.lines,
      menus:parsed.menus,
      choiceGroups:parsed.choiceGroups
    }});
  }catch(error){
    console.error(error);
    return json(500,{error:"급식 정보를 불러오지 못했습니다."});
  }
};

function parseMeal(html){
  const rawLines=String(html||"").split(/<br\s*\/?>/i).map(decode).map(v=>v.trim()).filter(Boolean);
  const menuMap=new Map();
  const lines=[];
  const choiceGroups=[];

  rawLines.forEach(raw=>{
    const allergyRemoved=raw.replace(/\s*\(\s*\d+(?:\.\d+)*\s*\)\s*/g," ");
    const choiceMatch=allergyRemoved.match(/^\s*선택\s*(\d+)\s*\)\s*/);
    const group=choiceMatch?`선택 ${choiceMatch[1]}`:null;
    if(group&&!choiceGroups.includes(group))choiceGroups.push(group);
    const withoutChoice=allergyRemoved.replace(/^\s*선택\s*\d+\s*\)\s*/,"").trim();
    const parts=withoutChoice.split(/\s*,\s*/).map(clean).filter(Boolean);

    if(parts.length){
      lines.push({
        text:parts.join(", "),
        group,
        menus:parts
      });
    }

    parts.forEach(name=>{
      if(!menuMap.has(name)){
        menuMap.set(name,{name,group,original:raw});
      }
    });
  });

  return{lines,menus:[...menuMap.values()],choiceGroups};
}

function clean(text){
  return String(text||"")
    .replace(/^\s*선택\s*\d+\s*\)\s*/,"")
    .replace(/\s*\d+(?:\.\d+)*\.?\s*$/g,"")
    .replace(/^[,\s]+|[,\s]+$/g,"")
    .trim();
}
function decode(value){
  return String(value).replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/&#39;/gi,"'");
}
function json(statusCode,body){return{statusCode,headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(body)}}
