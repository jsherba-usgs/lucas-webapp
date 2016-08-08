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



  // Intialize smooth scrolling
  smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
  });

 

 
  const body = document.body;
  const wrapper = document.getElementById('wrapper');
  const header = document.getElementById('header');
  const banner = document.getElementById('banner');
  const overlay = document.getElementById('overlay');
  const overlayOpenBtn = document.getElementById('overlayOpen');
  const overlayCloseBtn = document.getElementById('overlayClose');

  // Disable animations/transitions until the page has loaded.
  body.classList.add('is-loading');

  window.addEventListener('load', function () {
    window.setTimeout(function () {
      body.classList.remove('is-loading');
    }, 100);
  });
  window.addEventListener('pageshow', function () {
    window.setTimeout(function () {
      body.classList.remove('is-loading');
    }, 100);
  });

  // Clear transitioning state on unload/hide.
  window.addEventListener('unload', function () {
    window.setTimeout(function () {
      const transitioningElements = Array.from(document.querySelectorAll('.is-transitioning'));
      transitioningElements.forEach((el) => el.classList.remove('is-transitioning'));
    }, 250);
  });
  window.addEventListener('pagehide', function () {
    window.setTimeout(function () {
      const transitioningElements = Array.from(document.querySelectorAll('.is-transitioning'));
      transitioningElements.forEach((el) => el.classList.remove('is-transitioning'));
    }, 250);
  });

  // Intialize smooth scrolling
  smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
  });

  // Open, close overlay
  function overlayOpen(e) {
    body.classList.add('is-overlay-visible');
  }
  function overlayClose(e) {
    body.classList.remove('is-overlay-visible');
  }
  overlayOpenBtn.addEventListener('click', overlayOpen);
  overlayCloseBtn.addEventListener('click', overlayClose);













  // Init filters
  const container = document.getElementById('filters');
  const scenario = '6370';
  filters.init(container);

  //console.log(filters.scenario('6370'));

  const params = {
    scenario: '6370',
    secondary_stratum: 'Maui',
    stratum: 'Dry',
    timestep: 2061,
  };
  //service.loadStates(params);
});
