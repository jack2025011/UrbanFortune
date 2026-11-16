// ========== 農曆（天文推算：朔日＋冬至起算＋無中氣置閏；台灣時間 UTC+8）==========
// 依賴 bazi.js 的 jdOf、sunLon、termJd、mod
const D2R=Math.PI/180;
function deltaT(y){                                   // TT−UT（秒），分段線性近似
  const t=[[1900,-3],[1920,21],[1950,29],[1970,40],[1990,57],[2000,64],[2020,69],[2050,93],[2100,200]];
  if(y<=t[0][0])return t[0][1];
  for(let i=1;i<t.length;i++)if(y<=t[i][0])return t[i-1][1]+(t[i][1]-t[i-1][1])*(y-t[i-1][0])/(t[i][0]-t[i-1][0]);
  return t[t.length-1][1];
}
function newMoonJdUT(k){                              // Meeus 天文算法第 49 章（朔）
  const T=k/1236.85,T2=T*T,T3=T2*T,T4=T3*T;
  let jde=2451550.09766+29.530588861*k+0.00015437*T2-0.00000015*T3+0.00000000073*T4;
  const E=1-0.002516*T-0.0000074*T2;
  const M=(2.5534+29.1053567*k-0.0000014*T2-0.00000011*T3)*D2R;
  const Mp=(201.5643+385.81693528*k+0.0107582*T2+0.00001238*T3-0.000000058*T4)*D2R;
  const F=(160.7108+390.67050284*k-0.0016118*T2-0.00000227*T3+0.000000011*T4)*D2R;
  const Om=(124.7746-1.56375588*k+0.0020672*T2+0.00000215*T3)*D2R;
  const s=Math.sin;
  let c=-0.4072*s(Mp)+0.17241*E*s(M)+0.01608*s(2*Mp)+0.01039*s(2*F)+0.00739*E*s(Mp-M)-0.00514*E*s(Mp+M)
   +0.00208*E*E*s(2*M)-0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)
   +0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)-0.00024*E*s(2*Mp-M)-0.00017*s(Om)-0.00007*s(Mp+2*M)
   +0.00004*s(2*Mp-2*F)+0.00004*s(3*M)+0.00003*s(Mp+M-2*F)+0.00003*s(2*Mp+2*F)-0.00003*s(Mp+M+2*F)
   +0.00003*s(Mp-M+2*F)-0.00002*s(Mp-M-2*F)-0.00002*s(3*Mp+M)+0.00002*s(4*Mp);
  [[299.77+0.107408*k-0.009173*T2,0.000325],[251.88+0.016321*k,0.000165],[251.83+26.651886*k,0.000164],
   [349.42+36.412478*k,0.000126],[84.66+18.206239*k,0.00011],[141.74+53.303771*k,0.000062],
   [207.14+2.453732*k,0.00006],[154.84+7.30686*k,0.000056],[34.52+27.261239*k,0.000047],
   [207.19+0.121824*k,0.000042],[291.34+1.844379*k,0.00004],[161.72+24.198154*k,0.000037],
   [239.56+25.513099*k,0.000035],[331.55+3.592518*k,0.000023]].forEach(([a,w])=>{c+=w*s(a*D2R)});
  const yr=2000+(jde-2451545)/365.25;
  return jde+c-deltaT(yr)/86400;
}
const localDay=jdUT=>Math.floor(jdUT+8/24+0.5);        // 事件發生的台灣日序
const dayNo=(y,m,d)=>Math.floor(jdOf(y,m,d,12)+0.5);   // 西曆日期的日序
const nmDay=k=>localDay(newMoonJdUT(k));
const solsticeDay=y=>localDay(termJd(270,jdOf(y,12,21,12)));
function kOfDay(D){                                     // 找出 nmDay(k) ≤ D < nmDay(k+1)
  let k=Math.floor((D-2451550.1)/29.530588861);
  while(nmDay(k)>D)k--;
  while(nmDay(k+1)<=D)k++;
  return k;
}
const LN_NUM="〇一二三四五六七八九";
const LN_MONTH=["正","二","三","四","五","六","七","八","九","十","十一","十二"];
const LN_DAY=["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
const SHENGXIAO=["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"];
function lunarDate(y,m,d){
  const D=dayNo(y,m,d);
  const zy=D>=solsticeDay(y)?y:y-1;                      // 取不晚於 D 的冬至所在的年
  const Zp=solsticeDay(zy),Zn=solsticeDay(zy+1);
  const kz=kOfDay(Zp),kn=kOfDay(Zn),n=kn-kz;             // 冬至月到下個冬至月：12 或 13 個月
  const starts=[];for(let i=0;i<=n;i++)starts.push(nmDay(kz+i));
  // 每個月是否含中氣（太陽黃經為 30 度整數倍）
  const zhong=[];for(let j=0;j<12;j++)zhong.push(localDay(termJd(mod(270+30*j,360),jdOf(zy,12,21,12)+30.44*j)));
  const hasZ=i=>zhong.some(z=>z>=starts[i]&&z<starts[i+1]);
  let leapIdx=-1;
  if(n===13)for(let i=1;i<n;i++)if(!hasZ(i)){leapIdx=i;break;}
  let idx=0;for(let i=0;i<n;i++)if(starts[i]<=D)idx=i;
  const isLeap=idx===leapIdx;
  const eff=leapIdx>=0&&idx>=leapIdx?idx-1:idx;
  const month=mod(10+eff,12)+1;
  const year=month>=11?zy:zy+1;
  const day=D-starts[idx]+1;
  const yearText=[...String(year)].map(c=>LN_NUM[+c]).join("");
  return{year,month,day,isLeap,yearText,
    monthText:(isLeap?"閏":"")+LN_MONTH[month-1]+"月",dayText:LN_DAY[day-1],
    text:`${yearText}年 ${isLeap?"閏":""}${LN_MONTH[month-1]}月${LN_DAY[day-1]}`,
    shengxiao:SHENGXIAO[mod(year-4,12)]};
}
