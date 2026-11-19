// ========== 奇門遁甲（時家奇門・拆補法）==========
// 說明：依起局時間排出九宮盤（八門、九星、八神、天地盤干），再用使用者的八字（日主、用神）做白話說明。
// 奇門遁甲流派很多（拆補、置閏、茅山等），這裡採用常見的「拆補法」，僅供參考。
const QM_TERMS=["冬至","小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪"];
const QM_JU=[[1,7,4],[2,8,5],[3,9,6],[8,5,2],[9,6,3],[1,7,4],[3,9,6],[4,1,7],[5,2,8],[4,1,7],[5,2,8],[6,3,9],
             [9,3,6],[8,2,5],[7,1,4],[2,5,8],[1,4,7],[9,3,6],[7,1,4],[6,9,3],[5,8,2],[6,9,3],[5,8,2],[4,7,1]];
const QM_DI=["戊","己","庚","辛","壬","癸","丁","丙","乙"];                 // 六儀三奇
const QM_RING=[1,8,3,4,9,2,7,6];                                           // 外圈順時針：坎艮震巽離坤兌乾
const QM_STAR_HOME={1:"天蓬",2:"天芮",3:"天沖",4:"天輔",5:"天禽",6:"天心",7:"天柱",8:"天任",9:"天英"};
const QM_DOOR_HOME={1:"休門",2:"死門",3:"傷門",4:"杜門",5:"死門",6:"開門",7:"驚門",8:"生門",9:"景門"};
const QM_NAME={1:"坎",2:"坤",3:"震",4:"巽",5:"中",6:"乾",7:"兌",8:"艮",9:"離"};
const QM_DIR={1:"北",2:"西南",3:"東",4:"東南",5:"中央",6:"西北",7:"西",8:"東北",9:"南"};
const QM_WX={1:"水",2:"土",3:"木",4:"木",5:"土",6:"金",7:"金",8:"土",9:"火"};
const QM_BR_PAL=[1,8,8,3,4,4,9,2,2,7,6,6];                                 // 地支落宮：子丑寅卯辰巳午未申酉戌亥
const QM_GODS_YANG=["值符","螣蛇","太陰","六合","白虎","玄武","九地","九天"];
const QM_GODS_YIN=["值符","螣蛇","太陰","六合","勾陳","朱雀","九地","九天"];

const QM_DOOR_TXT={"開門":"開創、新的開始，適合求職、談事情、出遠門","休門":"休息、貴人、合作，安穩順心","生門":"賺錢、成長、生機，適合做生意與理財",
 "傷門":"競爭、受傷、衝突，不適合硬碰硬","杜門":"阻塞、保密、卡住，事情比較難推進","景門":"文書、考試、曝光與名聲，但容易流於表面",
 "死門":"停滯、結束、不順，適合處理舊事、不適合開新局","驚門":"驚嚇、口舌、變動，要小心消息與是非"};
const QM_STAR_TXT={"天蓬":"風險與波動較大，要防小人與意外","天芮":"問題、毛病、需要補救，要注意健康","天沖":"行動快、衝勁足，但容易急","天輔":"貴人、學習、文教，很吉利",
 "天禽":"穩定居中，比較中正平安","天心":"智慧、策劃、醫藥，很吉利","天柱":"口舌、破壞，適合守成不適合冒進","天任":"踏實穩重，適合累積與置產","天英":"熱度高、愛面子，容易急躁或虛名"};
const QM_GOD_TXT={"值符":"貴人與主導力，是最強的助力","螣蛇":"虛驚、糾纏、反覆，心思容易亂","太陰":"暗中助力、低調布局","六合":"人和、合作與感情，容易有人幫忙",
 "白虎":"強勢與衝突，要防傷害","玄武":"暗昧、欺騙、損失，要防小人","九地":"穩固、潛藏，適合守成","九天":"高遠、行動、擴張，適合往前衝",
 "勾陳":"拖延、牽制，事情不容易放手","朱雀":"口舌、文書與消息，要注意言語"};
const QM_GOOD_DOOR=["開門","休門","生門"],QM_BAD_DOOR=["死門","驚門","傷門"];
const QM_GOOD_STAR=["天輔","天心","天任","天禽"],QM_BAD_STAR=["天蓬","天芮","天柱","天英"];
const QM_GOOD_GOD=["值符","太陰","六合","九地","九天"],QM_BAD_GOD=["螣蛇","白虎","玄武","勾陳","朱雀"];

const qmNext=(p,dir)=>((p-1+dir+9)%9)+1;

function qmChart(y,m,d,hz){
  const b=calcBazi(y,m,d,hz),P=b.P,dIdx=b.dIdx;
  const hIdx=sexa(P[3][0],P[3][1]);
  // 1) 拆補法定局：符頭（最近的甲／己日）→ 三元；符頭當天所處的節氣 → 局數
  const back=dIdx%5,fu=new Date(Date.UTC(y,m-1,d-back));
  const fuIdx=dIdx-back,fb=fuIdx%12,yuan=[0,3,6,9].includes(fb)?0:[2,5,8,11].includes(fb)?1:2;
  const lon=sunLon(jdOf(fu.getUTCFullYear(),fu.getUTCMonth()+1,fu.getUTCDate(),12));
  const ti=Math.floor(mod(lon-270,360)/15),yang=ti<12,ju=QM_JU[ti][yuan];
  // 2) 地盤
  const earth={};QM_DI.forEach((s,k)=>{earth[yang?qmNext(ju,k):qmNext(ju,-k)]=s});
  const earthPal=s=>+Object.keys(earth).find(p=>earth[p]===s);
  const to2=p=>p===5?2:p;
  // 3) 旬首、值符、值使
  const xun=Math.floor(hIdx/10),xunStem=["戊","己","庚","辛","壬","癸"][xun],xunPal=earthPal(xunStem);
  const zhifuStar=QM_STAR_HOME[to2(xunPal)],zhishiDoor=QM_DOOR_HOME[xunPal];
  // 4) 天盤九星：值符星轉到時干所在宮
  const hStem=P[3][0]===0?xunStem:GAN[P[3][0]],tgtPal=to2(earthPal(hStem));
  const pos=p=>QM_RING.indexOf(to2(p)),delta=pos(tgtPal)-pos(xunPal);
  const cells={};for(let p=1;p<=9;p++)cells[p]={p,earth:earth[p],stars:[],tian:[],door:"",god:""};
  for(let h=1;h<=9;h++){if(h===5)continue;const np=QM_RING[mod(pos(h)+delta,8)];
    cells[np].stars.push(QM_STAR_HOME[h]);cells[np].tian.push(earth[h]);
    if(h===2){cells[np].stars.push("天禽");cells[np].tian.push(earth[5])}}
  // 5) 人盤八門：值使門依「時辰離旬首幾步」前進（陽遁順、陰遁逆）
  const steps=hIdx-xun*10;let lp=xunPal;for(let i=0;i<steps;i++)lp=qmNext(lp,yang?1:-1);
  const doorDelta=pos(lp)-pos(xunPal);
  for(let h=1;h<=9;h++){if(h===5)continue;const np=QM_RING[mod(pos(h)+doorDelta,8)];cells[np].door=QM_DOOR_HOME[h]}
  // 6) 八神：值符在天盤值符星的位置，陽遁順排、陰遁逆排
  const gods=yang?QM_GODS_YANG:QM_GODS_YIN,tp=QM_RING.indexOf(tgtPal);
  for(let i=0;i<8;i++)cells[QM_RING[mod(tp+(yang?i:-i),8)]].god=gods[i];
  // 空亡、驛馬
  const kw=kongwang(hIdx),kongPals=[...new Set(kw.map(z=>QM_BR_PAL[z]))];
  const hz2=P[3][1];
  const horsePal=[8,2,6,4][[[8,0,4],[2,6,10],[5,9,1],[11,3,7]].findIndex(a=>a.includes(hz2))];   // 申子辰→寅(艮) 寅午戌→申(坤) 巳酉丑→亥(乾) 亥卯未→巳(巽)
  return{cells,yang,ju,yuan,term:QM_TERMS[ti],zhifuStar,zhishiDoor,xunStem,xunPal,tgtPal,P,hIdx,kongPals,horsePal,
    hourGZ:GAN[P[3][0]]+ZHI[P[3][1]],dayGZ:GAN[P[2][0]]+ZHI[P[2][1]],dayStem:P[2][0],hStem};
}
function qmScore(c,chart){
  let s=0;
  s+=QM_GOOD_DOOR.includes(c.door)?2:QM_BAD_DOOR.includes(c.door)?-2:0;
  c.stars.forEach(t=>{s+=QM_GOOD_STAR.includes(t)?1:QM_BAD_STAR.includes(t)?-1:0});
  s+=QM_GOOD_GOD.includes(c.god)?1:QM_BAD_GOD.includes(c.god)?-1:0;
  if(chart.kongPals.includes(c.p))s-=1;
  return s;
}

// ================= 畫面與白話解析 =================
const QM_HOURS=["子時（23:00–00:59）","丑時（01:00–02:59）","寅時（03:00–04:59）","卯時（05:00–06:59）","辰時（07:00–08:59）","巳時（09:00–10:59）","午時（11:00–12:59）","未時（13:00–14:59）","申時（15:00–16:59）","酉時（17:00–18:59）","戌時（19:00–20:59）","亥時（21:00–22:59）"];
const QM_TOPICS={
  "整體運勢":{about:"整體",focal:[["self"],["fu"]]},
  "事業工作":{about:"事業與工作",focal:[["door","開門"]],hint:"看「開門」，代表事業、工作機會與新的開始"},
  "財運":{about:"財運",focal:[["door","生門"]],hint:"看「生門」，代表賺錢與財源"},
  "感情":{about:"感情",focal:[["god","六合"]],hint:"看「六合」，代表人和、感情與合作"},
  "健康":{about:"健康",focal:[["star","天芮"],["star","天心"]],hint:"看「天芮」（病星，代表毛病）和「天心」（醫藥，代表能不能得到幫助）"},
  "考試學習":{about:"考試與學習",focal:[["door","景門"],["star","天輔"]],hint:"看「景門」（考試文書）和「天輔」（學習貴人）"},
  "出行搬遷":{about:"出遠門與搬遷",focal:[["door","開門"],["horse"]],hint:"看「開門」和「驛馬」，代表出行與移動"}};
const QM_SEL={date:"",hz:null,topic:"整體運勢"};
function qmDefaults(){
  const n=new Date();QM_SEL.date=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
  QM_SEL.hz=Math.floor((n.getHours()+1)/2)%12;
}
function qmFind(chart,spec){
  const ps=[1,2,3,4,6,7,8,9],cs=chart.cells;
  if(spec[0]==="door")return ps.find(p=>cs[p].door===spec[1]);
  if(spec[0]==="god")return ps.find(p=>cs[p].god===spec[1]);
  if(spec[0]==="star")return ps.find(p=>cs[p].stars.includes(spec[1]));
  if(spec[0]==="horse")return chart.horsePal;
  if(spec[0]==="fu")return chart.tgtPal;
  if(spec[0]==="self")return qmSelfPal(chart);
}
function qmSelfPal(chart){                       // 使用者日主（日干）在地盤的位置；甲用旬首儀
  const stem=chart.userStem===0?null:GAN[chart.userStem];
  const s=stem||chart.xunStem;
  const e=[1,2,3,4,5,6,7,8,9].find(p=>chart.cells[p].earth===s);return e===5?2:e;
}
function qmVerdict(sc){return sc>=3?"非常有利":sc>=1?"偏順":sc===0?"普通":"比較不順"}
function qmElemNote(p){
  if(!BZ_CUR)return"";
  const wx=QM_WX[p];
  if(BZ_CUR.yong.includes(wx))return`這一宮五行屬${wx}，剛好是你八字的用神，對你更有加分。`;
  if(BZ_CUR.ji&&BZ_CUR.ji.includes(wx))return`這一宮五行屬${wx}，是你八字比較不喜歡的五行，效果要打點折扣。`;
  return"";
}
function qmCellDesc(c){
  const parts=[];
  if(c.door)parts.push(`${c.door}：${QM_DOOR_TXT[c.door]}`);
  c.stars.filter(s=>s!=="天禽"||c.stars.length===1).forEach(s=>parts.push(`${s}：${QM_STAR_TXT[s]}`));
  if(c.god)parts.push(`${c.god}：${QM_GOD_TXT[c.god]}`);
  return parts;
}
function qmGridHtml(chart,sel){
  const layout=[4,9,2,3,5,7,8,1,6];
  const selfP=qmSelfPal(chart),focals=sel.focal.map(f=>qmFind(chart,f)).filter(Boolean);
  const cell=p=>{
    const c=chart.cells[p];
    const tags=[chart.kongPals.includes(p)?'<i class="qm-t k">空</i>':"",chart.horsePal===p?'<i class="qm-t h">馬</i>':"",selfP===p?'<i class="qm-t s">你</i>':"",focals.includes(p)?'<i class="qm-t f">★</i>':""].join("");
    if(p===5)return`<div class="qm-c c5"><div class="qm-pn">中５</div><div class="qm-mid">${chart.cells[5].earth}</div><small>中宮寄坤二</small></div>`;
    const sc=qmScore(c,chart);
    return`<div class="qm-c ${sc>=2?"good":sc<=-2?"bad":""}"><div class="qm-pn">${QM_NAME[p]}${p}　${QM_DIR[p]}</div><div class="qm-tags">${tags}</div>
      <div class="qm-god">${c.god}</div><div class="qm-star">${c.stars.join("・")}<small>${c.tian.join("")}</small></div>
      <div class="qm-door">${c.door}</div><div class="qm-earth">${c.earth}</div></div>`};
  return`<div class="qm-grid">${layout.map(cell).join("")}</div>
    <p class="qm-leg"><small>每格由上到下：八神／天盤九星與天盤干／八門／地盤干。<i class="qm-t s">你</i>＝你的日主位置　<i class="qm-t f">★</i>＝你問的事要看的位置　<i class="qm-t k">空</i>＝空亡　<i class="qm-t h">馬</i>＝驛馬。綠底＝吉、紅底＝凶。</small></p>`;
}
function qmReadHtml(chart,topicName,date,hz){
  const sel=QM_TOPICS[topicName],cs=chart.cells,out=[];
  const yangTxt=chart.yang?"陽遁：氣勢向上，適合主動出擊、開創新局。":"陰遁：氣勢內斂，適合守成、等待時機、先穩住再說。";
  out.push(`<p>這一局是<b>${chart.yang?"陽遁":"陰遁"}${chart.ju}局</b>（${chart.term}・${["上","中","下"][chart.yuan]}元）。${yangTxt}</p>
    <p>主導這一局的「值符」是<b>${chart.zhifuStar}</b>（${QM_STAR_TXT[chart.zhifuStar]}），負責做事的「值使」是<b>${chart.zhishiDoor}</b>（${QM_DOOR_TXT[chart.zhishiDoor]}）。</p>`);
  // 你自己
  const sp=qmSelfPal(chart),sc=cs[sp],ss=qmScore(sc,chart);
  const dayStemName=GAN[chart.userStem];
  out.push(`<h5>你自己的狀況</h5><p>你的日主是「${dayStemName}${GAN_WX[chart.userStem]}」，在這一局落在<b>${QM_NAME[sp]}${sp}宮（${QM_DIR[sp]}方）</b>。這一宮的狀況：</p><ul class="qm-ul">${qmCellDesc(sc).map(t=>`<li>${t}</li>`).join("")}</ul>
    <p>整體看起來<b>${qmVerdict(ss)}</b>。${qmElemNote(sp)}${chart.kongPals.includes(sp)?"不過你這一宮落在「空亡」，力量比較虛，不要把期待放太高。":""}</p>`);
  // 問的事
  const items=sel.focal.filter(f=>f[0]!=="self"&&f[0]!=="fu");
  if(topicName==="整體運勢"){
    const fp=chart.tgtPal;out.push(`<h5>整體運勢怎麼看</h5><p>看你自己所在的宮，和「值符」所在的宮（${QM_NAME[fp]}${fp}宮，${QM_DIR[fp]}方）。值符宮是這個時間最有力量的位置：</p><ul class="qm-ul">${qmCellDesc(cs[fp]).map(t=>`<li>${t}</li>`).join("")}</ul>`);
  }else{
    out.push(`<h5>你問的「${sel.about}」</h5><p class="qm-hint">${sel.hint}。</p>`);
    items.forEach(f=>{
      const p=qmFind(chart,f);const nm=f[0]==="horse"?"驛馬":f[1];
      if(!p){out.push(`<p>這一局「${nm}」沒有落在外圈，看不到明顯的訊號。</p>`);return}
      const c=cs[p],s=qmScore(c,chart);
      out.push(`<p><b>${nm}</b>落在<b>${QM_NAME[p]}${p}宮（${QM_DIR[p]}方）</b>，這一宮${qmCellDesc(c).join("；")}。整體<b>${qmVerdict(s)}</b>。${qmElemNote(p)}${chart.kongPals.includes(p)?"但落在空亡，要多留意結果會不會落空。":""}</p>`);
    });
    const ps=items.map(f=>qmFind(chart,f)).filter(Boolean),avg=ps.length?ps.reduce((a,p)=>a+qmScore(cs[p],chart),0)/ps.length:0;
    const adv=avg>=2?"這個時間點對這件事很有利，可以放心積極行動。":avg>=0.5?"整體偏順，穩穩去做就有機會。":avg>-1?"普通，結果要看你自己的準備與努力，不用特別期待，也不用太擔心。":"這個時間點比較不順，建議先守、先等，或改個時間再試。";
    out.push(`<p class="qm-adv">建議：${adv}</p>`);
  }
  // 吉方凶方
  const ps8=[1,2,3,4,6,7,8,9].map(p=>({p,s:qmScore(cs[p],chart)+(BZ_CUR&&BZ_CUR.yong.includes(QM_WX[p])?0.5:0)}));
  const best=ps8.filter(x=>x.s>=2).sort((a,b)=>b.s-a.s).slice(0,3),worst=ps8.filter(x=>x.s<=-2).sort((a,b)=>a.s-b.s).slice(0,2);
  out.push(`<h5>方位與走動</h5>`+(best.length?`<p>比較適合往<b>${best.map(x=>`${QM_DIR[x.p]}方（${cs[x.p].door}）`).join("、")}</b>辦事、見人、走動。</p>`:`<p>這個時間沒有特別突出的吉方，保持平常心就好。</p>`)
    +(worst.length?`<p>比較要避開：<b>${worst.map(x=>`${QM_DIR[x.p]}方（${cs[x.p].door}）`).join("、")}</b>。</p>`:""));
  // 好時段
  const [y,m,d]=date.split("-").map(Number);
  const hrs=Array.from({length:12},(_,h)=>{const c=qmChart(y,m,d,h);const t=QM_TOPICS[topicName].focal;const sc=t.map(f=>{const p=qmFind(c,f);return p?qmScore(c.cells[p],c):-1}).reduce((a,b)=>a+b,0)/t.length;return{h,sc}});
  const top=[...hrs].sort((a,b)=>b.sc-a.sc).slice(0,3),low=[...hrs].sort((a,b)=>a.sc-b.sc)[0];
  out.push(`<h5>這一天比較適合的時段（針對「${sel.about}」）</h5><p>比較適合：<b>${top.map(x=>QM_HOURS[x.h]).join("、")}</b>。比較不順：${QM_HOURS[low.h]}。</p>`);
  // 八字核對
  let bz="";
  if(BZ_CUR){const ys=BZ_CUR.yong.slice(0,2);
    bz=`<p>你的八字日主「${GAN[BZ_CUR.me]}${GAN_WX[BZ_CUR.me]}」，${BZ_CUR.strong?"本身力量比較足，適合自己主動出擊、做決定":"本身力量比較柔，適合多借助貴人、團隊與合作，不要一個人硬撐"}。參考用神是「${ys.join("、")}」，所以選方位、選時間時，可以優先考慮五行屬「${ys.join("、")}」的宮位，例如${ys.map(w=>`${w}：${[1,2,3,4,6,7,8,9].filter(p=>QM_WX[p]===w).map(p=>QM_DIR[p]+"方").join("、")}`).join("；")}。</p>`}
  else bz=`<p>你沒有填時辰，所以只能用你的日主「${GAN[chart.userStem]}」來核對。回到第一頁補上時辰，就能再加入八字用神做更完整的核對。</p>`;
  out.push(`<h5>對照你的八字</h5>${bz}`);
  out.push(`<p class="rd-note">奇門遁甲是看「時間與方位」的傳統術數，流派很多，這裡採常見的「拆補法」。內容是依規則整理的參考，不是預言，重大決定請再多方評估。</p>`);
  return out.join("");
}
function qmRun(){
  const date=document.getElementById("qm-date").value,hz=+document.getElementById("qm-hz").value,topic=document.getElementById("qm-topic").value;
  QM_SEL.date=date;QM_SEL.hz=hz;QM_SEL.topic=topic;
  const box=document.getElementById("qm-result");
  if(!date){box.innerHTML='<div class="card"><p class="err">請先選擇日期</p></div>';return}
  const [y,m,d]=date.split("-").map(Number);
  const chart=qmChart(y,m,d,hz);
  chart.userStem=calcBazi(S.y,S.m,S.d,S.hour===null?0:S.hour).P[2][0];
  const sel=QM_TOPICS[topic];
  box.innerHTML=`<div class="card qm-card"><h3>奇門命盤</h3>
    <p class="qm-head"><b>${y}/${m}/${d}　${QM_HOURS[hz]}</b><br>日柱 ${chart.dayGZ}　時柱 ${chart.hourGZ}　${chart.yang?"陽遁":"陰遁"} ${chart.ju} 局<br>值符 ${chart.zhifuStar}　值使 ${chart.zhishiDoor}　旬空 ${chart.kongPals.map(p=>QM_NAME[p]+p).join("、")}宮</p>
    ${qmGridHtml(chart,sel)}</div>
    <div class="card qm-card"><h3>白話解析（對照你的八字）</h3>${qmReadHtml(chart,topic,date,hz)}</div>`;
  box.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderQimen(){
  const el=document.getElementById("qimen");if(!el)return;
  if(!entitled(4)){el.innerHTML=gateChartTeaser(4,"奇門遁甲",["輸入起盤時間與想問的事","奇門命盤：九宮、八門、九星、八神","對照你的八字，用白話說明怎麼做比較好"]);return}
  if(!QM_SEL.date)qmDefaults();
  el.innerHTML=`<div class="card"><h3>奇門遁甲</h3>
    <p class="qm-intro">奇門遁甲是看「時間」與「方位」的傳統術數：選一個時間，排出當下的盤，看哪個方向、哪件事比較順。下面輸入時間和想問的事，按「起盤」，我會用你的八字幫你白話解說。</p>
    <label for="qm-date">日期</label><input id="qm-date" type="date" value="${QM_SEL.date}">
    <label for="qm-hz">時辰</label><select id="qm-hz">${QM_HOURS.map((t,i)=>`<option value="${i}"${i===QM_SEL.hz?" selected":""}>${t}</option>`).join("")}</select>
    <label for="qm-topic">想問什麼</label><select id="qm-topic">${Object.keys(QM_TOPICS).map(t=>`<option${t===QM_SEL.topic?" selected":""}>${t}</option>`).join("")}</select>
    <button class="go" id="qm-go" type="button">起盤</button></div><div id="qm-result"></div>`;
  document.getElementById("qm-go").onclick=qmRun;
}
