const scrollMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
// Suaviza a roda do mouse, preservando toque, teclado, zoom e áreas com scroll próprio.
let scrollTarget = scrollY;
let scrollFrame = 0;
let lastScrollTime = 0;
function stopSmoothScroll() {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
  scrollTarget = scrollY;
  document.documentElement.classList.remove('wheel-scrolling');
}
function animateScroll(time) {
  const elapsed = lastScrollTime ? Math.min(time - lastScrollTime, 40) : 16;
  lastScrollTime = time;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  scrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));
  const distance = scrollTarget - scrollY;
  const next = Math.abs(distance) < 1.5 ? scrollTarget : scrollY + distance * (1 - Math.exp(-elapsed / 190));
  window.scrollTo({top:next,behavior:'instant'});
  if (Math.abs(scrollTarget - scrollY) < 1.5) {window.scrollTo({top:scrollTarget,behavior:'instant'});stopSmoothScroll();return;}
  scrollFrame = requestAnimationFrame(animateScroll);
}
addEventListener('wheel', event => {
  if (scrollMotionPreference.matches || document.querySelector('dialog[open]') !== null || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.defaultPrevented) return;
  let target = event.target instanceof Element ? event.target : null;
  while (target && target !== document.body) {
    const style = getComputedStyle(target);
    if (/auto|scroll/.test(style.overflowY) && target.scrollHeight > target.clientHeight) return;
    target = target.parentElement;
  }
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  if (!scrollFrame) scrollTarget = scrollY;
  const delta = event.deltaY * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? innerHeight : 1);
  scrollTarget = Math.max(0, Math.min(scrollTarget + delta, maxScroll));
  if (Math.abs(scrollTarget - scrollY) < .7) return;
  event.preventDefault();
  if (!scrollFrame) {
    document.documentElement.classList.add('wheel-scrolling');
    lastScrollTime = 0;
    scrollFrame = requestAnimationFrame(animateScroll);
  }
}, {passive:false,capture:true});
addEventListener('pointerdown',stopSmoothScroll,{passive:true});
addEventListener('touchstart',stopSmoothScroll,{passive:true});
addEventListener('keydown',stopSmoothScroll);
document.addEventListener('click', event => {if(event.target.closest('a[href]')) stopSmoothScroll();});
scrollMotionPreference.addEventListener('change',stopSmoothScroll);

