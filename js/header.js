// js/header.js
function toggleMenu() {
  const menuToggle = document.querySelector('.menuToggle');
  const navigation = document.querySelector('nav');
  menuToggle.classList.toggle('active');
  navigation.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;
  
  const onScroll = () => {
    const scrolled = window.scrollY > 50;
    header.classList.toggle('sticky', scrolled);          // per compatibilitat amb style.css
    header.classList.toggle('header--sticky', scrolled);  // activa fons blanc/ombra
    header.classList.toggle('header--transparent', !scrolled);
  };
  
  onScroll(); // Run once on load
  window.addEventListener('scroll', onScroll, { passive: true });
});
