(() => {
  const cover = document.getElementById('cover');
  const main = document.getElementById('invitation');
  const openButton = document.getElementById('open-invite');
  const skipButton = document.getElementById('skip-invite');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const petals = document.getElementById('petals');
  const motionButton = document.getElementById('motion-toggle');
  const music = document.getElementById('invite-music');
  const musicButton = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');
  function updateMusicButton() {
    const playing = !music.paused;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    musicLabel.textContent = playing ? 'Music on' : 'Music off';
  }
  musicButton.addEventListener('click', async () => {
    if (!music.paused) {
      music.pause();
      return;
    }
    try { await music.play(); }
    catch { updateMusicButton(); }
  });
  music.addEventListener('play', updateMusicButton);
  music.addEventListener('pause', updateMusicButton);
  let state = 'closed', timer, userPaused = false, heroVisible = true;
  const animations = [];
  function setPause() {
    document.body.classList.toggle('motion-paused', userPaused || document.hidden || !heroVisible || state !== 'open');
    motionButton.textContent = userPaused ? 'Play petals' : 'Pause petals';
    motionButton.setAttribute('aria-pressed', String(userPaused));
  }
  function finish(focus = true) {
    if (state === 'open') return;
    state = 'open'; clearTimeout(timer);
    animations.forEach(a => a.cancel()); cover.hidden = true; main.inert = false;
    document.body.classList.remove('cover-active');
    document.body.classList.add('entered');
    motionButton.hidden = preference.matches;
    if (focus) main.focus({preventScroll:true});
    setPause();
  }
  function reveal() {
    if (state !== 'closed') return;
    state = 'opening';
    if (preference.matches) { finish(); return; }
    cover.classList.add('opening');
    timer = setTimeout(() => finish(), 1700);
    try {
      cover.querySelectorAll('.cover-panel').forEach((panel, i) => {
        animations.push(panel.animate([{transform:'translateX(0)'},{transform:`translateX(${i ? 102 : -102}%)`}],{duration:1250,delay:150,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'}));
      });
      Promise.allSettled(animations.map(a=>a.finished)).then(()=>finish());
    } catch { finish(); }
  }
  openButton.addEventListener('click',reveal);
  skipButton.addEventListener('click',()=>finish());
  if (!preference.matches) { cover.hidden=false; main.inert=true; document.body.classList.add('cover-active'); }
  else finish(false);
  for(let i=0;i<10;i++) {
    const p=document.createElement('img');p.src='assets/royal/petal.png';p.alt='';p.className='petal';
    const x=i%2===0 ? 3+i*2.6 : 74+i*2.3;
    p.style.cssText=`--x:${x}%;--size:${18+i%4*8}px;--duration:${12+i%5*1.4}s;--delay:${-i*2.1}s;--travel:${i%2?'-':'+'}55px;--blur:${i%3===0?.5:0}px`;
    petals.append(p);
  }
  motionButton.addEventListener('click',()=>{userPaused=!userPaused;setPause();});
  document.addEventListener('visibilitychange',setPause);
  preference.addEventListener('change',()=>{if(preference.matches)finish(false);motionButton.hidden=preference.matches;});
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting');observer.unobserve(e.target);}}),{threshold:.1});
    document.querySelectorAll('[data-reveal]').forEach(e=>{if(!preference.matches)e.classList.add('waiting');observer.observe(e);});
    const ambient=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;setPause();});ambient.observe(document.querySelector('.hero'));
  }
  setPause();
})();

(() => {
  const date = Date.parse('2026-09-26T20:00:00+05:00');
  const elements = ['days','hours','minutes','seconds'].map(id=>document.getElementById(id));
  const note=document.getElementById('countdown-note');
  function renderCountdown(){
    const remaining=Math.max(0,Math.floor((date-Date.now())/1000));
    const parts=[Math.floor(remaining/86400),Math.floor(remaining%86400/3600),Math.floor(remaining%3600/60),remaining%60];
    elements.forEach((e,i)=>e.textContent=String(parts[i]).padStart(2,'0'));
    if(!remaining){note.textContent='With heartfelt wishes for Haroon & Warisha';clearInterval(interval);}
  }
  const interval=setInterval(renderCountdown,1000);renderCountdown();

  const card=document.getElementById('scratch-card');
  const canvas=document.getElementById('scratch-canvas');
  const button=document.getElementById('reveal-date');
  const ctx=canvas.getContext('2d');
  let active=false,revealed=false,segments=0;
  function burst(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const host=document.createElement('div');host.className='scratch-burst';host.setAttribute('aria-hidden','true');document.body.append(host);
    const bounds=card.getBoundingClientRect(),center=bounds.left+bounds.width/2;
    for(let i=0;i<25;i++){
      const particle=i%3===0?document.createElement('span'):document.createElement('img');
      if(particle.tagName==='IMG'){particle.src='assets/royal/petal.png';particle.alt='';}
      const x=Math.max(10,Math.min(innerWidth-25,center+(Math.random()-.5)*Math.min(innerWidth-24,480)));
      particle.style.cssText=`--x:${x}px;--size:${i%3===0?8+Math.random()*6:14+Math.random()*14}px;--fall:${1.9+Math.random()*1.2}s;--delay:${Math.random()*.52}s;--sway:${(Math.random()-.5)*160}px;--rotate:${Math.random()*720-360}deg`;
      host.append(particle);
    }
    setTimeout(()=>host.remove(),3700);
  }
  function reveal(){if(revealed)return;revealed=true;canvas.hidden=true;button.hidden=true;card.classList.add('scratched');burst();}
  if(!ctx || matchMedia('(prefers-reduced-motion: reduce)').matches){reveal();return;}
  function paint(){
    const box=card.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(box.width*scale);canvas.height=Math.round(box.height*scale);ctx.setTransform(scale,0,0,scale,0,0);
    const gradient=ctx.createLinearGradient(0,0,box.width,box.height);
    gradient.addColorStop(0,'#c6d6e0');gradient.addColorStop(.55,'#e9e1ca');gradient.addColorStop(1,'#a7bdcc');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,box.width,box.height);
    ctx.fillStyle='#314d61';ctx.font='italic 27px Georgia';ctx.textAlign='center';ctx.fillText('A date to remember',box.width/2,box.height/2);
    ctx.font='12px Arial';ctx.fillText('SCRATCH HERE',box.width/2,box.height/2+27);
  }
  paint();
  function scratch(e){
    const box=canvas.getBoundingClientRect();
    const x=e.clientX-box.left,y=e.clientY-box.top;
    ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,23,0,Math.PI*2);ctx.fill();
    if(++segments>48)reveal();
  }
  canvas.addEventListener('pointerdown',e=>{active=true;canvas.setPointerCapture(e.pointerId);scratch(e)});
  canvas.addEventListener('pointermove',e=>{if(active)scratch(e)});
  canvas.addEventListener('pointerup',()=>{active=false});
  canvas.addEventListener('pointercancel',()=>{active=false});
  button.addEventListener('click',reveal);
  addEventListener('resize',()=>{if(!revealed)paint()},{passive:true});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)reveal()});
})();
