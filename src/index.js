// Import Node Modules
import smoothScroll from 'smooth-scroll';
import d3 from 'd3';
import chroniton from 'chroniton';
import 'd3-svg-legend';

// Import Styles
import './style/main.css';
import './components/multiline-area-chart/multiLine-area-chart.css';
/*import './components/sankey-chart/sankey-chart.css';*/
import './components/bar-chart/bar-chart.css';


// Import Helpers
import service from './helpers/api-service.js';
import { stateclassColorScale } from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletMap from './components/map/index';
//import sankeyChart from './components/sankey-chart/sankey-chart';
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
      // Get year from date object
      const year = d.getFullYear();
      // Update leaflet map for year 1 or every 10th year
      // TODO: Refactor - replace hardcoded values below
      if ([2001, 2011, 2021, 2031, 2041, 2051, 2061].indexOf(year) > -1) {
        leafletMap.updateRaster({ year });
      }
      // Publish event with date, the timeseries chart listens for this event
      triggerEvent(document, 'slider.slide', {
        detail: year
      });
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
      .on('click', () => section1Slider.play());

  d3.select(section1ControlsContainer)
      .append('button')
      .html('<i class="icon fa-pause"></i>')
      .attr('class', 'small')
      .on('click', () => section1Slider.pause());

  d3.select(section1ControlsContainer)
      .append('button')
      .html('<i class="icon fa-stop"></i>')
      .attr('class', 'small')
      .on('click', () => section1Slider.stop());


  // Init timeseries chart
  const timeseriesContainer = document.getElementById('section1-timeseries');
  // Get width of element holding the chart
  const chartWidth = timeseriesContainer.offsetWidth;
  const chartHeight = timeseriesContainer.offsetHeight || 400;
  // Add loading class
  timeseriesContainer.classList.add('loading');

  function getViz1TooltipContent(){
    return '<p>label</p>';
  }

  const stateclassTimeseries = timeseriesChart()
    .width(chartWidth)
    .height(chartHeight)
    .xDomain(section1Slider.getScale().domain())
    .yAxisAnnotation('Area (square kilometers)')
    .color(stateclassColorScale)
    .on('click', (mousePos, xScale) => {
      const html = getViz1TooltipContent(mousePos, xScale);
      const xPos = Math.round(mousePos[0] + 75); // adding right chart margin
      const yPos = Math.round(mousePos[1] + 0); // adding top chart margin

      d3.select('.chart-tooltip')
        .style('left', `${xPos}px`)
        .style('top', `${yPos}px`)
        .html(html);

      d3.select('.hover-line')
        .attr('x1', mousePos[0])
        .attr('x2', mousePos[0])
        .style('stroke-opacity', 1);

      d3.select('.chart-tooltip').classed('hidden', false);
    })
    .on('mouseout', () => {
      // Hide the tooltip
      d3.select('.chart-tooltip').classed('hidden', true);
      d3.select('.hover-line')
        .style('stroke-opacity', 0);
    });



  /*
  * INTIALIZATIONS FOR SECTION 2
  */
  // Get section 2
  const section2Container = document.getElementById('two');
  // Init bar chart
  const barchartContainer = document.getElementById('section2-barchart');
  // Add loading class
  barchartContainer.classList.add('loading');
  const barchartTotalBtn = section2Container.querySelector('.total');
  const barchartChangeBtn = section2Container.querySelector('.change');

  /*
  * ADD STATIC D3 ELEMENTS - LEGENDS
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

    // Fetch data
    service.loadStates(params)
      .then((data) => {

        // Group data by stateclass and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.StateLabelX)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        // Update section 1 charts
        updateSection1Charts(totalAreaByYear);

        // Update section 2 charts
        updateSection2Charts(totalAreaByYear);
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
  });
  filters.init();

  addEventListener(document, 'slider.slide', (e) => {
    console.log('slider slide', e.detail);
  });

  function updateSection1Charts(nestedData) {
    /*
    * SECTION 1
    */
    // Remap nested data for plotting
    const timeseriesData = nestedData.map((series) => (
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
    timeseriesData.forEach((series) =>
      series.values.forEach((d) => domainRange.push(d.values))
    );
    stateclassTimeseries.yDomain([0, d3.max(domainRange)]);

    // Call timeseries chart
    d3.select('#section1-timeseries')
      .datum(timeseriesData)
      .transition()
      .call(stateclassTimeseries);

    // Remove loading/no-data class
    timeseriesContainer.className = '';
  }

  function updateSection2Charts(nestedData) {
    /*
    * SECTION 1
    */
    // Filter nested data
    // Filter function returns true for year 1, and then every 10th year
    function yearFilter(row, idx) {
      if (idx === 0 || (idx % 10 === 0)) {
        return true;
      }
      return false;
    }

    const decadalData = [];
    nestedData.forEach((series) => {
      const filteredValues = series.values.filter(yearFilter);
      filteredValues.forEach((row) => {
        decadalData.push(
          {
            name: series.key,
            value: row.values,
            year: row.key,
          }
        );
      });
    });
    const barChartTotals = d3.nest()
      .key((d) => d.year)
      .entries(decadalData);

    // Caluclate Net change
    const decadalChange = [];
    function calculateChange(currentRow, idx, arr) {
      const nextRow = arr.find((record) => {
        if (parseInt(record.year) === (parseInt(currentRow.year) + 10) &&
            record.name === currentRow.name) {
          return true;
        }
        return false;
      });
      if (nextRow) {
        decadalChange.push(
          {
            name: currentRow.name,
            value: nextRow.value - currentRow.value,
            year: `${nextRow.year} - ${currentRow.year}`,
          }
        );
      }
    }
    decadalData.forEach(calculateChange);
    const barChartChange = d3.nest()
      .key((d) => d.year)
      .entries(decadalChange);

    barchartTotalBtn.onclick = () => {
      // Call bar charts - small multiples
      d3.select('#section2-barchart')
        .datum(barChartTotals)
        .call(barChart()
          .color(stateclassColorScale)
        );
    };

    barchartChangeBtn.onclick = () => {
      // Call bar charts - small multiples
      d3.select('#section2-barchart')
        .datum(barChartChange)
        .call(barChart()
          .color(stateclassColorScale)
        );
    };

    // First time 
    // Call bar charts - small multiples
      d3.select('#section2-barchart')
        .datum(barChartTotals)
        .call(barChart()
          .color(stateclassColorScale)
        );
    

    // Remove loading/no-data class
    barchartContainer.className = '';
  }


});

