const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileNav = document.getElementById('mobileNav');

function openNav() {
  mobileNav.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', openNav);
menuClose.addEventListener('click', closeNav);
