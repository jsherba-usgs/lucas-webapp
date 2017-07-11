// Import Node Modules
import d3 from 'd3';
import chroniton from 'chroniton';
//import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.//css';

// Import Helpers
//import { stateclassColorScale } from './../helpers/colors';


// Import Components
//import leafletMap from './../components/map/index';
//import leafletFilters from './../components/map/leaflet_filters'//mport chart from './../components/multiline-area-chart/multiLine-area-chart';
import { triggerEvent } from './../helpers/utils';

/*
* PRIVATE VARIABLES
*/
/*const parentContainer = document.getElementById('one');
const mapContainer = document.getElementById('map');
const filtersContainer = document.getElementById('mapfilters');
let sliderContainer = parentContainer.querySelector('.chroniton-slider');
let slider;
let controlsContainer = parentContainer.querySelector('.controls');
const chartContainer = parentContainer.querySelector('.chart');
let timeseriesChart;
let loading;*/

/*
* EXPORT OBJECT
*/


const view = {
  init() {
   
   document.getElementById("map").onclick = function () {
      
      let layerLength = leafletMap.mapLayers()
     
      if (layerLength > 0){
      leafletMap.removeTimeSeriesRasters()
      leafletFilters.triggerChange()


    }
   }
  
   
   
   
  },
  sliderinit(){
    sliderContainer = parentContainer.querySelector('.chroniton-slider');
    controlsContainer = parentContainer.querySelector('.controls');
   
    // Create slider
    // TODO: Set slider domain and change function after data comes back from API,;
    //       move create slider to update function

    slider.width(sliderContainer.offsetWidth)
    
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
  sliderremove(){
   sliderContainer.querySelector('svg').remove();
   Array.prototype.forEach.call(controlsContainer.querySelectorAll('*'),function(e){
    
      e.parentNode.removeChild(e);
    });

    
  },
 
  resizeChart() {
    // update width
    d3.selectAll(".halo").remove();
    d3.selectAll(".slider").remove();
    controlsContainer = parentContainer.querySelector('.controls');
    timeseriesChart.width(chartContainer.offsetWidth)
    slider.width(chartContainer.offsetWidth)

    
    d3.select(chartContainer)
      .call(timeseriesChart);

    d3.select(sliderContainer)
      .call(slider);


    // reset x range
   // x.range([0, width]);

    // do the actual resize...
      },
  updateChart(nestedData, colorscale) {
    
    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');
    
    // Remap nested data for plotting

    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
        //values: series.values,
        values: series.values.map(function(dd){
                key = dd.key
                values = dd.values[0].Mean
                min = dd.values[0].min
                max = dd.values[0].max
                return {key:key, min:min, max:max, values:values}
              })
      }
    ));
   
    // Set x and y accessors for timeseries chart
    const yAccessor = function (d) { return +d.values; };
    //const yAccessor = function (d) { return d.values, function (d) { return +d.values;}};
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };

   
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);
    
    // Set y domain
    const domainRange = [];
    timeseriesData.forEach((series) =>
      //series.values.forEach((d) => domainRange.push(d.values))
      //series.values.forEach((d) => d.values.forEach((f) => domainRange.push(f.min, f.max)))
      series.values.forEach((d) => domainRange.push(d.min, d.max))
    );

    timeseriesChart.yDomain([d3.min(domainRange), d3.max(domainRange)]);

    timeseriesChart.color(colorscale);
    
    // Call timeseries chart
    d3.select(chartContainer)
      .datum(timeseriesData)
      .transition()
      .call(timeseriesChart);


  },
  removeLayers(){
    leafletMap.removeTimeSeriesRasters()
  },
  resizeMap(){
    leafletMap.resizeMap()
  },
  updateMap(options) {
    leafletMap.updateRaster(options);
  },
  updateIndividualMap(options) {
    //leafletFilters.init(options, addMapLegend)
    leafletFilters.updateIndividualLegend(options)
    leafletMap.updateIndividualRaster(options);
  },
  reloadMap(options, addMapLegend) {
    leafletFilters.init(options, addMapLegend)
    leafletMap.reloadMap(options);
  },
  chartStatus(status) {
    switch (status) {
      case 'loading':
        loading = new Spinner().spin(chartContainer);
        break;
      case 'loaded':
        loading.stop();
        break;
      default:
        chartContainer.classList.add('no-data');
    }
  }

};

export default view;
