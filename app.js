const $=id=>document.getElementById(id);
const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}};
let entries=load('exp-entries',[]);let cfg=load('exp-cfg',{currency:'EGP'});let parsed=null;
const cname=c=>(EXP.CURRENCIES.find(x=>x[0]===c)||[c,c])[1];
const save=()=>{localStorage.setItem('exp-entries',JSON.stringify(entries));localStorage.setItem('exp-cfg',JSON.stringify(cfg));};
const fmt=n=>(Math.round(n*100)/100).toLocaleString('ar-EG');
EXP.CURRENCIES.forEach(([c,n])=>{const o=document.createElement('option');o.value=c;o.textContent=n+' ('+c+')';$('cur').appendChild(o);});
$('cur').value=cfg.currency;$('cur').onchange=()=>{cfg.currency=$('cur').value;save();render();};
$('gear').onclick=()=>{const s=$('settings');s.style.display=s.style.display==='none'?'block':'none';};
function preview(){parsed=EXP.parse($('txt').value);$('prev').textContent=parsed?((parsed.type==='income'?'دخل: ':'مصروف: ')+fmt(parsed.amount)+' '+cname(cfg.currency)+' | '+parsed.category+(parsed.description?' | '+parsed.description:'')):($('txt').value?'مش لاقي مبلغ، قول المبلغ بالأرقام أو بالكلام':'');}
$('txt').oninput=preview;
$('save').onclick=()=>{preview();if(!parsed){alert('مفيش مبلغ واضح');return;}
 entries.push({id:Date.now(),ts:Date.now(),type:parsed.type,amount:parsed.amount,currency:cfg.currency,category:parsed.category,description:parsed.description||$('txt').value});
 $('txt').value='';$('prev').textContent='';save();render();};
function monthsList(){const s=new Set(entries.map(e=>EXP.monthKey(e.ts)));s.add(EXP.monthKey(Date.now()));return [...s].sort().reverse();}
function render(){const cur=$('month').value;const ms=monthsList();$('month').innerHTML=ms.map(m=>'<option>'+m+'</option>').join('');$('month').value=ms.includes(cur)?cur:ms[0];
 const m=$('month').value;const s=EXP.summarize(entries,m);const C=cname(cfg.currency);
 $('sum').innerHTML='<div class="row"><div>دخل<div class="big inc">'+fmt(s.income)+'</div></div><div>مصروف<div class="big exp">'+fmt(s.expense)+'</div></div><div>الباقي<div class="big">'+fmt(s.balance)+'</div></div></div><div class="muted">'+C+'</div>'+
  Object.entries(s.byCat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>'<div class="e"><span></span><b></b></div>').join('');
 const rows=$('sum').querySelectorAll('.e');Object.entries(s.byCat).sort((a,b)=>b[1]-a[1]).forEach(([k,v],i)=>{rows[i].children[0].textContent=k;rows[i].children[1].textContent=fmt(v);});
 const L=$('list');L.innerHTML='';entries.filter(e=>EXP.monthKey(e.ts)===m).sort((a,b)=>b.ts-a.ts).forEach(e=>{const d=document.createElement('div');d.className='e';
  const l=document.createElement('span');l.textContent=new Date(e.ts).toLocaleDateString('ar-EG')+' - '+e.category+(e.description?' - '+e.description:'');
  const a=document.createElement('b');a.className=e.type==='income'?'inc':'exp';a.textContent=(e.type==='income'?'+':'-')+fmt(e.amount)+' '+(e.currency||'');
  const x=document.createElement('button');x.className='danger';x.textContent='✕';x.onclick=()=>{entries=entries.filter(z=>z.id!==e.id);save();render();};
  d.append(l,a,x);L.appendChild(d);});}
$('month').onchange=render;
$('csv').onclick=()=>{const b=new Blob([EXP.toCSV(entries)],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='expenses.csv';a.click();};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){$('mic').disabled=true;$('mic').title='المتصفح مش بيدعم الصوت';}else{let rec=null;
 $('mic').onclick=()=>{if(rec){rec.stop();return;}rec=new SR();rec.lang='ar-EG';rec.interimResults=false;rec.maxAlternatives=1;$('mic').classList.add('on');
  rec.onresult=ev=>{$('txt').value=ev.results[0][0].transcript;preview();};
  rec.onerror=()=>{};rec.onend=()=>{rec=null;$('mic').classList.remove('on');};rec.start();};}
render();if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
