window.NiruBoot.run(function(){
'use strict';

var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var phone=document.getElementById('phone');
var phoneWrap=document.getElementById('phoneWrap');
var entrance=document.getElementById('entrance');
var gateVid=document.getElementById('gateVid');
var enterBtn=document.getElementById('enterBtn');
var gateSound=document.getElementById('gateSound');
var hero=document.getElementById('hero');
var langFab=document.getElementById('langFab');
var tszFab=document.getElementById('tszFab');
var musicFab=document.getElementById('musicFab');
var bgm=document.getElementById('bgm');
var keyHint=document.getElementById('keyHint');
var lockStage=document.getElementById('lockStage');
var dateActions=document.getElementById('dateActions');
var dateDay=document.getElementById('dateDay');
var dateBig=document.getElementById('dateBig');
var dateSub=document.getElementById('dateSub');
var gcalDate=document.getElementById('gcalDate');
var icsDate=document.getElementById('icsDate');
var rsvpSheet=document.getElementById('rsvpSheet');
var rsvpForm=document.getElementById('rsvpForm');
var mapModal=document.getElementById('mapModal');
var mapClose=document.getElementById('mapClose');
var mapBtn=document.getElementById('mapBtn');
var mapStops=document.getElementById('mapStops');
var mapEvents=document.getElementById('mapEvents');
var doneTitle=document.getElementById('doneTitle');
var doneMsg=document.getElementById('doneMsg');

/* Handoff measured against the delivered film: 720×1280 @ 7.917 s, motion runs to
   the end (freezedetect found no hold), and SSIM against hero.jpg rises toward
   the final frames (0.59 at 7.75 s). 7.55 starts the cross-dissolve while the
   film is still moving, just before the end. */
var HANDOFF=7.55;
var LANG=localStorage.getItem('basant-lang')||'en';
var musicWanted=true;
var musicOn=false;
var fadeToken=0;
var opened=false;
var dateUnlocked=false;
var submitted=false;
var rsvpYes=false;
var hasFilm=true;
var mapOpen=false;
var mapTrigger=null;
var io=null;
var gateFinishing=false;
var UD='۰۱۲۳۴۵۶۷۸۹';

var EVENTS=[
  { key:'mehndi', name:{en:'Mehndi',ur:'مہندی'},
    kind:{en:'The first evening',ur:'پہلی شام'},
    day:'11', mon:{en:'June',ur:'جون'}, yr:'2027',
    wd:{en:'Friday',ur:'جمعہ'}, hr:{en:'7:00 PM',ur:'شام سات بجے'},
    blurb:{en:'Kites on every rooftop string, the dholak, and nobody sitting down after nine.',
           ur:'چھتوں کی ہر ڈور پر پتنگیں، ڈھولک، اور نو بجے کے بعد کوئی نہیں بیٹھے گا۔'},
    venue:{en:'Gulistan Bagh',ur:'گلستان باغ'},
    addr:{en:'Rawalakot, Azad Kashmir',ur:'راولاکوٹ، آزاد کشمیر'},
    q:'Rawalakot+Azad+Kashmir', pardah:false, motif:'kite',
    wear:{en:'Marigold, mustard and green',ur:'گیندئی، سرسوں اور ہرا'},
    sw:['#E9B44C','#D9863B','#F7F3E9'],
    ics:{t:'Mehndi — Bilal & Mahrukh', s:'20270611T140000Z', e:'20270611T190000Z',
         loc:'Gulistan Bagh, Rawalakot, Azad Kashmir'} },

  { key:'baraat', name:{en:'Baraat &amp; Nikah',ur:'بارات و نکاح'},
    kind:{en:'The wedding day',ur:'شادی کا دن'},
    day:'12', mon:{en:'June',ur:'جون'}, yr:'2027',
    wd:{en:'Saturday',ur:'ہفتہ'}, hr:{en:'5:00 PM',ur:'شام پانچ بجے'},
    blurb:{en:'The nikah is read by the water, at the hour the light goes gold on the far ridge.',
           ur:'نکاح جھیل کے کنارے پڑھایا جائے گا، اُس وقت جب سامنے والی پہاڑی پر دھوپ سنہری ہو جاتی ہے۔'},
    venue:{en:'Banjosa Lake Lawn',ur:'بنجوسہ جھیل لان'},
    addr:{en:'Banjosa, Rawalakot',ur:'بنجوسہ، راولاکوٹ'},
    q:'Banjosa+Lake+Rawalakot', pardah:true, motif:'arch',
    wear:{en:'Formal eastern &middot; ivory and deep emerald',ur:'فارمل ایسٹرن — آئیوری اور گہرا زمردی'},
    sw:['#1F3A44','#F7F3E9','#D9863B'],
    ics:{t:'Baraat & Nikah — Bilal & Mahrukh', s:'20270612T120000Z', e:'20270612T180000Z',
         loc:'Banjosa Lake Lawn, Rawalakot, Azad Kashmir'} },

  { key:'walima', name:{en:'Walima',ur:'ولیمہ'},
    kind:{en:'The last evening',ur:'آخری شام'},
    day:'13', mon:{en:'June',ur:'جون'}, yr:'2027',
    wd:{en:'Sunday',ur:'اتوار'}, hr:{en:'8:00 PM',ur:'رات آٹھ بجے'},
    blurb:{en:'A quieter evening up on the meadow — dinner, and time to actually sit with everyone.',
           ur:'اوپر مرغزار میں ذرا سکون والی شام — کھانا، اور سب سے اطمینان سے ملنے کا موقع۔'},
    venue:{en:'Toli Peer Terrace',ur:'ٹولی پیر ٹیرس'},
    addr:{en:'Above Rawalakot',ur:'راولاکوٹ سے اوپر'},
    q:'Toli+Peer+Rawalakot', pardah:false, motif:'cypress',
    wear:{en:'Formal &middot; sherwani or a dark suit',ur:'فارمل — شیروانی یا گہرے رنگ کا سوٹ'},
    sw:['#27515B','#5E8C82','#F7F3E9'],
    ics:{t:'Walima — Bilal & Mahrukh', s:'20270613T150000Z', e:'20270613T200000Z',
         loc:'Toli Peer, Rawalakot, Azad Kashmir'} }
];

var SECTIONS=[
  {id:'invitation', label:{en:'The Invitation',ur:'دعوت'}},
  {id:'reveal', label:{en:'The Date',ur:'تاریخ'}},
  {id:'events', label:{en:'The Celebrations',ur:'تقریبات'}},
  {id:'dress', label:{en:'What to Wear',ur:'لباس'}},
  {id:'stay', label:{en:'Where to Stay',ur:'قیام'}},
  {id:'travel', label:{en:'The Journey',ur:'سفر'}},
  {id:'rsvp', label:{en:'Reply',ur:'جواب'}}
];

var STR={
  yes:{en:'Yes, I’ll be there',ur:'جی، آ رہے ہیں'},
  no:{en:'Sorry, I can’t make it',ur:'معذرت، نہیں آ سکیں گے'},
  guests:{en:'Guests',ur:'کتنے لوگ'},
  cal:{en:'Add to calendar',ur:'کیلنڈر میں سیو کریں'},
  openMap:{en:'View on maps',ur:'میپ پر دیکھیں'},
  gcal:{en:'Google Calendar',ur:'گوگل کیلنڈر'},
  apple:{en:'Apple / iPhone',ur:'آئی فون / ایپل'},
  pardah:{en:'Separate seating for ladies &amp; gents',ur:'خواتین اور مردوں کے لیے الگ انتظام'},
  thanksT:{en:'Your reply is sealed',ur:'آپ کا جواب محفوظ ہو گیا'},
  missT:{en:'We’ll miss you',ur:'آپ کی کمی رہے گی'},
  thanksM:{en:'Your presence is the best gift we could receive.',ur:'آپ کا آنا ہی ہمارے لیے سب سے بڑا تحفہ ہے۔'},
  missM:{en:'Thank you for letting us know. You’ll be in our duas that day.',ur:'بتا دینے کا شکریہ۔ اُس دن آپ ہماری دعاؤں میں ضرور ہوں گے۔'},
  keyLocked:{en:'Tap each kite to send it up.',ur:'ہر پتنگ کو چھڑیں۔'},
  keyAction:{en:'Launch the kites',ur:'پتنگیں اڑائیں'},
  keyOpen:{en:'The kites are flying.',ur:'پتنگیں اڑ گئیں۔'},
  soundOn:{en:'Sound on',ur:'آواز آن'},
  soundOff:{en:'Sound off',ur:'آواز آف'}
};

function num(v){ return LANG==='ur' ? String(v).replace(/[0-9]/g,function(d){ return UD[+d]; }) : String(v); }
function sep(){ return LANG==='ur' ? '، ' : ' &middot; '; }
function pad(n){ return (n<10?'0':'')+n; }

function gcal(v){
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'+
    '&text='+encodeURIComponent(v.ics.t)+'&dates='+v.ics.s+'/'+v.ics.e+
    '&location='+encodeURIComponent(v.ics.loc)+
    '&details='+encodeURIComponent('With love — Bilal & Mahrukh');
}
function icsHref(v){
  var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NIRU//Baradari//EN','BEGIN:VEVENT',
    'UID:'+v.ics.s+'@wedinvite.pk','DTSTART:'+v.ics.s,'DTEND:'+v.ics.e,'SUMMARY:'+v.ics.t,
    'LOCATION:'+v.ics.loc.replace(/,/g,'\\,'),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
}
function closeCals(){
  document.querySelectorAll('.calpop.on').forEach(function(x){ x.classList.remove('on'); });
}

function renderDate(){
  var d=EVENTS[1];
  dateDay.textContent=d.wd[LANG];
  dateBig.textContent=num('12')+' · '+num('06')+' · '+num('2027');
  dateSub.textContent=LANG==='ur'?'بنجوسہ جھیل · راولاکوٹ':'Banjosa Lake · Rawalakot';
  keyHint.textContent=dateUnlocked?STR.keyOpen[LANG]:STR.keyLocked[LANG];
  gcalDate.href=gcal(d);
  icsDate.href=icsHref(d);
  icsDate.download='basant-'+d.key+'.ics';
}

function unlockDate(){
  if(dateUnlocked) return;
  dateUnlocked=true;
  lockStage.classList.add('unlocked');
  dateActions.classList.add('on');
  renderDate();
  if(!reduce && window.NiruCelebrate){
    NiruCelebrate(false,{colors:['#D9863B','#E9B44C','#1F3A44','#F7F3E9','#5E8C82'],count:46,duration:5200});
  }
}

function renderEvents(){
  var host=document.getElementById('eventPath');
  host.innerHTML='';
  EVENTS.forEach(function(v,i){
    var motif='';
    var card=document.createElement('article');
    card.className='evCard';
    card.id='event-'+v.key;
    card.innerHTML=
      '<div class="evTop"><span class="evIndex">0'+(i+1)+'</span>'+
      '</div>'+
      '<div class="evKind">'+v.kind[LANG]+'</div>'+
      '<h3 class="evName">'+v.name[LANG]+'</h3>'+
      '<div class="evVenue">'+v.venue[LANG]+'</div>'+
      '<div class="evAddr">'+v.addr[LANG]+'</div>'+
      '<div class="hair"></div>'+
      '<div class="evMeta">'+
        '<div class="evDate">'+num(v.day)+' '+v.mon[LANG]+' '+num(v.yr)+sep()+v.wd[LANG]+'</div>'+
        '<div class="evTime">'+v.hr[LANG]+'</div>'+
      '</div>'+
      '<p class="evBlurb">'+v.blurb[LANG]+'</p>'+
      (v.pardah?'<div class="evPardah">'+STR.pardah[LANG]+'</div>':'')+
      '<div class="evActions">'+
        '<a class="btn" target="_blank" rel="noopener" '+
          'href="https://www.google.com/maps/search/?api=1&query='+v.q+'">'+STR.openMap[LANG]+'</a>'+
        '<span class="calwrap"><button class="btn caltoggle" type="button">'+STR.cal[LANG]+'</button>'+
          '<div class="calpop">'+
            '<a target="_blank" rel="noopener" href="'+gcal(v)+'">'+STR.gcal[LANG]+'</a>'+
            '<a href="'+icsHref(v)+'" download="'+v.ics.t.replace(/[^\w]+/g,'-')+'.ics">'+STR.apple[LANG]+'</a>'+
          '</div></span>'+
      '</div>';
    var tg=card.querySelector('.caltoggle'), pop=card.querySelector('.calpop');
    tg.addEventListener('click',function(e){
      e.stopPropagation();
      var was=pop.classList.contains('on');
      closeCals();
      if(!was) pop.classList.add('on');
    });
    pop.addEventListener('click',function(e){ e.stopPropagation(); });
    host.appendChild(card);
  });
}

function renderDress(){
  var host=document.getElementById('dressRail');
  host.innerHTML='';
  EVENTS.forEach(function(v){
    var d=document.createElement('article');
    d.className='dcCard';
    d.innerHTML=
      '<h3>'+v.name[LANG]+'</h3>'+
      '<div class="on">'+num(v.day)+' '+v.mon[LANG]+'</div>'+
      '<div class="wear">'+v.wear[LANG]+'</div>'+
      '<div class="sw">'+v.sw.map(function(c){ return '<i style="background:'+c+'"></i>'; }).join('')+'</div>';
    host.appendChild(d);
  });
}

function renderRsvpEvents(){
  var host=document.getElementById('rsvpEvents');
  var prev={};
  EVENTS.forEach(function(v){
    var r=rsvpForm.querySelector('input[name="att_'+v.key+'"]:checked');
    var g=rsvpForm.querySelector('input[name="guests_'+v.key+'"]');
    if(r||g) prev[v.key]={att:r?r.value:'yes',guests:g?g.value:'2'};
  });
  host.innerHTML='';
  EVENTS.forEach(function(v){
    var p=prev[v.key]||{att:'yes',guests:'2'};
    var d=document.createElement('div');
    d.className='evBlk';
    d.innerHTML=
      '<div class="en">'+v.name[LANG]+'</div>'+
      '<label class="opt"><input type="radio" name="att_'+v.key+'" value="yes"'+(p.att==='yes'?' checked':'')+'/>'+
        '<i class="dia"></i><span>'+STR.yes[LANG]+'</span></label>'+
      '<label class="opt"><input type="radio" name="att_'+v.key+'" value="no"'+(p.att==='no'?' checked':'')+'/>'+
        '<i class="dia"></i><span>'+STR.no[LANG]+'</span></label>'+
      '<div class="cnt"><label>'+STR.guests[LANG]+'</label>'+
        '<button type="button" data-step="-1" aria-label="One fewer guest">&minus;</button>'+
        '<output>'+p.guests+'</output>'+
        '<button type="button" data-step="1" aria-label="One more guest">+</button>'+
        '<input type="hidden" name="guests_'+v.key+'" value="'+p.guests+'"/></div>';
    var out=d.querySelector('output'), hid=d.querySelector('input[type=hidden]');
    out.textContent=num(p.guests);
    d.querySelectorAll('.cnt button').forEach(function(b){
      b.addEventListener('click',function(){
        var n=Math.max(1,Math.min(10,(+hid.value)+(+b.dataset.step)));
        hid.value=n; out.textContent=num(n);
      });
    });
    host.appendChild(d);
  });
}

function showThanks(){
  doneTitle.textContent=(rsvpYes?STR.thanksT:STR.missT)[LANG];
  doneMsg.textContent=(rsvpYes?STR.thanksM:STR.missM)[LANG];
}

function renderMap(){
  mapStops.innerHTML='';
  SECTIONS.forEach(function(s,i){
    var b=document.createElement('button');
    b.type='button';
    b.className='mapStop';
    b.dataset.target=s.id;
    b.innerHTML='<span class="mapNum">'+num(pad(i+1))+'</span>'+
      '<span class="mapLabel">'+s.label[LANG]+'</span><span class="mapArrow" aria-hidden="true">→</span>';
    mapStops.appendChild(b);
  });
  mapEvents.innerHTML='';
  EVENTS.forEach(function(v){
    var b=document.createElement('button');
    b.type='button';
    b.className='mapEvent';
    b.dataset.target='event-'+v.key;
    b.innerHTML='<span class="mapEventName">'+v.name[LANG]+'</span>'+
      '<span class="mapEventDate">'+num(v.day)+' '+v.mon[LANG]+'</span>';
    mapEvents.appendChild(b);
  });
}

function renderAll(){
  renderEvents();
  renderDress();
  renderRsvpEvents();
  renderMap();
  if(submitted) showThanks();
  stagger();
  observeAll();
}

function setLang(l){
  LANG=l==='ur'?'ur':'en';
  localStorage.setItem('basant-lang',LANG);
  document.body.classList.toggle('urdu',LANG==='ur');
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-ur]').forEach(function(el){
    if(!el.dataset.ur) return;
    if(el.dataset.en===undefined) el.dataset.en=el.innerHTML;
    el.innerHTML=LANG==='ur'?el.dataset.ur:el.dataset.en;
  });
  document.querySelectorAll('[data-ur-ph]').forEach(function(el){
    if(el.dataset.enPh===undefined) el.dataset.enPh=el.placeholder;
    el.placeholder=LANG==='ur'?el.dataset.urPh:el.dataset.enPh;
  });
  langFab.textContent=LANG==='ur'?'EN':'اردو';
  closeCals();
  updateSoundLabel();
  renderAll();
  renderDate();
  tickCountdown();
}

function tickCountdown(){
  var target=new Date('2027-06-12T17:00:00+05:00').getTime();
  var dEl=document.getElementById('cdD'), hEl=document.getElementById('cdH'), mEl=document.getElementById('cdM');
  if(!dEl||!hEl||!mEl) return;
  var g=Math.max(0,target-Date.now()), s=Math.floor(g/1000);
  dEl.textContent=num(pad(Math.floor(s/86400)));
  hEl.textContent=num(pad(Math.floor(s%86400/3600)));
  mEl.textContent=num(pad(Math.floor(s%3600/60)));
}

function stagger(){
  document.querySelectorAll('.rv').forEach(function(block){
    var kids=[].slice.call(block.children);
    if(!kids.length){ block.classList.add('stag'); return; }
    kids.forEach(function(k,i){
      if(!k.classList.contains('stag')) k.classList.add('stag');
      k.style.transitionDelay=(i*0.08).toFixed(2)+'s';
    });
  });
}
function observeAll(){
  if(!io) return;
  document.querySelectorAll('.rv:not(.in)').forEach(function(el){ io.observe(el); });
}

function updateSoundLabel(){
  var label=musicWanted?STR.soundOn[LANG]:STR.soundOff[LANG];
  gateSound.innerHTML=(musicWanted
    ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>'
    :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 4 6m0-6-4 6"/></svg>')
    +'<span>'+label+'</span>';
  gateSound.classList.toggle('off',!musicWanted);
  gateSound.setAttribute('aria-pressed',musicWanted?'true':'false');
  if(musicFab){
    musicFab.classList.toggle('muted',!musicWanted||!musicOn);
    musicFab.setAttribute('aria-pressed',(musicWanted&&musicOn)?'true':'false');
    musicFab.setAttribute('aria-label',(musicWanted&&musicOn)?'Mute music':'Play music');
  }
  gateVid.muted=true;
}

function fadeBg(target,ms){
  var token=++fadeToken, from=bgm.volume, t0=performance.now();
  (function step(t){
    if(token!==fadeToken) return;
    var k=Math.max(0,Math.min(1,(t-t0)/ms));
    bgm.volume=Math.max(0,Math.min(1,from+(target-from)*k));
    if(k<1) requestAnimationFrame(step);
    else if(target===0) bgm.pause();
  })(t0);
}

function startMusic(){
  if(!musicWanted||!bgm) return;
  if(!bgm.paused&&musicOn) return;
  if(!bgm.paused){ musicOn=true; fadeBg(.6,700); updateSoundLabel(); return; }
  var from=bgm.volume;
  bgm.volume=0;
  var result;
  try{ result=bgm.play(); }catch(e){ result=null; }
  if(result&&result.then){
    result.then(function(){
      musicOn=true;
      fadeBg(.6,1800);
      updateSoundLabel();
    }).catch(function(){
      musicOn=false;
      bgm.volume=from;
      updateSoundLabel();
    });
  } else {
    musicOn=true;
    fadeBg(.6,900);
    updateSoundLabel();
  }
}

function muteMusic(){
  musicWanted=false;
  musicOn=false;
  updateSoundLabel();
  fadeBg(0,450);
}

function toggleMusic(){
  if(musicOn){
    muteMusic();
  } else {
    musicWanted=true;
    updateSoundLabel();
    startMusic();
  }
}

function toggleGateSound(){
  if(musicWanted){
    muteMusic();
  } else {
    musicWanted=true;
    updateSoundLabel();
    startMusic();
  }
}

function musicGesture(e){
  if(e&&e.target&&e.target.closest&&e.target.closest('#gateSound,#musicFab')) return;
  if(musicWanted) startMusic();
}

function land(){
  window.scrollTo(0,0);
  hero.classList.add('entered');
  document.body.classList.remove('locked');
  phoneWrap.classList.add('ui-on');
}

function finishGate(){
  if(gateFinishing) return;
  gateFinishing=true;
  entrance.classList.add('fade');
  setTimeout(land,280);
  setTimeout(function(){
    entrance.classList.add('gone');
    try{ gateVid.pause(); }catch(_){}
  },1500);
}

function openCard(){
  if(opened) return;
  opened=true;
  enterBtn.classList.add('loading');
  if(reduce||!hasFilm){
    entrance.classList.add('gone');
    land();
    return;
  }
  entrance.classList.add('playing');
  gateVid.muted=true;
  window.NiruBoot.play(gateVid).catch(function(){
    finishGate();
  });
  var done=false;
  function finish(){
    if(done) return;
    done=true;
    finishGate();
  }
  (function watch(){
    if(done) return;
    if(gateVid.currentTime>=HANDOFF) return finish();
    requestAnimationFrame(watch);
  })();
  gateVid.addEventListener('ended',finish);
}

io=new IntersectionObserver(function(entries){
  entries.forEach(function(x){
    if(x.isIntersecting){
      x.target.classList.add('in');
      io.unobserve(x.target);
    }
  });
},{root:null,threshold:.1});

gateVid.querySelector('source').addEventListener('error',function(){ hasFilm=false; });
gateSound.addEventListener('click',function(e){
  e.stopPropagation();
  toggleGateSound();
});
musicFab.addEventListener('click',function(e){
  e.stopPropagation();
  toggleMusic();
});
document.addEventListener('pointerdown',musicGesture,{capture:true,passive:true});
document.addEventListener('keydown',musicGesture,{capture:true});
document.addEventListener('touchend',musicGesture,{capture:true,passive:true});
document.addEventListener('visibilitychange',function(){
  if(document.hidden){
    if(!bgm.paused){ musicOn=false; bgm.pause(); updateSoundLabel(); }
  }else if(musicWanted){
    startMusic();
  }
});
enterBtn.addEventListener('click',function(e){ e.stopPropagation(); openCard(); });
entrance.addEventListener('click',function(e){
  if(!opened&&e.target!==gateSound&&!gateSound.contains(e.target)) openCard();
});

(function(){
  var row=document.getElementById('kiteRow');
  if(!row) return;
  var btns=[].slice.call(row.querySelectorAll('.kiteBtn'));
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      if(dateUnlocked) return;
      if(b.classList.contains('lit')) return;
      b.classList.add('lit');
      b.setAttribute('aria-label','Kite launched');
      if(btns.every(function(x){ return x.classList.contains('lit'); })) unlockDate();
    });
  });
})()

document.addEventListener('click',closeCals);

function openMap(){
  if(mapOpen) return;
  mapOpen=true;
  mapTrigger=document.activeElement;
  renderMap();
  mapModal.hidden=false;
  requestAnimationFrame(function(){ mapModal.classList.add('on'); });
  document.body.classList.add('map-open');
  mapBtn.setAttribute('aria-expanded','true');
  try{ window.parent.postMessage({type:'niru:map-open'},location.origin); }catch(_){}
  setTimeout(function(){ mapClose.focus(); },120);
}
function closeMap(){
  if(!mapOpen) return;
  mapOpen=false;
  mapModal.classList.remove('on');
  document.body.classList.remove('map-open');
  mapBtn.setAttribute('aria-expanded','false');
  try{ window.parent.postMessage({type:'niru:map-close'},location.origin); }catch(_){}
  setTimeout(function(){ if(!mapOpen) mapModal.hidden=true; },380);
  if(mapTrigger&&mapTrigger.focus) mapTrigger.focus();
}
function goTo(id){
  closeMap();
  setTimeout(function(){
    var t=document.getElementById(id);
    if(t) t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  },260);
}
mapBtn.addEventListener('click',openMap);
mapClose.addEventListener('click',closeMap);
mapModal.addEventListener('click',function(e){ if(e.target===mapModal) closeMap(); });
mapModal.addEventListener('keydown',function(e){
  if(e.key==='Escape'){ closeMap(); return; }
  if(e.key!=='Tab') return;
  var f=[].slice.call(mapModal.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"])'));
  if(!f.length) return;
  var first=f[0], last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
});
mapStops.addEventListener('click',function(e){
  var b=e.target.closest('[data-target]');
  if(b) goTo(b.dataset.target);
});
mapEvents.addEventListener('click',function(e){
  var b=e.target.closest('[data-target]');
  if(b) goTo(b.dataset.target);
});
document.querySelector('.dockRsvp').addEventListener('click',function(e){
  e.preventDefault();
  document.getElementById('rsvp').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
});

(function(){
  var steps=[100,112,125], base=16;
  var i=+(localStorage.getItem('basant-tsz')||0);
  if(i<0||i>=steps.length) i=0;
  function apply(){
    document.documentElement.style.fontSize=(base*steps[i]/100).toFixed(2)+'px';
    document.documentElement.style.setProperty('--ds',(100/steps[i]).toFixed(4));
    tszFab.title='Text size '+steps[i]+'%';
    tszFab.setAttribute('aria-label','Text size '+steps[i]+' percent');
    tszFab.classList.toggle('on',i>0);
  }
  tszFab.addEventListener('click',function(){
    i=(i+1)%steps.length;
    localStorage.setItem('basant-tsz',i);
    apply();
  });
  apply();
})();

langFab.addEventListener('click',function(){ setLang(LANG==='ur'?'en':'ur'); });

rsvpForm.addEventListener('submit',function(e){
  e.preventDefault();
  rsvpYes=EVENTS.some(function(v){
    var r=rsvpForm.querySelector('input[name="att_'+v.key+'"]:checked');
    return r&&r.value==='yes';
  });
  var endpoint='';
  if(endpoint.indexOf('http')===0){
    fetch(endpoint,{method:'POST',body:new FormData(rsvpForm)}).catch(function(){});
  }
  submitted=true;
  rsvpSheet.classList.add('sent');
  showThanks();
  if(!reduce&&window.NiruCelebrate){
    NiruCelebrate(false,{colors:['#D9863B','#E9B44C','#1F3A44','#F7F3E9','#5E8C82'],count:38,duration:4400});
  }
});

var lastScrollY=window.scrollY;
window.addEventListener('scroll',function(){
  var y=window.scrollY;
  if(y>lastScrollY+6&&y>140) phoneWrap.classList.add('fabs-hidden');
  else if(y<lastScrollY-6||y<80) phoneWrap.classList.remove('fabs-hidden');
  lastScrollY=y;
},{passive:true});

bgm.volume=0;
setInterval(tickCountdown,1000);
updateSoundLabel();
setLang(LANG);
tickCountdown();
startMusic();
});
