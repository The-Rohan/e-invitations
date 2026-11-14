(function(){
  'use strict';
  var active=false,autoScrollClaimed=false;
  window.NiruAutoScroll=function(options){
    options=options||{};
    var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(autoScrollClaimed||(reduce&&!options.allowReducedMotion)) return {cancel:function(){}};
    autoScrollClaimed=true;
    var cancelled=false,begun=false,timer=0,frame=0,root=document.documentElement,token=1,expectedY=scrollY;
    var previousBehavior=root.style.scrollBehavior;
    var events=['touchstart','touchmove','touchend','touchcancel','wheel','pointerdown','pointerup','pointercancel','keydown'];
    function removeListeners(){events.forEach(function(type){removeEventListener(type,cancel,true)});removeEventListener('scroll',detectManualScroll,true);removeEventListener('message',receiveCancel,true)}
    function detectManualScroll(){if(begun&&!cancelled&&Math.abs(scrollY-expectedY)>10)cancel()}
    function receiveCancel(event){if(event.data==='niru:cancel-auto-scroll')cancel()}
    function finish(){root.style.scrollBehavior=previousBehavior;removeListeners()}
    function cancel(){
      if(cancelled) return;
      cancelled=true;
      token++;
      if(timer) clearTimeout(timer);
      if(frame) cancelAnimationFrame(frame);
      /* Keep the inline override after cancellation. Restoring CSS smooth-scroll
         here can allow a compositor-side movement to continue after touchend. */
      root.style.scrollBehavior='auto';
      removeListeners();
    }
    function begin(){
      if(cancelled) return;
      begun=true;
      var start=scrollY;
      expectedY=start;
      var end=Math.max(start,document.documentElement.scrollHeight-innerHeight);
      var distance=end-start;
      if(distance<2){finish();return}
      root.style.scrollBehavior='auto';
      var speed=Math.max(20,Number(options.pixelsPerSecond)||55);
      var duration=Math.max(Number(options.minDuration)||14000,Math.min(Number(options.maxDuration)||36000,distance/speed*1000));
      var began=performance.now();
      var runToken=token;
      function step(now){
        if(cancelled||runToken!==token) return;
        var progress=Math.min(1,(now-began)/duration);
        expectedY=start+distance*progress;
        scrollTo(0,expectedY);
        if(!cancelled&&runToken===token&&progress<1) frame=requestAnimationFrame(step);
        else if(!cancelled) finish();
      }
      frame=requestAnimationFrame(step);
    }
    events.forEach(function(type){addEventListener(type,cancel,{passive:true,capture:true})});
    addEventListener('scroll',detectManualScroll,{passive:true,capture:true});
    addEventListener('message',receiveCancel,{capture:true});
    timer=setTimeout(begin,Math.max(0,Number(options.delay)||0));
    return {cancel:cancel};
  };
  window.NiruCelebrate=function(message, options){
    if(active) return;
    options=options||{};
    active=true;
    var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    var veil=document.createElement('div');
    veil.className='niru-celebration';
    veil.setAttribute('role','status');
    veil.setAttribute('aria-live','polite');
    /* Scratch cards already reveal their own words in the card. Passing false gives
       them the petals only, with no duplicate centre message. */
    if(message!==false) veil.innerHTML='<div class="niru-celebration__message">'+(message||'We\u2019re getting married!')+'</div>';
    var style=document.createElement('style');
    style.textContent='.niru-celebration{position:fixed;inset:0;z-index:2147483000;pointer-events:none;display:grid;place-items:center;overflow:hidden}.niru-celebration__message{max-width:min(82vw,360px);padding:18px 26px;border:1px solid rgba(184,138,66,.65);border-radius:999px;background:rgba(255,250,243,.96);box-shadow:0 16px 48px rgba(50,30,20,.18);color:#672631;font:italic 600 clamp(1.15rem,4.5vw,1.55rem)/1.2 Georgia,serif;text-align:center;animation:niruCelebrateMessage 2.5s both}.niru-celebration__petal{position:absolute;top:-12vh;width:14px;height:22px;border-radius:80% 15% 75% 20%;background:var(--petal);opacity:.9;animation:niruCelebrateFall var(--dur) cubic-bezier(.25,.1,.4,1) var(--delay) both}@keyframes niruCelebrateMessage{0%{opacity:0;transform:translateY(14px) scale(.92)}14%,72%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px) scale(.98)}}@keyframes niruCelebrateFall{0%{transform:translate3d(0,-10vh,0) rotate(0)}100%{transform:translate3d(var(--drift),115vh,0) rotate(var(--spin))}}@media(prefers-reduced-motion:reduce){.niru-celebration__message{animation-duration:1.8s}.niru-celebration__petal{display:none}}';
    document.head.appendChild(style);
    if(!reduce){
      var colors=options.colors||['#d9a6a8','#efd9b8','#b88a42','#8f9d73','#f1c6c9'];
      var count=options.count||42;
      for(var i=0;i<count;i++){
        var p=document.createElement('i'); p.className='niru-celebration__petal';
        p.style.left=(Math.random()*100)+'%';
        p.style.setProperty('--petal',colors[i%colors.length]);
        p.style.setProperty('--dur',(2.2+Math.random()*1.8)+'s');
        p.style.setProperty('--delay',(Math.random()*.55)+'s');
        p.style.setProperty('--drift',(-70+Math.random()*140)+'px');
        p.style.setProperty('--spin',(-420+Math.random()*840)+'deg');
        veil.appendChild(p);
      }
    }
    document.body.appendChild(veil);
    setTimeout(function(){ veil.remove(); style.remove(); active=false; },reduce?1900:(options.duration||4200));
  };
}());
