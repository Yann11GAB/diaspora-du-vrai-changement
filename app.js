// Navbar burger
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Carousel
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dots = Array.from(document.querySelectorAll('.dot'));

let index = 0;
function goTo(i){
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
  slides.forEach((s, k) => {
    const current = k === index;
    s.classList.toggle('is-current', current);
    s.toggleAttribute('hidden', !current);
  });
  dots.forEach((d,k)=>{
    d.classList.toggle('is-active', k===index);
    d.setAttribute('aria-selected', k===index ? 'true' : 'false');
    d.tabIndex = k===index ? 0 : -1;
  });
}

prevBtn?.addEventListener('click', ()=> goTo(index-1));
nextBtn?.addEventListener('click', ()=> goTo(index+1));
dots.forEach((d,k)=> d.addEventListener('click', ()=> goTo(k)));

// clavier
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight') goTo(index+1);
  if(e.key === 'ArrowLeft') goTo(index-1);
});

// swipe (mobile)
let startX = null;
track.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
track.addEventListener('touchmove', (e)=>{
  if(startX === null) return;
  const dx = e.touches[0].clientX - startX;
  if (Math.abs(dx) > 50){
    goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  }
}, {passive:true});

// auto-play (optionnel, désactive si tu veux)
let autop = setInterval(()=> goTo(index+1), 6000);
track.addEventListener('mouseenter', ()=> clearInterval(autop));
track.addEventListener('mouseleave', ()=> autop = setInterval(()=> goTo(index+1), 6000));

// init
goTo(0);
