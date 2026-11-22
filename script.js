const $=id=>document.getElementById(id);
const WA="212600213299";
const SP=[{k:'سباكة',n:'السباكة',fr:'(Plomberie)',ic:'🔧',d:'تكوين في السباكة الصحية، صيانة الشبكات، تركيب الأنابيب وفق المعايير المهنية'},
{k:'كهرباء',n:'الكهرباء',fr:'(Électricité)',ic:'⚡',d:'تكوين في الكهرباء المنزلية والصناعية، السلامة والتجهيزات الكهربائية الحديثة'},
{k:'تبريد',n:'التبريد والتكييف',fr:'',ic:'❄️',d:'تكوين في تركيب وصيانة أجهزة التكييف والتبريد بأنواعها'}];
const IC=Object.fromEntries(SP.map(s=>[s.k,s.ic]));
const CITIES=['أكادير','إنزكان','أيت ملول','القليعة','تيزنيت','طاطا','تارودانت','أخرى'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){alert('الذاكرة مليانة، حاول بصورة أصغر')}}
function intl(p){let d=String(p).replace(/\D/g,'');if(d.startsWith('00'))d=d.slice(2);if(d.startsWith('0'))d='212'+d.slice(1);return d}
const okPhone=p=>/^212[567]\d{8}$/.test(intl(p));
let DL=null,lastLink='';
try{(window.claude&&claude.use?claude.use('downloads'):Promise.resolve(null)).then(d=>{DL=d}).catch(()=>{})}catch(e){}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),3500)}
window.alert=toast;
function go(u){lastLink=u;let w=null;try{w=window.open(u,'_blank')}catch(e){}if(!w){$('lmA').href=u;$('lm').classList.add('on')}}
function copyLink(){try{navigator.clipboard.writeText(lastLink).then(()=>toast('تم النسخ'),()=>toast(lastLink))}catch(e){toast(lastLink)}}
function wa(t,to){go('https://wa.me/'+(to||WA)+'?text='+encodeURIComponent(t||''))}
function doPrint(){try{window.print()}catch(e){toast('الطباعة ما خدامش هنا، استعمل التحميل')}}
function dlCard(){if(!last)return toast('سجل أولا');if(!DL)return toast('التحميل ما متاحش هنا، استعمل الطباعة');
 const c=document.createElement('canvas');c.width=900;c.height=520;const x=c.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,900,520);x.fillStyle='#0B3D91';x.fillRect(0,0,900,80);x.fillStyle='#FFD400';x.fillRect(0,470,900,50);
 x.direction='rtl';x.textAlign='right';x.fillStyle='#fff';x.font='bold 34px Tahoma,Arial';x.fillText('بطاقة عضوية رقمية',860,52);
 x.fillStyle='#0B1A3A';x.font='28px Tahoma,Arial';
 ['عضو: '+last.name,'التخصص: '+last.spec,'المدينة: '+last.city,'رقم العضوية: '+last.no,'صالح حتى: 12/2026'].forEach((l,i)=>x.fillText(l,860,150+i*58));
 x.fillStyle='#0B3D91';x.font='bold 22px Tahoma,Arial';x.textAlign='center';x.fillText('امسح للتحقق من العضوية',450,503);
 try{const t=document.createElement('div');new QRCode(t,{text:last.no+'|'+last.name,width:200,height:200});const q=t.querySelector('canvas');if(q)x.drawImage(q,40,150,200,200)}catch(e){}
 c.toBlob(b=>DL.save({filename:'carte-'+last.no+'.png',data:b}).then(()=>toast('تم الحفظ ✅')).catch(e=>{if(!e||e.code!=='declined')toast('ما تحملاتش')}),'image/png')}
let regs=load('hm_regs',[]),prods=load('hm_prods',[
 {name:'خلاط حمام',cat:'سباكة',price:450,mem:380,stock:12},{name:'كابل كهربائي',cat:'كهرباء',price:120,mem:102,stock:35},
 {name:'مكيف هواء',cat:'تبريد',price:1200,mem:1020,stock:5},{name:'مضخة مياه',cat:'سباكة',price:650,mem:553,stock:8}]);
let spec='سباكة',pcat='سباكة',pf='',pimg='',last=load('hm_last',null);

function show(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));$('page-'+id).classList.add('on');
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===id&&id!=='account'));window.scrollTo(0,0);
 if(id==='register')prev();if(id==='directory')renderDir();if(id==='account')renderProds()}
$('nav').onclick=e=>{const p=e.target.dataset&&e.target.dataset.p;if(p)show(p)};

function opts(el,list,cur,fn){el.innerHTML=list.map(s=>`<div class="opt ${s.k===cur?'on':''}" data-k="${s.k}">${s.ic||''} ${s.n}</div>`).join('');
 el.onclick=e=>{const k=e.target.dataset.k;if(k)fn(k)}}
function setSpec(k){spec=k;opts($('rSpec'),SP,spec,setSpec);prev()}
function setPcat(k){pcat=k;opts($('pCat'),SP,pcat,setPcat)}
function card(name,sp,city,no){return `<div class="mc"><div class="t"><span>بطاقة عضوية رقمية</span><span>🛡️</span></div><div class="bd"><div>عضو: ${esc(name||'[ يملأ الاسم ]')}<br>التخصص: ${esc(sp)}<br>${city?'المدينة: '+esc(city)+'<br>':''}رقم العضوية: <b>${esc(no)}</b><br>صالح حتى: 12/2026</div><div class="qr" data-qr="${esc(no+'|'+(name||''))}"></div></div><div class="ft">امسح للتحقق من العضوية</div></div>`}
function qrs(){document.querySelectorAll('[data-qr]').forEach(e=>{if(e.dataset.done)return;e.dataset.done=1;e.innerHTML='';
 try{new QRCode(e,{text:e.dataset.qr,width:80,height:80})}catch(x){e.textContent='QR'}})}
const newNo=()=>'PDS-SM-2026-'+Math.floor(1000+Math.random()*9000);
let draftNo=newNo();
function prev(){$('regPreview').innerHTML=card($('rName').value.trim(),SP.find(s=>s.k===spec).n,'',draftNo);qrs()}
function fileName(i,id){$(id).textContent=i.files[0]?'✓ '+i.files[0].name:'اضغط للتحميل'}
function submitReg(){const n=$('rName').value.trim(),ph=$('rPhone').value;
 if(!n)return alert('دخل الاسم الكامل');if(!okPhone(ph))return alert('رقم الهاتف ماشي صحيح (مثال: +212 6 00 00 00 00)');
 last={name:n,phone:'0'+intl(ph).slice(3),city:$('rCity').value,spec:SP.find(s=>s.k===spec).n,k:spec,exp:$('rExp').value,no:draftNo,status:'قيد المراجعة'};
 regs.unshift(last);save('hm_regs',regs);save('hm_last',last);draftNo=newNo();
 $('cName').textContent=last.name;$('cCity').textContent=last.city;$('cSpec').textContent=last.spec;$('cNo').textContent=last.no;
 $('confCard').innerHTML=card(last.name,last.spec,last.city,last.no);show('confirm');qrs()}
function sendReg(){if(!last)return;wa(`السلام عليكم، طلب انخراط - الاسم: ${last.name} - الهاتف: ${last.phone} - المدينة: ${last.city} - التخصص: ${last.spec} - الخبرة: ${last.exp||'—'} - رقم مؤقت: ${last.no}. سأرفق صورة البطاقة الوطنية والصورة الشخصية.`)}
function track(){alert(last?`رقم الطلب ${last.no}: ${last.status}`:'ما كاين حتى طلب')}

function renderDir(){const q=$('dq').value.trim(),f=$('dsp').value;
 const l=regs.filter(r=>(!f||r.k===f)&&(!q||(r.name+' '+r.city).includes(q)));
 $('dirList').innerHTML=l.map(r=>`<div class="card row"><div class="av">${esc(r.name[0])}</div><div class="g1"><b>${esc(r.name)}</b><br><span class="small">${esc(r.spec)} • ${esc(r.city)}</span><br><span class="bd2" style="background:#999">${esc(r.status)}</span><div class="row" style="margin-top:8px"><a class="btn b g1" href="tel:+${intl(r.phone)}">📞</a><button class="btn g g1" onclick="wa('','${intl(r.phone)}')">💬</button></div></div></div>`).join('')||'<div class="card small">ما كاين حتى حرفي مسجل بعد. كون أول واحد!</div>'}
function renderProds(){
 $('pTabs').innerHTML=`<span class="pill ${pf?'':'on'}" data-k="">الكل</span>`+SP.map(s=>`<span class="pill ${pf===s.k?'on':''}" data-k="${s.k}">${s.n}</span>`).join('');
 $('pTabs').onclick=e=>{if(e.target.dataset.k!==undefined){pf=e.target.dataset.k;renderProds()}};
 $('pList').innerHTML=prods.filter(p=>!pf||p.cat===pf).map(p=>{const pc=p.mem?Math.round((p.price-p.mem)/p.price*100):0;
 return `<div class="card row" style="margin-top:10px"><div class="pi">${p.img?`<img src="${p.img}" alt="">`:IC[p.cat]||'📦'}</div><div class="g1"><b style="font-size:18px">${esc(p.name)}</b><br>${p.mem?`<span class="old">السعر العادي: ${p.price} درهم</span><br><span class="mem">سعر العضو: ${p.mem} درهم</span> <span class="bd2">خصم ${pc}%</span>`:`<b>${p.price} درهم</b>`}<br><span class="small">المخزون: ${p.stock} قطعة • ${esc(p.cat)}</span></div></div>`}).join('')||'<div class="card small">ما كاين حتى منتج</div>'}
function calc(){const p=+$('pPrice').value||0,m=+$('pMem').value||0,on=$('pMemOn').checked;
 $('pMem').disabled=!on;$('pPrev').innerHTML=on&&p&&m?`خصم ${Math.round((p-m)/p*100)}% للأعضاء • وفّر ${p-m} درهم`:''}
function prodImg(i){const f=i.files[0];if(!f)return;$('pImgName').textContent='✓ '+f.name;const r=new FileReader();
 r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,300/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);pimg=c.toDataURL('image/jpeg',.7)};im.src=r.result};r.readAsDataURL(f)}
function addProd(){const n=$('pName').value.trim(),p=+$('pPrice').value,on=$('pMemOn').checked,m=on?+$('pMem').value:0;
 if(!n)return alert('دخل اسم المنتج');if(!(p>0))return alert('دخل السعر');if(on&&(!(m>0)||m>=p))return alert('سعر العضو خاصو يكون أقل من السعر العادي');
 prods.unshift({name:n,cat:pcat,price:p,mem:m,stock:+$('pStock').value||0,img:pimg});save('hm_prods',prods);
 ['pName','pPrice','pMem','pStock'].forEach(i=>$(i).value='');pimg='';$('pImgName').textContent='JPG, PNG • حتى 5MB';$('pForm').hidden=true;calc();renderProds()}
function plan(t){wa('السلام عليكم، بغيت نفعّل اشتراك مورد - '+t)}

$('specCards').innerHTML=SP.map(s=>`<div class="card sp"><div class="ic">${s.ic}</div><h3>${s.n} ${s.fr}</h3><p>${s.d}</p><a onclick="show('training')">التفاصيل ←</a></div>`).join('');
$('trainList').innerHTML=$('specCards').innerHTML;
$('rCity').innerHTML=CITIES.map(c=>`<option>${c}</option>`).join('');
$('dsp').innerHTML='<option value="">كل التخصصات</option>'+SP.map(s=>`<option value="${s.k}">${s.n}</option>`).join('');
setSpec('سباكة');setPcat('سباكة');calc();
