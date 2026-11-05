
const phases=[
 {date:'11.04—11.05',title:'启动沟通',promos:'确认 KAIROS / IRIS 各自核心主张，核对本土化与真实细节的判断标准，明确本轮修订重点。',demos:'核对三方向的 PPT 节点、演示结构、操作路径与素材接口，落实执行分工及每次看片的时段。'},
 {date:'11.06—11.13',title:'制作与看片',promos:'推进分镜、人物与场景一致性、关键画面和产品证据；11.06、11.10、11.13 逐轮看成果。',demos:'持续完善脚本，逐项接入真实界面、录屏与结果；对话、模版、模型选择分别完成清晰的解释路径。'},
 {date:'11.15',title:'初版审阅',promos:'两支宣传片交初版，重点审阅核心理念、故事理解、本土生活质感与产品证据是否连贯。',demos:'三方向交初版成果；逐项检查讲解、PPT、操作、结果是否对应，并形成明确的修订清单。'},
 {date:'11.17—11.20',title:'修改与交付检查',promos:'按初版反馈修改，核对日语、字幕、画面连续性、口径与会场播放效果。11.20 最后一次看片。',demos:'对齐真实流程、输出比较和选择理由，修正录屏与剪辑节奏；检查播放、字幕和讲解衔接。'},
 {date:'11.22',title:'最终交付',promos:'完成两支宣传片终版及审定的播放文件；按会场要求核对比例、字幕、音量与文件版本。',demos:'完成三支演示方向的最终交付，核对与大会 PPT / 讲解的顺序和素材对应。'}
];
const panel=document.querySelector('#stage-panel');
const tabs=[...document.querySelectorAll('[data-stage]')];
function selectStage(i,focus=false){const p=phases[i];tabs.forEach((t,n)=>{t.setAttribute('aria-selected',String(i===n));t.tabIndex=i===n?0:-1});panel.setAttribute('aria-labelledby',`tab-${i}`);panel.innerHTML=`<div><div class="eyebrow">${p.date}</div><h3>${p.title}</h3></div><div><b>两支宣传片</b><p>${p.promos}</p></div><div><b>三支演示片</b><p>${p.demos}</p></div>`;if(focus)tabs[i].focus()}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>selectStage(i));t.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectStage(n,true)}})});selectStage(0);
let filter='全部';const search=document.querySelector('#resource-search');const rows=[...document.querySelectorAll('.library-item')];
function applyFilter(){const q=search.value.trim().toLowerCase();let n=0;rows.forEach(r=>{const c=r.dataset.category;const match=filter==='全部'||(filter==='依据'?c.includes('依据'):filter==='对照'?['前序对照','原版提案','制作准备'].includes(c):c===filter);r.hidden=!(match&&r.dataset.search.toLowerCase().includes(q));if(!r.hidden)n++});document.querySelector('#empty').hidden=n>0;document.querySelector('#resource-count').textContent=n;}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyFilter()}));search.addEventListener('input',applyFilter);
if('IntersectionObserver'in window){const nav=[...document.querySelectorAll('nav a')];const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){nav.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}},{rootMargin:'-15% 0px -70% 0px'});nav.forEach(a=>observer.observe(document.querySelector(a.getAttribute('href'))));}
