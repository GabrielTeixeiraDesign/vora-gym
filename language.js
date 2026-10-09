(() => {
 const dictionary = window.VORA_TRANSLATIONS;
 const supported = ['pt','en','es'];
 let language = 'pt';
 try { language = localStorage.getItem('vora-language') || 'pt'; } catch {}
 const requested = new URL(location.href).searchParams.get('lang');
 if (supported.includes(requested)) language = requested;
 if (!supported.includes(language)) language = 'pt';
 const originals = new WeakMap();
 const normalize = text => text.trim().replace(/\s+/g, ' ');
 function translate(text) {
  if (language === 'pt') return text;
  if (dictionary[text]) return dictionary[text][language];
  let match = text.match(/^Mostrar (.+)$/);
  if (match) { const room = 'Sala de ' + match[1].replace(/^sala de /,''); return (language==='en'?'Show ':'Mostrar ') + (dictionary[room]?.[language] || match[1]); }
  match = text.match(/^Equipamento (superior|inferior) (\d+)$/);
  if (match) return (language==='en' ? (match[1]==='superior'?'Upper body equipment ':'Lower body equipment ') : (match[1]==='superior'?'Equipo de tren superior ':'Equipo de tren inferior ')) + match[2];
  if (text.endsWith(' — equipe VORA')) return text.replace(' — equipe VORA',language==='en'?' — VORA team':' — equipo VORA');
  return text;
 }
 function updateValue(node, key, current, write) {
  let record = originals.get(node);
  if (!record) {record={};originals.set(node,record);}
  if (!record[key] || record[key].last !== current) record[key] = {source:current,last:current};
  const value = record[key];
  const source = normalize(value.source);
  const translated = translate(source);
  const next = value.source.replace(value.source.trim(), translated);
  if (next !== current) write(next);
  value.last = next;
 }
 const observer = new MutationObserver(() => apply());
 function apply() {
  observer.disconnect();
  document.documentElement.lang = {pt:'pt-BR',en:'en',es:'es'}[language];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  let node;
  while ((node=walker.nextNode())) {
   if (!node.textContent.trim() || node.parentElement?.closest('script,style,[data-language-control]')) continue;
   updateValue(node,'text',node.textContent,value=>node.textContent=value);
  }
  document.querySelectorAll('[aria-label],[alt],meta[name="description"]').forEach(element=>{
   if (element.closest('[data-language-control]')) return;
   for (const attr of ['aria-label','alt', ...(element.matches('meta')?['content']:[])]) {
    if (element.hasAttribute(attr)) updateValue(element,attr,element.getAttribute(attr),value=>element.setAttribute(attr,value));
   }
  });
  document.querySelectorAll('a[href]').forEach(link=>{
   const url = new URL(link.getAttribute('href'),location.href);
   if (url.origin!==location.origin || !/\.html$/.test(url.pathname)) return;
   url.searchParams.set('lang',language);
   link.setAttribute('href',url.pathname.split('/').pop()+url.search+url.hash);
  });
  toggle.setAttribute('aria-label',translate('Escolher idioma'));
  panel.setAttribute('aria-label',translate('Escolher idioma'));
  document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 const toggle = document.querySelector('.language-toggle');
 const panel = document.querySelector('.language-panel');
 const wrapper = document.querySelector('.language-selector');
 function close(focus=false){wrapper.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');panel.inert=true;if(focus)toggle.focus();}
 toggle.addEventListener('click',()=>{
  const open=toggle.getAttribute('aria-expanded')!=='true';
  wrapper.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));panel.inert=!open;
 });
 document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{
  language=button.dataset.lang;
  try{localStorage.setItem('vora-language',language);}catch{}
  const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
  apply();close(true);
 }));
 document.addEventListener('click',event=>{if(!wrapper.contains(event.target))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape' && wrapper.classList.contains('is-open')){event.preventDefault();close(true);}});
 wrapper.addEventListener('focusout',event=>{if(!wrapper.contains(event.relatedTarget))close();});
 addEventListener('pageshow',()=>{close();apply();});
 apply();
})();
