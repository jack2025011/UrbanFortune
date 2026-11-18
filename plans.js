// ========== 方案分層（前端原型）==========
// 注意：目前還沒有會員與金流，這裡只是「依方案顯示不同內容」的畫面原型。
// 管理者輸入密碼後，可直接預覽各個方案看到的內容。要真正收費，付費內容必須放在伺服器端依會員權限提供。
const PLANS=[
  {lv:0,name:"免費版",price:"免費",feat:["生命靈數命盤與九宮格","生命塔羅命盤（六張牌與事業牌）","農曆"]},
  {lv:1,name:"入門",price:"NT$68／月",feat:["八字命盤","紫微斗數命盤","流年與流年解析","流月","歷史儲存 5 筆"]},
  {lv:2,name:"進階",price:"NT$168／月",feat:["生命靈數解析","生命塔羅解析","流月解析","流日","歷史儲存不限筆數"]},
  {lv:3,name:"專業",price:"NT$268／月",feat:["八字解析（十神與神煞）","紫微斗數解析","流日解析"]},
  {lv:4,name:"大師",price:"NT$888／月",feat:["每日「今日建議」（每天都有新的一句）","人生分析圖（八字、紫微、靈數、塔羅交叉對比）","列印、下載命盤圖片","全部功能開放"]}];
let ADMIN_PREVIEW=4;
try{const v=sessionStorage.getItem("uf.preview");if(v!==null&&+v>=0&&+v<=4)ADMIN_PREVIEW=+v}catch(e){}
// 目前方案：管理者看「預覽的方案」；一般訪客目前一律是免費版（尚未有會員）
function planLevel(){return(typeof unlocked!=="undefined"&&unlocked)?ADMIN_PREVIEW:0}
const entitled=min=>planLevel()>=min;

// ---------- 霧面預覽 ----------
const FK_W=[96,90,94,72,88,60,92,84,78,95];
function fakeLines(n,seed){let s="";for(let i=0;i<n;i++)s+=`<div class="fk" style="width:${FK_W[(i+(seed||0))%FK_W.length]}%"></div>`;return s}
// 不放真正的內容：只放標題（讓人知道裡面有什麼）與模糊的假文字條
function gateTeaser(min,label,sections){
  const need=PLANS[min];
  const body=(sections&&sections.length?sections:["完整內容"]).map((t,i)=>`<h4>${t}</h4>${fakeLines(3,i*2)}`).join("");
  return`<div class="gate"><div class="gate-body" aria-hidden="true">${body}</div>
    <div class="gate-cta"><div class="gate-ic">🔒</div><b>${label}</b><span>升級「${need.name}（${need.price}）」即可看到完整內容</span>
    <button type="button" class="gate-btn" data-plans="${min}">查看方案</button></div></div>`;
}
// 有權限：直接顯示（或附收合按鈕）；沒有權限：顯示霧面預覽
function gateBlock(min,o){
  if(!entitled(min))return gateTeaser(min,o.label,o.sections);
  if(o.toggle)return`<button class="toggle in-card" data-target="${o.id}" data-label="${o.toggle}">查看${o.toggle}</button><div id="${o.id}" class="hidden">${o.html}</div>`;
  return o.html;
}
function gateChartTeaser(min,label,sections){                    // 紫微命盤用的假盤面
  const cells=Array.from({length:12},(_,i)=>`<div class="gz-c">${fakeLines(3,i)}<div class="fk" style="width:50%"></div></div>`).join("");
  return`<div class="gate gate-chart"><div class="gate-body" aria-hidden="true"><div class="gz">${cells}</div>${(sections||[]).map((t,i)=>`<h4>${t}</h4>${fakeLines(2,i)}`).join("")}</div>
    <div class="gate-cta"><div class="gate-ic">🔒</div><b>${label}</b><span>升級「${PLANS[min].name}（${PLANS[min].price}）」即可看到完整命盤</span>
    <button type="button" class="gate-btn" data-plans="${min}">查看方案</button></div></div>`;
}

// ---------- 方案說明視窗 ----------
function openPlans(min,why){
  const cur=planLevel(),admin=(typeof unlocked!=="undefined"&&unlocked);
  document.getElementById("plans-why").textContent=why?`「${why}」需要「${PLANS[min].name}」以上方案`:"選擇適合你的方案";
  document.getElementById("plans-list").innerHTML=PLANS.map(p=>`<div class="plan${p.lv===min?" want":""}${p.lv===cur?" cur":""}">
    <div class="plan-h"><b>${p.name}</b><span>${p.price}</span>${p.lv===cur?'<em>目前</em>':p.lv===min?'<em class="w">所需</em>':""}</div>
    <ul>${p.feat.map(f=>`<li>${f}</li>`).join("")}</ul></div>`).join("");
  document.getElementById("plans-note").innerHTML=admin?"管理者模式：可用畫面下方的預覽列切換各方案。":"訂閱功能尚未開放，敬請期待。";
  document.getElementById("plans").hidden=false;
}
function closePlans(){document.getElementById("plans").hidden=true}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-plans]");if(b){openPlans(+b.dataset.plans,b.dataset.why||"");return}
  if(e.target.id==="plans")closePlans();
});
document.getElementById("plans-close").onclick=closePlans;

// ---------- 管理者預覽列 ----------
function refreshView(){
  if(typeof S==="undefined"||!S)return;
  const cur=(document.querySelector("#tabs a.current")||{dataset:{}}).dataset.tab||"numerology";
  renderAll();showTab(cur);updateGateButtons();
}
function updateGateButtons(){
  const life=document.getElementById("life-btn"),pr=document.getElementById("print-btn");
  if(life)life.textContent="✦ 人生分析"+(entitled(4)?"":" 🔒");
  document.body.classList.toggle("is-vip",entitled(4));
  if(pr)pr.textContent="🖨 列印"+(entitled(4)?"":" 🔒");
}
function adminChanged(){
  const bar=document.getElementById("admin-bar"),on=(typeof unlocked!=="undefined"&&unlocked);
  bar.hidden=!on;document.body.classList.toggle("is-admin",on);
  if(on)bar.querySelectorAll("[data-pv]").forEach(b=>b.classList.toggle("on",+b.dataset.pv===ADMIN_PREVIEW));
  refreshView();updateGateButtons();
}
document.getElementById("admin-bar").addEventListener("click",e=>{
  const b=e.target.closest("[data-pv]");
  if(b){ADMIN_PREVIEW=+b.dataset.pv;try{sessionStorage.setItem("uf.preview",String(ADMIN_PREVIEW))}catch(x){}
    closePlans();if(typeof closeLife==="function")closeLife();if(typeof closePrint==="function")closePrint();adminChanged();return}
  if(e.target.id==="admin-out"){unlocked=false;try{sessionStorage.removeItem("uf.unlock")}catch(x){}
    if(typeof applyUnlock==="function")applyUnlock();adminChanged()}
});
document.getElementById("admin-link").onclick=e=>{e.preventDefault();pending=()=>{};openLock()};
