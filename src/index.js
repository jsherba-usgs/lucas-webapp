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
  * ADD COMMON LEGEND ELEMENTS
  */
  // State type legend
  const stateclassLegends = d3.selectAll('.legend-stateclass');
  const legendWidth = stateclassLegends.node().getBoundingClientRect().width;

  stateclassLegends
    .append('svg')
    .attr('width', legendWidth)
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

  // Filters legend
  const filtersLegend = Array.from(document.getElementsByClassName('legend-filters'));
  function updateFiltersLegend(d) {
    const content = `
      <ul>
        <li>Scenario ${d.scenario}</li>
        <li>Iteration ${d.iteration}</li>
        <li>${d.secondary_stratum}</li>
        <li>${d.stratum}</li>
      </ul>
      <a data-scroll href="#filters">
        (Update)
      </a>`;

    filtersLegend.forEach((el) => {
      el.innerHTML = content;
    });
  
  }
  /*
  * FILTERS
  */
  // Add event listener to document for filters.change event
  addEventListener(document, 'filters.change', (e) => {
    // Change chart state to loading
    d3.selectAll('.chart')
      .classed('loading', true);
      
    // Update ul element
    updateFiltersLegend(e.detail);

    // Update section 1 map
    section1.updateMap(e.detail);

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
          d3.selectAll('.chart')
            .classed('no-data', true)
            .select('svg')
              .remove();
        }
        console.log(error);
      });


    // Fetch data for transitions and update charts
    service.loadTransitions(params)
      .then((data) => {
        // Group data by transition group and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.TransitionGroup).sortKeys(d3.ascending)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        // Update section 3 ag contraction chart
        section3.update(totalAreaByYear);
      })
      .catch((error) => {
        if (error.message.indexOf('No data') > -1) {
          d3.selectAll('#three .chart')
            .classed('no-data', true)
            .select('svg')
              .remove();
        }
        console.log(error);
      });

  });

  // Intializing the filters starts the app on page load
  filters.init();
});

