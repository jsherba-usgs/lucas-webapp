// Import Node Modules
import smoothScroll from 'smooth-scroll';
import d3 from 'd3';
import chroniton from 'chroniton';

// Import Styles
import './style/main.css';
import './style/flexboxgrid.css';
import './components/multiline-area-chart/multiLine-area-chart.css';


// Import Helpers
import service from './helpers/api-service.js';
import { stateclassColorScale } from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletMap from './components/map/index';

import timeseriesChart from './components/multiline-area-chart/multiLine-area-chart';


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
  * INTIALIZATIONS
  */

  // Init map
  const mapContainer = document.getElementById('map');
  leafletMap.init(mapContainer);


  // Init date slider
  const sliderContainer = document.getElementById('year-slider');
  const sliderWidth = sliderContainer.offsetWidth;

  const decadeSlider = chroniton()
    .domain([new Date(2001, 0), new Date(2061, 0)])
    .labelFormat(d3.time.format('%Y'))
    .width(sliderWidth)
    .margin({ top: 10, right: 40, bottom: 20, left: 60 })
    .tapAxis((axis) => axis.tickValues([new Date(2001, 0), new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)]))
    .on('change', (d) => {
      const year = d.getFullYear();
      if ([2001, 2011, 2021, 2031, 2041, 2051, 2061].indexOf(year) > -1) {
        leafletMap.updateRaster({ year });
      }
    })
    .playbackRate(0.2);

  d3.select(sliderContainer)
    .call(decadeSlider);

   // Init slider controls
  const sliderControlsContainer = document.querySelector('.slider-controls');
  d3.select(sliderControlsContainer)
      .append('button')
      .html('<i class="icon fa-play"></i>')
      .attr('class', 'small')
      .on('click', function() { decadeSlider.play(); });

  d3.select(sliderControlsContainer)
      .append('button')
      .html('<i class="icon fa-pause"></i>')
      .attr('class', 'small')
      .on('click', function() { decadeSlider.pause(); });

  d3.select(sliderControlsContainer)
      .append('button')
      .html('<i class="icon fa-stop"></i>')
      .attr('class', 'small')
      .on('click', function() { decadeSlider.stop(); });


  // Init tiemseries chart
  const timeseriesContainer = document.getElementById('timeseries-all');
  // Get width of element holding the chart
  const chartWidth = timeseriesContainer.offsetWidth;
  const chartHeight = timeseriesContainer.offsetHeight || 400;

  const stateclassTimeseries = timeseriesChart()
    .width(chartWidth)
    .height(chartHeight)
    .xDomain(decadeSlider.getScale().domain())
    .yAxisAnnotation('Area (square kilometers)')
    .color(stateclassColorScale);


  // Init filters
  // Add event listener to document for filters.change event
  addEventListener(document, 'filters.change', (e) => {
    console.log(e.detail);
    // Update map
    leafletMap.updateRaster(e.detail);
    // Update timeseries-all chart
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
    service.loadStates(params)
      .then((data) => {
        console.log(data);
        // Group by stateclass and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.StateLabelX)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        const plotData = totalAreaByYear.map((series) => {
          return {
            name: series.key,
            type: 'line',
            values: series.values,
          };
        });
        console.log(plotData);
        const yAccessor = function (d) { return +d.values; };
        const xAccessor = function (d) { return new Date(d.key, 0, 1); };
        stateclassTimeseries.yValue(yAccessor);
        stateclassTimeseries.xValue(xAccessor);


        const domainRange = [];
        plotData.forEach((series) =>
          series.values.forEach((d) => domainRange.push(d.values))
        );
        stateclassTimeseries.yDomain([0, d3.max(domainRange)]);


        d3.select('.chart-canvas')
          .datum(plotData)
          .transition()
          .call(stateclassTimeseries);

        stateclassTimeseries.render();
    });
  });
  filters.init();
});
