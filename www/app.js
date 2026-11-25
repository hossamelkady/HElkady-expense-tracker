const $=id=>document.getElementById(id);
const load=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null||typeof v!==typeof f||Array.isArray(v)!==Array.isArray(f)?f:v}catch(e){return f}};
let entries=load('exp-entries',[]);let cfg=load('exp-cfg',{currency:'EGP'});if(!Array.isArray(cfg.cats))cfg.cats=[];let parsed=null;
const cname=c=>(EXP.CURRENCIES.find(x=>x[0]===c)||[c,c])[1];
const save=()=>{localStorage.setItem('exp-entries',JSON.stringify(entries));localStorage.setItem('exp-cfg',JSON.stringify(cfg));};
const fmt=n=>(Math.round(n*100)/100).toLocaleString('ar-EG');
EXP.CURRENCIES.forEach(([c,n])=>{const o=document.createElement('option');o.value=c;o.textContent=n+' ('+c+')';$('cur').appendChild(o);});
$('cur').value=cfg.currency;$('cur').onchange=()=>{cfg.currency=$('cur').value;save();render();};
$('gear').onclick=()=>{const s=$('settings');s.style.display=s.style.display==='none'?'block':'none';};
function allCats(){return EXP.BUILTIN.concat(cfg.cats.map(c=>c.name).filter(n=>!EXP.BUILTIN.includes(n)));}
function drawCats(){const keep=$('catsel').value;$('catsel').innerHTML='<option value="auto">تلقائي</option>'+allCats().map(n=>'<option></option>').join('');
 [...$('catsel').options].slice(1).forEach((o,i)=>{o.value=o.textContent=allCats()[i];});$('catsel').value=[...$('catsel').options].some(o=>o.value===keep)?keep:'auto';
 const L=$('catlist');L.innerHTML='';cfg.cats.forEach((c,i)=>{const d=document.createElement('div');d.className='e';const a=document.createElement('span');a.textContent=c.name+(c.words?' ('+c.words+')':'');const x=document.createElement('button');x.type='button';x.className='danger';x.textContent='✕';x.onclick=()=>{cfg.cats.splice(i,1);save();drawCats();preview();};d.append(a,x);L.appendChild(d);});}
$('catsel').onchange=()=>preview();
$('cadd').onclick=()=>{const n=$('cname').value.trim();if(!n){alert('اكتب اسم التصنيف');return;}if(allCats().includes(n)){alert('التصنيف موجود');return;}
 cfg.cats.push({name:n,words:$('cwords').value.trim()});$('cname').value='';$('cwords').value='';save();drawCats();};
function preview(){parsed=EXP.parse($('txt').value,cfg.cats);if(parsed&&$('catsel').value!=='auto'&&parsed.type==='expense')parsed.category=$('catsel').value;$('prev').textContent=parsed?((parsed.type==='income'?'دخل: ':'مصروف: ')+fmt(parsed.amount)+' '+cname(cfg.currency)+' | '+parsed.category+(parsed.description?' | '+parsed.description:'')):($('txt').value?'مش لاقي مبلغ، قول المبلغ بالأرقام أو بالكلام':'');}
$('txt').oninput=preview;
$('save').onclick=()=>{preview();if(!parsed){alert('مفيش مبلغ واضح');return;}
 entries.push({id:Date.now(),ts:Date.now(),type:parsed.type,amount:parsed.amount,currency:cfg.currency,category:parsed.category,description:parsed.description||$('txt').value});
 $('txt').value='';$('prev').textContent='';$('catsel').value='auto';save();render();};
function monthsList(){const s=new Set(entries.map(e=>EXP.monthKey(e.ts)));s.add(EXP.monthKey(Date.now()));return [...s].sort().reverse();}
function render(){const cur=$('month').value;const ms=monthsList();$('month').innerHTML=ms.map(m=>'<option>'+m+'</option>').join('');$('month').value=ms.includes(cur)?cur:ms[0];
 const m=$('month').value;const sm=EXP.summarize(entries,m);const cs=Object.keys(sm);if(!cs.length)cs.push(cfg.currency);
 $('sum').innerHTML='';
 cs.forEach(cc=>{const s=sm[cc]||{income:0,expense:0,balance:0,byCat:{}};const box=document.createElement('div');
  box.innerHTML='<b></b><div class="row"><div>دخل<div class="big inc"></div></div><div>مصروف<div class="big exp"></div></div><div>الباقي<div class="big"></div></div></div>';
  box.querySelector('b').textContent=cname(cc)+' ('+cc+')';const bg=box.querySelectorAll('.big');bg[0].textContent=fmt(s.income);bg[1].textContent=fmt(s.expense);bg[2].textContent=fmt(s.balance);
  Object.entries(s.byCat).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>{const r=document.createElement('div');r.className='e';const a=document.createElement('span'),b=document.createElement('b');a.textContent=k;b.textContent=fmt(v);r.append(a,b);box.appendChild(r);});
  $('sum').appendChild(box);if(cs.length>1)$('sum').appendChild(document.createElement('hr'));});
 const L=$('list');L.innerHTML='';entries.filter(e=>EXP.monthKey(e.ts)===m).sort((a,b)=>b.ts-a.ts).forEach(e=>{const d=document.createElement('div');d.className='e';
  const l=document.createElement('span');l.textContent=new Date(e.ts).toLocaleDateString('ar-EG')+' - '+e.category+(e.description?' - '+e.description:'');
  const a=document.createElement('b');a.className=e.type==='income'?'inc':'exp';a.textContent=(e.type==='income'?'+':'-')+fmt(e.amount)+' '+(e.currency||'');
  const x=document.createElement('button');x.className='danger';x.textContent='✕';x.onclick=()=>{entries=entries.filter(z=>z.id!==e.id);save();render();};
  d.append(l,a,x);L.appendChild(d);});}
$('month').onchange=render;
$('csv').onclick=()=>{const b=new Blob([EXP.toCSV(entries)],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='expenses.csv';a.click();};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const native=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform();
drawCats();render();
const getSP=()=>{const C=window.Capacitor||{};return (C.Plugins&&C.Plugins.SpeechRecognition)||(typeof C.registerPlugin==='function'?C.registerPlugin('SpeechRecognition'):null);};
if(native){// Android app: use the native speech recognition plugin
 let busy=false;
 $('mic').onclick=async()=>{const SP=getSP();if(!SP){alert('إضافة الصوت مش موجودة في التطبيق');return;}if(busy){try{await SP.stop();}catch(e){}return;}
  try{const a=await SP.available();if(!a.available){alert('التعرف على الصوت غير متاح على الجهاز');return;}
   const p=await SP.requestPermissions();if(p.speechRecognition!=='granted'){alert('محتاج إذن الميكروفون');return;}
   busy=true;$('mic').classList.add('on');
   const r=await SP.start({language:'ar-EG',maxResults:1,prompt:'قول المصروف',popup:true,partialResults:false});
   if(r&&r.matches&&r.matches[0]){$('txt').value=r.matches[0];preview();}
  }catch(e){if(e&&!/cancel|no match|stop/i.test(String(e.message||e)))alert('تعذر التسجيل الصوتي: '+(e.message||e));}finally{busy=false;$('mic').classList.remove('on');}};
}else if(!SR){$('mic').disabled=true;$('mic').title='المتصفح مش بيدعم الصوت';}else{let rec=null;
 $('mic').onclick=()=>{if(rec){rec.stop();return;}rec=new SR();rec.lang='ar-EG';rec.interimResults=false;rec.maxAlternatives=1;$('mic').classList.add('on');
  rec.onresult=ev=>{$('txt').value=ev.results[0][0].transcript;preview();};
  rec.onerror=()=>{};rec.onend=()=>{rec=null;$('mic').classList.remove('on');};rec.start();};}


if('serviceWorker' in navigator&&!native)navigator.serviceWorker.register('sw.js');
