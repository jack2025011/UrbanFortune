// ========== 人生分析：像算命師聊天一樣的白話解說 ==========
// 用八字、紫微、生命靈數、生命塔羅與流年的結果，整理成一段一段的白話文。
// 這是程式依規則整理的內容，用來幫助自我了解，不是真人批命。
const RD_STAR={
"紫微":{tr:"你有一種天生的氣質，不用刻意表現，別人就會覺得你有分量。你愛面子、重尊嚴，想把事情做得有格調，也習慣當做決定的那個人。缺點是有時放不下身段，很需要被尊重。",
  fam:"家裡的人對你有期待，或你在家中是被倚重的角色。",love:"你要的是被尊重、被欣賞的感情，對方最好有格調，也要懂得給你面子。",
  work:"適合當主管、帶團隊或做需要負責的位置，不太適合一直被人指揮。",money:"你重視品質，花錢有品味，但不愛為小錢計較。",health:"要留意腸胃、頭部，還有因為過度操心造成的疲勞。"},
"天機":{tr:"你頭腦轉得快、點子多，愛研究也愛分析，很會觀察別人。缺點是想太多、容易猶豫，內心常常很忙。",
  fam:"家人之間話不一定很多，但你會默默分析、默默操心。",love:"你想要聊得來、腦袋有共鳴的對象，感情裡容易想太多。",
  work:"適合企劃、研究、顧問、技術、教學這類動腦的工作。",money:"你靠腦力和點子賺錢，不適合太衝動的投機。",health:"神經容易緊繃，要留意睡眠、肩頸和肝膽。"},
"太陽":{tr:"你像太陽一樣熱心、大方，喜歡照顧人，也愛發光發熱。常常付出比收穫多，要小心把自己累壞。",
  fam:"在家裡你是付出多、操心多的人，和父親或長輩的關係特別有感。",love:"你對感情很熱情、肯付出，也希望被看見、被肯定。",
  work:"適合服務、公職、教學、管理，或需要站在人前的工作。",money:"你靠名聲和人脈賺錢，花在人情和別人身上的也不少。",health:"要留意眼睛、心血管，還有過勞。"},
"武曲":{tr:"你務實、果斷、有毅力，對錢特別敏感，做事講求結果。不太愛說軟話，常讓人覺得你有點硬。",
  fam:"家裡比較少說情話，但你會用實際行動負責。",love:"你表達感情比較含蓄，常用「做」代替「說」，對方可能覺得不夠浪漫。",
  work:"適合財務、金融、業務、工程、管理這類重視結果的工作。",money:"你很會賺，也很會管錢，但容易為錢操心。",health:"要留意呼吸道、骨骼，還有肩頸的緊繃。"},
"天同":{tr:"你個性溫和、愛享受、不愛爭，容易知足，也帶點孩子氣。缺點是遇到挑戰容易想拖、想逃。",
  fam:"家裡氣氛通常比較輕鬆，你也是容易被疼愛的人。",love:"你重視相處的舒服與陪伴，不喜歡吵架。",
  work:"適合服務、藝術、餐飲、照護，這類輕鬆又有人情味的工作。",money:"財運平穩，但容易貪圖安逸，花在享受上的不少。",health:"要留意腸胃、泌尿，還有愛吃甜食、少運動的習慣。"},
"廉貞":{tr:"你情感強烈、有魅力，也有點倔強。愛恨分明，對在乎的事很執著，內心戲很多。",
  fam:"家人之間感情濃烈，偶爾有摩擦，但也有很深的牽絆。",love:"你愛得深，也容易糾結，要避免占有欲和情緒化。",
  work:"適合有挑戰性、需要魅力或專業判斷的工作，像法務、公關、設計、技術。",money:"賺錢可以很猛，但要小心因為情緒或人情花大錢。",health:"要留意血液循環、皮膚，還有情緒壓力。"},
"天府":{tr:"你穩重、有器度，愛守成，心裡很重視安全感和資產。你很會照顧人，也不愛冒險。",
  fam:"你是家裡的靠山，或是家人給你很穩的支持。",love:"你要穩定、踏實的感情，一旦認定就不輕易放手。",
  work:"適合管理、行政、金融、不動產這類穩定累積的工作。",money:"你很會存錢、守財，財運偏穩。",health:"整體體質不錯，要留意吃太多和體重。"},
"太陰":{tr:"你心思細膩、感情豐富、直覺強，也很重視家和安全感。有時多愁善感，愛把心事放在心裡。",
  fam:"你和母親或家中女性長輩的緣分特別深，也很重視家。",love:"你很溫柔體貼，需要被疼愛，也會默默付出。",
  work:"適合服務、設計、文字、照顧、財務細節等需要細心的工作。",money:"你會慢慢存、慢慢累積，不喜歡風險。",health:"要留意睡眠、情緒，還有婦科或泌尿，少熬夜。"},
"貪狼":{tr:"你多才多藝、愛交朋友、慾望也多，什麼都想嘗試。人緣好、有魅力，但容易三分鐘熱度、容易分心。",
  fam:"家裡可能比較熱鬧，也可能因為你愛往外跑而聚少離多。",love:"你桃花旺、愛玩，感情需要新鮮感，也要學習專一。",
  work:"適合業務、行銷、演藝、創意、公關這類社交型的工作。",money:"機會多、花費也多，要避免被慾望牽著走。",health:"要留意熬夜、飲食，還有菸酒過量。"},
"巨門":{tr:"你口才好、觀察力強，愛追根究柢，也很在意是非。有時說話太直、愛懷疑，容易被誤會。",
  fam:"家裡話多，也容易為了小事吵嘴，但你其實很關心大家。",love:"你很需要被理解，要避免用懷疑和挑剔傷到對方。",
  work:"適合老師、律師、主持、研究，這類需要說話或分析的工作。",money:"你靠口才和專業賺錢，要小心口舌是非帶來的損失。",health:"要留意口腔、腸胃，還有壓力引起的不舒服。"},
"天相":{tr:"你親切、有禮貌、愛幫忙，很會調解別人的關係，不愛衝突。有時太在意別人的看法，會有點優柔寡斷。",
  fam:"你是家裡的協調者，常幫大家說話、處理事情。",love:"你很體貼，願意配合對方，但也要說出自己的需要。",
  work:"適合行政、秘書、人資、顧問、輔佐型的工作。",money:"財運穩，靠信用和人緣，不適合冒險。",health:"要留意皮膚、腎臟，還有因為壓抑情緒產生的不適。"},
"天梁":{tr:"你穩重、愛照顧人，像長輩一樣可靠，常有貴人幫忙，也愛替人出頭。缺點是有點愛說教、愛操心。",
  fam:"你和長輩緣分深，也常是家裡扛責任的人。",love:"你的感情偏成熟，容易遇到年紀較大或像照顧者的對象。",
  work:"適合教育、醫療、公職、顧問、保險這類需要責任心的工作。",money:"財運穩，不靠投機，貴人運好。",health:"整體有福氣，但要留意腸胃和過度操心。"},
"七殺":{tr:"你果斷、敢衝、不怕挑戰，是天生的開路先鋒。個性直、脾氣急，人生起伏比較大，但也很能東山再起。",
  fam:"你和家人之間比較直接，可能很早就要學會獨立。",love:"你愛得直接，也容易說話太衝，需要學習柔軟。",
  work:"適合創業、軍警、業務，這類需要衝勁和決斷的工作。",money:"賺錢靠拚，起伏比較大，要留意風險。",health:"要留意外傷、開刀、急症，行事別太衝。"},
"破軍":{tr:"你敢破舊立新、不怕改變，愛挑戰常規。人生的轉折多，常常要從零重新開始，也因此累積了很多經驗。",
  fam:"你和家人的關係常有變動，可能搬家或比較早離家。",love:"感情起伏比較大，要學會穩定與承諾。",
  work:"適合創業、創新、改革，這類需要突破的工作。",money:"財運起伏大，容易大進大出，要養成存錢的習慣。",health:"要留意外傷、過勞，還有情緒波動。"}};

const RD_DEC=[
"這十年是在「認識自己、建立自己」的時期，你的個性和選擇會被放大，做什麼都容易回頭影響你自己。",
"這十年身邊的朋友、同事、兄弟姊妹特別有影響，合作和金錢往來要說清楚。",
"這十年的主角是感情和婚姻，容易遇到重要的對象、談婚論嫁，也要學習怎麼和另一個人好好相處。",
"這十年和孩子、晚輩、創作與桃花有關，可能生孩子、帶新人，也可能把才華發揮出來。",
"這十年重心在賺錢和理財，收入的變化比較大，適合建立穩定的財源和存錢的習慣。",
"這十年要特別注意身體，工作壓力和老毛病容易浮現，是改掉壞習慣、好好照顧自己的時候。",
"這十年機會在外面，可能出差、出國、搬家或換環境，在外要注意安全。",
"這十年人脈很重要，貴人和小人都會出現，要懂得看人，也不要隨便借錢或幫人擔保。",
"這十年是衝事業的時期，升遷、轉職、創業或考試都有機會，責任也會變重。",
"這十年和家、房子、家人有關，可能買房、搬家、裝修，也可能家人之間有些變化。",
"這十年重心在心情和興趣，容易想太多或追求享受，需要學會放鬆、調整心態。",
"這十年和父母、長輩、上司、學習與文件有關，可能進修考證、簽約，也可能要多照顧長輩。"];
const RD_PILLAR=["長輩、外在環境與老家","工作、兄弟姊妹與朋友","你自己和感情婚姻","子女、晚輩與晚年規劃"];

const rdBare=t=>String(t||"").replace(/^【[^】]*】/,"");
const rdStarList=i=>{const pm=lfPalaceMains(i);return{names:pm.names.slice(0,2),borrowed:pm.borrowed}};
const RD_LEAD={tr:"先說最核心的個性：",fam:"",love:"從紫微看你談感情的樣子：",work:"從紫微看你適合的工作：",money:"從紫微看你的財運：",health:"從紫微看你的身體："};
function rdStarText(i,field){
  const {names,borrowed}=rdStarList(i);if(!names.length)return"";
  const pre=borrowed?"這個位置沒有主星，借對面的星來看，所以會比較受環境和身邊的人影響。":"";
  return RD_LEAD[field]+pre+names.map((n,k)=>(k?"另外，":"")+RD_STAR[n][field]).join("");
}
const RD_MAXAGE=90;
const rdRange=d=>d&&d[0]<=RD_MAXAGE?d:null;
const rdP=t=>t?`<p>${lfEsc(t)}</p>`:"";
const rdSec=(title,body)=>`<div class="card lf-card rd"><h3>${title}</h3>${body}</div>`;

function rdAgeOfYear(Y){return Z_CUR?Y-Z_CUR.L.year+1:Y-S.y}   // 紫微用虛歲，沒有紫微時用實歲

function rdPersonality(cross){
  let h="";
  if(Z_CUR)h+=rdP(rdStarText(0,"tr"));
  if(BZ_CUR)h+=rdP(BZ_CUR.strong
    ?"從八字來看，你的底子比較有力，做事主動、有自己的主見，也扛得住壓力。不過太有主見的時候，要小心變得太硬、太愛自己來，偶爾聽聽別人的意見會更順。"
    :"從八字來看，你的個性比較柔軟、細膩，容易想很多，壓力也比較容易累積。你很需要身邊有支持你的人，遇到事情別一個人扛，找貴人幫忙會讓你輕鬆很多。");
  h+=rdP(`從你的生日數字來看，你的主命數是 ${LS.lifePath}。${rdBare(lifePathMeanings[LS.lifePath])}`);
  if(BZ_CUR){const g=lfGroups(),top=lfTop(g);if(top.length){const plain={"比劫":"你習慣靠自己，也很有競爭心。","食傷":"你有才華、愛表達，點子很多，不喜歡被框住。","財":"你很務實，對錢和成果比較敏感。","官殺":"你責任感重，也比較容易感受到壓力和被要求。","印":"你愛學習、愛思考，也容易得到長輩和貴人的幫忙。"};h+=rdP(plain[top[0]])}}
  if(cross&&cross.agree.length){const t=cross.agree.slice(0,3).map(([k])=>LF_TAGS[k][1]).join("；");h+=rdP(`有意思的是，不同的命盤都提到你有這些特質：${t}。這代表這些真的是你很明顯的樣子，可以放心把它們當成你的優點。`)}
  if(cross&&cross.diff.length){const d=cross.diff[0];h+=rdP(`另外，你心裡有一點小小的拉扯：一方面想要「${LF_TAGS[d.a][0]}」，另一方面又有「${LF_TAGS[d.b][0]}」的需要，所以有時候會猶豫。這很正常，先想清楚現在哪一個比較重要就好。`)}
  return rdSec("一、先聊聊你這個人",h);
}
function rdFamily(){
  let h="";
  if(Z_CUR){h+=rdP("【父母與長輩】"+rdStarText(11,"fam"));h+=rdP("【家庭與家運】"+rdStarText(9,"fam"))}
  if(BZ_CUR){const g=lfGroups();
    h+=rdP(g["印"]>=2?"從八字看，你的長輩緣和貴人運不錯，從小到大比較容易得到照顧和提點。":g["印"]===0?"從八字看，你比較不會被長輩特別照顧，很多事情要靠自己，所以你比同齡的人更早學會獨立。":"從八字看，你和長輩之間的緣分算正常，有需要時也找得到人幫忙。");
    if(g["比劫"]>=3)h+=rdP("你身邊兄弟姊妹或同輩的影響很大，感情好的時候互相扶持，但也容易有競爭或金錢往來，這部分要說清楚、算清楚。");
  }
  return h?rdSec("二、家裡的狀況",h):"";
}
function rdLove(){
  let h="";
  if(Z_CUR)h+=rdP(rdStarText(2,"love"));
  if(BZ_CUR){const dayBranch=BZ_CUR.P[2][1],ss=shishen(BZ_CUR.me,HIDDEN[dayBranch][0]),sp=LF_SPOUSE[ss];if(sp)h+=rdP(`從八字看你未來的另一半：${sp[0]}。`);
    const G=lfGroups();
    if(S.gender){const star=S.gender==="男"?G["財"]:G["官殺"];h+=rdP(star===0?"你命盤中的感情緣分來得比較晚，或比較被動，所以別等著對方出現，主動認識新朋友會有幫助。":star>=3?"你的異性緣不錯，機會很多，但也容易心動、分心，要學會專一，也要懂得取捨。":"你的感情緣分算正常，遇到對的人會願意認真經營。")}
  }
  if(TAROT_CUR){const nm=TAROT_CUR.key(TAROT_CUR.c[2]),d=LOVE_ANALYSIS_DATA[nm];if(d)h+=rdP(`塔羅的愛情牌是「${nm}」，代表你談感情的風格是：${d.style} 要留意的是：${d.weakness}`)}
  if(Z_CUR){const d=rdRange(Z_CUR.palaces[2].dx);if(d)h+=rdP(`紫微看感情婚姻最重要的時期，大概在 ${d[0]}～${d[1]} 歲，這十年容易遇到重要的對象，或是感情有大的變化。`)}
  return h?rdSec("三、感情與婚姻",h):"";
}
function rdWork(){
  let h="";
  if(Z_CUR)h+=rdP(rdStarText(8,"work"));
  if(BZ_CUR){const g=lfGroups(),top=lfTop(g);if(top.length)h+=rdP("從八字看，"+LF_GROUP_CAREER[top[0]]);
    if(BZ_CUR.strong&&g["官殺"]>=2)h+=rdP("你扛得起責任，可以往管理或負責的位置發展。");
    if(!BZ_CUR.strong&&g["官殺"]>=3)h+=rdP("你的壓力偏重，建議先把自己的能力補足、找到貴人支持，再去接太大的責任。")}
  h+=rdP(`以你的主命數 ${LS.lifePath} 來看，${LF_NUM_CAREER[LS.lifePath]||""}。`);
  if(TAROT_CUR){const nm=TAROT_CUR.key(TAROT_CUR.c.career),d=CAREER_ANALYSIS_DATA[nm];if(d)h+=rdP(`塔羅的事業牌是「${nm}」。${d.main}適合的方向：${d.suitable_job} 要避開：${d.forbidden}`)}
  if(Z_CUR){const d=rdRange(Z_CUR.palaces[8].dx);if(d)h+=rdP(`紫微看事業衝刺最重要的時期，大概在 ${d[0]}～${d[1]} 歲，升遷、轉職或創業的機會比較多。`)}
  return rdSec("四、事業與工作",h);
}
function rdMoney(){
  let h="";
  if(Z_CUR)h+=rdP(rdStarText(4,"money"));
  if(BZ_CUR){const g=lfGroups();
    h+=rdP(g["財"]===0?"從八字看，你的財運不是靠運氣型，而是靠專業和長期累積，不要想一夜致富，也不要碰投機。":BZ_CUR.strong?"從八字看，你有力氣接住財運，看到好機會可以積極一點。":g["財"]>=3?"從八字看，你的賺錢機會很多，但容易力不從心，要量力而為，不要什麼都想要。":"從八字看，你的財運穩穩的，靠人脈和貴人會帶來機會。");
    if(g["食傷"]>=2)h+=rdP("你可以靠才華、技能和創意賺錢，把你的專長變成收入。");
    if(g["比劫"]>=3)h+=rdP("你身邊競爭和花費比較多，容易破財，所以合夥、借錢給人、幫人擔保這三件事要特別小心。")}
  if(Z_CUR){const d=rdRange(Z_CUR.palaces[4].dx);if(d)h+=rdP(`紫微看賺錢和理財的重心時期，大概在 ${d[0]}～${d[1]} 歲，收入會有明顯的變化，這時候要特別存錢、保險和理財要先做好。`)}
  return h?rdSec("五、錢的方面",h):"";
}
function rdHealth(){
  let h="";
  if(Z_CUR)h+=rdP(rdStarText(5,"health"));
  if(BZ_CUR){const sc=BZ_CUR.score;let any=false;
    LF_WX.forEach(w=>{if(sc[w]>=20){any=true;h+=rdP(`你的命盤「${w}」特別強，要留意${LF_HEALTH[w]}。`)}else if(sc[w]<=3){any=true;h+=rdP(`你的命盤「${w}」比較弱，平常可以多保養${LF_HEALTH[w]}。`)}});
    if(!any)h+=rdP("你的五行分布算平均，體質上沒有特別偏的地方。");
    if(!BZ_CUR.strong)h+=rdP("你的體力和精神比較容易耗損，作息和休息要顧好，不要硬撐。")}
  if(Z_CUR){const d=rdRange(Z_CUR.palaces[5].dx);if(d)h+=rdP(`紫微看健康要特別注意的時期，大概在 ${d[0]}～${d[1]} 歲，這十年要定期健康檢查、早睡、運動，有小警訊要早點處理。`)}
  h+=rdP("提醒你，這裡是依命盤整理的體質傾向，不是診斷，身體有不舒服還是要看醫生。");
  return rdSec("六、身體健康",h);
}
function rdDecades(){
  const dec=lfDecades();
  if(!dec)return rdSec("七、人生每個階段，幾歲會遇到什麼",rdP(Z_CUR?"填寫性別後，才能排出每十年的人生階段。":"填寫時辰和性別後，才能排出每十年的人生階段。"));
  let h=rdP("人生每十年會走到不同的重點，下面幫你一段一段說。年紀用的是虛歲（出生算 1 歲）。");
  const out=dec.list.filter(p=>p.dx[0]<=RD_MAXAGE).map(p=>{
    const cur=dec.age>=p.dx[0]&&dec.age<=p.dx[1],past=dec.age>p.dx[1],tag=cur?"目前就在這十年":past?"已經走過":"還沒到";
    const m=lfPalaceMains(p.i).names,hard=m.some(n=>LF_HARD_STARS.has(n)),good=m.length&&m.every(n=>LF_GOOD_STARS.has(n));
    const tone=!m.length?"這十年受環境和身邊的人影響比較大。":good?"整體偏順，把握機會就好。":hard?"起伏會比較大，但你有能力面對。":"有順有逆，穩穩走就好。";
    const parts=ZW_SIHUA[p.gan].map((star,k)=>{const q=Z_CUR.palaces.find(pp=>pp.stars.some(s=>s.n===star));return q?{k,q}:null}).filter(Boolean);
    const lu=parts.find(x=>x.k===0),ji=parts.find(x=>x.k===3);
    const extra=(lu?`這十年「${ZW_SHORT[lu.q.i]}」方面比較容易有機會、比較順。`:"")+(ji?`「${ZW_SHORT[ji.q.i]}」方面比較容易卡住或放不下，要多留心。`:"");
    return`<div class="rd-dec${cur?" cur":""}${past?" past":""}"><div class="rd-dh"><b>${p.dx[0]}～${p.dx[1]} 歲</b><em>${tag}</em></div>
      <p>${lfEsc(RD_DEC[p.i])}${lfEsc(tone)}${lfEsc(extra)}</p><p class="rd-adv">建議：${lfEsc(LF_DEC_ADVICE[p.i])}</p></div>`}).join("");
  return rdSec("七、人生每個階段，幾歲會遇到什麼",h+out);
}
function rdKeyAges(){
  if(!Z_CUR||!Z_CUR.palaces[0].dx)return"";
  const items=[[2,"感情、婚姻的重要時期"],[8,"事業衝刺的時期"],[4,"賺錢、理財的重心"],[5,"要特別照顧身體"],[9,"買房、搬家、家運變化"],[6,"外出、換環境的機會"],[3,"孩子、創作和桃花"],[11,"長輩、進修、簽約文件"]];
  const lis=items.map(([i,t])=>{const d=rdRange(Z_CUR.palaces[i].dx);return d?`<li><b>${d[0]}～${d[1]} 歲</b>　${t}</li>`:""}).join("");
  return rdSec("八、幾個要特別記得的年紀",rdP("把上面的階段濃縮成一張清單，方便你記：")+`<ul class="rd-keys">${lis}</ul>`);
}
function rdYear(Y){
  const age=rdAgeOfYear(Y),yg=mod(Y-4,10),yz=mod(Y-4,12);let lines=[],score=0;
  const n=(Y===(LN_CUR&&LN_CUR.Yc)&&LN_CUR)?LN_CUR.n0:(Y===(LN_CUR&&LN_CUR.Yc+1)&&LN_CUR?LN_CUR.n1:liunianNum(Y));
  const a=LIU_NIAN_ANALYSIS[n];
  lines.push(`這一年的主題是「${a.theme}」。${a.advice}`);
  if(Z_CUR){const pal=Z_CUR.palaces.find(p=>p.b===yz);if(pal)lines.push(`生活的重心會放在「${ZW_SHORT[pal.i]}」。`);
    const parts=ZW_SIHUA[yg].map((star,k)=>{const q=Z_CUR.palaces.find(pp=>pp.stars.some(s=>s.n===star));return q?{k,q}:null}).filter(Boolean);
    const lu=parts.find(x=>x.k===0),ji=parts.find(x=>x.k===3);
    if(lu){if([0,2,4,8].includes(lu.q.i))score++;lines.push(`「${ZW_SHORT[lu.q.i]}」方面比較容易有機會、比較順。`)}
    if(ji){if([0,2,4,5,8].includes(ji.q.i))score--;lines.push(`「${ZW_SHORT[ji.q.i]}」方面容易卡關或放不下，要多留心。`)}}
  if(BZ_CUR){const ss=shishen(BZ_CUR.me,yg);lines.push(`從八字看：${LF_SS_YEAR[ss]}。`);
    ["年","月","日","時"].forEach((nm,i)=>{const z=BZ_CUR.P[i][1];if(mod(z+6,12)===yz){if(i===1||i===2)score--;lines.push(`今年和你的${nm}柱相沖，代表「${RD_PILLAR[i]}」比較容易有變動，凡事多留意。`)}else if(mod(13-z,12)===yz){if(i===1||i===2)score++;lines.push(`今年和你的${nm}柱相合，「${RD_PILLAR[i]}」比較容易有順利的機會。`)}})}
  return`<div class="rd-yr"><div class="rd-dh"><b>${Y} 年（約 ${age} 歲）</b>${score>=1?'<em class="g">比較順</em>':score<=-1?'<em class="w">要留意</em>':'<em>平穩</em>'}</div>${lines.map(l=>`<p>${lfEsc(l)}</p>`).join("")}</div>`;
}
function rdYears(){
  const Y0=new Date().getFullYear();
  const list=Array.from({length:10},(_,i)=>rdYear(Y0+i)).join("");
  return rdSec("九、接下來十年，每一年的狀況",rdP("流年都是從你的生日換年。標「比較順」的年份可以大膽一點，標「要留意」的年份請放慢腳步、多確認，「平穩」的年份照自己的節奏走就好。")+list);
}
function rdClosing(cross){
  let h="";
  if(BZ_CUR&&BZ_CUR.yong&&BZ_CUR.yong.length){const ys=BZ_CUR.yong.slice(0,2);h+=rdP(`有一個小方向給你：從八字來看，「${ys.join("、")}」對你比較有幫助，可以多接近這些元素，像是${ys.map(w=>LF_ELEM_ADV[w]).join("；")}。`)}
  h+=rdP("最後想跟你說，命盤講的是「傾向」，不是註定。好的地方，你可以放大它；需要留意的地方，就當成一個溫柔的提醒，提早準備就好。你的人生還是掌握在你自己手上。");
  h+=rdP("如果你心裡有特別想問的，例如感情、工作要不要換，可以拿這份內容當參考，再多和信任的人聊一聊。");
  return rdSec("十、最後想跟你說",h);
}
function lfReadingHtml(cross){
  const name=S.name?lfEsc(S.name):"你";
  const intro=`<div class="card lf-card rd"><h3>✦ 來，我們慢慢聊</h3>
    <p>${name}好，我把你的八字、紫微斗數、生命靈數和塔羅一起看過了。下面我用比較白話的方式，一段一段跟你說：先講你的個性，再講家裡、感情、事業、錢和身體，接著是人生每個階段和接下來每一年。</p>
    <p class="rd-note">這是依命盤規則整理出來的解說，用來幫你更了解自己，不是真人批命，請當作參考。</p></div>`;
  return intro+rdPersonality(cross)+rdFamily()+rdLove()+rdWork()+rdMoney()+rdHealth()+rdDecades()+rdKeyAges()+rdYears()+rdClosing(cross);
}
