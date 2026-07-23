const URL="https://open.neis.go.kr/hub/schoolInfo";
exports.handler=async event=>{
  if(event.httpMethod!=="GET")return json(405,{error:"GET 요청만 사용할 수 있습니다."});
  const q=String(event.queryStringParameters?.q||"").trim();
  if(!q)return json(400,{error:"학교 이름을 입력해 주세요."});
  const key=process.env.NEIS_API_KEY;
  if(!key)return json(500,{error:"NEIS_API_KEY 환경변수가 등록되지 않았습니다."});
  try{
    const params=new URLSearchParams({KEY:key,Type:"json",pIndex:"1",pSize:"30",SCHUL_NM:q});
    const response=await fetch(`${URL}?${params}`);
    if(!response.ok)throw Error(`학교정보 API 오류 (${response.status})`);
    const data=await response.json();
    if(data?.RESULT?.CODE==="INFO-200")return json(200,{schools:[]});
    if(data?.RESULT&&data.RESULT.CODE!=="INFO-000")throw Error(data.RESULT.MESSAGE);
    const rows=data?.schoolInfo?.[1]?.row??[];
    return json(200,{schools:rows.map(row=>({
      schoolName:row.SCHUL_NM||"",
      schoolType:row.SCHUL_KND_SC_NM||"",
      address:row.ORG_RDNMA||"",
      educationCode:row.ATPT_OFCDC_SC_CODE||"",
      educationName:row.ATPT_OFCDC_SC_NM||"",
      schoolCode:row.SD_SCHUL_CODE||""
    }))});
  }catch(error){
    console.error(error);
    return json(500,{error:"학교 정보를 불러오지 못했습니다."});
  }
};
function json(statusCode,body){return{statusCode,headers:{"Content-Type":"application/json; charset=utf-8"},body:JSON.stringify(body)}}
