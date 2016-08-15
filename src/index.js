// Import Node Modules
import smoothScroll from 'smooth-scroll';
import d3 from 'd3';
import chroniton from 'chroniton';
import 'd3-svg-legend';

// Import Styles
import './style/main.css';
//import './style/flexboxgrid.css';
import './components/multiline-area-chart/multiLine-area-chart.css';
import './components/sankey-chart/sankey-chart.css';
import './components/bar-chart/bar-chart.css';


// Import Helpers
import service from './helpers/api-service.js';
import { stateclassColorScale } from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletMap from './components/map/index';
import sankeyChart from './components/sankey-chart/sankey-chart';
import timeseriesChart from './components/multiline-area-chart/multiLine-area-chart';
import barChart from './components/bar-chart/bar-chart-small-multiples';

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

  // Init map
  const mapContainer = document.getElementById('map');
  leafletMap.init(mapContainer);


  // Init date slider
  const section1SliderContainer = document.getElementById('section1-slider');
  const section1SliderWidth = section1SliderContainer.offsetWidth;

  const section1Slider = chroniton()
    // TODO: Refactor - get range of years from data
    .domain([new Date(2001, 0), new Date(2061, 0)])
    .labelFormat(d3.time.format('%Y'))
    .width(section1SliderWidth)
    .margin({ top: 10, right: 40, bottom: 20, left: 60 })
    // TODO: Refactor axis tick values to add ticks every n years
    // instead of hardcoded values below
    .tapAxis((axis) => axis.tickValues([new Date(2001, 0), new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)]))
    .on('change', (d) => {
      const year = d.getFullYear();
      // TODO: Refactor - replace hardcoded values below
      if ([2001, 2011, 2021, 2031, 2041, 2051, 2061].indexOf(year) > -1) {
        leafletMap.updateRaster({ year });
      }
    })
    .playbackRate(0.2);

  d3.select(section1SliderContainer)
    .call(section1Slider);

   // Init slider controls
  const section1ControlsContainer = document.getElementById('section1-controls');
  d3.select(section1ControlsContainer)
      .append('button')
      .html('<i class="icon fa-play"></i>')
      .attr('class', 'small')
      .on('click', function() { section1Slider.play(); });

  d3.select(section1ControlsContainer)
      .append('button')
      .html('<i class="icon fa-pause"></i>')
      .attr('class', 'small')
      .on('click', function() { section1Slider.pause(); });

  d3.select(section1ControlsContainer)
      .append('button')
      .html('<i class="icon fa-stop"></i>')
      .attr('class', 'small')
      .on('click', function() { section1Slider.stop(); });


  // Init tiemseries chart
  const timeseriesContainer = document.getElementById('section1-timeseries');
  // Get width of element holding the chart
  const chartWidth = timeseriesContainer.offsetWidth;
  const chartHeight = timeseriesContainer.offsetHeight || 400;
  // Add loading class
  timeseriesContainer.classList.add('loading');

  const stateclassTimeseries = timeseriesChart()
    .width(chartWidth)
    .height(chartHeight)
    .xDomain(section1Slider.getScale().domain())
    .yAxisAnnotation('Area (square kilometers)')
    .color(stateclassColorScale);


  /*
  * INTIALIZATIONS FOR SECTION 2
  */
  // Init bar chart
  const barchartContainer = document.querySelector('section2-barchart');
  // Get width of element holding the chart
  //const chartWidth = timeseriesContainer.offsetWidth;
  //const chartHeight = timeseriesContainer.offsetHeight || 400;
  // Add loading class
  //timeseriesContainer.classList.add('loading');

  
  /*
  * FILTERS
  */
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
        /*
        * SECTION 1
        */
        // Group data by stateclass and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.StateLabelX)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        // Remap data for plotting
        const plotData = totalAreaByYear.map((series) => (
          {
            name: series.key,
            type: 'line',
            values: series.values,
          }
        ));

        // Set x and y accessors
        const yAccessor = function (d) { return +d.values; };
        const xAccessor = function (d) { return new Date(d.key, 0, 1); };
        stateclassTimeseries.yValue(yAccessor);
        stateclassTimeseries.xValue(xAccessor);

        // Set y domain
        const domainRange = [];
        plotData.forEach((series) =>
          series.values.forEach((d) => domainRange.push(d.values))
        );
        stateclassTimeseries.yDomain([0, d3.max(domainRange)]);

        // Call timeseries chart
        d3.select('#section1-timeseries')
          .datum(plotData)
          .transition()
          .call(stateclassTimeseries);

        // Render timeseries chart
        // Remove loading class
        timeseriesContainer.classList.remove('loading');
        stateclassTimeseries.render();

        /*
        * SECTION 2
        */
        var data1 = [ 
          {name: 'A', value: -15},
          {name: 'B', value: 20},
          {name: 'C', value: 22}, 
          {name: 'D', value: 2}, 
          {name: 'E', value: 10}, 
        ];

        function yearFilter(row, idx, arr) { 
          if (idx === 0 || (idx % 10 ===  0)) {
            return true;
          }
          return false;
        }

        const barChartData = [];

        plotData.forEach((series) => {
          const filteredValues = series.values.filter(yearFilter);
          filteredValues.forEach((row) => {
            barChartData.push(
              {
                name: series.name,
                value: row.values,
                year: row.key,
              }
            );
          });
        });

        console.log(barChartData);
        const transformData = d3.nest()
          .key((d) => d.year)
          .entries(barChartData);


        d3.select('#section2-barchart')
          .datum(transformData)
          .call(barChart()
            .color(stateclassColorScale)
          );

        const svgLegend = d3.select('#section2-barchart').select('svg');
        svgLegend.append("g")
          .attr("class", "legendOrdinal")
          .attr("transform", "translate(20,20)");

        var legendOrdinal = d3.legend.color()
          .shapePadding(10)
          .orient('horizontal')
          .scale(stateclassColorScale);

svgLegend.select(".legendOrdinal")
  .call(legendOrdinal);

      });
  });
  filters.init();



  

});
