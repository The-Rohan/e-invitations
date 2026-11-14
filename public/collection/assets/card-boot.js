/* Shared invitation boot. Reveals the card immediately and keeps iOS low-power video playback working. */
(function(){
  'use strict';
  var root=document.documentElement,callbacks=[],shellReady=false;
  var status={phase:'loading'};

  function notifyParent(type){if(window.parent!==window)window.parent.postMessage({type:type},new URL(document.baseURI).origin);}

  function revealShell(){
    if(shellReady)return;shellReady=true;status.phase='ready';root.dataset.niruLoadState='media-ready';
    callbacks.splice(0).forEach(function(fn){try{fn();}catch(e){setTimeout(function(){throw e;});}});
    window.dispatchEvent(new CustomEvent('niru:card-shell-ready'));notifyParent('niru:card-shell-ready');
    window.dispatchEvent(new CustomEvent('niru:card-media-ready'));notifyParent('niru:card-media-ready');
    window.dispatchEvent(new CustomEvent('niru:card-ready'));notifyParent('niru:card-ready');
  }
  function start(){if(shellReady)return;revealShell();}

  /* ---- iPhone Low Power Mode ----
     Low Power Mode refuses video play() unless it runs inside a tap, and a press (touchstart /
     pointerdown) is not a tap -- only the release is. A refused film that is already in memory is
     advanced frame by frame by seeking instead, so the entrance still moves with no "Tap to play",
     and the guest's next release authorises every film for real playback. */
  var mediaProto=window.HTMLMediaElement&&HTMLMediaElement.prototype,nativePlay=mediaProto&&mediaProto.play,nativePause=mediaProto&&mediaProto.pause;
  var emulated=new Map(),authorised=new WeakSet();
  function stopEmulating(video){var s=emulated.get(video);if(!s)return false;cancelAnimationFrame(s.raf);emulated.delete(video);delete video.paused;return true;}
  function emulate(video){
    if(emulated.has(video))return;
    var s={t:video.currentTime,last:video.currentTime,prev:performance.now(),raf:0};emulated.set(video,s);
    Object.defineProperty(video,'paused',{configurable:true,get:function(){return false;}});
    video.dispatchEvent(new Event('play'));video.dispatchEvent(new Event('playing'));
    function step(now){
      if(emulated.get(video)!==s)return;
      var dt=Math.min(Math.max((now-s.prev)/1000,0),.1);s.prev=now;
      if(Math.abs(video.currentTime-s.last)>.05)s.t=video.currentTime;/* the card seeked it */
      s.t+=dt*(video.playbackRate||1);
      var d=video.duration;
      if(isFinite(d)&&s.t>=d){if(video.loop)s.t=0;else{stopEmulating(video);video.currentTime=d;video.dispatchEvent(new Event('ended'));return;}}
      if(!video.seeking){video.currentTime=s.t;s.last=s.t;}
      s.raf=requestAnimationFrame(step);
    }
    s.raf=requestAnimationFrame(step);
  }
  if(nativePlay){
    mediaProto.play=function(){
      var el=this;if(emulated.has(el))return Promise.resolve();
      var p;try{p=nativePlay.apply(el,arguments);}catch(e){p=Promise.reject(e);}
      if(!(el instanceof HTMLVideoElement)||!p||!p.then)return p;
      return p.catch(function(e){if(!e||e.name!=='NotAllowedError'||el.readyState<1)throw e;emulate(el);});
    };
    mediaProto.pause=function(){if(stopEmulating(this))this.dispatchEvent(new Event('pause'));return nativePause.apply(this,arguments);};
    var authorise=function(){
      document.querySelectorAll('video').forEach(function(v){
        if(authorised.has(v))return;authorised.add(v);
        if(stopEmulating(v)){var t=v.currentTime;nativePlay.call(v).catch(function(){authorised.delete(v);try{v.currentTime=t;}catch(_){}emulate(v);});}
        else if(v.paused){var p=nativePlay.call(v);nativePause.call(v);if(p&&p.catch)p.catch(function(){});}
      });
    };
    ['touchend','click','keydown'].forEach(function(type){window.addEventListener(type,authorise,true);});
  }

  var playback=new WeakMap(),blockedPlayback=new Set(),playbackButton=null,mediaWaitButton=null;
  function finishPlayback(state,video,skip){if(state.finished)return;state.finished=true;clearTimeout(state.waitTimer);clearTimeout(state.skipTimer);blockedPlayback.delete(state);if(mediaWaitButton){mediaWaitButton.remove();mediaWaitButton=null;}if(skip){try{video.pause();}catch(_){}video.dispatchEvent(new Event('ended'));}state.resolve();}
  function showPlaybackRetry(state){blockedPlayback.add(state);if(playbackButton)return;playbackButton=document.createElement('button');playbackButton.type='button';playbackButton.textContent='Tap to play';playbackButton.id='niru-media-wait';playbackButton.onclick=function(e){e.stopPropagation();var pending=Array.from(blockedPlayback);blockedPlayback.clear();playbackButton.remove();playbackButton=null;pending.forEach(function(item){item.attempt();});};document.body.appendChild(playbackButton);}
  function showMediaWait(state,video){
    if(state.finished||mediaWaitButton)return;mediaWaitButton=document.createElement('button');mediaWaitButton.type='button';mediaWaitButton.id='niru-media-wait';mediaWaitButton.innerHTML='Preparing the original-quality animation…<small>The invitation remains available.</small>';mediaWaitButton.onclick=function(e){e.stopPropagation();};document.body.appendChild(mediaWaitButton);
    state.skipTimer=setTimeout(function(){if(state.finished||!mediaWaitButton)return;mediaWaitButton.innerHTML='Open invitation now<small>You can continue without waiting for the film.</small>';mediaWaitButton.onclick=function(e){e.stopPropagation();finishPlayback(state,video,true);};},2200);
  }
  function play(video,onPlaying){
    var state=playback.get(video);
    if(!state||state.finished){state={finished:false,resolve:null,waitTimer:null,skipTimer:null};state.promise=new Promise(function(resolve){state.resolve=resolve;});playback.set(video,state);var initialTime=video.currentTime;
      function progress(){if(!video.paused&&video.readyState>=2&&Math.abs(video.currentTime-initialTime)>.025)finishPlayback(state,video,false);}
      video.addEventListener('timeupdate',progress);
      state.attempt=function(){if(state.finished)return;video.preload='auto';if(video.networkState===0)video.load();
        /* A film already in memory never needs the wait notice; it only guards the streaming fallback. */
        if(!/^blob:/.test(video.currentSrc||video.src))state.waitTimer=setTimeout(function(){showMediaWait(state,video);},450);
        var result=video.play();if(result&&result.catch)result.catch(function(error){clearTimeout(state.waitTimer);if(error.name!=='AbortError')showPlaybackRetry(state);});};
    }
    state.attempt();if(onPlaying)state.promise.then(onPlaying);return state.promise;
  }
  window.NiruBoot={run:function(fn){if(shellReady)fn();else callbacks.push(fn);},play:play,status:status};
  document.addEventListener('DOMContentLoaded',start,{once:true});
})();
