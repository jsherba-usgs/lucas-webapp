// Import Node Modules
import smoothScroll from 'smooth-scroll';

// Import Styles
import './style/main.css';
import './style/flexboxgrid.css';
import './style/components.css';

// Import Helpers
import service from './helpers/api-service.js';

// Import Components
import filters from './components/filters/filters.js';


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
  const container = document.getElementById('filters');
  const scenario = '6370';
  filters.init(container);

  console.log(filters.scenario('6370'));

  const params = {
    scenario: '6370',
    secondary_stratum: 'Maui',
    stratum: 'Dry',
    timestep: 2061,
  };
  //service.loadStates(params);
});
