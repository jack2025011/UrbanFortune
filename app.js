const $=s=>document.querySelector(s);
document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#tabs button,.panel").forEach(e=>e.classList.remove("on"));
  b.classList.add("on");$("#"+b.dataset.tab).classList.add("on");
});
const parse=v=>{if(!v)return null;const[y,m,d]=v.split("-").map(Number);return{y,m,d}};
function seeded(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
  return()=>{h=Math.imul(h^h>>>15,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return(h>>>0)/4294967296}}
function signOf(m,d){let r=SIGNS[0];for(const s of SIGNS){if(m>s[1]||(m===s[1]&&d>=s[2]))r=s}return r}

// 星座
$("#z-go").onclick=()=>{
  const b=parse($("#z-date").value);if(!b)return alert("請先選擇出生日期");
  const s=signOf(b.m,b.d),t=new Date().toISOString().slice(0,10),r=seeded(s[0]+t);
  const bar=(n,v)=>`<div class="bar"><b>${n}</b><i><u style="width:${v*20}%"></u></i></div>`;
  const sc=()=>1+Math.floor(r()*5);
  $("#z-out").innerHTML=`<h2>${s[0]}</h2><p>${s[3]}</p>${bar("整體",sc())}${bar("愛情",sc())}${bar("事業",sc())}${bar("財運",sc())}
  <p>${TIPS[Math.floor(r()*TIPS.length)]}</p><p>幸運色：${COLORS[Math.floor(r()*COLORS.length)]}　幸運數字：${1+Math.floor(r()*9)}</p>`;
};

// 塔羅
$("#t-go").onclick=()=>{
  const deck=[...TAROT.keys()];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
  $("#t-out").innerHTML=["過去","現在","未來"].map((p,i)=>{
    const c=TAROT[deck[i]],rev=Math.random()<.3;
    return`<div class="tc ${rev?"rev":""}"><div class="pos">${p}</div><div class="nm">${c[0]}</div><div>${rev?"逆位":"正位"}</div><p>${rev?c[2]:c[1]}</p></div>`}).join("");
};

// 生命靈數
const digits=n=>[...String(n)].reduce((a,c)=>a+ +c,0);
$("#n-go").onclick=()=>{
  const b=parse($("#n-date").value);if(!b)return alert("請先選擇出生日期");
  let n=digits(`${b.y}${b.m}${b.d}`);const path=[n];
  while(n>9&&![11,22,33].includes(n)){n=digits(n);path.push(n)}
  $("#n-out").innerHTML=`<h2>生命靈數 ${n}</h2><p>${LIFE[n]}</p><p>計算過程：${path.join(" → ")}</p>`;
};

// 八字（節氣用固定日期近似，邊界日可能差一天）
const JIE=[6,4,6,5,6,6,7,8,8,8,7,7]; // 每月「節」的日期：小寒、立春、驚蟄…大雪
function bazi(y,m,d,h){
  const ey=(m>2||(m===2&&d>=4))?y:y-1;
  const yg=((ey-4)%10+10)%10,yz=((ey-4)%12+12)%12;
  // 月支：過了本月的節，月支=寅(2)+(m-2)；未過則退一個月
  let mz=(m+0)%12; // 1月(小寒後)=丑(1), 2月(立春後)=寅(2) ...
  if(d<JIE[m-1])mz=(mz+11)%12;
  const mg=((yg%5)*2+2+((mz-2+12)%12))%10;
  const days=Math.round((Date.UTC(y,m-1,d)-Date.UTC(1900,0,1))/864e5);
  const dgan=((days%10)+10)%10,dzhi=(((days+10)%12)+12)%12; // 1900-01-01 為甲戌
  const hz=Math.floor((h+1)/2)%12,hg=((dgan%5)*2+hz)%10;
  return[[yg,yz],[mg,mz],[dgan,dzhi],[hg,hz]];
}
$("#b-go").onclick=()=>{
  const b=parse($("#b-date").value);if(!b)return alert("請先選擇出生日期");
  const h=+($("#b-time").value||"12:00").split(":")[0];
  const P=bazi(b.y,b.m,b.d,h),names=["年柱","月柱","日柱","時柱"],cnt={木:0,火:0,土:0,金:0,水:0};
  P.forEach(([g,z])=>{cnt[GAN_WX[g]]++;cnt[ZHI_WX[z]]++});
  const lack=Object.keys(cnt).filter(k=>!cnt[k]);
  $("#b-out").innerHTML=`<div class="pillars">${P.map(([g,z],i)=>`<div><small>${names[i]}</small><strong>${GAN[g]}<br>${ZHI[z]}</strong></div>`).join("")}</div>
  <p>日主：${GAN[P[2][0]]}（${GAN_WX[P[2][0]]}）</p><p>五行：${Object.entries(cnt).map(([k,v])=>k+v).join("　")}</p>
  <p>${lack.length?"五行缺："+lack.join("、"):"五行俱全"}</p><p class="hint">節氣為近似日期，跨節氣當天請以萬年曆為準。</p>`;
};
