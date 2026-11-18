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
  const lnBoxes=[...document.querySelectorAll("#liunian .ln-box")].map((b,i)=>`<div class="sh-ln"><div class="sh-ln-t">${esc(b.querySelector(".ln-t").textContent)}・${esc(b.querySelector(".ln-y").textContent)}</div><div class="sh-ln-n">${esc(b.querySelector(".ln-n").textContent)}</div><div class="sh-ln-p">${esc(b.querySelector(".ln-p").innerText.replace(/\n/g," "))}</div></div>`).join("");
  const ln=`<div class="sh-sec"><div class="sh-t">流年・流月・流日</div><div class="sh-lns">${lnBoxes}</div></div>`;

  // 塔羅
  const cards=[...document.querySelectorAll("#tarot-grid .tarot-card-display")].map(c=>`<div class="sh-tc"><div class="sh-tc-l">${esc(c.querySelector("strong").textContent.replace(/^\d+\.\s*/,""))}</div><div class="sh-tc-n">${esc(c.querySelector(".number").textContent)}</div><div class="sh-tc-m">${esc(c.querySelector(".name").textContent)}</div></div>`).join("");
  const career=[...document.querySelectorAll("#career-tarot .cc")].map(c=>`<span class="sh-cc"><b>${esc(c.querySelector(".number").textContent)}</b>${esc(c.querySelector(".name").textContent)}</span>`).join("");
  const tarot=`<div class="sh-sec"><div class="sh-t">生命塔羅</div><div class="sh-tcs">${cards}</div><div class="sh-career"><span>事業塔羅</span>${career}</div></div>`;

  return`${head}<div class="sh-cols"><div class="sh-col">${bazi}${baziExtra}${ln}</div><div class="sh-col">${ziwei}${ls}${tarot}</div></div>
    <div class="sh-foot">僅供娛樂參考，不構成任何決策建議<br>URBAN 命理</div>`;
}
// 內容比紙張還高時，逐級收緊行距（神煞直排最多可到 11 行）
function fitHeight(){
  const sh=document.getElementById("po-sheet");sh.classList.remove("tight1","tight2");
  const limit=1085;                                       // 紙高 1123 扣掉頁尾
  const bottom=()=>Math.max(...[...sh.querySelectorAll(".sh-col")].map(c=>c.offsetTop+c.offsetHeight));
  if(bottom()>limit){sh.classList.add("tight1");if(bottom()>limit)sh.classList.add("tight2")}
  return bottom();
}
function fitSheet(){
  const s=Math.min(1,(window.innerWidth-24)/794),sh=document.getElementById("po-sheet"),box=document.getElementById("po-box");
  sh.style.transform=`scale(${s})`;box.style.width=794*s+"px";box.style.height=1123*s+"px";
}
function openPrint(){
  if(!S)return;
  if(!entitled(4)){openPlans(4,"列印與存成圖片");return}
  document.getElementById("po-sheet").innerHTML=buildSheet();
  fitHeight();
  document.getElementById("po").hidden=false;document.body.classList.add("po-open");
  fitSheet();document.querySelector(".po-scroll").scrollTop=0;
}
function closePrint(){backToSheet();document.getElementById("po").hidden=true;document.body.classList.remove("po-open")}

// ---------- 存成圖片（長按可存相簿；也可下載、分享）----------
let PIC_URL="",PIC_NAME="URBAN命盤.png",PIC_FILE=null;
const $id=i=>document.getElementById(i);
function loadH2C(){
  return new Promise((res,rej)=>{
    if(window.html2canvas)return res();
    const s=document.createElement("script");s.src="html2canvas.min.js?v=1.4.1";
    s.onload=()=>res();s.onerror=()=>rej(new Error("無法載入轉圖程式"));document.head.appendChild(s);
  });
}
function safeName(){return `URBAN-chart-${S.digits}.png`}   // 用英數檔名，各種手機都能正確存檔
async function makeImage(){
  const btn=$id("po-img"),old=btn.textContent;btn.disabled=true;btn.textContent="產生中…";
  let holder=null;
  try{
    await loadH2C();
    // 複製一份 794×1123 的紙張（不帶縮放），放在畫面外轉成圖片
    holder=document.createElement("div");
    holder.style.cssText="position:fixed;left:-12000px;top:0;width:794px;height:1123px;pointer-events:none";
    const clone=$id("po-sheet").cloneNode(true);clone.removeAttribute("id");
    clone.style.transform="none";clone.style.boxShadow="none";
    holder.appendChild(clone);document.body.appendChild(holder);
    const canvas=await html2canvas(clone,{scale:2,width:794,height:1123,windowWidth:794,backgroundColor:"#fffdf7",useCORS:true,logging:false});
    PIC_URL=canvas.toDataURL("image/png");PIC_NAME=safeName();
    try{const bin=atob(PIC_URL.split(",")[1]),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);PIC_FILE=new File([u8],PIC_NAME,{type:"image/png"})}catch(e){PIC_FILE=null}
    $id("po-pic").src=PIC_URL;
    $id("po-box").hidden=true;$id("po-result").hidden=false;
    $id("po-bar-main").hidden=true;$id("po-bar-img").hidden=false;
    document.querySelector(".po-scroll").scrollTop=0;
  }catch(e){alert("產生圖片失敗："+(e&&e.message||e)+"\n可以改用「列印 / PDF」，或用手機截圖。")}
  finally{if(holder)holder.remove();btn.disabled=false;btn.textContent=old}
}
function backToSheet(){
  $id("po-result").hidden=true;$id("po-box").hidden=false;
  $id("po-bar-img").hidden=true;$id("po-bar-main").hidden=false;
}
$id("po-img").onclick=makeImage;
$id("po-back").onclick=backToSheet;
$id("po-dl").onclick=async()=>{
  // 手機：開啟系統分享選單（可「儲存影像」、存到檔案、傳給朋友）
  try{
    if(PIC_FILE&&navigator.share&&navigator.canShare&&navigator.canShare({files:[PIC_FILE]})){
      await navigator.share({files:[PIC_FILE],title:"URBAN 命盤"});return;
    }
  }catch(e){if(e&&e.name==="AbortError")return;}   // 使用者取消就結束；其他錯誤改走下載
  // 電腦或不支援分享的瀏覽器：直接下載
  const blob=await (await fetch(PIC_URL)).blob(),u=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=u;a.download=PIC_NAME;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),4000);
};

document.getElementById("print-btn").onclick=openPrint;
document.getElementById("po-close").onclick=closePrint;
document.getElementById("po-print").onclick=()=>window.print();
window.addEventListener("resize",()=>{if(!document.getElementById("po").hidden)fitSheet()});
