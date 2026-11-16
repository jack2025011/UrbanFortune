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

// ===== 神煞 =====
function shensha(P){               // P=[年,月,日,時] 每項 [干,支]
  const yG=P[0][0],yZ=P[0][1],mZ=P[1][1],dG=P[2][0],dZ=P[2][1];
  const g4=z=>z%4;
  const tianyi=[[1,7],[0,8],[11,9],[11,9],[1,7],[0,8],[1,7],[2,6],[5,3],[5,3]];
  const taiji=[[0,6],[0,6],[9,3],[9,3],[4,10,1,7],[4,10,1,7],[2,11],[2,11],[5,8],[5,8]];
  const xuetang={木:11,火:2,土:8,金:5,水:8}[GAN_WX[dG]];
  const xueren={2:1,3:7,4:2,5:8,6:3,7:9,8:4,9:10,10:5,11:11,0:6,1:0};
  const feiren={0:9,2:0,4:0,6:3,8:6}[dG];
  const rules=[
    ["天喜",[mod(9-yZ,12)]],["福德",[mod(yZ+9,12)]],
    ["桃花",[[9,6,3,0][g4(yZ)],[9,6,3,0][g4(dZ)]]],
    ["血刃",[xueren[mZ]]],
    ["天乙",[...tianyi[dG],...tianyi[yG]]],["太極",[...taiji[dG],...taiji[yG]]],
    ["喪門",[mod(yZ+2,12)]],
    ["驛馬",[[2,11,8,5][g4(yZ)],[2,11,8,5][g4(dZ)]]],
    ["孤辰",[[2,5,8,11][Math.floor(mod(yZ+1,12)/3)]]],
    ["學堂",[xuetang]],
    ["紅豔",[[6,6,2,7,4,4,10,9,0,8][dG]]],
    ["龍德",[mod(yZ+7,12)]],
    ["金輿",[[4,5,7,8,7,8,10,11,1,2][dG]]],
    ["流霞",[[9,10,7,8,5,6,4,3,11,2][dG]]],
    ["災煞",[[6,3,0,9][g4(yZ)],[6,3,0,9][g4(dZ)]]],
    ["飛刃",feiren===undefined?[]:[feiren]]
  ];
  return P.map(([,z])=>rules.filter(([,set])=>set.includes(z)).map(r=>r[0]));
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
  const ss=shensha(P);
  const kw=i=>{const idx=sexa(P[i][0],P[i][1]);return kongwang(idx).map(z=>ZHI[z]).join("")};
  const table=`<table class="mp">
    <tr class="hd"><th>日期</th>${order.map(i=>`<th>${names[i]}</th>`).join("")}</tr>
    ${row("主星",i=>i===2?"<span class='red'>日主</span>":shishen(me,P[i][0]))}
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
    <p>節氣：${fmtTerm(R.jie.name,R.jie.jd)}　${fmtTerm(R.qi.name,R.qi.jd)}</p>
    <p>人元司令：${R.renyuan.jie}後${R.renyuan.days}日　${R.renyuan.stem}${GAN_WX[GAN.indexOf(R.renyuan.stem)]}用事</p>
    <p>命宮：${gz(R.ming)}　胎元：${gz(R.taiyuan)}</p>
    <p>胎息：${gz(R.taixi)}　身宮：${gz(R.shen)}</p>
    <p>空亡(年日)：${[R.yIdx,R.dIdx].map(i=>kongwang(i).map(z=>ZHI[z]).join("")).join("　")}</p>
    <p>日主：<strong>${GAN[me]}（${GAN_WX[me]}）</strong></p>
    <p>五行：${Object.entries(cnt).map(([k,v])=>`${k}${v}`).join("　")}　${lack.length?"缺："+lack.join("、"):"五行俱全"}</p>
  </div>`;
  return`<div class="card"><h3>命盤</h3>${table}</div>${info}
    <p class="note">節氣由太陽位置推算，誤差約十分鐘內；出生在節氣交接當天請以萬年曆為準。時間取該時辰的起始整點。</p>`;
}
