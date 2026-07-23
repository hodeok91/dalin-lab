const BASE=process.env.TEST_BASE_URL||"http://localhost:8888";
async function run(){
  console.log("테스트 주소:",BASE);
  const schoolRes=await fetch(`${BASE}/api/schools?q=${encodeURIComponent("갈현초")}`);
  const schoolData=await schoolRes.json();
  if(!schoolRes.ok)throw Error(`학교 검색 실패: ${JSON.stringify(schoolData)}`);
  console.log("학교 검색 성공:",schoolData.schools?.[0]?.schoolName||"결과 없음");

  const imageChecks=[
    "assets/foods/categories/rice.svg",
    "assets/foods/categories/soup.svg",
    "assets/foods/exact/brown-rice.svg"
  ];
  for(const file of imageChecks){
    const res=await fetch(`${BASE}/${file}`);
    console.log(`${file}:`,res.ok?"존재":"없음");
  }
}
run().catch(error=>{console.error(error);process.exitCode=1});
