(function(root){
function norm(s){return String(s).replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
 .replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/،/g,' ').replace(/٫/g,'.').toLowerCase();}
const N={};
function def(v,words){words.split(' ').forEach(w=>N[norm(w)]=v);}
def(0,'صفر');def(1,'واحد واحده');def(2,'اتنين اثنين اتنان');def(3,'تلاته ثلاثه تلات ثلاث');def(4,'اربعه اربع');def(5,'خمسه خمس');
def(6,'سته ست');def(7,'سبعه سبع');def(8,'تمانيه ثمانيه تمن ثمان تماني');def(9,'تسعه تسع');def(10,'عشره عشر');
def(11,'احداشر احدعشر');def(12,'اتناشر اثناعشر');def(13,'تلتاشر ثلاثعشر');def(14,'اربعتاشر');def(15,'خمستاشر');def(16,'ستاشر');
def(17,'سبعتاشر');def(18,'تمنتاشر');def(19,'تسعتاشر');def(20,'عشرين');def(30,'تلاتين ثلاثين');def(40,'اربعين');def(50,'خمسين');
def(60,'ستين');def(70,'سبعين');def(80,'تمانين ثمانين');def(90,'تسعين');def(100,'ميه مايه مائه');def(200,'ميتين مئتين مائتين');
def(300,'تلتميه ثلاثمائه');def(400,'ربعميه اربعمائه');def(500,'خمسميه خمسمائه');def(600,'ستميه ستمائه');def(700,'سبعميه سبعمائه');
def(800,'تمنميه ثمانمائه');def(900,'تسعميه تسعمائه');
const THOUS=new Set(['الف','الاف','آلاف','تلاف'].map(norm));const TWO_THOUS=new Set(['الفين'].map(norm));
const HUND=new Set(['ميه','مايه','مائه'].map(norm));
const FRAC={'نص':0.5,'نصف':0.5,'ربع':0.25};
function wordsToNumber(tokens){// returns {value,start,end} for first run of number words
 let i=0;const n=tokens.length;
 const val=t=>{if(t in N)return N[t];if(/^[وبل]/.test(t)&&t.slice(1) in N)return N[t.slice(1)];return undefined;};
 const isTh=t=>THOUS.has(t)||(t[0]==='و'&&THOUS.has(t.slice(1)));
 for(;i<n;i++){const t=tokens[i];if(val(t)!==undefined||TWO_THOUS.has(t)||THOUS.has(t))break;}
 if(i>=n)return null;const start=i;let total=0,cur=0,any=false,j=i;
 for(;j<n;j++){const t=tokens[j];
  if(TWO_THOUS.has(t)){total+=2000;any=true;continue;}
  if(isTh(t)){total+=(cur||1)*1000;cur=0;any=true;continue;}
  const v=val(t);
  if(v!==undefined){if(HUND.has(t.replace(/^و/,''))&&cur>0&&cur<10)cur*=100;else cur+=v;any=true;continue;}
  const f=FRAC[t.replace(/^و/,'')];
  if(f!==undefined&&any){cur+=f;j++;break;}
  break;}
 if(!any)return null;return {value:total+cur,start,end:j};}
const CUR=['جنيه','جنيها','جنيهات','جنيهي','ريال','ريالات','درهم','دراهم','دولار','دولارات','يورو','دينار','قرش','egp','sar','aed','usd','eur','kwd','lE'].map(norm);
const INCOME=['استلمت','قبضت','جالي','جاني','كسبت','مرتب','راتب','حصلت','دخل','اتحول','حولولي','اجره'].map(norm);
const FILLER=['صرفت','دفعت','جبت','اشتريت','اشتري','خدت','عملت','على','علي','ب','في','من','لل','ال','حوالي','تقريبا','وانا','انا','النهارده','امبارح','ده','دي'].map(norm);
const CATS=[
['طعام','عيش خبز اكل اكلت فطار غدا عشا مطعم وجبه بيتزا ساندوتش سندوتش ساندويتش قهوه شاي عصير خضار فاكهه لحمه لحمة فراخ سوبرماركت بقاله بقالة جبنه لبن بيض'],
['مواصلات','بنزين مواصلات اوبر اوبير تاكسي ميكروباص مترو اجره تذكره سواق سولار موقف ركنه'],
['فواتير','كهرباء كهربا مياه ميه غاز نت انترنت فاتوره رصيد شحن تليفون موبايل اشتراك'],
['صحة','دوا دواء دكتور كشف صيدليه علاج تحليل اشعه'],
['تعليم','مدرسه كورس كتاب كتب دروس جامعه مصاريف دراسه كراسه'],
['ترفيه','سينما لعبه خروج رحله نادي كافيه فسحه العاب'],
['ملابس','هدوم لبس جزمه حذاء قميص بنطلون فستان'],
['بيت','ايجار اثاث صيانه سباك كهربائي تنضيف منظفات']];
const CATMAP={};CATS.forEach(([c,ws])=>ws.split(' ').forEach(w=>CATMAP[norm(w)]=c));
const INC_CATS={};
function tailFrac(tokens,i,used){let k=i;if(tokens[k]&&CUR.includes(tokens[k]))k++;const t=tokens[k];
 if(t){const f=FRAC[t.replace(/^و/,'')];if(f!==undefined&&(t[0]==='و'||k===i)&&!used.has(k)){used.add(k);return f;}}return 0;}
function parse(text,custom){
 const t=norm(text).replace(/[^\u0600-\u06FFa-z0-9.\s]/g,' ');
 const tokens=t.split(/\s+/).filter(Boolean);
 let amount=null,used=new Set();
 for(let i=0;i<tokens.length;i++){if(/^\d+(\.\d+)?$/.test(tokens[i])){amount=parseFloat(tokens[i]);used.add(i);
   amount+=tailFrac(tokens,i+1,used);
   break;}}
 if(amount===null){const r=wordsToNumber(tokens);if(!r)return null;amount=r.value;for(let k=r.start;k<r.end;k++)used.add(k);amount+=tailFrac(tokens,r.end,used);}
 if(!(amount>0))return null;
 const rest=tokens.filter((x,i)=>!used.has(i));
 const type=rest.some(x=>INCOME.includes(x))?'income':'expense';
 let category=type==='income'?'دخل':'أخرى';
 let hit=false;
 if(type==='expense'&&Array.isArray(custom)){const cm={};custom.forEach(c=>{if(!c||!c.name)return;[c.name].concat(String(c.words||'').split(/[,،\s]+/)).forEach(w=>{const k=norm(w).trim();if(k)cm[k]=c.name;});});
  for(const x of rest){const k=x.replace(/^(ال|ل|ب)/,'');if(cm[x]||cm[k]){category=cm[x]||cm[k];hit=true;break;}}}
 if(!hit)for(const x of rest){const k=x.replace(/^(ال|ل|ب)/,'');if(CATMAP[x]||CATMAP[k]){if(type==='expense'){category=CATMAP[x]||CATMAP[k];break;}}}
 const desc=rest.filter(x=>!CUR.includes(x)&&!FILLER.includes(x)).join(' ');
 return {type,amount,description:desc,category};}
function monthKey(ts){const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
// totals are kept separate per currency, never added across currencies
function summarize(entries,month){const out={};
 entries.filter(e=>monthKey(e.ts)===month).forEach(e=>{const c=e.currency||'EGP';const o=out[c]||(out[c]={income:0,expense:0,balance:0,byCat:{}});
  if(e.type==='income')o.income+=e.amount;else{o.expense+=e.amount;o.byCat[e.category]=(o.byCat[e.category]||0)+e.amount;}
  o.balance=o.income-o.expense;});
 return out;}
function toCSV(entries){const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
 return '\ufeffdate,type,amount,currency,category,description\n'+entries.map(e=>[new Date(e.ts).toISOString().slice(0,10),e.type,e.amount,e.currency||'',q(e.category),q(e.description)].join(',')).join('\n');}
const CURRENCIES=[['EGP','جنيه مصري'],['SAR','ريال سعودي'],['AED','درهم إماراتي'],['KWD','دينار كويتي'],['QAR','ريال قطري'],['USD','دولار'],['EUR','يورو']];
const BUILTIN=CATS.map(c=>c[0]).concat(['أخرى']);
const api={BUILTIN,norm,parse,wordsToNumber,summarize,toCSV,monthKey,CURRENCIES};
if(typeof module!=='undefined')module.exports=api;else root.EXP=api;
})(typeof window!=='undefined'?window:globalThis);
