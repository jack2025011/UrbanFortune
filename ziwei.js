// ========== 紫微斗數（三合派常用排法；依農曆生日、時辰）==========
// 依賴：bazi.js 的 mod、sexa、NAYIN；data.js 的 GAN、ZHI；lunar.js 提供 S.lunar
const ZW_PALACES=["命宮","兄弟宮","夫妻宮","子女宮","財帛宮","疾厄宮","遷移宮","交友宮","官祿宮","田宅宮","福德宮","父母宮"];
const ZW_DOMAIN=["個性、天賦與一生的基本格局","兄弟姊妹、同輩與合作關係","感情、婚姻與配偶的特質","子女緣、晚輩、創作與桃花","賺錢方式、理財能力與財運","身體狀況、體質與健康","外出、人際環境與外在機運","朋友、同事、部屬與人脈","事業、工作、學業與成就","不動產、家庭環境與家運","精神生活、心態與福氣","父母長輩、上司關係與學歷文書"];
// 四化（依年干）：[化祿, 化權, 化科, 化忌]
const ZW_SIHUA=[["廉貞","破軍","武曲","太陽"],["天機","天梁","紫微","太陰"],["天同","天機","文昌","廉貞"],["太陰","天同","天機","巨門"],["貪狼","太陰","右弼","天機"],["武曲","貪狼","天梁","文曲"],["太陽","武曲","太陰","天同"],["巨門","太陽","文曲","文昌"],["天梁","紫微","左輔","武曲"],["破軍","巨門","太陰","貪狼"]];
const ZW_SH_NAME=["祿","權","科","忌"];
const ZW_SH_TEXT=["帶來機會、財源與人緣，事情容易順利","代表掌控、主導與行動力，能力得以發揮","代表名聲、貴人與條理，讓事情清楚順遂","代表執著、阻礙與需要修的課題，也是壓力來源"];
const ZW_MING_ZHU=["貪狼","巨門","祿存","文曲","廉貞","武曲","破軍","武曲","廉貞","文曲","祿存","巨門"];   // 依命宮地支
const ZW_SHEN_ZHU=["火星","天相","天梁","天同","文昌","天機","火星","天相","天梁","天同","文昌","天機"];   // 依年支
const ZW_MAIN_TEXT={
 "紫微":"尊貴、有領導力與統御力，自尊心強、重責任，喜歡掌握全局；要避免自視過高或過於孤高。",
 "天機":"聰明機智、善於思考與策劃，反應快、點子多；但容易想太多、心緒不定。",
 "太陽":"熱情大方、積極外向，樂於付出與照顧人，重名聲；但操勞多、容易為別人忙碌。",
 "武曲":"剛毅果斷、務實重財，執行力強，個性直率；不擅長甜言蜜語，要多一點柔軟。",
 "天同":"溫和知足、隨和愛享受，人緣好、不愛爭；但較缺乏衝勁，容易安逸。",
 "廉貞":"個性鮮明、情感強烈，有企圖心與魅力，重原則也重感情；要學會調節情緒。",
 "天府":"穩重保守、有包容力與財庫，善於理財守成，重安全感，有管理與領導的才能。",
 "太陰":"細膩溫柔、感性內斂，重家庭與情感，善於積累；容易多愁善感。",
 "貪狼":"多才多藝、慾望與魅力並重，交際廣、愛玩樂，有桃花與投機的特質；宜專注一個方向。",
 "巨門":"口才佳、分析力強，愛鑽研與質疑；容易招來是非口舌，適合以言語或專業為業。",
 "天相":"重禮儀、愛幫助人，形象整潔、有服務精神；但容易優柔寡斷、受他人影響。",
 "天梁":"老成穩重、有長者風範，樂於照顧人，常能逢凶化吉；但容易說教或孤高。",
 "七殺":"勇猛果決、獨立冒險，有拓荒精神，人生起伏較大；宜學會耐心與合作。",
 "破軍":"破舊立新、勇於變革，行動力強、不喜歡被限制，人生多變動；需要穩定的方向。"};
const ZW_KEY={
 "紫微":"尊貴、領導","天機":"智謀、變動","太陽":"光明、付出","武曲":"財星、果決","天同":"福星、知足","廉貞":"情感、原則","天府":"財庫、守成",
 "太陰":"細膩、積累","貪狼":"慾望、才藝","巨門":"口才、是非","天相":"服務、輔佐","天梁":"蔭庇、照顧","七殺":"衝刺、獨立","破軍":"變革、突破",
 "左輔":"平輩貴人","右弼":"異性/晚輩貴人","文昌":"文才、考試","文曲":"口才、才藝","天魁":"長輩貴人","天鉞":"暗中貴人",
 "祿存":"財庫、保守","擎羊":"衝勁、競爭","陀羅":"拖延、糾纏","火星":"急躁、爆發","鈴星":"暗火、壓抑","地劫":"劫耗、先破後立","天空":"空靈、不執著",
 "紅鸞":"桃花、喜慶","天喜":"喜事、人緣","天馬":"奔波、變動"};
const ZW_JU_NAME={2:"水二局",3:"木三局",4:"金四局",5:"土五局",6:"火六局"};
const ZW_SHEN_PALACE_TEXT=[ "身宮在命宮：後半生仍以自己的個性與想法為主。","身宮在兄弟宮：後半生重視同輩、朋友與合作關係。","身宮在夫妻宮：後半生重視感情與婚姻，配偶影響大。","身宮在子女宮：後半生重視子女、創作與晚輩緣。","身宮在財帛宮：後半生重視賺錢與物質生活。","身宮在疾厄宮：後半生要多留意身體，健康影響生活品質。","身宮在遷移宮：後半生適合外出發展，人際與環境影響大。","身宮在交友宮：後半生重視人脈，朋友與部屬是助力。","身宮在官祿宮：後半生重視事業與成就，工作是重心。","身宮在田宅宮：後半生重視家庭與不動產，守成安穩。","身宮在福德宮：後半生重視精神生活與心境，講求享受與平靜。","身宮在父母宮：後半生與長輩、上司或學習的緣分深。"];

function ziweiPos(day,ju){            // 起紫微：日數＋借數 能被局數整除，商數從寅宮起，借數奇退偶進
  let k=0;while((day+k)%ju!==0)k++;
  const q=(day+k)/ju;let pos=2+(q-1);
  pos=(k%2===1)?pos-k:pos+k;
  return mod(pos,12);
}
function calcZiwei(S){
  const L=S.lunar;let month=L.month;
  if(L.isLeap&&L.day>15)month=month%12+1;             // 閏月十五日後算下個月
  const day=L.day,hz=S.hour;
  const yg=mod(L.year-4,10),yz=mod(L.year-4,12);
  const ming=mod(2+month-1-hz,12),shen=mod(2+month-1+hz,12);
  const stemOf=b=>mod((yg%5)*2+2+mod(b-2,12),10);     // 五虎遁：寅宮起
  const mingIdx=sexa(stemOf(ming),ming);
  const element=NAYIN[Math.floor(mingIdx/2)].slice(-1);
  const ju={水:2,木:3,金:4,土:5,火:6}[element];
  const zp=ziweiPos(day,ju);
  const stars={};for(let b=0;b<12;b++)stars[b]=[];
  const put=(n,b,main)=>stars[mod(b,12)].push({n,main});
  [["紫微",0],["天機",-1],["太陽",-3],["武曲",-4],["天同",-5],["廉貞",-8]].forEach(([n,o])=>put(n,zp+o,true));
  const tf=mod(4-zp,12);
  [["天府",0],["太陰",1],["貪狼",2],["巨門",3],["天相",4],["天梁",5],["七殺",6],["破軍",10]].forEach(([n,o])=>put(n,tf+o,true));
  // 輔佐星
  put("左輔",4+month-1);put("右弼",10-(month-1));
  put("文昌",10-hz);put("文曲",4+hz);
  const TK={0:[1,7],1:[0,8],2:[11,9],3:[11,9],4:[1,7],5:[0,8],6:[1,7],7:[6,2],8:[3,5],9:[3,5]};   // 天魁、天鉞
  put("天魁",TK[yg][0]);put("天鉞",TK[yg][1]);
  const lu=[2,3,5,6,5,6,8,9,11,0][yg];
  put("祿存",lu);put("擎羊",lu+1);put("陀羅",lu-1);
  const g4=yz%4;
  // 火星起點：申子辰寅、巳酉丑卯、寅午戌丑、亥卯未酉；鈴星起點：寅午戌卯，其餘戌
  const huoStart={0:2,1:3,2:1,3:9}[g4],lingStart={0:10,1:10,2:3,3:10}[g4];
  put("火星",huoStart+hz);put("鈴星",lingStart+hz);
  put("地劫",11+hz);put("天空",11-hz);
  put("紅鸞",3-yz);put("天喜",3-yz+6);
  put("天馬",{0:2,1:11,2:8,3:5}[g4]);
  // 四化標記
  const sihua={};ZW_SIHUA[yg].forEach((n,i)=>{sihua[n]=i});
  // 十二宮
  const yang=yg%2===0,forward=S.gender?((yang&&S.gender==="男")||(!yang&&S.gender==="女")):null;
  const palaces=[];
  for(let i=0;i<12;i++){
    const b=mod(ming-i,12);
    let dx=null;
    if(forward!==null){const t=forward?mod(-i,12):i;dx=[ju+10*t,ju+10*t+9]}
    palaces.push({i,name:ZW_PALACES[i],b,gan:stemOf(b),stars:stars[b],dx,isShen:b===shen});
  }
  return{L,month,day,yg,yz,ming,shen,ju,element,zp,tf,sihua,palaces,forward,yang,
    mingZhu:ZW_MING_ZHU[ming],shenZhu:ZW_SHEN_ZHU[yz],mingGan:stemOf(ming),stars};
}

// ===== 畫面 =====
const ZW_GRID={5:[1,1],6:[1,2],7:[1,3],8:[1,4],4:[2,1],9:[2,4],3:[3,1],10:[3,4],2:[4,1],1:[4,2],0:[4,3],11:[4,4]};
const zwTag=n=>{const s=Z_CUR.sihua[n];return s===undefined?"":`<i class="sh sh${s}">${ZW_SH_NAME[s]}</i>`};
let Z_CUR=null;
function ziweiHtml(S){
  const Z=calcZiwei(S);Z_CUR=Z;
  const cells=Z.palaces.map(p=>{
    const [r,c]=ZW_GRID[p.b];
    const mains=p.stars.filter(s=>s.main).map(s=>`<div class="zs-m">${s.n}${zwTag(s.n)}</div>`).join("");
    const aux=p.stars.filter(s=>!s.main).map(s=>`<span class="zs-a">${s.n}${zwTag(s.n)}</span>`).join("");
    return`<div class="zc${p.i===0?" zc-ming":""}" style="grid-row:${r};grid-column:${c}">
      <div class="zc-top"><span class="zc-gz">${GAN[p.gan]}${ZHI[p.b]}</span><span class="zc-name">${p.name.replace("宮","")}${p.isShen?"<em>身</em>":""}</span></div>
      <div class="zc-main">${mains||'<span class="zs-none">　</span>'}</div><div class="zc-aux">${aux}</div>
      ${p.dx?`<div class="zc-dx">${p.dx[0]}~${p.dx[1]}</div>`:""}</div>`;
  }).join("");
  const center=`<div class="zc-center" style="grid-row:2/4;grid-column:2/4">
    <div class="zcc-title">紫微斗數命盤</div>
    ${S.name?`<div>${S.name}${S.gender?"（"+S.gender+"）":""}</div>`:S.gender?`<div>${S.gender}</div>`:""}
    <div>農曆 ${Z.L.text}</div>
    <div>${GAN[Z.yg]}${ZHI[Z.yz]}年　${SHICHEN[S.hour]}</div>
    <div class="zcc-b">${ZW_JU_NAME[Z.ju]}</div>
    <div>命主：${Z.mingZhu}　身主：${Z.shenZhu}</div>
  </div>`;
  const note=S.gender?"":`<p class="note">填寫性別後可顯示各宮的大限年齡區間（陽男陰女順行、陰男陽女逆行）。</p>`;
  return`<div class="card"><h3>命盤</h3><div class="zw">${cells}${center}</div>${note}
    <p><small>年柱以農曆正月初一換年；閏月十五日後算下個月；時辰取該時辰整段。四化：祿＝財源順利、權＝掌控、科＝名聲貴人、忌＝執著課題。</small></p></div>
    <button class="toggle" data-lock="1" data-target="zw-detail" data-label="紫微解析">查看紫微解析</button>
    <div id="zw-detail" class="hidden">${ziweiAnalysis(Z,S)}</div>`;
}
function ziweiAnalysis(Z,S){
  const ming=Z.palaces[0],qian=Z.palaces[6];
  const mains=p=>p.stars.filter(s=>s.main).map(s=>s.n);
  let mt="";
  if(mains(ming).length)mt=mains(ming).map(n=>`<p><b>${n}</b>：${ZW_MAIN_TEXT[n]}</p>`).join("");
  else{
    const q=mains(qian);
    mt=`<p>命宮沒有主星，借對宮（遷移宮）的星曜來看${q.length?"："+q.join("、"):""}。個性受環境與人影響較大，適應力強、可塑性高。</p>`
      +q.map(n=>`<p><b>${n}（借星）</b>：${ZW_MAIN_TEXT[n]}</p>`).join("");
  }
  const shenP=Z.palaces.find(p=>p.isShen);
  const overview=`<div class="card"><h3>命盤概要</h3>
    <p><b>${ZW_JU_NAME[Z.ju]}</b>：以命宮（${GAN[Z.mingGan]}${ZHI[Z.ming]}）的納音五行「${Z.element}」定局，大限從 ${Z.ju} 歲起運，每十年換一個大限。</p>
    <p><b>命主：${Z.mingZhu}</b>（${ZW_KEY[Z.mingZhu]||""}）　<b>身主：${Z.shenZhu}</b>（${ZW_KEY[Z.shenZhu]||""}）</p>
    <p>${ZW_SHEN_PALACE_TEXT[shenP.i]}</p></div>
    <div class="card"><h3>命宮主星・個性與格局</h3>${mt}</div>`;
  // 十二宮
  const palaceHtml=Z.palaces.map(p=>{
    const ms=p.stars.filter(s=>s.main),as=p.stars.filter(s=>!s.main);
    const sh=p.stars.filter(s=>Z.sihua[s.n]!==undefined).map(s=>`${s.n}化${ZW_SH_NAME[Z.sihua[s.n]]}`);
    let body=`<p class="zd">${ZW_DOMAIN[p.i]}</p>`;
    if(ms.length)body+=ms.map(s=>`<p>${s.n}（${ZW_KEY[s.n]}）：${ZW_MAIN_TEXT[s.n]}</p>`).join("");
    else body+=`<p>此宮沒有主星，借對宮（${ZW_PALACES[mod(p.i+6,12)]}）的星曜來看${mains(Z.palaces[mod(p.i+6,12)]).length?"："+mains(Z.palaces[mod(p.i+6,12)]).join("、"):""}。</p>`;
    if(as.length)body+=`<p class="aux-line">輔星：${as.map(s=>`${s.n}（${ZW_KEY[s.n]}）`).join("　")}</p>`;
    if(sh.length)body+=`<p class="sh-line">四化：${sh.join("　")}</p>`;
    return`<div class="ss"><div class="ss-h"><b>${p.name}</b><span class="tag">${GAN[p.gan]}${ZHI[p.b]}${p.isShen?"・身宮":""}${p.dx?"・"+p.dx[0]+"~"+p.dx[1]+"歲":""}</span></div>${body}</div>`;
  }).join("");
  // 四化
  const sihuaHtml=ZW_SIHUA[Z.yg].map((n,i)=>{
    const p=Z.palaces.find(pp=>pp.stars.some(s=>s.n===n));
    return`<div class="occ"><b>${n}化${ZW_SH_NAME[i]}　入${p.name}</b><p>${ZW_SH_TEXT[i]}；落在${p.name}，主要影響「${ZW_DOMAIN[p.i]}」。</p></div>`;
  }).join("");
  return overview+`<div class="card"><h3>本命四化（${GAN[Z.yg]}年）</h3>${sihuaHtml}</div>
    <div class="card"><h3>十二宮解析</h3>${palaceHtml}
    <p class="note">紫微斗數是傳統命理的參考，各派排法略有不同（例如年柱換年點、閏月、四化版本）；解析為一般性說明，實際吉凶還要看星曜亮度、三方四正與大限流年，僅供參考。</p></div>`;
}
