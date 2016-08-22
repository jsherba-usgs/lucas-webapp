// Import Node Modules
import d3 from 'd3';
import chroniton from 'chroniton';
import 'd3-svg-legend';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';

// Import Helpers
import { stateclassColorScale } from './../helpers/colors';

// Import Components
import leafletMap from './../components/map/index';
import chart from './../components/multiline-area-chart/multiLine-area-chart';


/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('one');
const mapContainer = document.getElementById('map');
const sliderContainer = parentContainer.querySelector('.chroniton-slider');
let slider;
const controlsContainer = parentContainer.querySelector('.controls');
const chartContainer = parentContainer.querySelector('.chart');
let timeseriesChart;

/*
* EXPORT OBJECT
*/
const view = {
  init() {
    // Init map
    leafletMap.init(mapContainer);

    // Add loading class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    chartContainer.classList.add('loading');

    timeseriesChart = chart()
      .width(chartContainer.offsetWidth)
      .height(chartContainer.offsetHeight || 400)
      .xDomain([new Date(2001, 0), new Date(2061, 0)])
      .yAxisAnnotation('Area (square kilometers)')
      .color(stateclassColorScale);

    // Init date slider
    slider = chroniton()
      // TODO: Refactor - get range of years from data, instead of hardcoding values below
      .domain([new Date(2001, 0), new Date(2061, 0)])
      .labelFormat(d3.time.format('%Y'))
      .width(sliderContainer.offsetWidth)
      .margin({ top: 10, right: 40, bottom: 20, left: 60 })
      // TODO: Refactor axis tick values to add ticks every n years
      // instead of hardcoding values below
      .tapAxis((axis) => axis.tickValues([new Date(2001, 0), new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)]))
      .on('change', (d) => {
        // Get year from date object
        const year = d.getFullYear();
        // Update leaflet map for year 1 or every 10th year
        // TODO: Refactor - replace hardcoded values below
        if ([2001, 2011, 2021, 2031, 2041, 2051, 2061].indexOf(year) > -1) {
          leafletMap.updateRaster({ year });
        }
        timeseriesChart.moveTooltip(year);
      })
      .playbackRate(0.1);

    // Create slider
    // TODO: Set slider domain and change function after data comes back from API,;
    //       move create slider to update function
    d3.select(sliderContainer)
      .call(slider);

     // Add slider controls
    d3.select(controlsContainer)
        .append('button')
        .html('<i class="icon fa-play"></i>')
        .attr('class', 'small')
        .on('click', () => slider.play());

    d3.select(controlsContainer)
        .append('button')
        .html('<i class="icon fa-pause"></i>')
        .attr('class', 'small')
        .on('click', () => slider.pause());

    d3.select(controlsContainer)
        .append('button')
        .html('<i class="icon fa-stop"></i>')
        .attr('class', 'small')
        .on('click', () => slider.stop());
  },
  update(nestedData) {
    // Remove loading/no-data class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    chartContainer.classList.remove('loading');
    chartContainer.classList.remove('no-data');

    // Remap nested data for plotting
    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
        values: series.values,
      }
    ));

    // Set x and y accessors for timeseries chart
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);

    // Set y domain
    const domainRange = [];
    timeseriesData.forEach((series) =>
      series.values.forEach((d) => domainRange.push(d.values))
    );
    timeseriesChart.yDomain([0, d3.max(domainRange)]);

    // Call timeseries chart
    d3.select(chartContainer)
      .datum(timeseriesData)
      .transition()
      .call(timeseriesChart);
  },
  updateMap(options) {
    leafletMap.updateRaster(options);
  }
};

export default view;
