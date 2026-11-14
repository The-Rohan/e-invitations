window.NiruBoot.run(function(){
'use strict';

(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var phoneWrap=document.getElementById('phoneWrap'), entrance=document.getElementById('entrance'),
      hero=document.getElementById('hero'), bgm=document.getElementById('bgm'),
      musicFab=document.getElementById('musicFab'), langFab=document.getElementById('langFab'),
      tszFab=document.getElementById('tszFab');
  var opened=false, lang=localStorage.getItem('riwaj-lang')||'en';
  document.body.classList.add('locked');

  var hasFilm=true;
  document.getElementById('gateVid').querySelector('source').addEventListener('error',function(){ hasFilm=false; });

  var EVENTS=[
    { key:'mehndi', name:{en:'Mehndi',ur:'مہندی'},
      kind:{en:'The first evening',ur:'پہلی شام'},
      day:'11', mon:{en:'June',ur:'جون'}, yr:'2027',
      wd:{en:'Friday',ur:'جمعہ'}, hr:{en:'7:00 PM',ur:'شام سات بجے'},
      blurb:{en:'Marigold arches, the dholak out, and everybody in earth tones.',
             ur:'گیندے کے گنبد، ڈھولک کی تھاپ، اور ہر کوئی مٹیالے رنگوں میں۔'},
      venue:{en:'Gulistan Bagh',ur:'گلستان باغ'},
      addr:{en:'Rawalakot, Azad Kashmir',ur:'راولاکوٹ، آزاد کشمیر'},
      q:'Rawalakot+Azad+Kashmir', pardah:false,
      ics:{t:'Mehndi — Bilal & Mahrukh', s:'20270611T140000Z', e:'20270611T190000Z',
           loc:'Gulistan Bagh, Rawalakot, Azad Kashmir'} },

    { key:'baraat', name:{en:'Baraat &amp; Nikah',ur:'بارات و نکاح'},
      kind:{en:'The wedding day',ur:'شادی کا دن'},
      day:'12', mon:{en:'June',ur:'جون'}, yr:'2027',
      wd:{en:'Saturday',ur:'ہفتہ'}, hr:{en:'5:00 PM',ur:'شام پانچ بجے'},
      blurb:{en:'The nikah is read as the light settles gold over the hills.',
             ur:'نکاح اُس وقت پڑھایا جائے گا جب سورج پہاڑوں پر سنہری ہو۔'},
      venue:{en:'Banjosa Lake Lawn',ur:'بنجوسہ جھیل لان'},
      addr:{en:'Banjosa, Rawalakot',ur:'بنجوسہ، راولاکوٹ'},
      q:'Banjosa+Lake+Rawalakot', pardah:true,
      ics:{t:'Baraat & Nikah — Bilal & Mahrukh', s:'20270612T120000Z', e:'20270612T180000Z',
           loc:'Banjosa Lake Lawn, Rawalakot, Azad Kashmir'} },

    { key:'walima', name:{en:'Walima',ur:'ولیمہ'},
      kind:{en:'The last evening',ur:'آخری شام'},
      day:'13', mon:{en:'June',ur:'جون'}, yr:'2027',
      wd:{en:'Sunday',ur:'اتوار'}, hr:{en:'8:00 PM',ur:'رات آٹھ بجے'},
      blurb:{en:'A quiet evening on the terrace to close the week.',
             ur:'ہفتے کے اختتام پر تراس پر سکون بھری شام۔'},
      venue:{en:'Toli Peer Terrace',ur:'ٹولی پیر ٹیرس'},
      addr:{en:'Above Rawalakot',ur:'راولاکوٹ سے اوپر'},
      q:'Toli+Peer+Rawalakot', pardah:false,
      ics:{t:'Walima — Bilal & Mahrukh', s:'20270613T150000Z', e:'20270613T200000Z',
           loc:'Toli Peer, Rawalakot, Azad Kashmir'} }
  ];

  var REVEAL=[{en:'12',ur:'۱۲'},{en:'Jun',ur:'جون'},{en:'2027',ur:'۲۰۲۷'}];
  var tileBs=[];

  var STR={
    thanksT:{en:'Thank you',ur:'بہت شکریہ'},
    missT:{en:'We’ll miss you',ur:'آپ کی کمی رہے گی'},
    thanksM:{en:'Your presence is the best gift we could receive.',
             ur:'آپ کا آنا ہی ہمارے لیے سب سے بڑا تحفہ ہے۔'},
    missM:{en:'Thank you for letting us know. You’ll be in our duas that day.',
           ur:'بتا دینے کا شکریہ۔ اُس دن آپ ہماری دعاؤں میں ضرور ہوں گے۔'},
    yes:{en:'Yes, I’ll be there',ur:'جی، آ رہے ہیں'},
    no:{en:'Sorry, I can’t make it',ur:'معذرت، نہیں آ سکیں گے'},
    guests:{en:'Guests',ur:'کتنے لوگ'},
    open:{en:'View on maps',ur:'میپ پر دیکھیں'},
    cal:{en:'Add to calendar',ur:'کیلنڈر میں سیو کریں'},
    gcal:{en:'Google Calendar',ur:'گوگل کیلنڈر'}, apple:{en:'Apple / iPhone',ur:'آئی فون / ایپل'},
    pardah:{en:'Separate seating for ladies &amp; gents',
            ur:'خواتین اور مردوں کے لیے الگ انتظام'}
  };

  function setLang(l){
    lang=l; localStorage.setItem('riwaj-lang',l);
    document.getElementById('phone').classList.toggle('urdu', l==='ur');
    document.documentElement.lang=l;
    document.querySelectorAll('[data-ur]').forEach(function(el){
      if(!el.dataset.ur) return;
      if(el.dataset.en===undefined) el.dataset.en=el.innerHTML;
      el.innerHTML = l==='ur'? el.dataset.ur : el.dataset.en;
    });
    document.querySelectorAll('[data-ur-ph]').forEach(function(el){
      if(el.dataset.enPh===undefined) el.dataset.enPh=el.placeholder;
      el.placeholder = l==='ur'? el.dataset.urPh : el.dataset.enPh;
    });
    langFab.textContent = l==='ur'?'EN':'اردو';
    /* swap seal values in place — re-rendering would reset hold progress */
    tileBs.forEach(function(b,i){ b.textContent=REVEAL[i][l]; });
  }

  var UD='۰۱۲۳۴۵۶۷۸۹';
  function num(v){ return lang==='ur' ? String(v).replace(/[0-9]/g,function(d){ return UD[+d]; }) : v; }
  function sep(){ return lang==='ur' ? '، ' : ' &middot; '; }

  var musicOn=false;
  function fadeTo(target,ms){
    var from=bgm.volume, t0=performance.now();
    (function step(t){
      var k=Math.max(0,Math.min(1,(t-t0)/ms));
      bgm.volume=Math.max(0,Math.min(1, from+(target-from)*k));
      if(k<1) requestAnimationFrame(step); else if(target===0) bgm.pause();
    })(t0);
  }
  function musicStart(){
    musicOn=true; musicFab.classList.remove('muted'); bgm.volume=0;
    var r; try{ r=bgm.play(); }catch(e){ r=null; }
    if(r&&r.then){
      r.then(function(){ fadeTo(.6,2600); })
       .catch(function(){ musicOn=false; musicFab.classList.add('muted'); });
    }
  }
  musicFab.addEventListener('click',function(){
    if(musicOn){ musicOn=false; musicFab.classList.add('muted'); fadeTo(0,600); }
    else{ musicOn=true; musicFab.classList.remove('muted'); var r=bgm.play(); if(r&&r.catch) r.catch(function(){ musicOn=false; musicFab.classList.add('muted'); }); fadeTo(.6,900); }
  });
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){ if(musicOn) bgm.pause(); } else if(musicOn){ var r=bgm.play(); if(r&&r.catch) r.catch(function(){}); }
  });

  /* ================= ENTRANCE =================
     Motion stops at 8.5 s (freezedetect: three holds from 8.5 to the end of the 10 s
     clip) and SSIM against hero.jpg plateaus ~0.61 before that, so the handoff fires
     while the last of the motion is still moving — 8.35 s. The film must never trap
     the guest: play failure, ended, or a source error all fall through to land(). */
  var HANDOFF=8.35;
  function land(){
    hero.classList.add('entered');
    document.body.classList.remove('locked');
    setTimeout(function(){ phoneWrap.classList.add('ui-on'); }, 500);
  }
  function openCard(){
    if(opened) return; opened=true;
    musicStart();
    if(!hasFilm){ entrance.classList.add('gone'); land(); return; }
    entrance.classList.add('playing');
    var p=window.NiruBoot.play(document.getElementById('gateVid'));
    if(p && p.catch) p.catch(function(){ entrance.classList.add('gone'); land(); });
    var done=false;
    function finish(){
      if(done) return; done=true;
      entrance.classList.add('fade');
      setTimeout(land, 250);
      setTimeout(function(){ entrance.classList.add('gone'); }, 1300);
    }
    (function watch(){
      if(done) return;
      if(document.getElementById('gateVid').currentTime >= HANDOFF) return finish();
      requestAnimationFrame(watch);
    })();
    document.getElementById('gateVid').addEventListener('ended', finish);
  }
  document.getElementById('enterBtn').addEventListener('click',openCard);
  entrance.addEventListener('click',function(e){ if(!opened && e.target!==document.getElementById('enterBtn')) openCard(); });

  var io=new IntersectionObserver(function(en){ en.forEach(function(x){
    if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });},
    {root:null, threshold:.1});
  function observeAll(){ document.querySelectorAll('.rv:not(.in)').forEach(function(el){ io.observe(el); }); }
  function stagger(){
    document.querySelectorAll('.rv').forEach(function(block){
      var kids=[].slice.call(block.children);
      if(!kids.length){ block.classList.add('stag'); return; }
      kids.forEach(function(k,i){
        if(!k.classList.contains('stag')) k.classList.add('stag');
        k.style.transitionDelay=(i*0.1).toFixed(2)+'s';
      });
    });
  }

  var POP={colors:['#3D2B33','#8A3B4A','#C08A3E','#F5EFE4'],count:42,duration:4200};

  function gcal(v){ return 'https://calendar.google.com/calendar/render?action=TEMPLATE'+
    '&text='+encodeURIComponent(v.ics.t)+'&dates='+v.ics.s+'/'+v.ics.e+
    '&location='+encodeURIComponent(v.ics.loc)+
    '&details='+encodeURIComponent('With love — Bilal & Mahrukh'); }
  function icsHref(v){
    var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WEDINVITE//Riwaj//EN','BEGIN:VEVENT',
      'UID:'+v.ics.s+'@wedinvite.pk','DTSTART:'+v.ics.s,'DTEND:'+v.ics.e,'SUMMARY:'+v.ics.t,
      'LOCATION:'+v.ics.loc.replace(/,/g,'\\,'),'END:VEVENT','END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
  }
  document.addEventListener('click',function(){
    document.querySelectorAll('.calpop.on').forEach(function(x){ x.classList.remove('on'); }); });

  function renderEvents(){
    var host=document.getElementById('evGrid'), SEP=sep(); host.innerHTML='';
    EVENTS.forEach(function(v){
      var d=document.createElement('div'); d.className='ev';
      d.innerHTML='<div class="evPlaque">'+
          '<i class="mk" aria-hidden="true"></i>'+
          '<div class="kind">'+v.kind[lang]+'</div>'+
          '<h3>'+v.name[lang]+'</h3>'+
          '<div class="vn">'+v.venue[lang]+'</div>'+
          '<div class="vn sm">'+v.addr[lang]+'</div>'+
          '<div class="hair"></div>'+
          '<div class="dt">'+num(v.day)+' '+v.mon[lang]+' '+num(v.yr)+SEP+v.wd[lang]+'</div>'+
          '<div class="hr">'+v.hr[lang]+'</div>'+
          '<div class="vn sm" style="margin-top:14px">'+v.blurb[lang]+'</div>'+
          (v.pardah?'<div class="pardah">'+STR.pardah[lang]+'</div>':'')+
        '</div>'+
        '<div class="btnrow">'+
            '<a class="btn" target="_blank" rel="noopener" '+
              'href="https://www.google.com/maps/search/?api=1&query='+v.q+'">'+STR.open[lang]+'</a>'+
            '<span class="calwrap"><button class="btn caltoggle" type="button">'+STR.cal[lang]+'</button>'+
              '<div class="calpop">'+
                '<a target="_blank" rel="noopener" href="'+gcal(v)+'">'+STR.gcal[lang]+'</a>'+
                '<a href="'+icsHref(v)+'" download="'+v.ics.t.replace(/[^\w]+/g,'-')+'.ics">'+STR.apple[lang]+'</a>'+
              '</div></span>'+
        '</div>';
      var tg=d.querySelector('.caltoggle'), pop=d.querySelector('.calpop');
      tg.addEventListener('click',function(e){ e.stopPropagation();
        var was=pop.classList.contains('on');
        document.querySelectorAll('.calpop.on').forEach(function(x){ x.classList.remove('on'); });
        if(!was) pop.classList.add('on'); });
      pop.addEventListener('click',function(e){ e.stopPropagation(); });
      host.appendChild(d);
    });
  }

  function renderRsvpEvents(){
    var host=document.getElementById('rsvpEvents'); host.innerHTML='';
    EVENTS.forEach(function(v){
      var d=document.createElement('div'); d.className='evBlk';
      d.innerHTML='<div class="en">'+v.name[lang]+'</div>'+
        '<label class="opt"><input type="radio" name="att_'+v.key+'" value="yes" checked/>'+
          '<i class="dia"></i><span>'+STR.yes[lang]+'</span></label>'+
        '<label class="opt"><input type="radio" name="att_'+v.key+'" value="no"/>'+
          '<i class="dia"></i><span>'+STR.no[lang]+'</span></label>'+
        '<div class="cnt"><label>'+STR.guests[lang]+'</label>'+
          '<button type="button" data-step="-1" aria-label="One fewer guest">&minus;</button>'+
          '<output>2</output>'+
          '<button type="button" data-step="1" aria-label="One more guest">+</button>'+
          '<input type="hidden" name="guests_'+v.key+'" value="2"/></div>';
      var out=d.querySelector('output'), hid=d.querySelector('input[type=hidden]');
      d.querySelectorAll('.cnt button').forEach(function(b){
        b.addEventListener('click',function(){
          var n=Math.max(1,Math.min(10,(+hid.value)+(+b.dataset.step)));
          hid.value=n; out.textContent=n;
        });
      });
      host.appendChild(d);
    });
  }

  (function(){
    var target=new Date('2027-06-12T17:00:00+05:00').getTime();
    var dEl=document.getElementById('cdD'), hEl=document.getElementById('cdH'),
        mEl=document.getElementById('cdM'), sEl=document.getElementById('cdS');
    if(!dEl||!hEl||!mEl||!sEl) return;
    function pad(n){ return (n<10?'0':'')+n; }
    function tick(){
      var g=Math.max(0, target-Date.now()), s=Math.floor(g/1000);
      dEl.textContent=num(pad(Math.floor(s/86400)));
      hEl.textContent=num(pad(Math.floor(s%86400/3600)));
      mEl.textContent=num(pad(Math.floor(s%3600/60)));
      sEl.textContent=num(pad(s%60));
    }
    tick(); setInterval(tick,1000);
  })();

  (function(){
    var STEPS=[100,112,125], base=16;
    var i=+(localStorage.getItem('riwaj-tsz')||0); if(i<0||i>=STEPS.length) i=0;
    var btn=tszFab;
    function apply(){
      document.documentElement.style.fontSize=(base*STEPS[i]/100).toFixed(2)+'px';
      document.documentElement.style.setProperty('--ds',(100/STEPS[i]).toFixed(4));
      btn.title='Text size '+STEPS[i]+'%';
      btn.setAttribute('aria-label','Text size '+STEPS[i]+' percent');
      btn.classList.toggle('on', i>0);
    }
    btn.addEventListener('click',function(){
      i=(i+1)%STEPS.length; localStorage.setItem('riwaj-tsz',i);
      var centerFrac=(window.scrollY+window.innerHeight/2)/document.body.scrollHeight;
      apply();
      window.scrollTo({top: centerFrac*document.body.scrollHeight-window.innerHeight/2, behavior:'auto'});
    });
    apply();
  })();

  (function(){
    var btn=document.getElementById('nextBtn');
    if(!btn) return;
    btn.addEventListener('click',function(){
      btn.classList.add('press'); setTimeout(function(){ btn.classList.remove('press'); },320);
      window.scrollTo({top: window.scrollY+window.innerHeight*0.8, behavior: reduce?'auto':'smooth'});
    });
    window.addEventListener('scroll',function(){
      btn.classList.toggle('atEnd', window.scrollY+window.innerHeight >= document.body.scrollHeight-40);
    },{passive:true});
  })();

  (function(){
    var RSVP_ENDPOINT='';
    var card=document.getElementById('rsvpCard'), form=document.getElementById('rsvpForm');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var yes=EVENTS.some(function(v){
        var r=form.querySelector('input[name="att_'+v.key+'"]:checked');
        return r && r.value==='yes'; });
      if(RSVP_ENDPOINT.indexOf('http')===0){
        fetch(RSVP_ENDPOINT,{method:'POST',body:new FormData(form)}).catch(function(){});
      }
      document.getElementById('doneTitle').innerHTML = yes?STR.thanksT[lang]:STR.missT[lang];
      document.getElementById('doneMsg').innerHTML   = yes?STR.thanksM[lang]:STR.missM[lang];
      card.classList.add('sent');
      if(!reduce&&window.NiruCelebrate){ NiruCelebrate(false,{colors:['#3D2B33','#8A3B4A','#C08A3E','#F5EFE4'],count:36,duration:4000}); }
    });
  })();

  /* ================= REVEAL — hold to ink =================
     Three wax-covered seal tiles. Hold each ~0.8 s: the wax cover's opacity is tied
     to --wax (0..1) while a rAF timer runs under the pointer; releasing early cools
     the wax back a little. All three inked -> the line and the petal shower. */
  (function(){
    var host=document.getElementById('seals'), done=document.getElementById('revDone');
    if(!host||!done) return;
    var inked=0, HOLD=0.8;

    REVEAL.forEach(function(part){
      var tile=document.createElement('div');
      tile.className='sealTile';
      tile.setAttribute('role','button');
      tile.setAttribute('tabindex','0');
      tile.setAttribute('aria-label','Press and hold to ink the date');
      tile.innerHTML='<i class="wax"></i><i class="glaze"></i><b></b>';
      host.appendChild(tile); tileBs.push(tile.querySelector('b'));
      wire(tile);
    });

    function wire(tile){
      var hold=0, holding=false, raf=0, tPrev=0;
      function paint(){ tile.style.setProperty('--wax', hold.toFixed(3)); }
      function tick(now){
        if(!holding) return;
        var dt=tPrev?Math.min((now-tPrev)/1000,.1):0; tPrev=now;
        hold=Math.min(1, hold+dt/HOLD);
        paint();
        if(hold>=1){ holding=false; cancelAnimationFrame(raf); tile.classList.remove('holding'); complete(); return; }
        raf=requestAnimationFrame(tick);
      }
      function complete(){
        tile.classList.add('inked');
        if(++inked===REVEAL.length){
          done.classList.add('on');
          if(!reduce&&window.NiruCelebrate){ NiruCelebrate(false,POP); }
        }
      }
      function down(e){
        if(tile.classList.contains('inked')||holding) return;
        e.preventDefault();
        holding=true; tPrev=0;
        tile.classList.add('holding');
        raf=requestAnimationFrame(tick);
      }
      function cool(){
        if(!holding) return;
        holding=false; tPrev=0; cancelAnimationFrame(raf);
        tile.classList.remove('holding');
        hold=Math.max(0, hold-.2); paint();
      }
      tile.addEventListener('pointerdown',down);
      ['pointerup','pointerleave','pointercancel'].forEach(function(tp){
        tile.addEventListener(tp,cool);
      });
      tile.addEventListener('keydown',function(e){
        if(tile.classList.contains('inked')||holding) return;
        if(e.key===' '||e.key==='Enter'){ e.preventDefault(); down(e); }
      });
      tile.addEventListener('keyup',cool);
      if(reduce){
        tile.addEventListener('click',function(){
          if(!tile.classList.contains('inked')){ complete(); }
        });
      }
    }
  })();

  /* ================= THE WRITTEN NAMES =================
     Names type out a letter at a time once the hero enters; Urdu reveals word by
     word so ligatures never break. Re-run after every language swap. */
  var LETTER=0.075;
  function writeNames(){
    var t=0, ur=(lang==='ur');
    [document.getElementById('nm1'), document.getElementById('nm2')].forEach(function(el,idx){
      var txt = ur ? el.dataset.ur : el.dataset.en;
      if(idx===1) t+=0.30;
      var units = ur ? txt.split(/\s+/) : txt.split('');
      var step  = ur ? 0.26 : LETTER;
      var html='';
      for(var i=0;i<units.length;i++){
        var u = ur ? units[i] : (units[i]===' '?'&nbsp;':units[i]);
        html+='<i style="transition-delay:'+t.toFixed(3)+'s">'+u+'</i>';
        if(ur && i<units.length-1) html+=' ';
        t+=step;
      }
      el.innerHTML=html;
    });
    document.querySelector('.heroNames .amp').style.transitionDelay=
      Math.max(0, t - 0.30).toFixed(3)+'s';
  }

  function renderAll(){
    renderEvents(); renderRsvpEvents();
    stagger(); observeAll();
  }
  if(lang==='ur') setLang('ur'); else setLang('en');
  writeNames();
  renderAll();
  langFab.addEventListener('click',function(){ setLang(lang==='ur'?'en':'ur'); writeNames(); renderAll(); });
})();

});
