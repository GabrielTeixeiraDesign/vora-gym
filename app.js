const navigation = document.querySelector('#navigation');
const menuToggle = document.querySelector('.menu-toggle');
const menuDialog = document.querySelector('#menu-overlay');
const menuClose = document.querySelector('.menu-close');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let menuAnimation;
function openMenu() {
  stopSmoothScroll();
  menuAnimation?.cancel();
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-is-open');
  if (!menuDialog.open) menuDialog.showModal();
  menuClose.focus({preventScroll:true});
  if (!reducedMotion.matches) menuAnimation = menuDialog.animate(
    [{opacity:0,transform:'translateY(-20px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:420,easing:'cubic-bezier(.16,1,.3,1)'}
  );
}
function closeMenu(immediate = false) {
  if (!menuDialog.open) return;
  menuAnimation?.cancel();
  menuToggle.setAttribute('aria-expanded','false');
  const finish = () => {menuDialog.close();document.body.classList.remove('menu-is-open');};
  if (immediate || reducedMotion.matches) {finish();return;}
  menuAnimation = menuDialog.animate(
    [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-12px)'}],
    {duration:220,easing:'ease-out'}
  );
  menuAnimation.finished.then(finish).catch(() => {});
}
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', () => closeMenu());
menuDialog.addEventListener('cancel', event => {event.preventDefault();closeMenu();});
menuDialog.addEventListener('click', event => {if(event.target.closest('a[href]')) closeMenu(true);});
addEventListener('pageshow', event => {if(event.persisted) closeMenu(true);});
// Navegação real entre documentos, com fade como alternativa aos View Transitions.
if (!('CSSViewTransitionRule' in window)) {
  let leavingPage = false;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || destination.pathname === location.pathname || reducedMotion.matches) return;
    event.preventDefault();
    if (leavingPage) return;
    leavingPage = true;
    document.body.animate([{opacity:1},{opacity:0}], {duration:240,easing:'ease-in-out',fill:'forwards'});
    setTimeout(() => location.assign(destination.href), 240);
  });
  if (!reducedMotion.matches) document.body.animate([{opacity:0},{opacity:1}], {duration:480,easing:'cubic-bezier(.22,1,.36,1)'});
  addEventListener('pageshow', event => {leavingPage = false; if (event.persisted) document.body.getAnimations().forEach(animation => animation.cancel());});
}
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const src = asset => asset.src.split('/').map(encodeURIComponent).join('/');
const render = (selector, html) => {const target = document.querySelector(selector); if (target) target.innerHTML = html;};
async function initializeContent() {
  const responses = await Promise.all([fetch('image-review/catalog.json', {cache:'no-cache'}), fetch('content/site-content.json', {cache:'no-cache'})]);
  if (responses.some(response => !response.ok)) throw new Error('Não foi possível carregar o conteúdo.');
  const [assets, content] = await Promise.all(responses.map(response => response.json()));
  const heroAssets = assets.filter(asset => asset.hero).sort((a, b) => a.heroOrder - b.heroOrder);
  document.querySelector(".menu-photo").src = src(heroAssets[0]);
  if (document.querySelector('.slides')) {
  const slides = document.querySelector('.slides');
  const dots = document.querySelector('.slide-dots');
  let active = 0;
  heroAssets.forEach((asset, index) => {
    const image = document.createElement('img');
    image.src = src(asset); image.alt = ''; image.className = `slide${index === 0 ? ' active' : ''}`;
    image.style.objectPosition = asset.objectPosition;
    image.decoding = 'async';
    if (index === 0) image.fetchPriority = 'high';
    slides.append(image);
    const dot = document.createElement('button');
    dot.className = 'slide-dot'; dot.setAttribute('aria-label', `Mostrar ${asset.label.toLowerCase()}`);
    dot.innerHTML = '<span class="slide-progress"></span>';
    dot.setAttribute('aria-pressed', String(index === 0));
    dot.addEventListener('click', () => {showSlide(index); restartTimer();});
    dots.append(dot);
  });
  function showSlide(index) {
    active = index;
    [...slides.children].forEach((slide, i) => slide.classList.toggle('active', i === active));
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
  }
  let timer;
  function restartTimer() {
    clearInterval(timer);
    dots.querySelectorAll('.slide-progress').forEach(progress => progress.getAnimations().forEach(animation => animation.cancel()));
    if (!reducedMotion.matches && !document.hidden) {
      const progress = dots.children[active].querySelector('.slide-progress');
      progress.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:5500,easing:'linear',fill:'forwards'});
      timer = setInterval(() => {showSlide((active + 1) % heroAssets.length);restartTimer();}, 5500);
    }
  }
  reducedMotion.addEventListener('change', restartTimer);
  document.addEventListener('visibilitychange', restartTimer);
  restartTimer();
  }
  const roomIds = ['musculacao','cardio','fisioterapia','danca'];
  render('#space-grid', heroAssets.map(asset => `<article class="space-card"><img src="${src(asset)}" alt="${escapeHTML(asset.label)}" loading="lazy"><h3>${escapeHTML(asset.label.replace('Sala de ', ''))}</h3></article>`).join(''));
  const roomDescriptions = [
    'Um ambiente para treinar com pesos livres e máquinas. Os professores orientam o uso dos equipamentos e ajudam a organizar o treino de acordo com os seus objetivos.',
    'Esteiras, bicicletas e outros aparelhos para trabalhar o condicionamento. O ritmo e a intensidade podem ser ajustados de acordo com a orientação dos professores.',
    'Um espaço dedicado ao acompanhamento individual por profissional de fisioterapia. Os atendimentos são agendados e definidos após avaliação.',
    'Uma sala com espaço livre, espelhos e barras para aulas de dança. Consulte a programação da unidade para conhecer as aulas e os horários.'
  ];
  render('#space-details', heroAssets.map((asset,index) => `<section class="section room-detail" id="${roomIds[index]}"><img src="${src(asset)}" alt="${escapeHTML(asset.label)}" loading="lazy"><div><p class="eyebrow">0${index+1} · ESPAÇOS VORA</p><h2>${escapeHTML(asset.label)}</h2><p>${roomDescriptions[index]}</p></div></section>`).join(''));
  const money = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
  render('#plan-grid', content.plans.map(plan => `<article class="plan ${plan.featured ? 'featured' : ''}"><p class="plan-badge">${plan.featured ? escapeHTML(plan.badge) : 'Sua experiência VORA'}</p><h3>${escapeHTML(plan.name)}</h3><p class="price">${money.format(plan.monthlyPrice)}<span> /mês</span></p><ul>${plan.benefits.map(benefit => `<li>${escapeHTML(benefit)}</li>`).join('')}</ul><a class="button ${plan.featured ? 'button-orange' : 'button-cream'}" href="index.html?v=20261008-languages#unidades">Encontrar unidade</a></article>`).join(''));
  for (const [category,target] of [['equipamentos-superiores','#upper-grid'],['equipamentos-inferiores','#lower-grid']]) {
    render(target, assets.filter(asset => asset.category === category).map((asset,index) => `<article><img src="${src(asset)}" alt="${escapeHTML(asset.label)}" loading="lazy"></article>`).join(''));
  }
  const storyImage = document.querySelector('#story-image');
  if (storyImage) storyImage.src = src(heroAssets[0]);
  const roles = [{role:'professores',label:'Professores'},{role:'recepcao',label:'Recepção'},{role:'limpeza',label:'Equipe de limpeza'}];
  const roleDescriptions = {professores:'Orientação e acompanhamento no salão de treino.',recepcao:'Acolhimento e apoio na rotina da academia.',limpeza:'Cuidado diário com a limpeza dos nossos ambientes.'};
  render('#team-sections', roles.map(({role,label}) => `<section class="section"><div class="section-heading"><h2>${label}</h2><p>${roleDescriptions[role]}</p></div><div class="team-grid">${assets.filter(asset => asset.role === role).map(asset => `<article class="team-card"><img src="${src(asset)}" alt="${escapeHTML(asset.name || label)} — equipe VORA" loading="lazy">${asset.name ? `<div class="teacher-caption"><h3>${escapeHTML(asset.name)}</h3><p>${role === 'professores' ? (asset.id <= 25 ? 'Professor' : 'Professora') : label} · VORA</p></div>` : ''}</article>`).join('')}</div></section>`).join(''));
  render('#product-grid', assets.filter(asset => asset.category === 'produtos').map(asset => `<article><img src="${src(asset)}" alt="${escapeHTML(asset.label)}" loading="lazy"><h3>${escapeHTML(asset.label)}</h3></article>`).join(''));
  render('#unit-grid', content.units.map(unit => `<article class="unit"><h3>${escapeHTML(unit.name)}</h3><p>${escapeHTML(unit.address)}<br>${escapeHTML(unit.neighborhood)} · ${escapeHTML(unit.city)} / ${unit.state}</p></article>`).join(''));
  const currentFile = location.pathname.split('/').pop();
  if (currentFile && currentFile !== 'index.html') {
    document.querySelectorAll('#navigation a').forEach(link => {if (new URL(link.href).pathname.split('/').pop() === currentFile) link.setAttribute('aria-current','page');});
  }
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
initializeContent().catch(error => {console.error(error);const target = document.querySelector('.hero-description, .page-intro > p:last-child'); if (target) target.textContent = 'Recarregue a página para visualizar o conteúdo da VORA.';});


document.querySelector('.copy-email')?.addEventListener('click', async () => {
 const status = document.querySelector('#copy-status');
 try {
  await navigator.clipboard.writeText('contato@vora.example');
  status.textContent = 'E-mail copiado!';
 } catch {
  status.textContent = 'Não foi possível copiar. Selecione o endereço acima e copie.';
 }
});

