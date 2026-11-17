// ========== 列印：A4 命盤總覽（不含解析）==========
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function gridSvg(){                                    // 九宮格命盤（獨立繪製，不依賴畫面上的位置）
  const C=n=>({x:Math.floor((n-1)/3)*50+25,y:((n-1)%3)*50+25});
  let g=`<svg viewBox="0 0 150 150" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="148" height="148" fill="#fffdf7" stroke="#b08a2e" stroke-width="2"/>`;
  for(let i=1;i<3;i++)g+=`<line x1="${i*50}" y1="1" x2="${i*50}" y2="149" stroke="#d9cfae"/><line x1="1" y1="${i*50}" x2="149" y2="${i*50}" stroke="#d9cfae"/>`;
  for(let n=1;n<=9;n++){const c=C(n);g+=`<text x="${c.x}" y="${c.y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#8c86ab">${n}</text>`}
  CONNECTIONS.forEach(p=>{if(p.every(n=>LS.marked.has(n))){const a=C(p[0]),b=C(p[p.length-1]);g+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#b08a2e" stroke-width="2.4" stroke-linecap="round"/>`}});
  new Set([...LS.raw].map(Number)).forEach(n=>{if(n>=1&&n<=9){const c=C(n);g+=`<circle cx="${c.x}" cy="${c.y}" r="15" fill="none" stroke="#e08a00" stroke-width="2.2"/>`}});
  new Set([...LS.allSumDigits].map(Number)).forEach(n=>{if(n>=1&&n<=9){const c=C(n);g+=`<polygon points="${c.x},${c.y-18} ${c.x-17},${c.y+13} ${c.x+17},${c.y+13}" fill="none" stroke="#d02828" stroke-width="2.2"/>`}});
  {const c=C(LS.finalLp);g+=`<rect x="${c.x-15}" y="${c.y-15}" width="30" height="30" fill="none" stroke="#1f8a2f" stroke-width="2.4"/>`}
  return g+"</svg>";
}
function buildSheet(){
  const hasTime=S.hour!==null;
  const nm=S.name?esc(S.name):"—";
  const now=new Date(),pd=`${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getDate()).padStart(2,"0")}`;
  const kv=(k,v)=>`<div class="sh-kv"><span>${k}</span><b>${v}</b></div>`;
  const head=`<div class="sh-head">
    <div class="sh-brand"><div class="sh-logo">URBAN 命理</div><div class="sh-sub">✦ 命 盤 總 覽 ✦</div></div>
    <div class="sh-info">${kv("姓名",nm)}${kv("性別",S.gender||"—")}${kv("西曆",`${S.y}年${S.mm}月${S.dd}日`)}${kv("農曆",S.lunar.text+(S.lunar.shengxiao?`　屬${S.lunar.shengxiao}`:""))}${kv("時辰",hasTime?SHICHEN[S.hour]:"未填")}${kv("列印",pd)}</div></div>`;

  // 八字
  let bazi="",baziExtra="";
  const mp=document.querySelector("#bazi .mp");
  if(hasTime&&mp){
    const cards=[...document.querySelectorAll("#bazi > .card")];
    // 基本資料：西曆、農曆、日主、五行已在表頭或下方出現，這裡省略避免重複
    const info=cards[1]?[...cards[1].querySelectorAll("p")].map(p=>p.textContent.trim()).filter(t=>!/^(西曆|農曆|日主|五行)/.test(t))
      .map(t=>`<div${/^節氣/.test(t)?' class="wide"':""}>${esc(t)}</div>`).join(""):"";
    const st=cards[2]?[...cards[2].querySelectorAll(".strength")].map(s=>{
      const l=s.querySelector(".st-l").textContent.trim(),v=s.textContent.replace(s.querySelector(".st-l").textContent,"").replace(/\s+/g," ").trim();
      return`<div class="sh-st"><span>${esc(l)}</span>${esc(v)}</div>`}).join(""):"";
    const mp2=cards[2]?document.querySelector("#bazi .mp2")?.outerHTML||"":"";
    bazi=`<div class="sh-sec"><div class="sh-t">八字命盤</div>${mp.outerHTML}</div>`;
    baziExtra=`<div class="sh-sec"><div class="sh-t">基本資料</div><div class="sh-lines">${info}</div></div>
      <div class="sh-sec"><div class="sh-t">五行與十神</div>${st}${mp2}</div>`;
  }else bazi=`<div class="sh-sec"><div class="sh-t">八字命盤</div><div class="sh-none">未填時辰，無法排盤</div></div>`;

  // 紫微
  const zw=document.querySelector("#ziwei .zw");
  const ziwei=`<div class="sh-sec"><div class="sh-t">紫微斗數</div>${hasTime&&zw?zw.outerHTML:'<div class="sh-none">未填時辰，無法排盤</div>'}</div>`;

  // 生命靈數
  const ls=`<div class="sh-sec"><div class="sh-t">生命靈數</div><div class="sh-ls">
    <div class="sh-grid">${gridSvg()}</div>
    <div class="sh-lsn">${kv("先天數",esc(LS.raw))}${kv("後天總和",LS.sum)}${kv("主命數",`<em>${LS.lifePath}</em>`)}
    <div class="sh-leg"><i class="o"></i>先天　<i class="t"></i>後天　<i class="s"></i>主命</div></div></div></div>`;

  // 流年
  const lnBoxes=[...document.querySelectorAll("#liunian .ln-box")].map(b=>`<div class="sh-ln"><div class="sh-ln-t">${esc(b.querySelector(".ln-t").textContent)}・${esc(b.querySelector(".ln-y").textContent)}</div><div class="sh-ln-n">${esc(b.querySelector(".ln-n").textContent)}</div><div class="sh-ln-p">${esc(b.querySelector(".ln-p").innerText.replace(/\n/g," "))}</div></div>`).join("");
  const ln=`<div class="sh-sec"><div class="sh-t">流年</div><div class="sh-lns">${lnBoxes}</div></div>`;

  // 塔羅
  const cards=[...document.querySelectorAll("#tarot-grid .tarot-card-display")].map(c=>`<div class="sh-tc"><div class="sh-tc-l">${esc(c.querySelector("strong").textContent.replace(/^\d+\.\s*/,""))}</div><div class="sh-tc-n">${esc(c.querySelector(".number").textContent)}</div><div class="sh-tc-m">${esc(c.querySelector(".name").textContent)}</div></div>`).join("");
  const career=[...document.querySelectorAll("#career-tarot .cc")].map(c=>`<span class="sh-cc"><b>${esc(c.querySelector(".number").textContent)}</b>${esc(c.querySelector(".name").textContent)}</span>`).join("");
  const tarot=`<div class="sh-sec"><div class="sh-t">生命塔羅</div><div class="sh-tcs">${cards}</div><div class="sh-career"><span>事業塔羅</span>${career}</div></div>`;

  return`${head}<div class="sh-cols"><div class="sh-col">${bazi}${baziExtra}${ln}</div><div class="sh-col">${ziwei}${ls}${tarot}</div></div>
    <div class="sh-foot">僅供娛樂參考，不構成任何決策建議　・　URBAN 命理</div>`;
}
function fitSheet(){
  const s=Math.min(1,(window.innerWidth-24)/794),sh=document.getElementById("po-sheet"),box=document.getElementById("po-box");
  sh.style.transform=`scale(${s})`;box.style.width=794*s+"px";box.style.height=1123*s+"px";
}
function openPrint(){
  if(!S)return;
  document.getElementById("po-sheet").innerHTML=buildSheet();
  document.getElementById("po").hidden=false;document.body.classList.add("po-open");
  fitSheet();document.querySelector(".po-scroll").scrollTop=0;
}
function closePrint(){document.getElementById("po").hidden=true;document.body.classList.remove("po-open")}
document.getElementById("print-btn").onclick=openPrint;
document.getElementById("po-close").onclick=closePrint;
document.getElementById("po-print").onclick=()=>window.print();
window.addEventListener("resize",()=>{if(!document.getElementById("po").hidden)fitSheet()});
