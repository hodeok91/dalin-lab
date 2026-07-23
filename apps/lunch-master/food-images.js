/*
31개 급식 이미지 대체 매핑
업로드한 파일명을 그대로 사용합니다.

우선순위:
1. 정확한 로컬 이미지(기존 assets/foods/exact)
2. Unsplash 자동 검색
3. 아래 31개 이미지 중 메뉴명과 가장 가까운 이미지
4. rice.jpg
*/

window.FOOD_IMAGE_CONFIG = {
  exact: {},
  similar: [],
  categories: [],
  defaultFile: "",

  fallbackBasePath: "assets/foods/fallback/",

  fallbackExact: {
    "푸딩":"pudding.jpg","과일푸딩":"pudding.jpg","과일젤리":"pudding.jpg","젤리":"pudding.jpg",
    "쿠키":"cookie.jpg","초코쿠키":"cookie.jpg",
    "케이크":"cake.jpeg","딸기케이크":"cake.jpeg","생크림케이크":"cake.jpeg",
    "떡볶이":"tteokbokki.jpg",
    "망고주스":"juice.jpg","망고음료":"juice.jpg","망고쥬스":"juice.jpg",
    "식혜":"Sweet Rice Punch.jpg",
    "요구르트":"yogurt.jpg","요거트":"yogurt.jpg","발효유":"yogurt.jpg",
    "우유":"milk.jpg","수박":"watermelon.jpg","사과":"apologize.jpg",
    "멸치볶음":"Myeolchi bokkeum.jpg","견과멸치볶음":"Myeolchi bokkeum.jpg",
    "감자조림":"Gamja Jorim.jpg","알감자조림":"Gamja Jorim.jpg",
    "모둠튀김":"fried.jpg","튀김":"fried.jpg",
    "과일샐러드":"salad.jpg","사라다":"salad.jpg",
    "시금치나물":"Spinach Namul.jpg",
    "깍두기":"Kkakdugi.jpg",
    "배추김치":"cabbage kimchi.jpg","포기김치":"cabbage kimchi.jpg","김장김치":"cabbage kimchi.jpg",
    "계란후라이":"fried egg.jpg","달걀후라이":"fried egg.jpg",
    "계란말이":"egg roll.jpg","달걀말이":"egg roll.jpg",
    "고등어구이":"Grilled Mackerel.jpg",
    "닭볶음탕":"Spicy Braised Chicken.jpg","닭도리탕":"Spicy Braised Chicken.jpg",
    "케이준치킨샐러드":"Cajun chicken salad.jpg","치킨샐러드":"Cajun chicken salad.jpg",
    "후라이드치킨":"chicken.jpg","치킨":"chicken.jpg",
    "함박스테이크":"Hamburger Steak.jpg","함박스테이크소스":"Hamburger Steak.jpg","밥스테이크":"Hamburger Steak.jpg",
    "제육볶음":"Spicy Stir-fried Pork.jpg","돼지고기볶음":"Spicy Stir-fried Pork.jpg",
    "식빵":"white bread.jpg","토스트":"white bread.jpg",
    "쫄면":"Spicy Chewy Noodles.jpg","비빔쫄면":"Spicy Chewy Noodles.jpg",
    "우동":"Udon.jpg",
    "미소장국":"Miso soup.jpg","미소국":"Miso soup.jpg",
    "콩나물국":"Clear Bean Sprout Soup.jpg","맑은콩나물국":"Clear Bean Sprout Soup.jpg",
    "밥":"rice.jpg","백미밥":"rice.jpg","쌀밥":"rice.jpg"
  },

  fallbackRules: [
    {keywords:["푸딩","젤리"],file:"pudding.jpg"},
    {keywords:["쿠키"],file:"cookie.jpg"},
    {keywords:["케이크"],file:"cake.jpeg"},
    {keywords:["떡볶이"],file:"tteokbokki.jpg"},
    {keywords:["망고","주스","쥬스","음료"],file:"juice.jpg"},
    {keywords:["식혜"],file:"Sweet Rice Punch.jpg"},
    {keywords:["요구르트","요거트","발효유"],file:"yogurt.jpg"},
    {keywords:["우유"],file:"milk.jpg"},
    {keywords:["수박"],file:"watermelon.jpg"},
    {keywords:["사과"],file:"apologize.jpg"},

    {keywords:["멸치볶음","멸치"],file:"Myeolchi bokkeum.jpg"},
    {keywords:["감자조림","알감자"],file:"Gamja Jorim.jpg"},
    {keywords:["튀김","강정","탕수"],file:"fried.jpg"},
    {keywords:["과일샐러드","사라다"],file:"salad.jpg"},
    {keywords:["시금치"],file:"Spinach Namul.jpg"},
    {keywords:["깍두기"],file:"Kkakdugi.jpg"},
        {keywords:["계란후라이","달걀후라이"],file:"fried egg.jpg"},
    {keywords:["계란말이","달걀말이"],file:"egg roll.jpg"},
    {keywords:["고등어","생선구이","생선"],file:"Grilled Mackerel.jpg"},

    {keywords:["닭볶음탕","닭도리탕","닭조림"],file:"Spicy Braised Chicken.jpg"},
    {keywords:["케이준","치킨샐러드"],file:"Cajun chicken salad.jpg"},
    {keywords:["후라이드치킨","치킨","닭튀김"],file:"chicken.jpg"},
    {keywords:["함박","스테이크","밥스테이크"],file:"Hamburger Steak.jpg"},
    {keywords:["제육","돼지고기볶음","고추장불고기"],file:"Spicy Stir-fried Pork.jpg"},

    {keywords:["식빵","토스트","빵"],file:"white bread.jpg"},
    {keywords:["쫄면","비빔면"],file:"Spicy Chewy Noodles.jpg"},
    {keywords:["우동"],file:"Udon.jpg"},
    {keywords:["미소장국","미소국"],file:"Miso soup.jpg"},
    {keywords:["콩나물국"],file:"Clear Bean Sprout Soup.jpg"},
    {keywords:["밥","덮밥","볶음밥","비빔밥","주먹밥"],file:"rice.jpg"}
  ],

  fallbackDefault: "",

  englishQueries: [
    {keywords:["현미밥"],query:"brown rice bowl food"},
    {keywords:["잡곡밥"],query:"mixed grain rice bowl food"},
    {keywords:["미역국"],query:"korean seaweed soup food"},
    {keywords:["된장국"],query:"korean soybean paste soup food"},
    {keywords:["김치","깍두기"],query:"korean kimchi food"},
    {keywords:["계란후라이","달걀후라이"],query:"fried egg food"},
    {keywords:["구운김"],query:"roasted seaweed food"},
    {keywords:["돈가스","돈까스"],query:"pork cutlet food"},
    {keywords:["불고기"],query:"korean bulgogi food"},
    {keywords:["닭갈비"],query:"korean spicy chicken food"},
    {keywords:["스파게티"],query:"spaghetti food"},
    {keywords:["카레"],query:"curry rice food"},
    {keywords:["샐러드"],query:"salad food"},
    {keywords:["밥"],query:"rice bowl food"},
    {keywords:["국","탕","찌개"],query:"korean soup food"},
    {keywords:["면","국수"],query:"noodle food"},
    {keywords:["빵"],query:"bread food"},
    {keywords:["생선"],query:"grilled fish food"},
    {keywords:["고기","스테이크"],query:"cooked meat food"},
    {keywords:["과일"],query:"fresh fruit food"},
    {keywords:["우유"],query:"milk drink"},
    {keywords:["떡"],query:"korean rice cake food"}
  ]
};
