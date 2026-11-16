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
// 讀取並驗證輸入；成功回傳資料，失敗回傳 {error}
function readInput(){
  const v=$("#dob").value.replace(/\D/g,"");
  if(v.length!==8)return{error:"請輸入完整 8 位生日數字，例：19960728"};
  const y=+v.slice(0,4),m=+v.slice(4,6),d=+v.slice(6,8),dt=new Date(y,m-1,d);
  if(y<1900||y>new Date().getFullYear()||dt.getFullYear()!==y||dt.getMonth()!==m-1||dt.getDate()!==d)
    return{error:"這個日期不存在，請再確認"};
  const h=$("#shichen").value;
  return{y,m,d,digits:v,mm:v.slice(4,6),dd:v.slice(6,8),hour:h===""?null:+h,name:$("#uname").value.trim(),gender:$("#gender").value||null};
}
const msg=(t,ok)=>{const e=$("#err");e.textContent=t;e.style.color=ok?"var(--gold)":""};
$("#go").onclick=()=>{
  const r=readInput();
  if(r.error)return msg(r.error);
  msg("");S=r;
  $("#i-name").textContent=S.name;$("#i-gender").textContent=S.gender||"";
  $("#i-name-wrap").style.display=S.name?"":"none";$("#i-gender-wrap").style.display=S.gender?"":"none";
  $("#i-name-row").style.display=(S.name||S.gender)?"":"none";
  $("#i-dob").textContent=`${S.digits.slice(0,4)}/${S.mm}/${S.dd}`;
  $("#i-sc").textContent=S.hour===null?"未填":SHICHEN[S.hour];
  S.lunar=lunarDate(S.y,S.m,S.d);$("#i-lunar").textContent=S.lunar.text;
  renderAll();
  $("#v-input").classList.remove("on");$("#v-result").classList.add("on");
  showTab("numerology");window.scrollTo(0,0);
};

// ========== 儲存／歷史（存在這支手機的瀏覽器裡，不會上傳）==========
const HKEY="urbanfortune.history.v1";
function loadHist(){try{const l=JSON.parse(localStorage.getItem(HKEY)||"[]");return Array.isArray(l)?l:[]}catch(e){return[]}}
function saveHist(l){try{localStorage.setItem(HKEY,JSON.stringify(l));return true}catch(e){return false}}
const fmtDob=d=>`${d.slice(0,4)} / ${d.slice(4,6)} / ${d.slice(6,8)}`;
$("#save").onclick=()=>{
  const r=readInput();
  if(r.error)return msg(r.error);
  const item={name:r.name,dob:r.digits,hour:r.hour,gender:r.gender};
  let list=loadHist();
  const i=list.findIndex(x=>x.name===item.name&&x.dob===item.dob&&x.hour===item.hour&&(x.gender||null)===item.gender);
  if(i>=0)list.splice(i,1);                      // 相同資料就更新到最前面
  list.unshift(item);
  if(!saveHist(list))return msg("這個瀏覽器無法儲存（可能是無痕模式）");
  msg("已儲存",true);
  if(!$("#hist-list").classList.contains("hidden"))renderHist();
};
function renderHist(){
  const list=loadHist(),box=$("#hist-list");
  if(!list.length){box.innerHTML='<p class="empty">還沒有儲存的紀錄</p>';return}
  box.innerHTML=list.map((x,i)=>`<div class="hi" data-i="${i}">
    <div class="hi-main"><b class="hi-name"></b><span>${fmtDob(x.dob)}　${x.hour===null||x.hour===undefined?"時辰未填":SHICHEN[x.hour]}${x.gender?"　"+x.gender:""}</span></div>
    <button class="del" data-del="${i}" aria-label="刪除">✕</button></div>`).join("");
  box.querySelectorAll(".hi-name").forEach((el,i)=>el.textContent=list[i].name||"未命名");   // 姓名用 textContent，避免被當成網頁語法
}
$("#hist").onclick=()=>{
  const box=$("#hist-list"),open=box.classList.toggle("hidden")===false;
  if(open)renderHist();
};
$("#hist-list").addEventListener("click",e=>{
  const del=e.target.closest("[data-del]");
  if(del){const list=loadHist();list.splice(+del.dataset.del,1);saveHist(list);renderHist();return}
  const row=e.target.closest(".hi");if(!row)return;
  const x=loadHist()[+row.dataset.i];if(!x)return;
  $("#uname").value=x.name||"";
  $("#dob").value=fmtDob(x.dob);
  $("#shichen").value=x.hour===null||x.hour===undefined?"":String(x.hour);
  $("#gender").value=x.gender||"";
  $("#hist-list").classList.add("hidden");
  msg("已讀取："+(x.name||"未命名"),true);
});
$("#back").onclick=()=>{$("#v-result").classList.remove("on");$("#v-input").classList.add("on");window.scrollTo(0,0)};

// ========== 分頁 ==========
function showTab(t){
  document.querySelectorAll("#tabs a").forEach(a=>a.classList.toggle("current",a.dataset.tab===t));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("on",p.id===t));
  if(t==="numerology")drawConnections();
}
document.querySelectorAll("#tabs a").forEach(a=>a.onclick=()=>showTab(a.dataset.tab));

// ========== 解析按鈕與密碼鎖 ==========
// 注意：這是純網頁的簡易鎖，用來擋一般使用者；懂程式的人仍可從原始碼看到內容。
const PW_HASH="813b461f7e654a4bb1da3cbc1e405a89d33d3c0b57d8bfb67d8217d66df2097f",PW_SALT="urbanfortune|";
let unlocked=false,pending=null;
try{unlocked=sessionStorage.getItem("uf.unlock")==="1"}catch(e){}
const applyUnlock=()=>document.body.classList.toggle("unlocked",unlocked);
applyUnlock();
async function sha256(s){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
  return[...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function doToggle(b){
  const t=$("#"+b.dataset.target),open=t.classList.toggle("hidden")===false;
  b.textContent=(open?"收起":"查看")+b.dataset.label;
  b.classList.toggle("open",open);
}
function openLock(){$("#lock-pw").value="";$("#lock-err").textContent="";$("#lock").hidden=false;setTimeout(()=>$("#lock-pw").focus(),50)}
function closeLock(){$("#lock").hidden=true;pending=null}
async function tryUnlock(){
  let ok=false;
  try{ok=(await sha256(PW_SALT+$("#lock-pw").value))===PW_HASH}catch(e){$("#lock-err").textContent="此瀏覽器不支援解鎖，請改用 Safari 或 Chrome";return}
  if(!ok){$("#lock-err").textContent="密碼錯誤";return}
  unlocked=true;try{sessionStorage.setItem("uf.unlock","1")}catch(e){}
  applyUnlock();const b=pending;closeLock();if(b)doToggle(b);
}
document.addEventListener("click",e=>{
  const b=e.target.closest(".toggle");if(!b)return;
  if(b.dataset.lock&&!unlocked){pending=b;openLock();return}
  doToggle(b);
});
$("#lock-ok").onclick=tryUnlock;
$("#lock-cancel").onclick=closeLock;
$("#lock-pw").addEventListener("keydown",e=>{if(e.key==="Enter")tryUnlock()});
$("#lock").addEventListener("click",e=>{if(e.target.id==="lock")closeLock()});
function renderAll(){renderZodiac();renderNumerology();renderTarot();renderBazi();renderDivine()}

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
const isLeap=y=>(y%4===0&&y%100!==0)||y%400===0;
function liunianNum(y){                                   // 生日月日＋該年西元數字
  const [M1,M2,D1,D2]=[...S.mm,...S.dd].map(Number),[Y1,Y2,Y3,Y4]=[...String(y)].map(Number);
  return reduce9(reduce9(reduce9(M1+M2)+reduce9(D1+D2))+reduce9(reduce9(Y1+Y2)+reduce9(Y3+Y4)));
}
function birthdayIn(y){return new Date(y,S.m-1,(S.m===2&&S.d===29&&!isLeap(y))?28:S.d)}
const fmtD=d=>`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
const dayBefore=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate()-1);
function renderLiuNian(){
  // 以「今天」為基準：左邊＝目前正在走的流年，右邊＝下一個流年（以生日換年）
  const now=new Date(),Y=now.getFullYear();
  const Yc=now>=birthdayIn(Y)?Y:Y-1;
  const curStart=birthdayIn(Yc),nextStart=birthdayIn(Yc+1);
  const n0=liunianNum(Yc),n1=liunianNum(Yc+1);
  const box=(t,y,n,period)=>`<div class="ln-box"><div class="ln-t">${t}</div><div class="ln-y">${y} 年</div><div class="ln-n">${n}</div><div class="ln-p">${period}</div></div>`;
  const ana=(t,y,n)=>{const a=LIU_NIAN_ANALYSIS[n];return`<h4>${t}（${y}）流年 ${n}</h4><p><b>年度主題：</b>${a.theme}</p><p><b>建議：</b>${a.advice}</p>`};
  $("#liunian").innerHTML=`<div class="card"><h3>流年</h3>
    <div class="ln-grid">
      ${box("目前流年",Yc,n0,`${fmtD(curStart)}<br>～ ${fmtD(dayBefore(nextStart))}`)}
      ${box("下一個流年",Yc+1,n1,`${fmtD(nextStart)}<br>起開始`)}
    </div>
    <p><small>流年以每年生日為換年點，並以今天的日期為基準。</small></p>
    <button class="toggle in-card" data-lock="1" data-target="ln-detail" data-label="流年解析">查看流年解析</button>
    <div id="ln-detail" class="hidden analysis">${ana("目前流年",Yc,n0)}${ana("下一個流年",Yc+1,n1)}</div></div>`;
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
  // 事業塔羅：主命數 n 對應 n、n+9、n+18（不超過 22）
  const careerNums=[c.career,c.career+9,c.career+18].filter(n=>n<=22);
  $("#career-tarot").innerHTML=`<strong>事業塔羅</strong><div class="career-row">${careerNums.map(n=>
    `<div class="cc"><span class="number">${n}</span><span class="name">${key(n)}</span></div>`).join("")}</div>`;

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

// ========== 八字（計算在 bazi.js）==========
function renderBazi(){
  if(S.hour===null){
    $("#bazi").innerHTML=`<div class="card"><div class="need">請填寫時辰</div>
      <p style="text-align:center"><small>八字需要出生時辰，請按上方「返回修改」補填。</small></p></div>`;
    return;
  }
  $("#bazi").innerHTML=baziHtml(S,S.hour);
}
