// ========== 八字命盤計算（以台灣時間 UTC+8；節氣由太陽黃經推算，誤差約十幾分鐘內）==========
const RAD=Math.PI/180;
function jdOf(y,m,d,h){            // 台灣時間 → 儒略日
  let Y=y,M=m;if(M<=2){Y--;M+=12}
  const A=Math.floor(Y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(M+1))+d+B-1524.5+(h-8)/24;
}
function fromJd(jd){               // 儒略日 → 台灣時間 {d,h,mi}（只取日與時分）
  const t=jd+8/24+0.5,Z=Math.floor(t),F=t-Z;
  let A=Z;if(Z>=2299161){const a=Math.floor((Z-1867216.25)/36524.25);A=Z+1+a-Math.floor(a/4)}
  const B=A+1524,C=Math.floor((B-122.1)/365.25),D=Math.floor(365.25*C),E=Math.floor((B-D)/30.6001);
  const day=B-D-Math.floor(30.6001*E),mins=Math.round(F*1440);
  return{d:day,h:Math.floor(mins/60)%24,mi:mins%60,carry:Math.floor(mins/1440)};
}
function sunLon(jd){
  const T=(jd-2451545)/36525,L0=280.46646+36000.76983*T+0.0003032*T*T;
  const M=(357.52911+35999.05029*T-0.0001537*T*T)*RAD;
  const C=(1.914602-0.004817*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M);
  const om=(125.04-1934.136*T)*RAD;
  return(((L0+C-0.00569-0.00478*Math.sin(om))%360)+360)%360;
}
function termJd(target,guess){     // 求太陽黃經到達 target 的時刻
  let jd=guess;
  for(let i=0;i<8;i++){const diff=((target-sunLon(jd)+540)%360)-180;jd+=diff/0.98565}
  return jd;
}
const mod=(a,n)=>((a%n)+n)%n;
const sexa=(g,z)=>{for(let n=g;n<60;n+=10)if(n%12===z)return n;return 0};

// ===== 表格資料 =====
const HIDDEN=["癸","己癸辛","甲丙戊","乙","戊乙癸","丙庚戊","丁己","己丁乙","庚壬戊","辛","戊辛丁","壬甲"]
  .map(s=>[...s].map(c=>GAN.indexOf(c)));
const NAYIN=["海中金","爐中火","大林木","路旁土","劍鋒金","山頭火","澗下水","城頭土","白蠟金","楊柳木","泉中水","屋上土","霹靂火","松柏木","長流水","砂石金","山下火","平地木","壁上土","金箔金","覆燈火","天河水","大驛土","釵釧金","桑柘木","大溪水","沙中土","天上火","石榴木","大海水"];
const CHANGSHENG=["長生","沐浴","冠帶","臨官","帝旺","衰","病","死","墓","絕","胎","養"];
const CS_START=[11,6,2,9,2,9,5,0,8,3];   // 甲亥 乙午 丙寅 丁酉 戊寅 己酉 庚巳 辛子 壬申 癸卯
function changsheng(g,z){const yang=g%2===0;return CHANGSHENG[yang?mod(z-CS_START[g],12):mod(CS_START[g]-z,12)]}
const WX_IDX={木:0,火:1,土:2,金:3,水:4};
function shishen(me,g){            // 以日主 me 看天干 g 的十神
  const a=WX_IDX[GAN_WX[me]],b=WX_IDX[GAN_WX[g]],same=(me%2)===(g%2);
  const rel=mod(b-a,5);            // 0 同我 1 我生 2 我克 3 克我 4 生我
  return[["比肩","劫財"],["食神","傷官"],["偏財","正財"],["七殺","正官"],["偏印","正印"]][rel][same?0:1];
}
function kongwang(idx){const x=Math.floor(idx/10);return[mod(10-2*x,12),mod(11-2*x,12)]}

// ===== 神煞（規則以兩張對照命盤校正）=====
// 每條規則：[名稱, 判斷函式(柱序 i, 天干 g, 地支 z)]；順序即畫面顯示順序
function shensha(P,gender){          // P=[年,月,日,時] 每項 [干,支]
  const yG=P[0][0],yZ=P[0][1],mZ=P[1][1],dG=P[2][0],dZ=P[2][1];
  const g4=z=>z%4;
  const tianyi=[[1,7],[0,8],[11,9],[11,9],[1,7],[0,8],[1,7],[2,6],[5,3],[5,3]];
  const taiji=[[0,6],[0,6],[9,3],[9,3],[4,10,1,7],[4,10,1,7],[2,11],[2,11],[5,8],[5,8]];
  const xuetang={木:11,火:2,土:8,金:5,水:8}[GAN_WX[dG]];
  const xueren={2:1,3:7,4:2,5:8,6:3,7:9,8:4,9:10,10:5,11:11,0:6,1:0};
  // 飛刃＝羊刃的對沖：甲卯 乙寅 丙午 丁未 戊午 己未 庚酉 辛戌 壬子 癸丑 → 沖位
  const feiren=[9,8,0,1,0,1,3,4,6,7][dG];
  // 天德（依月支）：{s:天干} 或 {b:地支}
  const TD=[{b:5},{s:6},{s:3},{b:8},{s:8},{s:7},{b:11},{s:0},{s:9},{b:2},{s:2},{s:1}][mZ];
  const yued=[8,6,2,0][g4(mZ)];                 // 月德：申子辰壬、巳酉丑庚、寅午戌丙、亥卯未甲
  const inb=set=>(i,g,z)=>set.includes(z);
  // 天羅：年柱或日柱的納音屬火，見戌、亥（地網未列，因對照命盤沒有出現）
  const nyEl=(g,z)=>NAYIN[Math.floor(sexa(g,z)/2)].slice(-1);
  const luo=(nyEl(yG,yZ)==="火"||nyEl(dG,dZ)==="火")?[10,11]:[];
  const rules=[
    ["天喜",inb([mod(9-yZ,12)])],
    ["福德",inb([mod(yZ+9,12)])],
    ["五鬼",inb([mod(yZ+4,12)])],
    ["天德",(i,g,z)=>TD.s!==undefined?g===TD.s:z===TD.b],
    ["天狗",inb([mod(yZ-2,12)])],
    ["喪門",inb([mod(yZ+2,12)])],
    ["六厄",inb([[3,0,9,6][g4(yZ)]])],
    ["龍德",inb([mod(yZ+7,12)])],
    // 元辰（大耗）：陽男陰女＝年支對沖再往後一位；陰男陽女＝對沖再往前一位；需要性別
    ["元辰",gender?inb([mod(yZ+6+(((yG%2===0)===(gender==="男"))?1:-1),12)]):()=>false],
    ["金輿",inb([[4,5,7,8,7,8,10,11,1,2][dG]])],
    ["流霞",inb([[9,10,7,8,5,6,4,3,11,2][dG]])],
    ["災煞",inb([[6,3,0,9][g4(yZ)],[6,3,0,9][g4(dZ)]])],
    ["桃花",inb([[9,6,3,0][g4(yZ)],[9,6,3,0][g4(dZ)]])],
    ["驛馬",inb([[2,11,8,5][g4(yZ)],[2,11,8,5][g4(dZ)]])],
    ["劫煞",inb([[5,2,11,8][g4(yZ)],[5,2,11,8][g4(dZ)]])],
    ["血刃",inb([xueren[mZ]])],
    ["孤辰",inb([[2,5,8,11][Math.floor(mod(yZ+1,12)/3)]])],
    ["學堂",inb([xuetang])],
    ["紅豔",inb([[6,6,2,7,4,4,10,9,0,8][dG]])],
    ["天羅",inb(luo)],
    ["弔客",inb([mod(yZ-2,12)])],
    ["天醫",inb([mod(mZ-1,12)])],
    ["月德合",(i,g)=>g===mod(yued+5,10)],
    ["隔角",inb([mod(dZ+2,12)])],
    ["日破",(i,g,z)=>i===3&&z===mod(dZ+6,12)],
    ["破碎",inb([mod(yZ+6,12)])],
    ["大耗",inb([mod(yZ+6,12)])],
    ["飛刃",inb([feiren])],
    ["墓庫",(i,g,z)=>changsheng(dG,z)==="墓"],
    ["天乙",inb(tianyi[dG])],
    ["月德",(i,g)=>g===yued],
    ["太極",inb(taiji[dG])]
  ];
  return P.map(([g,z],i)=>rules.filter(([,f])=>f(i,g,z)).map(r=>r[0]));
}

// ===== 人元司令分野（淵海子平）=====
const RENYUAN=[
  [["壬",10],["癸",20]],[["癸",9],["辛",3],["己",18]],[["戊",7],["丙",7],["甲",16]],[["甲",10],["乙",20]],
  [["乙",9],["癸",3],["戊",18]],[["戊",5],["庚",9],["丙",16]],[["丙",10],["己",9],["丁",11]],[["丁",9],["乙",3],["己",18]],
  [["戊",7],["壬",3],["庚",20]],[["庚",10],["辛",20]],[["辛",9],["丁",3],["戊",18]],[["戊",7],["甲",5],["壬",18]]];

// ===== 主計算 =====
function calcBazi(y,m,d,hz){
  const hour=hz===0?0:2*hz-1;                         // 取該時辰起始整點
  const jd=jdOf(y,m,d,hour),lon=sunLon(jd);
  const k=Math.floor(mod(lon-315,360)/30);            // 0=寅月 … 11=丑月
  const ey=(m<=2&&lon<315&&lon>=240)?y-1:y;
  const yg=mod(ey-4,10),yz=mod(ey-4,12);
  const mz=mod(2+k,12),mg=mod((yg%5)*2+2+k,10);
  const days=Math.round((Date.UTC(y,m-1,d)-Date.UTC(1900,0,1))/864e5);
  const dIdx=mod(days+10,60),dg=dIdx%10,dz=dIdx%12;
  const hg=mod((dg%5)*2+hz,10);
  const P=[[yg,yz],[mg,mz],[dg,dz],[hg,hz]];

  // 節氣：出生當月的「節」與其後的「中氣」
  const jieLon=mod(315+30*k,360);
  const jieJd=termJd(jieLon,jd-mod(lon-jieLon,360)/0.98565);
  const qiJd=termJd(mod(jieLon+15,360),jieJd+15);
  const JIE=["立春","驚蟄","清明","立夏","芒種","小暑","立秋","白露","寒露","立冬","大雪","小寒"];
  const QI=["雨水","春分","穀雨","小滿","夏至","大暑","處暑","秋分","霜降","小雪","冬至","大寒"];

  // 命宮、身宮、胎元、胎息
  const S=k+1+hz,mgOff=(S>=14?26:14)-S-1;
  const ming=[mod((yg%5)*2+2+mgOff,10),mod(2+mgOff,12)];
  const shen=[mod((yg%5)*2+2+mod(S,12),10),mod(2+mod(S,12),12)];
  const taiyuan=[mod(mg+1,10),mod(mz+3,12)];
  const taixi=[mod(dg+5,10),mod(13-dz,12)];

  // 人元司令
  const elapsed=jd-jieJd;let acc=0,ry=null;
  for(const [s,n] of RENYUAN[mz]){acc+=n;if(elapsed<acc){ry=s;break}}
  if(!ry)ry=RENYUAN[mz][RENYUAN[mz].length-1][0];

  return{P,dIdx,yIdx:sexa(yg,yz),
    jie:{name:JIE[k],jd:jieJd},qi:{name:QI[k],jd:qiJd},
    ming,shen,taiyuan,taixi,renyuan:{days:Math.floor(elapsed),stem:ry,jie:JIE[k]}};
}

// ===== 畫面 =====
const WXC={木:"wxm",火:"wxh",土:"wxt",金:"wxj",水:"wxs"};
const fmtTerm=(n,jd)=>{const t=fromJd(jd);return`${n} (${t.d}日${t.h}時${String(t.mi).padStart(2,"0")}分)`};
const gz=([g,z])=>`${GAN[g]}${ZHI[z]}`;
function baziHtml(S,hz){
  const R=calcBazi(S.y,S.m,S.d,hz),P=R.P,me=P[2][0];
  const order=[3,2,1,0];                                // 時、日、月、年
  const names=["年柱","月柱","日柱","時柱"];
  const row=(label,fn)=>`<tr><th>${label}</th>${order.map(i=>`<td>${fn(i)}</td>`).join("")}</tr>`;
  const ss=shensha(P,S.gender);
  const kw=i=>{const idx=sexa(P[i][0],P[i][1]);return kongwang(idx).map(z=>ZHI[z]).join("")};
  const table=`<table class="mp">
    <tr class="hd"><th>日期</th>${order.map(i=>`<th>${names[i]}</th>`).join("")}</tr>
    ${row("主星",i=>i===2?`<span class='red'>${S.gender==="男"?"元男":S.gender==="女"?"元女":"日主"}</span>`:shishen(me,P[i][0]))}
    ${row("天干",i=>`<b class="big ${WXC[GAN_WX[P[i][0]]]}">${GAN[P[i][0]]}</b>`)}
    ${row("地支",i=>`<b class="big ${WXC[ZHI_WX[P[i][1]]]}">${ZHI[P[i][1]]}</b>`)}
    ${row("藏干",i=>HIDDEN[P[i][1]].map(g=>`${GAN[g]} ${GAN_WX[g]}`).join("<br>"))}
    ${row("副星",i=>HIDDEN[P[i][1]].map(g=>shishen(me,g)).join("<br>"))}
    ${row("納音",i=>NAYIN[Math.floor(sexa(P[i][0],P[i][1])/2)])}
    ${row("星運",i=>changsheng(me,P[i][1]))}
    ${row("自坐",i=>changsheng(P[i][0],P[i][1]))}
    ${row("空亡",kw)}
    ${row("神煞",i=>ss[i].join("<br>")||"—")}
  </table>`;
  const cnt={木:0,火:0,土:0,金:0,水:0};
  P.forEach(([g,z])=>{cnt[GAN_WX[g]]++;cnt[ZHI_WX[z]]++});
  const lack=Object.keys(cnt).filter(k=>!cnt[k]);
  const info=`<div class="card"><h3>基本資料</h3>
    <p>西曆：${S.y}年${S.mm}月${S.dd}日　${SHICHEN[hz]}</p>
    <p>農曆：${S.lunar.text}　${SHICHEN[hz]}　屬${S.lunar.shengxiao}</p>
    <p>節氣：${fmtTerm(R.jie.name,R.jie.jd)}　${fmtTerm(R.qi.name,R.qi.jd)}</p>
    <p>人元司令：${R.renyuan.jie}後${R.renyuan.days}日　${R.renyuan.stem}${GAN_WX[GAN.indexOf(R.renyuan.stem)]}用事</p>
    <p>命宮：${gz(R.ming)}　胎元：${gz(R.taiyuan)}</p>
    <p>胎息：${gz(R.taixi)}　身宮：${gz(R.shen)}</p>
    <p>空亡(年日)：${[R.yIdx,R.dIdx].map(i=>kongwang(i).map(z=>ZHI[z]).join("")).join("　")}</p>
    <p>日主：<strong>${GAN[me]}（${GAN_WX[me]}）</strong></p>
    <p>五行：${Object.entries(cnt).map(([k,v])=>`${k}${v}`).join("　")}　${lack.length?"缺："+lack.join("、"):"五行俱全"}</p>
  </div>`;
  // ===== 十神統計（天干不含日主 + 全部藏干）=====
  const names4=["年","月","日","時"],cntS={},posS={};
  SHISHEN_ORDER.forEach(n=>{cntS[n]=0;posS[n]=[]});
  P.forEach(([g,z],i)=>{
    if(i!==2){const n=shishen(me,g);cntS[n]++;posS[n].push({i,t:"天干",g})}
    HIDDEN[z].forEach(h=>{const n=shishen(me,h);cntS[n]++;posS[n].push({i,t:"藏干",g:h})});
  });
  // 旺相休囚死：依月令五行
  const mw=[2,3].includes(P[1][1])?"木":[5,6].includes(P[1][1])?"火":[8,9].includes(P[1][1])?"金":[11,0].includes(P[1][1])?"水":"土";
  const WXN=["木","火","土","金","水"],mi=WXN.indexOf(mw);
  const status={};status[WXN[mi]]="旺";status[WXN[(mi+1)%5]]="相";status[WXN[(mi+4)%5]]="休";status[WXN[(mi+3)%5]]="囚";status[WXN[(mi+2)%5]]="死";
  const wxShi={木:[],火:[],土:[],金:[],水:[]};
  // 十神所屬五行：以日主五行推算
  const meWx=WX_IDX[GAN_WX[me]];
  const shiWx={比肩:0,劫財:0,食神:1,傷官:1,偏財:2,正財:2,七殺:3,正官:3,偏印:4,正印:4};
  SHISHEN_ORDER.forEach(n=>wxShi[WXN[mod(meWx+shiWx[n],5)]].push(`${n}${cntS[n]}`));
  // ===== 五行分數（本站參考算法，共 60 分）=====
  // 天干每個 5 分（含日主）；地支：年8、月16（當令加重）、日8、時8，再依本氣／中氣／餘氣分給藏干
  const SW=[5,5,5,5],BW=[8,16,8,8],score={木:0,火:0,土:0,金:0,水:0};
  P.forEach(([g,z],i)=>{
    score[GAN_WX[g]]+=SW[i];
    const hs=HIDDEN[z],sh=hs.length===1?[1]:hs.length===2?[.7,.3]:[.6,.3,.1];
    hs.forEach((h,k)=>{score[GAN_WX[h]]+=BW[i]*sh[k]});
  });
  const wxAt=r=>WXN[mod(meWx+r,5)];                          // 相對日主的五行：0同我 1我生 2我克 3克我 4生我
  const helpScore=score[wxAt(0)]+score[wxAt(4)];              // 生扶＝比劫＋印
  const strong=helpScore>30;
  const yong=strong?[wxAt(1),wxAt(2),wxAt(3)]:[wxAt(4),wxAt(0)];   // 身強用食傷、財、官殺；身弱用印、比劫
  const ji=strong?[wxAt(0),wxAt(4)]:[wxAt(1),wxAt(2),wxAt(3)];
  const wxRows=WXN.map(w=>`<tr><th class="${WXC[w]}">${w}</th><td>${status[w]}</td><td>${Math.round(score[w])}</td><td class="ss-c">${wxShi[w].join(" ")}</td></tr>`).join("");
  const wxCard=`<div class="card"><h3>五行與十神</h3>
    <div class="strength"><span class="st-l">命主屬性</span><b class="${WXC[GAN_WX[me]]}">${GAN[me]}（${GAN_WX[me]}）</b><b class="st-v ${strong?"s":"w"}">${strong?"身強":"身弱"}（${Math.round(helpScore)}）</b></div>
    <div class="strength"><span class="st-l">參考用神</span><span class="st-t">${yong.map(w=>`<b class="${WXC[w]}">${w}</b>`).join(" ")}</span></div>
    <div class="strength"><span class="st-l">參考忌神</span><span class="st-t">${ji.map(w=>`<b class="${WXC[w]}">${w}</b>`).join(" ")}</span></div>
    <table class="mp2"><tr class="hd"><th>五行</th><th>月令</th><th>分數</th><th>十神數量</th></tr>${wxRows}</table>
    <p><small>以月支「${ZHI[P[1][1]]}」為當令（${mw}旺）；十神數量＝天干（不含日主）＋所有藏干。身強弱以「生扶（比劫＋印）」分數過半（超過 30 分）為身強；分數為本站參考算法，與其他軟體可能差 1～2 分，用神忌神僅供參考。</small></p></div>`;
  // ===== 十神解析（依所在柱位）=====
  const posLegend=POS_MEANING.map(p=>`<p><b>${p.name}</b>：${p.who}<br><small>${p.desc}</small></p>`).join("")
    +`<p><small>天干＝外顯、別人看得到的表現；藏干＝內在、潛藏或較晚才顯現的特質。</small></p>`;
  const analysis=SHISHEN_ORDER.map(n=>{
    const c=cntS[n],t=SHISHEN_TEXT[n];
    const lvl=c===0?"無":c===1?"1個":c===2?"2個・適中":`${c}個・偏多`;
    const items=posS[n].sort((x,y)=>x.i-y.i).map(o=>
      `<div class="occ"><b>${POS_MEANING[o.i].name}${o.t}（${GAN[o.g]}）</b><p><small>${o.t==="天干"?"外顯":"內在"}</small>　${SS_POS[n][o.i]}</p></div>`).join("");
    return`<div class="ss"><div class="ss-h"><b>${n}</b><span class="tag ${c===0?"no":c>=3?"hi":""}">${lvl}</span></div>
      <p>${c===0?t.none:(c>=3?t.core+t.many:t.core)}</p>${S.gender&&GENDER_NOTE[n]?`<p class="gn">${GENDER_NOTE[n][S.gender]}</p>`:""}${items}</div>`;
  }).join("");
  // ===== 神煞解析（依所在柱位）=====
  const shaPos={};
  ss.forEach((list,i)=>list.forEach(n=>{(shaPos[n]=shaPos[n]||[]).push(i)}));
  const shaHtml=SHENSHA_ORDER.filter(n=>shaPos[n]).map(n=>{
    const t=SHENSHA_INFO[n];
    const items=shaPos[n].sort((x,y)=>x-y).map(i=>`<div class="occ"><b>${POS_MEANING[i].name}（${ZHI[P[i][1]]}）</b><p>${t.pos[i]}</p></div>`).join("");
    return`<div class="ss"><div class="ss-h"><b>${n}</b><span class="tag ${t.type==="凶"?"hi":t.type==="中"?"":"ok"}">${t.type==="中"?"吉凶參半":t.type}</span></div><p>${t.core}</p>${items}</div>`;
  }).join("")||'<p>命盤中沒有出現本站列出的神煞。</p>';
  const shaCard=`<div class="card"><h3>神煞解析</h3>${shaHtml}
    <p class="note">神煞是傳統命理的輔助參考，依「所在柱位」看影響的人事時地；吉凶要與整體命盤、大運一起判斷，不宜單看一個神煞下定論。</p></div>`;
  const anaCard=`<button class="toggle" data-lock="1" data-target="ss-detail" data-label="十神・神煞解析">查看十神・神煞解析</button>
    <div id="ss-detail" class="hidden"><div class="card"><h3>各柱位置的意義</h3>${posLegend}</div>
    <div class="card"><h3>十神解析</h3>${analysis}
    <p class="note">以上為十神的一般性說明，依日主「${GAN[me]}${GAN_WX[me]}」計算；同一個十神出現在不同柱，意義會不同。實際強弱還要看月令、合沖與大運，僅供參考。</p></div>${shaCard}</div>`;
  return`<div class="card"><h3>命盤</h3>${table}</div>${info}${wxCard}${anaCard}
    <p class="note">節氣由太陽位置推算，誤差約十分鐘內；出生在節氣交接當天請以萬年曆為準。時間取該時辰的起始整點。</p>`;
}
