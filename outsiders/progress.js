/* Outsiders · course progress: stage order, best test results, and locking of stages until the previous one is passed */
(function(){
'use strict';
const PASS=70;
const root=new URL('..',document.currentScript.src).href;
const steps=[
 {id:'intro',label:'Introduction',title:'Hello!',lessons:'intro/index.html',page:'intro-study'},
 {id:'unit1',label:'Unit 1',title:'Who are you?',lessons:'unit1/learn.html',page:'unit1-study',test:'unit1/index.html'},
 {id:'unit2',label:'Unit 2',title:'Family & everyday life',lessons:'unit2/index.html',page:'unit2-study',test:'unit2/test.html'},
 {id:'unit3',label:'Unit 3',title:'On the move in London',lessons:'unit3/index.html',page:'unit3-study',test:'unit3/test.html'},
 {id:'unit4',label:'Unit 4',title:'A strange delivery',lessons:'unit4/index.html',page:'unit4-study',test:'unit4/test.html'},
 {id:'unit5',label:'Unit 5',title:'Free time',lessons:'unit5/index.html',page:'unit5-study',test:'unit5/test.html'},
 {id:'unit6',label:'Unit 6',title:'Let’s go shopping',lessons:'unit6/index.html',page:'unit6-study',test:'unit6/test.html'},
 {id:'unit7',label:'Unit 7',title:'Yesterday',lessons:'unit7/index.html',page:'unit7-study',test:'unit7/test.html'},
 {id:'unit8',label:'Unit 8',title:'Plans and promises',lessons:'unit8/index.html',page:'unit8-study',test:'unit8/test.html'},
 {id:'unit9',label:'Unit 9',title:'Bigger, better, the best',lessons:'unit9/index.html',page:'unit9-study',test:'unit9/test.html'},
 {id:'unit10',label:'Unit 10',title:'The most precious thing',lessons:'unit10/index.html',page:'unit10-study',test:'unit10/test.html'},
 {id:'reading',label:'Final readings',title:'Read about England',lessons:'reading/index.html',page:'reading-study'}
];
const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const best=s=>get('outsiders:'+s.id+':best');
const lessons=s=>get('outsiders:summary:'+s.page)||{done:0,total:0};
const lessonPct=s=>{const l=lessons(s);return l.total?Math.round(100*l.done/l.total):0;};
const passed=s=>s.test?((best(s)||{}).percent||0)>=PASS:lessonPct(s)>=PASS;
const index=id=>steps.findIndex(s=>s.id===id);
const unlocked=i=>i<=0||steps.slice(0,i).every(passed);
function record(id,percent,correct,total){const s=steps[index(id)];if(!s)return;const b=best(s);if(!b||percent>=b.percent)set('outsiders:'+id+':best',{percent,correct,total,date:new Date().toISOString()});}
function stepFor(pageId){const m=/^(unit\d+)-/.exec(pageId||'');if(m)return m[1];if(/^intro/.test(pageId))return 'intro';if(/^reading/.test(pageId))return 'reading';return null;}
function reset(){try{Object.keys(localStorage).filter(k=>k.startsWith('outsiders:')).forEach(k=>localStorage.removeItem(k));}catch(e){}}
const st=document.createElement('style');st.textContent=".lockScreen{position:fixed;inset:0;z-index:1000;background:rgba(20,45,54,.82);display:grid;place-items:center;padding:16px;font-family:'Nunito Sans','Nunito',Arial,sans-serif}.lockCard{background:#fff;color:#182630;max-width:480px;width:100%;border-radius:24px;padding:30px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}.lockCard h2{font:normal 30px/1.15 'DM Serif Display',Georgia,serif;margin:12px 0}.lockCard p{color:#44565d;line-height:1.6}.lockIcon{font-size:54px}.lockCard .badge{display:inline-block;border-radius:999px;background:#dbedeb;color:#0a5f61;padding:4px 12px;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.lockCard .cta{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:20px}.lockCard .btn{border:0;border-radius:13px;background:#087f7c;color:#fff;padding:12px 18px;font-weight:900;text-decoration:none;display:inline-flex;align-items:center}.lockCard .btn.secondary{background:#fff;color:#075f60;border:2px solid #b5d1ce}";document.head.appendChild(st);
window.OUTSIDERS={PASS,root,steps,best,lessons,lessonPct,passed,unlocked,index,record,stepFor,reset};

/* Lock this page if an earlier stage has not been passed yet */
const here=stepFor(document.body.dataset.page),i=index(here);
if(i>0&&!unlocked(i)){
 const need=steps.slice(0,i).find(s=>!passed(s));
 const why=need.test?'Pass the '+need.label+' test with at least '+PASS+'% to unlock '+steps[i].label+'.':'Complete at least '+PASS+'% of the '+need.label+' activities to unlock '+steps[i].label+'.';
 const box=document.createElement('div');box.className='lockScreen';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
 box.innerHTML='<div class="lockCard"><div class="lockIcon" aria-hidden="true">🔒</div><span class="badge">'+steps[i].label+' is locked</span><h2>Finish the previous stage first</h2><p>'+why+'</p><div class="cta"><a class="btn" href="'+root+(need.test&&lessonPct(need)>=PASS?need.test:need.lessons)+'">Go to '+need.label+' →</a><a class="btn secondary" href="'+root+'index.html">Back to my progress</a></div></div>';
 const show=()=>{document.body.appendChild(box);document.body.style.overflow='hidden';box.querySelector('.btn').focus();};
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',show):show();
}
})();
