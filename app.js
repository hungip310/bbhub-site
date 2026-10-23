(function(){
  var LANGS=['zh-Hant','zh-Hans','en'];
  var $=function(s){return document.querySelector(s)};
  var $$=function(s){return document.querySelectorAll(s)};
  var lang=localStorage.getItem('bbhub_lang');
  if(LANGS.indexOf(lang)<0){
    var n=(navigator.language||'').toLowerCase();
    lang=n.indexOf('zh')===0?(/hans|cn|sg/.test(n)?'zh-Hans':'zh-Hant'):(n?'en':'zh-Hant');
  }

  function setLang(l){
    lang=l;localStorage.setItem('bbhub_lang',l);
    var d=I18N[l];
    document.documentElement.lang=l;
    document.title=d['meta.title'];
    $('meta[name=description]').setAttribute('content',d['meta.desc']);
    $$('[data-i18n]').forEach(function(e){e.textContent=d[e.dataset.i18n]});
    $$('[data-i18n-html]').forEach(function(e){e.innerHTML=d[e.dataset.i18nHtml]});
    $('#policy').innerHTML=POLICY[l];
    $('#terms-body').innerHTML=TERMS[l];
    $$('#lang button').forEach(function(b){b.classList.toggle('on',b.dataset.lang===l)});
  }
  $$('#lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang)})});

  var pages=$$('.page'),links=$$('#nav a');
  function show(){
    var id=location.hash.slice(1),el=document.getElementById(id);
    if(!el||!el.classList.contains('page'))id='home';
    pages.forEach(function(p){p.classList.toggle('active',p.id===id)});
    links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',show);

  var KEY='bbhub_cookie_consent',banner=$('#cookie-banner'),modal=$('#cookie-modal');
  var boxes={perf:$('#ck-perf'),func:$('#ck-func'),tgt:$('#ck-tgt')};
  function save(c){localStorage.setItem(KEY,JSON.stringify(c));banner.hidden=true;modal.hidden=true}
  function all(v){return {necessary:true,perf:v,func:v,tgt:v}}
  function openModal(){
    var c={};try{c=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
    boxes.perf.checked=!!c.perf;boxes.func.checked=!!c.func;boxes.tgt.checked=!!c.tgt;
    modal.hidden=false;
  }
  $('#ck-accept').onclick=$('#ck-acceptall2').onclick=function(){save(all(true))};
  $('#ck-reject').onclick=function(){save(all(false))};
  $('#ck-save').onclick=function(){save({necessary:true,perf:boxes.perf.checked,func:boxes.func.checked,tgt:boxes.tgt.checked})};
  $('#ck-settings').onclick=openModal;
  $('#ck-close').onclick=function(){modal.hidden=true};
  modal.addEventListener('click',function(e){if(e.target===modal)modal.hidden=true});
  $('#open-cookie').onclick=function(e){e.preventDefault();openModal()};
  banner.hidden=!!localStorage.getItem(KEY);

  setLang(lang);
  show();
})();
