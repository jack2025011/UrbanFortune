// ========== 人生分析：整合八字、紫微、生命靈數、生命塔羅與流年，做交叉對比 ==========
// 說明：這是程式依命盤規則整理的分析（不是真人批命），用來看「哪些特質被多個系統同時指出」與「系統之間看法的差異」。
const LF_WX=["木","火","土","金","水"];
const LF_TAGS={
  lead:["領導主導","有主見、願意承擔、帶動他人"],start:["開創行動","行動力強、敢衝敢試、不怕從零開始"],
  steady:["穩健守成","重視安全感與計畫，做事踏實"],think:["思考分析","愛研究、善於策劃與判斷"],
  express:["表達創意","口才或才藝出眾，有創作與表現力"],people:["重人際","重視關係、擅長協調與合作"],
  care:["照顧付出","樂於幫助人、有責任心與愛心"],feel:["重感情","情感豐富、重視親密與連結"],
  free:["自由變動","愛變化、不喜歡被框住"],duty:["責任紀律","重承諾、守規矩、能扛壓"],
  wealth:["重財務實","對金錢與資源敏感，重成果"],honor:["重名聲地位","在意形象、成就與被認可"],
  learn:["學習求知","好學、重視知識與成長"],solo:["獨立自主","習慣靠自己、不愛依賴"],
  pressure:["壓力競爭","環境挑戰多、競爭或壓力大"],luck:["貴人助力","容易得到長輩或朋友的幫助"],
  inner:["內省敏感","內在世界豐富、心思細膩"],social:["交際魅力","人緣好、有吸引力、愛熱鬧"]};
const LF_CONFLICT=[["steady","free"],["inner","social"]];
const LF_STAR_TAGS={"紫微":["lead","honor"],"天機":["think","free"],"太陽":["care","honor"],"武曲":["wealth","duty","solo"],"天同":["people","luck"],
  "廉貞":["feel","honor","pressure"],"天府":["steady","wealth"],"太陰":["inner","feel","steady"],"貪狼":["social","express","free"],"巨門":["think","express","pressure"],
  "天相":["care","people","duty"],"天梁":["care","luck","duty"],"七殺":["start","solo","pressure"],"破軍":["start","free","pressure"]};
const LF_GROUP_TAGS={"比劫":["solo","pressure"],"食傷":["express","free"],"財":["wealth","steady"],"官殺":["duty","pressure","honor"],"印":["learn","luck","inner"]};
const LF_NUM_TAGS={1:["lead","start","solo"],2:["people","inner"],3:["express","social"],4:["steady","duty"],5:["free","start"],6:["care","duty","people"],7:["think","inner","learn"],8:["wealth","honor","lead"],9:["care","learn"],11:["inner","think"],22:["lead","duty"],33:["care","people"]};
const LF_TAROT_TAGS={1:["start","express"],2:["inner","think"],3:["care","steady"],4:["lead","duty"],5:["learn","people"],6:["feel","people"],7:["start","lead"],8:["duty","care"],9:["think","inner","solo"],10:["free","luck"],11:["duty","think"],12:["care","inner"],13:["free","pressure"],14:["people","steady"],15:["wealth","social"],16:["pressure","free"],17:["luck","inner"],18:["inner","feel"],19:["social","start"],20:["learn","duty"],21:["honor","social"],22:["free","start"]};
const LF_GROUP_TEXT={
  "比劫":"比劫（同輩、競爭）突出，凡事習慣靠自己，也容易遇到競爭與金錢糾葛。",
  "食傷":"食傷（才華、表達）突出，有創意與口才，想法多、不愛受拘束。",
  "財":"財星（財、務實）突出，重視成果與資源，做事講求實際。",
  "官殺":"官殺（責任、壓力）突出，能扛責任與規範，也容易感到壓力與被要求。",
  "印":"印星（學習、貴人）突出，好學、有長輩與貴人緣，思考偏內在。"};
const LF_GROUP_CAREER={"比劫":"獨立打拚型，適合自己做主的工作；合夥、借貸要寫清楚。","食傷":"才華與表達是你的資本，適合創作、企劃、教學、技術或自媒體。","財":"重視成果與資源，適合業務、財務、經營與實務管理。","官殺":"能扛責任與壓力，適合在制度或組織中升遷，或需要紀律與決斷的工作。","印":"適合專業、學習型與文教工作，靠證照、知識與長輩提攜累積。"};
const LF_NUM_CAREER={1:"適合自己創業、領導或獨當一面的職位",2:"適合需要合作與協調的工作，如顧問、人資、行政",3:"適合創意、傳播、教學、表演與行銷",4:"適合需要紀律與規劃的工作，如工程、財務、管理",5:"適合需要變化與接觸人的工作，如業務、旅遊、貿易",6:"適合服務、教育、醫護、照顧型的工作",7:"適合研究、技術、分析與專業顧問",8:"適合管理、金融、經營與商業，重視成就",9:"適合公益、教育、藝術與跨領域的助人工作",11:"適合靈感型、諮詢、藝術或身心靈相關的工作",22:"適合大型計畫、建設、組織與管理",33:"適合教育、療癒與服務性質的志業"};
const LF_SPOUSE={"比肩":["伴侶像朋友、各有主見，感情中要留意主導權與金錢分攤",0],"劫財":["感情中容易有競爭者，財務分配要說清楚",-1],"食神":["伴侶溫和體貼、懂生活，感情氣氛輕鬆",1],"傷官":["伴侶聰明有個性、口才強，容易為小事爭執，要多包容",-1],"偏財":["異性緣好、感情多彩，出手大方",0],"正財":["伴侶務實顧家，感情穩定踏實",1],"七殺":["伴侶強勢有魄力，感情磨合與壓力較多",-1],"正官":["伴侶端正重責任，感情態度正派",1],"偏印":["伴侶有自己的世界，感情中需要保留空間",-1],"正印":["伴侶體貼像照顧者，感情中有安全感",1]};
const LF_SS_YEAR={"比肩":"同輩與朋友的助力與競爭並存，宜主動爭取，留意金錢分攤","劫財":"花費與競爭加大，合夥借貸要謹慎，宜守成","食神":"才華發揮、生活愉快，適合學習、創作與享受生活","傷官":"表達欲與突破力強，容易挑戰權威或有口舌，宜用在創作與專業","偏財":"有機會、人脈與副業，宜把握但避免投機","正財":"收入穩定、務實進帳，適合規劃儲蓄與穩健理財","七殺":"壓力與挑戰增加，也是磨練與突破的一年，要穩住情緒與健康","正官":"責任與名聲提升，適合進修、升遷與守規矩的發展","偏印":"靈感與研究增加，適合學習專業、獨處沉澱，注意想太多","正印":"貴人與學習運佳，適合進修、考證與取得支持"};
const LF_HEALTH={"木":"肝膽、筋骨、眼睛與情緒壓力","火":"心血管、血壓、睡眠與眼睛","土":"脾胃消化與體重","金":"呼吸道、皮膚與大腸","水":"腎臟泌尿、生殖系統、睡眠與手腳冰冷"};
const LF_ELEM_ADV={"木":"綠色系、東方，領域如教育文化、出版、植栽、設計","火":"紅橘色系、南方，領域如傳播、能源、餐飲、行銷","土":"黃棕色系、中央，領域如不動產、農業、顧問、行政","金":"白金色系、西方，領域如金融、機械、法律、科技","水":"黑藍色系、北方，領域如貿易、物流、旅遊、水相關行業"};
const LF_GOOD_STARS=new Set(["紫微","天府","太陽","天梁","武曲","太陰","天同","天相"]);
const LF_HARD_STARS=new Set(["七殺","破軍","巨門","廉貞"]);
const LF_GOOD_AUX=new Set(["左輔","右弼","天魁","天鉞","文昌","文曲","祿存","天喜","紅鸞"]);
const LF_BAD_AUX=new Set(["擎羊","陀羅","火星","鈴星","地劫","地空"]);
const LF_NOBLE_SHA=["天乙","太極","福德","龍德","天德","月德","月德合","天德合","文昌","國印","祿神"];

// ---------- 工具 ----------
const lfEsc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lfSum=(c,names)=>names.reduce((a,n)=>a+(c[n]||0),0);
const lfFirst=t=>String(t).split(/[；;。]/)[0];
function lfGroups(){const c=BZ_CUR.cntS;return{"比劫":lfSum(c,["比肩","劫財"]),"食傷":lfSum(c,["食神","傷官"]),"財":lfSum(c,["偏財","正財"]),"官殺":lfSum(c,["七殺","正官"]),"印":lfSum(c,["偏印","正印"])}}
function lfTop(g){const mx=Math.max(...Object.values(g));return mx>=2?Object.keys(g).filter(k=>g[k]===mx):[]}
const lfMains=p=>p.stars.filter(s=>s.main).map(s=>s.n);
function lfPalaceMains(i){                         // 該宮主星；沒有就借對宮
  const p=Z_CUR.palaces[i],m=lfMains(p);
  if(m.length)return{names:m,borrowed:false};
  const q=lfMains(Z_CUR.palaces[(i+6)%12]);return{names:q,borrowed:true};
}
function lfSihuaIn(i){                              // 該宮的四化
  const p=Z_CUR.palaces[i],out=[];
  p.stars.forEach(s=>{const k=Z_CUR.sihua[s.n];if(k!==undefined)out.push({n:s.n,k})});return out;
}
const lfSig=(sys,tone,text)=>({sys,tone,text});
function lfCross(T){                                 // 由各系統的標籤做交叉對比
  const cnt={};Object.entries(T).forEach(([sys,set])=>set.forEach(t=>{(cnt[t]=cnt[t]||[]).push(sys)}));
  const agree=Object.entries(cnt).filter(([,s])=>s.length>=2).sort((a,b)=>b[1].length-a[1].length);
  const diff=[];LF_CONFLICT.forEach(([a,b])=>{const A=cnt[a]||[],B=cnt[b]||[];if(A.length&&B.length&&(A.some(x=>!B.includes(x))||B.some(x=>!A.includes(x))))diff.push({a,b,A,B})});
  return{agree,diff,cnt};
}

// ---------- 各系統的性格標籤 ----------
function lfPersonalityTags(){
  const T={};
  if(BZ_CUR){const s=new Set(),g=lfGroups();(BZ_CUR.strong?["lead","solo"]:["luck","people"]).forEach(t=>s.add(t));lfTop(g).forEach(k=>LF_GROUP_TAGS[k].forEach(t=>s.add(t)));T["八字"]=s}
  if(Z_CUR){const s=new Set();lfPalaceMains(0).names.forEach(n=>(LF_STAR_TAGS[n]||[]).forEach(t=>s.add(t)));T["紫微"]=s}
  T["靈數"]=new Set(LF_NUM_TAGS[LS.lifePath]||[]);
  if(TAROT_CUR){const s=new Set();[1,3].forEach(i=>(LF_TAROT_TAGS[TAROT_CUR.c[i]]||[]).forEach(t=>s.add(t)));T["塔羅"]=s}
  return T;
}

// ---------- 各領域的指標 ----------
function lfCareer(){
  const out=[];
  if(BZ_CUR){const g=lfGroups(),top=lfTop(g);
    if(top.length)top.forEach(k=>out.push(lfSig("八字",1,`${LF_GROUP_CAREER[k]}`)));
    else out.push(lfSig("八字",0,"十神分佈平均，沒有特別偏重，適應面廣，可依興趣與環境選擇方向。"));
    if(BZ_CUR.strong&&g["官殺"]>=2)out.push(lfSig("八字",1,"身強而官殺有力，能承擔責任與壓力，適合往管理與負責的位置發展。"));
    if(!BZ_CUR.strong&&g["官殺"]>=3)out.push(lfSig("八字",-1,"官殺多而身弱，壓力偏重，宜先充實自己、爭取貴人與資源再承擔大責任。"));
    if(!BZ_CUR.strong&&g["印"]===0)out.push(lfSig("八字",-1,"身弱又缺印星，事業上較少得到支持，要多經營人脈、持續進修。"));
  }
  if(Z_CUR){const pm=lfPalaceMains(8);
    pm.names.forEach(n=>out.push(lfSig("紫微",LF_GOOD_STARS.has(n)?1:0,`官祿宮${pm.borrowed?"借":"坐"}${n}：${ZW_STAR_PALACE[n][8]}`)));
    lfSihuaIn(8).forEach(h=>out.push(lfSig("紫微",h.k===3?-1:1,`${h.n}化${ZW_SH_NAME[h.k]}入官祿宮：${ZW_SH_TEXT[h.k]}。`)));
  }
  out.push(lfSig("靈數",0,`主命數 ${LS.lifePath}：${LF_NUM_CAREER[LS.lifePath]||""}。`));
  [[1,5,9],[4,5,6],[1,2,3]].forEach(p=>{const m=connectionMeanings[p.join("")];if(m&&p.every(n=>LS.marked.has(n)))out.push(lfSig("靈數",1,`九宮格有${m.name}：${m.trait}`))});
  if(TAROT_CUR){const nm=TAROT_CUR.key(TAROT_CUR.c.career),d=CAREER_ANALYSIS_DATA[nm];
    if(d){out.push(lfSig("塔羅",0,`事業牌「${nm}」：${d.main}適合：${d.suitable_job}`));out.push(lfSig("塔羅",-1,`事業牌提醒：${d.forbidden}`))}}
  return out;
}
function lfMoney(){
  const out=[];
  if(BZ_CUR){const g=lfGroups();
    if(g["財"]===0)out.push(lfSig("八字",0,"命盤財星不明顯，財運偏向靠專業與長期積累，不宜貪快、不宜投機。"));
    else if(BZ_CUR.strong)out.push(lfSig("八字",1,"身強而見財星，有力量承接財運，賺錢機會可以積極把握。"));
    else if(g["財"]>=3)out.push(lfSig("八字",-1,"財星多而身弱，機會多卻容易力不從心，要量力而為、避免貪多。"));
    else out.push(lfSig("八字",0,"財星適中但日主偏弱，宜穩健累積，靠人脈與貴人帶來機會。"));
    if(g["食傷"]>=2)out.push(lfSig("八字",1,"食傷有力，可以靠才華、技能與創意變現（食傷生財）。"));
    if(g["比劫"]>=3)out.push(lfSig("八字",-1,"比劫多，競爭與花費大、容易破財，合夥與借貸要特別小心。"));
  }
  if(Z_CUR){[[4,"財帛宮"],[9,"田宅宮"]].forEach(([i,nm])=>{const pm=lfPalaceMains(i);
    pm.names.forEach(n=>out.push(lfSig("紫微",LF_GOOD_STARS.has(n)&&i===4?1:0,`${nm}${pm.borrowed?"借":"坐"}${n}：${ZW_STAR_PALACE[n][i]}`)));
    lfSihuaIn(i).forEach(h=>out.push(lfSig("紫微",h.k===3?-1:(h.k===0?1:0),`${h.n}化${ZW_SH_NAME[h.k]}入${nm}：${ZW_SH_TEXT[h.k]}。`)));
    if(i===4&&Z_CUR.palaces[i].stars.some(s=>s.n==="祿存"))out.push(lfSig("紫微",1,"財帛宮有祿存，財庫穩，宜守成累積。"));});}
  if([8,4].includes(LS.lifePath))out.push(lfSig("靈數",1,`主命數 ${LS.lifePath}：重視成果與資源，具理財與經營的潛力。`));
  [[1,4,7],[4,8]].forEach(p=>{const m=connectionMeanings[p.join("")];if(m&&p.every(n=>LS.marked.has(n)))out.push(lfSig("靈數",1,`九宮格有${m.name}：${m.trait}`))});
  if(!out.some(o=>o.sys==="靈數"))out.push(lfSig("靈數",0,`主命數 ${LS.lifePath}：財運靠自己的專長與努力累積。`));
  return out;
}
function lfLove(){
  const out=[],male=S.gender==="男",female=S.gender==="女";
  if(BZ_CUR){const dayBranch=BZ_CUR.P[2][1],g=HIDDEN[dayBranch][0],ss=shishen(BZ_CUR.me,g),sp=LF_SPOUSE[ss];
    out.push(lfSig("八字",sp[1],`配偶宮（日支${ZHI[dayBranch]}）本氣為「${ss}」：${sp[0]}。`));
    const G=lfGroups();
    if(male||female){const star=male?G["財"]:G["官殺"],nm=male?"妻星（財）":"夫星（官殺）";
      out.push(lfSig("八字",star===0?-1:(star>=3?0:1),star===0?`命盤${nm}不明顯，感情緣分來得較晚或較被動，要主動創造機會。`:star>=3?`${nm}多，異性緣旺但容易分心，需要專一與取捨。`:`${nm}適中，感情有機會，也能較穩定地經營。`))}
    const dayShas=BZ_CUR.ss[2]||[];
    ["桃花","紅鸞","紅豔"].filter(n=>dayShas.includes(n)).forEach(n=>out.push(lfSig("八字",1,`日柱帶${n}，異性緣與感情魅力佳。`)));
    ["孤辰","寡宿","孤鸞煞","陰差陽錯"].filter(n=>dayShas.includes(n)).forEach(n=>out.push(lfSig("八字",-1,`日柱帶${n}，感情路上較孤單或磨合較多，需要主動經營。`)));
  }
  if(Z_CUR){const pm=lfPalaceMains(2);
    pm.names.forEach(n=>out.push(lfSig("紫微",LF_GOOD_STARS.has(n)?1:(LF_HARD_STARS.has(n)?-1:0),`夫妻宮${pm.borrowed?"借":"坐"}${n}：${ZW_STAR_PALACE[n][2]}`)));
    lfSihuaIn(2).forEach(h=>out.push(lfSig("紫微",h.k===3?-1:1,`${h.n}化${ZW_SH_NAME[h.k]}入夫妻宮：${ZW_SH_TEXT[h.k]}。`)));
    const aux=Z_CUR.palaces[2].stars.filter(s=>!s.main).map(s=>s.n);
    const good=aux.filter(n=>LF_GOOD_AUX.has(n)),bad=aux.filter(n=>LF_BAD_AUX.has(n));
    if(good.length)out.push(lfSig("紫微",1,`夫妻宮有${good.join("、")}，感情中容易得到助力與喜氣。`));
    if(bad.length)out.push(lfSig("紫微",-1,`夫妻宮有${bad.join("、")}，感情中容易有衝突、起伏或情緒壓力。`));
  }
  [[2,5,8],[2,6],[3,5,7]].forEach(p=>{const m=connectionMeanings[p.join("")];if(m&&p.every(n=>LS.marked.has(n)))out.push(lfSig("靈數",1,`九宮格有${m.name}：${m.trait}`))});
  if(TAROT_CUR){const nm=TAROT_CUR.key(TAROT_CUR.c[2]),d=LOVE_ANALYSIS_DATA[nm];
    if(d){out.push(lfSig("塔羅",0,`愛情牌「${nm}」：${d.style}`));out.push(lfSig("塔羅",-1,`愛情牌提醒：${d.weakness}`))}}
  return out;
}
function lfPeople(){
  const out=[];
  if(BZ_CUR){const g=lfGroups();
    if(g["印"]>=2)out.push(lfSig("八字",1,"印星有力，長輩、貴人與學習的助力多。"));
    else if(g["印"]===0)out.push(lfSig("八字",0,"印星不明顯，貴人較不顯著，人脈要靠自己經營。"));
    if(g["比劫"]>=3)out.push(lfSig("八字",-1,"比劫多，同輩之間競爭與金錢往來較多，交友要看人品、金錢要分清。"));
    const flat=[].concat(...BZ_CUR.ss),noble=LF_NOBLE_SHA.filter(n=>flat.includes(n));
    if(noble.length>=2)out.push(lfSig("八字",1,`命帶${noble.slice(0,4).join("、")}等貴人星，關鍵時刻容易有人相助。`));
    if(flat.includes("孤辰")||flat.includes("寡宿"))out.push(lfSig("八字",-1,"命帶孤辰或寡宿，偏獨來獨往，要刻意經營親友關係。"));
  }
  if(Z_CUR){[[11,"父母宮"],[1,"兄弟宮"],[7,"交友宮"]].forEach(([i,nm])=>{const pm=lfPalaceMains(i);
    pm.names.forEach(n=>out.push(lfSig("紫微",LF_GOOD_STARS.has(n)?1:(LF_HARD_STARS.has(n)?-1:0),`${nm}${pm.borrowed?"借":"坐"}${n}：${ZW_STAR_PALACE[n][i]}`)));
    lfSihuaIn(i).forEach(h=>out.push(lfSig("紫微",h.k===3?-1:1,`${h.n}化${ZW_SH_NAME[h.k]}入${nm}：${ZW_SH_TEXT[h.k]}。`)));});}
  [[3,5,7]].forEach(p=>{const m=connectionMeanings[p.join("")];if(m&&p.every(n=>LS.marked.has(n)))out.push(lfSig("靈數",1,`九宮格有${m.name}：${m.trait}`))});
  if([6,2,9,33].includes(LS.lifePath))out.push(lfSig("靈數",1,`主命數 ${LS.lifePath}：重視關係與付出，人緣與家庭責任感是你的特色。`));
  return out;
}
function lfHealth(){
  const out=[];
  if(BZ_CUR){const sc=BZ_CUR.score;let ext=false;
    LF_WX.forEach(w=>{if(sc[w]>=20){ext=true;out.push(lfSig("八字",-1,`${w}行過旺（${Math.round(sc[w])} 分），要留意${LF_HEALTH[w]}。`))}
      else if(sc[w]<=3){ext=true;out.push(lfSig("八字",-1,`${w}行偏弱（${Math.round(sc[w])} 分），可多留意${LF_HEALTH[w]}的保養。`))}});
    if(!ext)out.push(lfSig("八字",1,"五行分佈相對均衡，沒有特別過旺或過弱的一行，體質上的偏頗較不明顯。"));
    if(!BZ_CUR.strong)out.push(lfSig("八字",0,"日主偏弱，體力與精神較容易耗損，作息與休息要顧好。"));
  }
  if(Z_CUR){const pm=lfPalaceMains(5);
    pm.names.forEach(n=>out.push(lfSig("紫微",0,`疾厄宮${pm.borrowed?"借":"坐"}${n}：${ZW_STAR_PALACE[n][5]}`)));
    lfSihuaIn(5).forEach(h=>out.push(lfSig("紫微",h.k===3?-1:1,`${h.n}化${ZW_SH_NAME[h.k]}入疾厄宮：${ZW_SH_TEXT[h.k]}。`)));}
  return out;
}

// ---------- 流年與大限 ----------
function lfYearBlock(Y,label){
  const out=[],yg=mod(Y-4,10),yz=mod(Y-4,12),ganzhi=GAN[yg]+ZHI[yz];
  const items=[];
  if(BZ_CUR){const ss=shishen(BZ_CUR.me,yg);items.push(["八字",`${Y}年${ganzhi}，天干對日主是「${ss}」：${LF_SS_YEAR[ss]}。`]);
    const hits=[];["年","月","日","時"].forEach((nm,i)=>{const z=BZ_CUR.P[i][1];if(mod(z+6,12)===yz)hits.push(`${nm}柱${ZHI[z]}相沖`);else if(mod(13-z,12)===yz)hits.push(`${nm}柱${ZHI[z]}相合`)});
    if(hits.length)items.push(["八字",`流年${ZHI[yz]}與原局：${hits.join("、")}。相沖處（${hits.filter(h=>h.includes("沖")).map(h=>h.slice(0,2)).join("、")||"無"}）所代表的人事容易有變動，相合處則較容易有合作與緣分。`])}
  if(LN_CUR){const n=Y===LN_CUR.Yc?LN_CUR.n0:(Y===LN_CUR.Yc+1?LN_CUR.n1:liunianNum(Y)),a=LIU_NIAN_ANALYSIS[n];items.push(["靈數",`${Y}年流年數 ${n}：主題是「${a.theme}」，${a.advice}`])}
  if(Z_CUR){const pal=Z_CUR.palaces.find(p=>p.b===yz);
    if(pal)items.push(["紫微",`${Y}年流年地支「${ZHI[yz]}」落在${pal.name}，這一年的生活重心偏向：${ZW_DOMAIN[pal.i]}。`]);
    const sh=ZW_SIHUA[yg],parts=[];sh.forEach((star,k)=>{const p=Z_CUR.palaces.find(pp=>pp.stars.some(s=>s.n===star));if(p)parts.push([k,star,p])});
    const lu=parts.find(x=>x[0]===0),ji=parts.find(x=>x[0]===3),qu=parts.find(x=>x[0]===1);
    if(lu||ji)items.push(["紫微",`流年${GAN[yg]}干四化：${lu?`${lu[1]}化祿入${lu[2].name}（機會與順利處）`:""}${lu&&ji?"；":""}${ji?`${ji[1]}化忌入${ji[2].name}（需多留意、容易執著處）`:""}${qu?`；${qu[1]}化權入${qu[2].name}（主導與行動處）`:""}。`])}
  return{label,items};
}
function lfDecades(){
  if(!Z_CUR||!Z_CUR.palaces[0].dx)return null;
  const Y=new Date().getFullYear(),age=Y-Z_CUR.L.year+1;
  const list=Z_CUR.palaces.filter(p=>p.dx&&p.dx[0]<=100).sort((a,b)=>a.dx[0]-b.dx[0]);
  return{age,list};
}

// ---------- 建議 ----------
function lfAdvice(cross,domains){
  const adv=[];
  if(BZ_CUR){const ys=BZ_CUR.yong.slice(0,2);adv.push(`補強方向（八字${BZ_CUR.strong?"身強":"身弱"}、用神為${BZ_CUR.yong.join("、")}）：可多接近${ys.map(w=>`「${w}」──${LF_ELEM_ADV[w]}`).join("；")}。`)}
  if(cross.agree.length){const top=cross.agree.slice(0,3).map(([t,s])=>`${LF_TAGS[t][0]}`).join("、");adv.push(`善用多個系統都指到的特質：${top}。把這些放進工作與生活的選擇裡，最容易發揮。`)}
  if(cross.diff.length){const d=cross.diff[0];adv.push(`留意內在拉扯：「${LF_TAGS[d.a][0]}」與「${LF_TAGS[d.b][0]}」同時出現，代表你在兩種需求之間會猶豫，先想清楚現階段更重要的是哪一個。`)}
  const risk=[];Object.entries(domains).forEach(([k,sigs])=>{const neg=sigs.filter(s=>s.tone<0).length,pos=sigs.filter(s=>s.tone>0).length;if(neg>pos&&neg>=2)risk.push(k)});
  if(risk.length)adv.push(`需要多花心思的領域：${risk.join("、")}。這些面向「需留意」的指標比「順利」的多，先從小地方預防與調整。`);
  const good=Object.entries(domains).filter(([,sigs])=>sigs.filter(s=>s.tone>0).length>=sigs.filter(s=>s.tone<0).length+2).map(([k])=>k);
  if(good.length)adv.push(`相對有利、值得放大的領域：${good.join("、")}。`);
  adv.push("人生分析是看傾向，不是定論：把「順」的地方放大、把「需留意」的地方當成提醒，重大決定仍要回到實際狀況與專業意見。");
  return adv;
}

// 各領域的關鍵詞：同一個關鍵詞被兩個以上系統提到，就標示為「交叉印證」
const LF_KEYS={
  "事業":["開創","創業","管理","領導","創作","企劃","教學","教育","金融","財務","業務","技術","研究","服務","壓力","競爭","起伏","貴人","責任"],
  "財運":["起伏","破財","積累","累積","投資","才華","穩健","競爭","合夥","借貸","儲蓄","守成","機會","貴人"],
  "感情":["孤單","爭執","磨合","桃花","穩定","衝突","魅力","專一","溝通","包容","主動","壓力","異性緣"],
  "家庭人際":["貴人","競爭","孤獨","獨來獨往","長輩","朋友","金錢","溝通","摩擦","人緣","照顧"],
  "健康":["心血管","血壓","眼睛","睡眠","脾胃","消化","呼吸","皮膚","腎","肝","筋骨","頭部","情緒","休息","體力"]};
function lfCorroborate(domain,sigs){
  const keys=LF_KEYS[domain]||[],hit=[];
  keys.forEach(k=>{const sys=[...new Set(sigs.filter(s=>s.text.includes(k)).map(s=>s.sys))];if(sys.length>=2)hit.push([k,sys])});
  return hit;
}
// ---------- 畫面 ----------
function lfSigHtml(sigs,domain){
  if(!sigs.length)return'<p class="lf-none">這個領域目前沒有足夠的指標。</p>';
  const pos=sigs.filter(s=>s.tone>0).length,neg=sigs.filter(s=>s.tone<0).length,sys=[...new Set(sigs.map(s=>s.sys))];
  const word=pos-neg>=2?"整體偏順":(neg-pos>=2?"整體需多留意":"有順有逆，需要因應");
  const co=lfCorroborate(domain,sigs);
  const coHtml=co.length?`<div class="lf-co"><b>交叉印證</b>${co.map(([k,s])=>`<span>${k}<small>${s.join("、")}</small></span>`).join("")}</div>`:"";
  return`<div class="lf-sum"><b>${word}</b>　<small>共 ${sigs.length} 項指標（${sys.join("、")}）：順 ${pos}・平 ${sigs.length-pos-neg}・留意 ${neg}</small></div>`+coHtml
    +sigs.map(s=>`<div class="lf-s t${s.tone>0?"p":s.tone<0?"n":"z"}"><span class="lf-sys">${s.sys}</span><span class="lf-tx">${lfEsc(s.text)}</span></div>`).join("");
}
function lfLifeHtml(){
  const hasT=S.hour!==null&&BZ_CUR&&Z_CUR;
  const T=lfPersonalityTags(),cross=lfCross(T);
  const sysUsed=Object.keys(T);
  // 總覽
  const lines=[];
  if(BZ_CUR){const g=lfGroups(),top=lfTop(g);lines.push(["八字",`日主${GAN[BZ_CUR.me]}（${GAN_WX[BZ_CUR.me]}），${BZ_CUR.strong?"身強":"身弱"}（生扶 ${Math.round(BZ_CUR.helpScore)} 分）。${top.length?LF_GROUP_TEXT[top[0]]:"十神分佈平均。"}`])}
  if(Z_CUR){const pm=lfPalaceMains(0);lines.push(["紫微",`${ZW_JU_NAME[Z_CUR.ju]}，命宮${pm.borrowed?"借":"坐"}${pm.names.join("、")||"（無主星）"}。${pm.names[0]?lfFirst(ZW_MAIN_TEXT[pm.names[0]]):""}`])}
  lines.push(["靈數",`主命數 ${LS.lifePath}。${lfFirst(lifePathMeanings[LS.lifePath]||"")}`]);
  if(TAROT_CUR){const k=TAROT_CUR.key,c=TAROT_CUR.c;lines.push(["塔羅",`個性牌「${k(c[1])}」、靈魂牌「${k(c[3])}」、潛能牌「${k(c[4])}」。${lfFirst(ANALYSIS_DATA[k(c[1])]||"")}`])}
  const overview=`<div class="card lf-card"><h3>命盤總覽</h3>${lines.map(([s,t])=>`<div class="lf-s tz"><span class="lf-sys">${s}</span><span class="lf-tx">${lfEsc(t)}</span></div>`).join("")}</div>`;
  const agreeHtml=cross.agree.length?cross.agree.map(([t,s])=>`<div class="lf-agree"><b>${LF_TAGS[t][0]}</b><span>${LF_TAGS[t][1]}</span><small>${s.join("、")} 都指向</small></div>`).join(""):'<p class="lf-none">各系統指出的特質各有不同，沒有明顯重疊。</p>';
  const diffHtml=cross.diff.length?cross.diff.map(d=>`<div class="lf-diff"><b>${LF_TAGS[d.a][0]}</b>（${d.A.join("、")}）　vs　<b>${LF_TAGS[d.b][0]}</b>（${d.B.join("、")}）<br><small>不同系統對這兩種傾向看法不同，通常代表你在兩種需求之間會拉扯，依情境而定。</small></div>`).join(""):'<p class="lf-none">各系統之間沒有明顯矛盾的看法。</p>';
  const crossCard=`<div class="card lf-card"><h3>交叉對比：性格與天賦</h3><h4>多個系統同時指到的特質（可信度較高）</h4>${agreeHtml}<h4>系統之間看法不同的地方</h4>${diffHtml}
    <p class="lf-note">比對的系統：${sysUsed.join("、")}${hasT?"":"（填寫時辰後可加入八字與紫微，交叉對比更完整）"}。</p></div>`;
  const doms={"事業":lfCareer(),"財運":lfMoney(),"感情":lfLove(),"家庭人際":lfPeople(),"健康":lfHealth()};
  const domCards=Object.entries(doms).map(([k,s])=>`<div class="card lf-card"><h3>${k}</h3>${lfSigHtml(s,k)}</div>`).join("");
  // 人生階段
  const dec=lfDecades();let decHtml="";
  if(dec){decHtml=`<div class="card lf-card"><h3>人生階段（大限）</h3><p class="lf-note">依紫微大限，約以虛歲 ${dec.age} 歲計算。</p>`
    +dec.list.map(p=>{const cur=dec.age>=p.dx[0]&&dec.age<=p.dx[1],m=lfMains(p);
      return`<div class="lf-dec${cur?" cur":""}"><div class="lf-dh"><b>${p.dx[0]}～${p.dx[1]} 歲</b><span>${p.name}${m.length?"（"+m.join("、")+"）":""}${cur?"　◀ 目前":""}</span></div><div class="lf-dd">${ZW_DOMAIN[p.i]}</div></div>`}).join("")+`</div>`}
  else if(Z_CUR)decHtml=`<div class="card lf-card"><h3>人生階段（大限）</h3><p class="lf-none">填寫性別後，才能依陽男陰女、陰男陽女的順逆行排出每十年的大限。</p></div>`;
  // 近期
  const Y=new Date().getFullYear();
  const yrs=[lfYearBlock(Y,`${Y} 年（今年）`),lfYearBlock(Y+1,`${Y+1} 年（明年）`)];
  const yrHtml=`<div class="card lf-card"><h3>近期運勢（流年交叉）</h3>`+yrs.map(b=>`<h4>${b.label}</h4>`+(b.items.length?b.items.map(([s,t])=>`<div class="lf-s tz"><span class="lf-sys">${s}</span><span class="lf-tx">${lfEsc(t)}</span></div>`).join(""):'<p class="lf-none">缺少資料。</p>')).join("")+`</div>`;
  const adv=lfAdvice(cross,doms);
  const advHtml=`<div class="card lf-card"><h3>綜合建議</h3><ol class="lf-adv">${adv.map(a=>`<li>${lfEsc(a)}</li>`).join("")}</ol></div>`;
  const tail=`<p class="lf-note">這份分析由程式依八字、紫微、生命靈數、生命塔羅與流年的規則整合而成，用來協助自我了解與參考，不是真人批命，也不能取代醫療、法律、財務等專業意見。各派取法不同，結果可能與其他軟體略有差異。</p>`;
  const warn=hasT?"":`<div class="card lf-card"><p class="lf-none">目前沒有填寫時辰，所以只用「生命靈數、生命塔羅、流年數」做分析。回到第一頁補上時辰，就能加入八字與紫微，交叉對比會更完整。</p></div>`;
  return warn+overview+crossCard+domCards+decHtml+yrHtml+advHtml+tail;
}
function openLife(){
  if(!S)return;
  document.getElementById("lf-body").innerHTML=lfLifeHtml();
  document.getElementById("life").hidden=false;document.body.classList.add("po-open");
  document.querySelector(".lf-scroll").scrollTop=0;
}
function closeLife(){document.getElementById("life").hidden=true;document.body.classList.remove("po-open")}
document.getElementById("life-btn").onclick=()=>{
  if(typeof unlocked!=="undefined"&&!unlocked){pending=openLife;openLock();return}
  openLife();
};
document.getElementById("lf-close").onclick=closeLife;
