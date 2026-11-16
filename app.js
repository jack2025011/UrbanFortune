const $=s=>document.querySelector(s);
let S=null;      // {y,m,d,digits,mm,dd,hour}
let LS=null;     // 生命靈數計算結果

// ========== 第一頁：輸入 ==========
$("#dob").addEventListener("input",e=>{
  const v=e.target.value.replace(/\D/g,"").slice(0,8);
  let f=v.slice(0,4);
  if(v.length>4)f+=" / "+v.slice(4,6);
  if(v.length>6)f+=" / "+v.slice(6,8);
  e.target.value=f;
});
$("#go").onclick=()=>{
  const v=$("#dob").value.replace(/\D/g,"");
  const err=t=>{$("#err").textContent=t};
  if(v.length!==8)return err("請輸入完整 8 位生日數字，例：19960728");
  const y=+v.slice(0,4),m=+v.slice(4,6),d=+v.slice(6,8),dt=new Date(y,m-1,d);
  if(y<1900||y>new Date().getFullYear()||dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d)
    return err("這個日期不存在，請再確認");
  err("");
  const h=$("#shichen").value;
  S={y,m,d,digits:v,mm:v.slice(4,6),dd:v.slice(6,8),hour:h===""?null:+h};
  $("#i-dob").textContent=`${v.slice(0,4)} / ${S.mm} / ${S.dd}`;
  $("#i-sc").textContent=S.hour===null?"未填":SHICHEN[S.hour];
  renderAll();
  $("#v-input").classList.remove("on");$("#v-result").classList.add("on");
  showTab("zodiac");window.scrollTo(0,0);
};
$("#back").onclick=()=>{$("#v-result").classList.remove("on");$("#v-input").classList.add("on");window.scrollTo(0,0)};

// ========== 分頁 ==========
function showTab(t){
  document.querySelectorAll("#tabs a").forEach(a=>a.classList.toggle("current",a.dataset.tab===t));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("on",p.id===t));
  if(t==="numerology")drawConnections();
}
document.querySelectorAll("#tabs a").forEach(a=>a.onclick=()=>showTab(a.dataset.tab));

document.querySelectorAll(".toggle").forEach(b=>b.onclick=()=>{
  const t=$("#"+b.dataset.target),open=t.classList.toggle("hidden")===false;
  b.textContent=(open?"收起":"查看")+b.dataset.label;
  b.classList.toggle("open",open);
});
function renderAll(){renderZodiac();renderNumerology();renderTarot();renderBazi()}

// ========== 星座 ==========
function seeded(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
  return()=>{h=Math.imul(h^h>>>15,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return(h>>>0)/4294967296}}
function signOf(m,d){let r=SIGNS[11];for(const s of SIGNS){if(m>s[1]||(m===s[1]&&d>=s[2]))r=s}return r}
function renderZodiac(){
  const s=signOf(S.m,S.d),n=new Date(),t=`${n.getFullYear()}-${n.getMonth()+1}-${n.getDate()}`,r=seeded(s[0]+t);
  const bar=(k)=>`<div class="bar"><b>${k}</b><i><u style="width:${(1+Math.floor(r()*5))*20}%"></u></i></div>`;
  $("#zodiac").innerHTML=`<div class="card"><h3>${s[0]}　今日運勢</h3><p>${s[3]}</p>
  ${bar("整體")}${bar("愛情")}${bar("事業")}${bar("財運")}
  <p>${TIPS[Math.floor(r()*TIPS.length)]}</p>
  <p>幸運色：<strong>${COLORS[Math.floor(r()*COLORS.length)]}</strong>　幸運數字：<strong>${1+Math.floor(r()*9)}</strong></p></div>`;
}

// ========== 生命靈數 ==========
const digitSum=s=>String(s).split("").reduce((a,b)=>a+ +b,0);
function calcAll(digits){
  const initialSum=digitSum(digits);
  let tmp=initialSum,allSumDigits="";
  while(tmp>=10){
    allSumDigits+=tmp;
    if(tmp===11||tmp===22||tmp===33)break;
    tmp=digitSum(tmp);
  }
  const lifePath=tmp;
  const finalLp=lifePath>9?digitSum(lifePath):lifePath;       // 大師數在九宮格上用個位數
  const marked=new Set();
  for(const c of digits)if(c!=="0")marked.add(+c);
  for(const c of allSumDigits)if(c!=="0")marked.add(+c);
  marked.add(finalLp);
  return{raw:digits,sum:initialSum,sumDigits:String(initialSum),allSumDigits,lifePath,finalLp,marked};
}
function renderNumerology(){
  LS=calcAll(S.digits);
  $("#raw-number").textContent=LS.raw;
  $("#sum-number").textContent=LS.sum;
  $("#lp-number").textContent=LS.lifePath;

  // 九宮格符號
  document.querySelectorAll(".symbol-area").forEach(a=>a.innerHTML="");
  const put=(n,cls)=>{if(n>=1&&n<=9)$(`#cell-${n} .symbol-area`).innerHTML+=`<div class="symbol ${cls}"></div>`};
  new Set([...LS.raw].map(Number)).forEach(n=>put(n,"s-raw"));
  new Set([...LS.allSumDigits].map(Number)).forEach(n=>put(n,"s-sum"));
  put(LS.finalLp,"s-lp");

  // 詳細解析
  let sub="";
  if(LS.sumDigits.length>1){
    sub="<h4>後天數分解數字解析：</h4>"+[...LS.sumDigits].filter(d=>d!=="0")
      .map(d=>`<p>數字 <strong class="red">${d}</strong>：${singleDigitMeanings[d]}</p>`).join("");
  }
  let conns="";
  CONNECTIONS.forEach(p=>{
    const m=connectionMeanings[p.join("")];
    if(m&&p.every(n=>LS.marked.has(n)))
      conns+=`<li><strong>✅ ${p.join("-")} 連線 (${m.name})：</strong>${m.trait}</li>`;
  });
  $("#ls-detail").innerHTML=`
  <div class="card analysis"><h3>🥇 主命數 解析</h3>
    <div class="result-number"><small>主命數</small>${LS.lifePath}</div>
    <p>${lifePathMeanings[LS.lifePath]||""}</p></div>
  <div class="card"><h3>🌱 先天數</h3>
    <div class="result-number"><small>先天數</small>${LS.raw}</div></div>
  <div class="card"><h3>🌳 後天數</h3>
    <div class="result-number"><small>總和數</small>${LS.sum}</div>${sub}</div>
  <div class="card"><h3>🔗 九宮連線（天賦連線）解析</h3>
    <p>以下是命盤中擁有的天賦連線。連線完整代表天生擁有該特質的能量組。</p>
    <ul class="connection-list">${conns||"<li>九宮格未形成任何一條完整的連線。</li>"}</ul></div>`;

  renderLiuNian();
}
function drawConnections(){
  if(!LS)return;
  const svg=$("#connection-svg"),grid=$("#lo-shu-grid"),g=grid.getBoundingClientRect();
  svg.innerHTML="";
  CONNECTIONS.forEach(p=>{
    if(!p.every(n=>LS.marked.has(n)))return;
    const a=$(`#cell-${p[0]}`).getBoundingClientRect(),b=$(`#cell-${p[p.length-1]}`).getBoundingClientRect();
    const l=document.createElementNS("http://www.w3.org/2000/svg","line");
    l.setAttribute("x1",a.left+a.width/2-g.left);l.setAttribute("y1",a.top+a.height/2-g.top);
    l.setAttribute("x2",b.left+b.width/2-g.left);l.setAttribute("y2",b.top+b.height/2-g.top);
    l.setAttribute("class","connection-line");svg.appendChild(l);
  });
}

// ========== 流年（接在生命靈數下方）==========
function reduce9(n){
  let s=n;
  while(String(s).length>1)s=digitSum(s);
  return s===0?9:s;
}
function renderLiuNian(){
  const yr=String(new Date().getFullYear());              // 流年：今年
  const [M1,M2,D1,D2]=[...S.mm,...S.dd].map(Number),[Y1,Y2,Y3,Y4]=[...yr].map(Number);
  const P5=reduce9(reduce9(M1+M2)+reduce9(D1+D2)),P7=reduce9(reduce9(Y1+Y2)+reduce9(Y3+Y4));
  const n=reduce9(P5+P7),a=LIU_NIAN_ANALYSIS[n];
  $("#ln-year").textContent=yr;$("#ln-num").textContent=n;
  $("#ln-theme").textContent=a.theme;$("#ln-advice").textContent=a.advice;
}

// ========== 生命塔羅 ==========
const reduceTo22=n=>{if(n<=22)return n===0?22:n;let s=n;while(s>22)s=digitSum(s);return s===0?22:s};
const subtract22=n=>{while(n>22)n-=22;return n===0?22:n};
function dayOfYear(m,d){const dm=[0,31,28,31,30,31,30,31,31,30,31,30,31];let t=0;for(let i=1;i<m;i++)t+=dm[i];return t+d}
function renderTarot(){
  const y=S.digits.slice(0,4),mo=S.digits.slice(4,6),da=S.digits.slice(6,8);
  const sy=digitSum(y),sm=digitSum(mo),sd=digitSum(da);
  const c4=dayOfYear(S.m,S.d)%22||22;
  let lp=digitSum(S.digits);while(lp>9)lp=digitSum(lp);
  const c={1:reduceTo22(S.d),2:subtract22(sy+sm+sd),3:subtract22(sy+S.m+S.d),4:c4,
    5:c4-1===0?22:c4-1,6:c4+1===23?1:c4+1,career:lp};
  const nm=n=>TAROT_MAP[n],key=n=>TAROT_MAP[n].split(" ")[0];
  const labels={1:"1. 個性塔羅",2:"2. 愛情塔羅",3:"3. 靈魂塔羅",4:"4. 潛能塔羅",5:"5. 配牌 1",6:"6. 配牌 2"};
  $("#tarot-grid").innerHTML=[1,2,3,4,5,6].map(i=>
    `<div class="tarot-card-display"><strong>${labels[i]}</strong><span class="number">${c[i]}</span><span class="name">${key(c[i])}</span></div>`).join("");
  $("#career-tarot").innerHTML=`<strong>事業塔羅：</strong><span class="number">${c.career}</span><span class="name">${key(c.career)}</span>`;

  const names=[c[1],c[2],c[3],c[4],c[5],c[6],c.career].map(key);
  const block=(title,n,body)=>`<div class="card analysis"><h3>${title}</h3><p><strong>卡號 ${n}：${nm(n)}</strong></p>${body}</div>`;
  const plain=(t,n)=>block(t,n,`<p>${ANALYSIS_DATA[key(n)]||"暫無解析"}</p>`);
  const love=LOVE_ANALYSIS_DATA[key(c[2])],car=CAREER_ANALYSIS_DATA[key(c.career)];
  let html=plain("個性塔羅",c[1])
    +block("愛情塔羅",c[2],`<h4>愛情風格</h4><p>${love.style}</p><h4>愛情弱點</h4><p>${love.weakness}</p>`)
    +plain("靈魂塔羅",c[3])+plain("潛能塔羅",c[4])+plain("配牌 1",c[5])+plain("配牌 2",c[6])
    +block("事業塔羅",c.career,`<h4>事業方向</h4><p>${car.main}</p><h4>禁忌</h4><p>${car.forbidden}</p><h4>適合職務</h4><p>${car.suitable_job}</p>`);

  // 特殊組合
  let combo="";const cnt={};names.forEach(n=>cnt[n]=(cnt[n]||0)+1);
  for(const n in cnt)if(cnt[n]>=2&&COMBINATION_DATA[n]&&COMBINATION_DATA[n].count===2)
    combo+=`<p><strong>【${n} 重複】</strong>：${COMBINATION_DATA[n].text}</p>`;
  const uniq=[...new Set(names)];
  for(const k in COMBINATION_DATA)if(k.includes("+")&&k.split("+").every(p=>uniq.includes(p)))
    combo+=`<p><strong>【組合：${k}】</strong>：${COMBINATION_DATA[k]}</p>`;
  if(combo)html+=`<div class="card analysis"><h3>✨ 特殊牌組合</h3>${combo}</div>`;
  $("#tarot-detail").innerHTML=html;
}

// ========== 八字（節氣以固定日期近似）==========
const JIE=[6,4,6,5,6,6,7,8,8,8,7,7]; // 每月「節」日期：小寒、立春、驚蟄…大雪
function bazi(y,m,d,hz){
  const ey=(m>2||(m===2&&d>=4))?y:y-1;
  const yg=((ey-4)%10+10)%10,yz=((ey-4)%12+12)%12;
  let mz=m%12;if(d<JIE[m-1])mz=(mz+11)%12;
  const mg=((yg%5)*2+2+((mz-2+12)%12))%10;
  const days=Math.round((Date.UTC(y,m-1,d)-Date.UTC(1900,0,1))/864e5);
  const dg=((days%10)+10)%10,dz=(((days+10)%12)+12)%12;   // 1900-01-01 為甲戌日
  const hg=((dg%5)*2+hz)%10;
  return[[yg,yz],[mg,mz],[dg,dz],[hg,hz]];
}
function renderBazi(){
  if(S.hour===null){
    $("#bazi").innerHTML=`<div class="card"><div class="need">請填寫時辰</div>
      <p style="text-align:center"><small>八字需要出生時辰，請按上方「返回修改」補填。</small></p></div>`;
    return;
  }
  const P0=bazi(S.y,S.m,S.d,S.hour),P=[...P0].reverse(),names=["時柱","日柱","月柱","年柱"],cnt={木:0,火:0,土:0,金:0,水:0};
  P.forEach(([g,z])=>{cnt[GAN_WX[g]]++;cnt[ZHI_WX[z]]++});
  const lack=Object.keys(cnt).filter(k=>!cnt[k]);
  $("#bazi").innerHTML=`<div class="card"><h3>四柱八字</h3>
    <div class="pillars">${P.map(([g,z],i)=>`<div><small>${names[i]}</small><b>${GAN[g]}<br>${ZHI[z]}</b></div>`).join("")}</div>
    <p>日主：<strong>${GAN[P[1][0]]}（${GAN_WX[P[1][0]]}）</strong></p>
    <p>五行：${Object.entries(cnt).map(([k,v])=>`${k}${v}`).join("　")}</p>
    <p>${lack.length?"五行缺："+lack.join("、"):"五行俱全"}</p>
    <p class="note">節氣以固定日期近似，出生在節氣交接當天，月柱可能差一個月，請以萬年曆為準。</p></div>`;
}
