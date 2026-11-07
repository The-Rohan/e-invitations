/* Niru first-party funnel analytics.
   Records anonymous journey events only: never field values, names, contact details,
   photos, payment data or invitation content. */
(function(root){
  'use strict';
  var META_PIXEL_ID='1060062783239176';

  /* Meta Pixel base code. No customer form fields or personal details are sent. */
  (function(f,b,e,v,n,t,s){
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
  })(root,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  root.fbq('init',META_PIXEL_ID);
  root.fbq('track','PageView');

  var ENDPOINT='https://script.google.com/macros/s/AKfycby-6OW_FvI4w6u6lDYCCh_YDxvBzV440GewP311PeTS1q_XX2_DBvfDBsIrWzHDF50zRQ/exec';
  var KEY='niru_visit_session', session='';
  try{
    session=localStorage.getItem(KEY)||'';
    if(!session){ session=(root.crypto&&crypto.randomUUID)?crypto.randomUUID():('nv-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)); localStorage.setItem(KEY,session); }
  }catch(_){ session='nv-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2); }

  function safe(v,n){ return String(v==null?'':v).replace(/[\r\n\t]/g,' ').slice(0,n||160); }
  function device(){ var w=root.innerWidth||0; return w<600?'Mobile':w<1024?'Tablet':'Desktop'; }
  function page(){ return location.pathname.split('/').pop()||'home'; }
  function slugFromPage(){
    var m=page().match(/^(?:demo-|design-)(.+?)(?:\.html)?$/); if(m) return m[1];
    var q=new URLSearchParams(location.search).get('tpl'); return q||'';
  }
  function source(){
    try{ if(!document.referrer) return 'Direct'; var u=new URL(document.referrer); return u.hostname===location.hostname?'Internal':u.hostname; }
    catch(_){ return 'Direct'; }
  }
  function campaign(){ var q=new URLSearchParams(location.search); return [q.get('utm_source'),q.get('utm_medium'),q.get('utm_campaign')].filter(Boolean).join(' / '); }
  function tierFor(slug){ return root.NIRU_CATALOG&&NIRU_CATALOG.bySlug[slug]?NIRU_CATALOG.bySlug[slug].tier:''; }
  function metaTrack(event,extra){
    if(!root.fbq)return; extra=extra||{};
    var design=safe(extra.design||slugFromPage(),60),tier=safe(extra.tier||tierFor(design),30);
    var common={content_name:design||'Niru invitation',content_category:tier||'invitation',content_type:'product'};
    if(design) common.content_ids=[design];
    if(event==='demo_open') root.fbq('track','ViewContent',common);
    else if(event==='order_started') root.fbq('track','InitiateCheckout',common);
    else if(event==='whatsapp_lead') root.fbq('track','Contact',common);
    else if(event==='order_confirmed'){
      var amount=Number(extra.value);
      if(isFinite(amount)&&amount>0){
        common.value=amount; common.currency='PKR'; common.order_id=safe(extra.orderId,30);
        /* The form creates an unpaid order, so this is a Lead. The Apps Script
           sends the real Purchase only when the studio confirms payment. */
        root.fbq('track','Lead',common,{eventID:'niru-lead-'+safe(extra.orderId,30).toLowerCase()});
      }
    }
  }
  function track(event,extra){
    extra=extra||{};
    metaTrack(event,extra);
    var body={action:'track',session:session,event:safe(event,40),page:safe(page(),160),
      design:safe(extra.design||slugFromPage(),60),tier:safe(extra.tier||tierFor(extra.design||slugFromPage()),30),
      orderId:safe(extra.orderId,30),value:safe(extra.value,100),referrer:safe(source(),180),
      campaign:safe(campaign(),100),device:device(),viewport:(root.innerWidth||0)+'x'+(root.innerHeight||0)};
    if(location.protocol==='file:') return Promise.resolve({ok:false,local:true});
    return fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body),keepalive:true})
      .then(function(r){return r.text();}).then(function(t){try{return JSON.parse(t);}catch(_){return {ok:false};}}).catch(function(){return {ok:false};});
  }
  root.NiruAnalytics={track:track,session:session};

  function installWhatsAppButton(){
    var current=page().replace(/\.html$/,'');
    if(/^\/inv(?:\/|$)/.test(location.pathname)||/^(?:demo-|card-)/.test(current)||current==='dashboard'||document.querySelector('[data-niru-whatsapp],[data-niru-no-whatsapp]')) return;
    var style=document.createElement('style');
    style.textContent='.niru-wa-float{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:calc(var(--niru-wa-actionbar-offset,0px) + max(18px,env(safe-area-inset-bottom)));width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#1f7654;color:#fffaf0;border:1px solid rgba(210,181,118,.9);box-shadow:0 8px 24px rgba(41,27,23,.24),0 2px 7px rgba(41,27,23,.18);z-index:9998;text-decoration:none;transition:bottom .2s ease,transform .2s ease,box-shadow .2s ease,background .2s ease;-webkit-tap-highlight-color:transparent}.niru-wa-float:hover{transform:translateY(-2px) scale(1.035);background:#176646;box-shadow:0 11px 28px rgba(41,27,23,.3),0 3px 8px rgba(41,27,23,.18)}.niru-wa-float:focus-visible{outline:3px solid #fffaf0;outline-offset:3px}.niru-wa-float svg{width:29px;height:29px;display:block}@media(max-width:600px){.niru-wa-float{width:54px;height:54px;right:max(14px,env(safe-area-inset-right));bottom:calc(var(--niru-wa-actionbar-offset,0px) + max(14px,env(safe-area-inset-bottom)))}.niru-wa-float svg{width:27px;height:27px}}@media(prefers-reduced-motion:reduce){.niru-wa-float{transition:none}}';
    document.head.appendChild(style);
    var link=document.createElement('a');
    link.className='niru-wa-float';
    link.setAttribute('data-niru-whatsapp','');
    link.href='https://wa.me/923213397889?text='+encodeURIComponent('Assalam o Alaikum, I would like to know more about Niru digital wedding invitations.');
    link.target='_blank';
    link.rel='noopener';
    link.setAttribute('aria-label','Chat with Niru on WhatsApp');
    link.title='Chat with Niru on WhatsApp';
    link.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2C6.55 2 2.1 6.45 2.1 11.93c0 1.75.46 3.45 1.34 4.94L2 22l5.27-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.48 0 9.93-4.45 9.93-9.93a9.85 9.85 0 0 0-2.92-6.96zM12.04 20.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.23 8.23 0 0 1-1.27-4.39c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.27.85 5.82 2.4a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.21 8.23zm4.51-6.17c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.17.25-.64.8-.79.96-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.38.11-.5.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.45.06-.69.32-.24.25-.9.88-.9 2.15 0 1.27.92 2.49 1.05 2.66.13.17 1.8 2.75 4.37 3.85.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.17.21-.57.21-1.06.15-1.17-.06-.1-.23-.16-.48-.29z"/></svg>';
    document.body.appendChild(link);
    var actionbar=document.querySelector('.actionbar');
    if(actionbar){
      var positionAboveActionbar=function(){
        link.style.setProperty('--niru-wa-actionbar-offset',Math.ceil(actionbar.getBoundingClientRect().height)+'px');
      };
      positionAboveActionbar();
      root.addEventListener('resize',positionAboveActionbar);
      if(root.ResizeObserver) new ResizeObserver(positionAboveActionbar).observe(actionbar);
    }
  }

  function ready(){
    var slug=slugFromPage();
    installWhatsAppButton();
    track('page_view',{design:slug,tier:tierFor(slug)});
    if(/^demo-/.test(page())) track('demo_open',{design:slug,tier:tierFor(slug)});
    if(/^design-/.test(page())) track('design_view',{design:slug,tier:tierFor(slug)});
    if(page().replace(/\.html$/,'')==='order') track('order_started',{design:slug,tier:tierFor(slug)});

    var catalog=document.getElementById('designs');
    if(catalog&&root.IntersectionObserver){ var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){track('catalog_view');co.disconnect();}});},{threshold:.25});co.observe(catalog); }
    var seen={};
    if(root.IntersectionObserver){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var a=e.target.querySelector('a[href*="tpl="]'),s=a?new URL(a.href,location.href).searchParams.get('tpl'):'';if(s&&!seen[s]){seen[s]=1;track('design_view',{design:s,tier:tierFor(s)});}io.unobserve(e.target);});},{threshold:.55});
      document.querySelectorAll('.tpl').forEach(function(el){io.observe(el);});
    }
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a'); if(!a)return; var href=a.getAttribute('href')||'';
      if(href.indexOf('wa.me/')>=0) track('whatsapp_lead',{design:slug,tier:tierFor(slug)});
      var m=href.match(/[?&]tpl=([^&#]+)/); if(m){var s=decodeURIComponent(m[1]);track((s.indexOf('personalised-')===0?'personalised_selected':'design_selected'),{design:s,tier:tierFor(s)});}
    },true);
  }
  root.addEventListener('error',function(e){ track('javascript_error',{value:safe(e.message||'Script error',80)}); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready); else setTimeout(ready,0);
})(window);
