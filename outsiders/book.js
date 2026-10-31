/* Outsiders · renders a unit page from window.UNIT, then hands the activities to course.js */
(function(){
'use strict';
const U=window.UNIT;if(!U)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const practice={},cards={};let n=0;
const line=p=>{const m=/^([A-Z][A-Za-z’' ]{1,24}):\s+(.*)$/.exec(p);return m?'<p><span class="who">'+esc(m[1])+':</span> '+esc(m[2])+'</p>':'<p>'+esc(p)+'</p>';};
function item(q){
 if('tf' in q)return {prompt:q.tf,options:['True','False'],answer:q.a?0:1,why:q.w};
 if(q.o)return {prompt:q.p,options:q.o,answer:q.a,why:q.w};
 return {prompt:q.p,answer:q.a,why:q.w,tip:q.tip};
}
const blocks={
 read(b){const id='txt'+(++n),dlg=b.p.some(p=>/^[A-Z][A-Za-z’' ]{1,24}:\s/.test(p));
  return '<div class="'+(dlg?'dialogue':'reading')+'" id="'+id+'">'+(b.img?'<img src="'+esc(b.img)+'" alt="'+esc(b.alt||'')+'">':'')+(b.label?'<p><span class="textLabel">'+esc(b.label)+'</span></p>':'')+b.p.map(line).join('')+'<button type="button" class="btn secondary small" data-say-target="'+id+'">🔊 Listen</button></div>';},
 quiz(b){const id='set'+(++n);practice[id]=b.q.map(item);
  return (b.bank?'<div class="chips" aria-label="Word box">'+b.bank.map(w=>'<span class="chip">'+esc(w)+'</span>').join('')+'</div>':'')+'<div class="activityBox quiz" data-set="'+id+'" data-title="'+esc(b.title||'Practice')+'"></div>';},
 cards(b){const id='cards'+(++n);cards[id]=b.items;return '<div class="cardsBox" data-cards="'+id+'"></div>';},
 grammar(b){return '<div class="grammar">'+(b.title?'<h3>'+esc(b.title)+'</h3>':'')+b.html+'</div>';},
 note(b){return '<div class="note">'+b.html+'</div>';},
 cols(b){return '<div class="cols'+(b.items.length===3?' three':'')+'">'+b.items.map(c=>'<div class="box">'+(c.badge?'<span class="badge">'+esc(c.badge)+'</span>':'')+(c.title?'<h3>'+esc(c.title)+'</h3>':'')+c.html+'</div>').join('')+'</div>';},
 think(b){return '<div class="note"><h3>'+esc(b.title||'Think about it')+'</h3><ol>'+b.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>';},
 write(b){return '<h3>'+esc(b.title)+'</h3>'+(b.prompt?'<p>'+esc(b.prompt)+'</p>':'')+'<textarea class="writeBox" data-save="w'+(++n)+'" aria-label="'+esc(b.title)+'" placeholder="'+esc(b.ph||'Write here…')+'"></textarea>';},
 h(b){return '<h3>'+esc(b.text)+'</h3>';}
};
const num=U.num,label=U.label||('Unit '+num),base='../';
const nav='<header class="site"><a href="'+base+'outsiders/index.html" class="logo">Outsiders</a><nav>'+(U.prev?'<a href="'+esc(U.prev[0])+'">← '+esc(U.prev[1])+'</a>':'')+(U.test?'<a href="test.html">'+esc(label)+' test</a>':'')+'<a href="'+base+'outsiders/index.html">All units</a>'+(U.next?'<a href="'+esc(U.next[0])+'">'+esc(U.next[1])+' →</a>':'')+'</nav></header>';
const hero='<section class="hero"><div><span class="badge">'+esc(label)+' · Interactive lessons</span><h1>'+esc(U.title)+'</h1><p class="lead">'+esc(U.lead)+' Based on '+esc(U.of||label)+' of Robert Fader’s <em>Outsiders</em> (pp. '+esc(U.pages)+').</p><div class="cta"><a class="btn" href="#'+U.sections[0].id+'">Start learning →</a>'+(U.test?'<a class="btn secondary" href="test.html">Take the '+esc(label)+' test</a>':'')+'</div><div class="progressBox"><div class="progressTrack"><i id="progressBar"></i></div><span class="progressLabel" id="progressLabel"></span></div></div><div class="hero-art"><img src="'+esc(U.hero[0])+'" alt="'+esc(U.hero[1])+'"><span class="caption">'+esc(U.hero[2])+'</span></div></section>';
const jump='<nav class="jump" aria-label="Unit sections">'+U.sections.map(s=>'<a href="#'+s.id+'">'+esc(s.letter+' · '+(s.short||s.title))+'</a>').join('')+'</nav>';
const body=U.sections.map(s=>'<section class="chapter" id="'+s.id+'"><div class="chapterhead"><span class="letter">'+esc(s.letter)+'</span><div><span class="eyebrow">'+esc(s.eyebrow)+'</span><h2>'+esc(s.title)+'</h2>'+(s.lead?'<p class="lead">'+esc(s.lead)+'</p>':'')+'</div></div>'+s.blocks.map(b=>blocks[b.t](b)).join('')+'</section>').join('');
const end=U.test?'<div class="finalCTA"><span class="badge">Assessment</span><h2>Ready for the '+esc(label)+' test?</h2><p>Check what you learned with a scored test and explanations.</p><div class="cta"><a class="btn" href="test.html">Take the test →</a>'+(U.next?'<a class="btn secondary" href="'+esc(U.next[0])+'">Continue to '+esc(U.next[1])+'</a>':'')+'</div></div>':'';
document.body.insertAdjacentHTML('afterbegin',nav+'<main>'+hero+jump+body+end+'</main><footer class="foot">Outsiders · English by Robert Fader · '+esc(label)+' interactive lessons · Original reference: Figma pp. '+esc(U.pages)+'</footer>');
document.title='Outsiders · '+label+' · '+U.title;
window.PRACTICE=practice;window.CARDS=cards;
})();
