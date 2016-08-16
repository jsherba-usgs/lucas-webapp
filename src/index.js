// Import Node Modules
import smoothScroll from 'smooth-scroll';
import d3 from 'd3';

// Import Styles
import './style/main.css';

// Import Helpers
import service from './helpers/api-service.js';
import { stateclassColorScale } from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletMap from './components/map/index';

// Import views
import section1 from './views/section1';
import section2 from './views/section2';
import section3 from './views/section3';

document.addEventListener('DOMContentLoaded', () => {
  /*
  * PAGE UI
  */
  // Intialize smooth scrolling
  smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
  });

  const body = document.body;
/*  const wrapper = document.getElementById('wrapper');
  const header = document.getElementById('header');
  const banner = document.getElementById('banner');
  const overlay = document.getElementById('overlay');*/
  const overlayOpenBtn = document.getElementById('overlayOpen');
  const overlayCloseBtn = document.getElementById('overlayClose');

  // Disable animations/transitions until the page has loaded.
  body.classList.add('is-loading');

  window.addEventListener('load', () => {
    window.setTimeout(() => {
      body.classList.remove('is-loading');
    }, 100);
  });
  window.addEventListener('pageshow', () => {
    window.setTimeout(() => {
      body.classList.remove('is-loading');
    }, 100);
  });

  // Clear transitioning state on unload/hide.
  window.addEventListener('unload', () => {
    window.setTimeout(() => {
      const transitioningElements = Array.from(document.querySelectorAll('.is-transitioning'));
      transitioningElements.forEach((el) => el.classList.remove('is-transitioning'));
    }, 250);
  });
  window.addEventListener('pagehide', () => {
    window.setTimeout(() => {
      const transitioningElements = Array.from(document.querySelectorAll('.is-transitioning'));
      transitioningElements.forEach((el) => el.classList.remove('is-transitioning'));
    }, 250);
  });

  // Open, close overlay
  function overlayOpen() {
    body.classList.add('is-overlay-visible');
  }
  function overlayClose() {
    body.classList.remove('is-overlay-visible');
  }
  overlayOpenBtn.addEventListener('click', overlayOpen);
  overlayCloseBtn.addEventListener('click', overlayClose);

  /*
  * INTIALIZATIONS FOR SECTION 1
  */
  section1.init();

  /*
  * INTIALIZATIONS FOR SECTION 2
  */
  section2.init();


  /*
  * INTIALIZATIONS FOR SECTION 3
  */
  section3.init();

  /*
  * ADD static D3 elements common to more than one section, e.g. Stateclass legend
  */
  // Add stateclass legends
  const stateclassLegends = d3.selectAll('.legend-stateclass');

  stateclassLegends
    .append('svg')
    .append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(25,20)');

  const stateclassOrdinal = d3.legend.color()
    .shapePadding(60)
    .shapeWidth(30)
    .orient('horizontal')
    .title('State Classes (area in square kilometers):')
    .scale(stateclassColorScale);

  stateclassLegends.select('.legendOrdinal')
    .call(stateclassOrdinal);

  /*
  * FILTERS
  */
  // Add event listener to document for filters.change event
  addEventListener(document, 'filters.change', (e) => {
    console.log('filters changed', e.detail);

    // Update section 1 map
    leafletMap.updateRaster(e.detail);

    // Setup query params for fetching data from API
    const params = {
      scenario: e.detail.scenario,
      iteration: e.detail.iteration,
      secondary_stratum: e.detail.secondary_stratum,
      stratum: e.detail.stratum,
      pagesize: 1000,
    };
    if (params.stratum === 'All') {
      delete params.stratum;
    }

    // Fetch data for state class and update charts
    service.loadStates(params)
      .then((data) => {
        // Group data by stateclass and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.StateLabelX)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        // Update section 1 charts
        section1.update(totalAreaByYear);

        // Update section 2 charts
        section2.update(totalAreaByYear);
      })
      .catch((error) => {
        if (error.message.indexOf('No data') > -1) {
          d3.select('#section1-timeseries')
            .classed('no-data', true)
            .select('svg')
              .remove();
          d3.select('#section2-barchart')
            .classed('no-data', true)
            .selectAll('div')
              .remove();
        }
        console.log(error);
      });


  // Fetch data for transitions and update charts
    service.loadTransitions(params)
    .then((data) => {
      console.log(data);
      // Group data by transition group and year, calculate total area (amount)
      const totalAreaByYear = d3.nest()
        .key((d) => d.TransitionGroup)
        .key((d) => d.Timestep)
        .rollup((v) => d3.sum(v, (d) => d.Amount))
        .entries(data);

      console.log(totalAreaByYear);

      // Update section 3 ag contraction chart
      section3.update(totalAreaByYear);
    })
    .catch((error) => {
/*      if (error.message.indexOf('No data') > -1) {
        d3.select('#section1-timeseries')
          .classed('no-data', true)
          .select('svg')
            .remove();
        d3.select('#section2-barchart')
          .classed('no-data', true)
          .selectAll('div')
            .remove();
      }*/
      console.log(error);
    });

  });

  // Intializing the filters starts the app on page load
  filters.init();
});

