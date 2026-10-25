(function(){
'use strict';
const pageId=document.body.dataset.page||location.pathname;
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?]/g,'').replace(/\s+/g,' ');
let progress={};
try{progress=JSON.parse(localStorage.getItem('outsiders:progress:'+pageId)||'{}')||{};}catch(e){}
function saveProgress(){try{localStorage.setItem('outsiders:progress:'+pageId,JSON.stringify(progress));}catch(e){}updateProgress();}
function updateProgress(){const qs=Object.keys(window.PRACTICE||{}).flatMap(k=>(window.PRACTICE[k]||[]).map((_,i)=>k+':'+i));const n=qs.filter(k=>progress[k]).length;const label=$('#progressLabel'),bar=$('#progressBar');if(label)label.textContent=qs.length?n+'/'+qs.length+' activities completed':'Read, listen and practise';if(bar)bar.style.width=(qs.length?Math.round(100*n/qs.length):0)+'%';}
function say(text){if(!('speechSynthesis' in window)){alert('Audio reading is not supported in this browser.');return;}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.88;speechSynthesis.speak(u);}catch(e){alert('Audio playback is unavailable.');}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-say],[data-say-target]');if(!b)return;const target=b.getAttribute('data-say-target');const phrase=target?document.getElementById(target)?.innerText:b.getAttribute('data-say');if(phrase)say(phrase);});
const cfg=window.PRACTICE||{};
$$('.quiz').forEach(container=>{
 const id=container.dataset.set,arr=cfg[id]||[];
 if(!arr.length)return;
 const title=container.dataset.title||'Check your understanding';
 container.innerHTML='<div class="sectionMeta"><h3>'+esc(title)+'</h3><span class="scoreChip" id="score-'+esc(id)+'"></span></div>'+arr.map((q,i)=>{
  const key=id+':'+i;
  let body='';
  if(q.options){body='<div class="answers">'+q.options.map((opt,oi)=>'<button class="answer" type="button" data-choice="'+oi+'">'+esc(opt)+'</button>').join('')+'</div>';}
  else {body='<div class="inputRow"><input class="exerciseInput" aria-label="Your answer" autocomplete="off" placeholder="Write your answer"><button type="button" class="btn small verify">Check</button></div>';}
  return '<div class="qItem" data-question="'+i+'"><div class="qPrompt">'+(i+1)+'. '+esc(q.prompt)+'</div>'+body+'<div class="feedback" role="status" aria-live="polite"></div></div>';
 }).join('');
 const showScore=()=>{const n=arr.filter((_,i)=>progress[id+':'+i]).length;$('#score-'+id).textContent=n+'/'+arr.length+' correct';};showScore();
 $$('.qItem',container).forEach(item=>{
  const i=+item.dataset.question,q=arr[i],key=id+':'+i,feedback=$('.feedback',item);
  function mark(ok,answer){if(ok){progress[key]=true;saveProgress();showScore();feedback.className='feedback good';feedback.textContent='Correct! '+(q.why||'Well done.');}else{feedback.className='feedback bad';feedback.textContent='Not quite. '+(q.tip||'Read the text again and try another answer.');}}
  if(q.options){$$('.answer',item).forEach(b=>b.addEventListener('click',()=>{const iOpt=+b.dataset.choice,ok=iOpt===q.answer;$$('.answer',item).forEach(a=>{a.classList.toggle('correct',+a.dataset.choice===q.answer&&ok);a.classList.toggle('wrong',a===b&&!ok);});mark(ok,b.textContent);if(ok)$$('.answer',item).forEach(a=>a.disabled=true);}));}
  else{const inp=$('input',item);const check=()=>{let valid=Array.isArray(q.answer)?q.answer.map(norm).includes(norm(inp.value)):norm(inp.value)===norm(q.answer);inp.style.borderColor=valid?'#238b4f':'#c16a74';mark(valid,inp.value);};$('.verify',item).addEventListener('click',check);inp.addEventListener('keydown',e=>{if(e.key==='Enter')check();});}
  if(progress[key]){feedback.className='feedback good';feedback.textContent='Completed previously ✓';}
 });
});
if(window.CARDS){$$('[data-cards]').forEach(container=>{const data=window.CARDS[container.dataset.cards]||[];container.innerHTML='<h3>Vocabulary cards</h3><p class="hint">Reveal the meaning, then listen to the English pronunciation.</p><div class="flash">'+data.map((c,i)=>'<div class="flashcard" id="card-'+i+'-'+esc(container.dataset.cards)+'"><div><strong>'+esc(c[0])+'</strong><div class="meaning">'+esc(c[1])+'</div></div><div class="actions"><button class="btn secondary small flip" type="button">Reveal</button><button class="btn secondary small speakCard" type="button" aria-label="Listen to '+esc(c[0])+'">🔊</button></div></div>').join('')+'</div>';$$('.flashcard',container).forEach((card,i)=>{$('.flip',card).addEventListener('click',()=>{card.classList.toggle('flipped');$('.flip',card).textContent=card.classList.contains('flipped')?'Hide':'Reveal';});$('.speakCard',card).addEventListener('click',()=>say(data[i][0]));});});}
$$('textarea[data-save]').forEach(el=>{const id='outsiders:writing:'+pageId+':'+el.dataset.save;try{el.value=localStorage.getItem(id)||'';}catch(e){}el.addEventListener('input',()=>{try{localStorage.setItem(id,el.value);}catch(e){}});});
updateProgress();
const mount=$('#testMount');if(!mount||!window.TEST_QUESTIONS)return;
const questions=window.TEST_QUESTIONS;let responses=Array(questions.length).fill(null),idx=0,started=performance.now();
function render(){let q=questions[idx],val=responses[idx];mount.innerHTML='<div class="testPane"><div class="testHead"><span>Question '+(idx+1)+' of '+questions.length+'</span><span>'+responses.filter(v=>v!==null).length+' answered</span></div><div class="progressTrack" style="width:100%;margin-top:13px"><i style="width:'+Math.round((idx+1)/questions.length*100)+'%"></i></div><h2>'+esc(q.prompt)+'</h2>'+(q.context?'<p class="hint">'+esc(q.context)+'</p>':'')+'<div class="testOptions">'+q.options.map((x,i)=>'<button type="button" data-option="'+i+'" class="'+(val===i?'selected':'')+'" aria-pressed="'+(val===i?'true':'false')+'">'+String.fromCharCode(65+i)+'. '+esc(x)+'</button>').join('')+'</div><div class="questionNav"><button type="button" class="btn secondary" id="prevQ" '+(idx===0?'disabled':'')+'>← Previous</button><button type="button" class="btn" id="nextQ">'+(idx===questions.length-1?'Finish test':'Next →')+'</button></div><p class="smallPrint">Choose one answer. You can go back before submitting.</p></div>';
 $$('.testOptions button',mount).forEach(b=>b.addEventListener('click',()=>{responses[idx]=+b.dataset.option;render();}));$('#prevQ',mount).addEventListener('click',()=>{idx--;render();});$('#nextQ',mount).addEventListener('click',()=>{if(idx===questions.length-1){if(responses.some(v=>v===null)){const missing=responses.findIndex(v=>v===null);if(!confirm('Some questions are unanswered. Submit anyway?')){idx=missing;render();return;}}finish();}else{idx++;render();}});}
function finish(){const correct=questions.filter((q,i)=>responses[i]===q.answer).length,pct=Math.round(100*correct/questions.length),elapsed=Math.round((performance.now()-started)/1000);try{localStorage.setItem('outsiders:unit2:lastResult',JSON.stringify({correct,total:questions.length,percent:pct,seconds:elapsed,date:new Date().toISOString()}));}catch(e){}mount.innerHTML='<div class="testPane"><span class="badge">Unit 2 · Test result</span><h1 style="font-size:54px">'+pct+'%</h1><p class="lead">'+correct+' of '+questions.length+' correct · '+Math.floor(elapsed/60)+'m '+(elapsed%60)+'s</p><p>'+ (pct>=85?'Excellent work! You know the material very well.':pct>=65?'Good progress! Review the corrections and practise again.':'Keep practising the lessons, then try again.')+'</p><div class="resultList">'+questions.map((q,i)=>'<div class="reviewItem"><b>'+(i+1)+'. '+esc(q.prompt)+'</b><span style="color:'+(responses[i]===q.answer?'#17754e':'#a33445')+'">'+(responses[i]===q.answer?'✓ Correct':'✗ Your answer: '+esc(responses[i]===null?'(not answered)':q.options[responses[i]]))+'</span><div>Correct answer: '+esc(q.options[q.answer])+'</div>'+(q.why?'<div class="hint">'+esc(q.why)+'</div>':'')+'</div>').join('')+'</div><div class="cta"><button type="button" class="btn" id="againTest">Try again</button><a class="btn secondary" href="index.html">Review Unit 2</a></div></div>';$('#againTest',mount).addEventListener('click',()=>{responses=Array(questions.length).fill(null);idx=0;started=performance.now();render();});}
render();
})();