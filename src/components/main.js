// Import Node Modules
import smoothScroll from 'smooth-scroll';

// Import Styles
import './../style/main.css';
import './../style/flexboxgrid.css';

// Import Modules
import utils from './utils.js';
import filters from './filters/filters.js';


document.addEventListener('DOMContentLoaded', () => {
  // Get an array of all links in main nav
  const nav = document.getElementById('nav');
  const navLinks = Array.prototype.slice.call(nav.querySelectorAll('a'));


  // Intialize smooth scrolling
  smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
    callback: (anchor, toggle) => {
      toggle.classList.add('active');
      navLinks.forEach((link) => {
        if (link !== toggle) {
          link.classList.remove('active');
        }
      });
    },
  });

   // Enable responsive menu
  const headerToggle = document.getElementById('headerToggle');
  function responsiveMenuToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('header-visible');
  }
  headerToggle.addEventListener('click', responsiveMenuToggle);
  headerToggle.addEventListener('touchstart', responsiveMenuToggle);

  // Init filters
  filters.init();
});
