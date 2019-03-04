// Import Node Modules
import d3 from 'd3';
import chroniton from 'chroniton';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';

// Import Helpers
import projectDetails from './../helpers/project-details.js';

// Import Components
import leafletMap from './../components/map/index_animation';
import leafletFilters from './../components/map/leaflet_filters'
import chart from './../components/multiline-area-chart/multiLine-area-chart';
import { triggerEvent } from './../helpers/utils';
import projects from './../helpers/project-details';
/*
* PRIVATE VARIABLES
*/
const tabContainer = document.getElementById('Map');
const parentContainer = tabContainer.querySelector('#one-two');
const mapContainer = tabContainer.querySelector('#map2');
const filtersContainer = document.getElementById('mapfilters2');
const projectContainer = document.getElementById('filters_project');
let sliderContainer = parentContainer.querySelector('.chroniton-slider');
let slider;
let controlsContainer = parentContainer.querySelector('.controls');
const chartContainer = parentContainer.querySelector('.chart');
let timeseriesChart;
let xScale
let xAxis
let loading;
let startYear
let endYear
let tickValues
let xDomainValues
/*
* EXPORT OBJECT
*/


const view = {
  init() {
    // Init map
    console.log(mapContainer)
    leafletMap.init(mapContainer,22.234262,-159.784857,'6368','1','2011','7096' );
    
    let startYear = 2011
    let endYear = 2061
    let sliderVals = []
    for(var i=2011; i<=2061;i=i+5) {
    sliderVals.push(i);
    }
    let initiateChart = true
    
    
     let sliderYear = 2011
    // Init date slider
    slider = chroniton()
      // TODO: Refactor - get range of years from data, instead of hardcoding values below
      .loop(true)
      .domain([new Date(2011, 0), new Date(2061, 0)])
      .labelFormat(d3.time.format('%Y'))
      .width(sliderContainer.offsetWidth)
      .margin({ top: 10, right: 25, bottom: 10, left: 25})
      // TODO: Refactor axis tick values to add ticks every n years
      // instead of hardcoding values below
      .tapAxis((axis) => axis.tickValues([new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)]))
      .on('change', (d) => {
       /* if (initiateChart === false){
          slider.playPause()
        }*/
        
        
        const year = d.getFullYear();
        
        let loadAll = function(slider,d){
          
          if (initiateChart === false){

        
          leafletMap.preLoadRasters(slider, d, startYear, endYear)
          
          
          }
          initiateChart=false

        }
     
          
        let updateRasterOpacity = function(){
            sliderYear = year
            if (sliderVals.indexOf(year) > -1 && year!==sliderYear) {
              leafletMap.updateRaster({ year })
             
             }
            
        } 

        
        loadAll(slider, d)


            if (sliderVals.indexOf(year) > -1 && year!==sliderYear) {
              leafletMap.updateRaster({ year })
              
              sliderYear = year
             }
         
       // timeseriesChart.moveTooltip(year);
        
      })
      .playbackRate(5);

   

   document.getElementById("map2").onclick = function () {
      
      let layerLength = leafletMap.mapLayers()
     
      if (layerLength > 0){
      leafletMap.removeTimeSeriesRasters()
      leafletFilters.triggerChange()


    }
   }
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
        .attr('id', 'pause_button')
        .on('click', () => slider.pause());

    d3.select(controlsContainer)
        .append('button')
        .html('<i class="icon fa-stop"></i>')
        .attr('class', 'small')
        .attr('id', 'stop_button')
        .on('click', () => slider.stop());
  },
  sliderupdate(details, variableType){
    
    startYear = details.years[0][variableType][0].start
    endYear = details.years[0][variableType][0].end
    sliderContainer.querySelector('.slider').remove()
    let initiateChart = true
    let sliderVals = []
   
    
    for(var i=startYear; i<=endYear;i=i+5) {
    sliderVals.push(i);
    }
    tickValues = details.xDomain[0][variableType][0].ticks
    xDomainValues = details.xDomain[0][variableType][0].domain
    
    if (variableType === "transition_group"){
      let update_start_year = sliderVals[0]
      sliderVals[0] = update_start_year+1
    }
   
     let sliderYear = startYear//d3.min(years)
     
    slider
     .stop(stopValue = true)
     .domain(xDomainValues)
      .tapAxis((axis) => axis.tickValues(tickValues))
      .on('change', (d) => {
        
        
        if (stopValue!==true){
          const year = d.getFullYear();
         
          
          let loadAll = function(slider,d){
            
            if (initiateChart === false){

            
            leafletMap.preLoadRasters(slider, d, startYear, endYear)
            
            
            }
            initiateChart=false
            

          }
       
            
          let updateRasterOpacity = function(){
              sliderYear = year
              if (sliderVals.indexOf(year) > -1 && year!==sliderYear) {

                leafletMap.updateRaster({ year })
                
               }
              
          } 

          
          loadAll(slider, d)
         
              if (sliderVals.indexOf(year) > -1 && year!==sliderYear) {
               
                leafletMap.updateRaster({ year })
                
                sliderYear = year
               }
          

           if (slider.isAtEnd()){slider.pause();}

          // timeseriesChart.moveTooltip(year);
        }  
        stopValue=false
        
          
      
        
      })
      
    
  sliderContainer = parentContainer.querySelector('.chroniton-slider');
  d3.select(sliderContainer)
      .call(slider);

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

      },
  updateChart(nestedData, colorscale, details, variableType) {
    
    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');
    
    // Remap nested data for plotting

    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
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
   
    const xAccessor = function (d) { return +new Date(d.key, 0, 1); };
    
   
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);
    
    // Set y domain
    const domainRange = [];
    timeseriesData.forEach((series) =>
      
      series.values.forEach(function(d) {

           domainRange.push(d.min, d.max)
        

    }));

   
    
    timeseriesChart.yDomain([d3.min(domainRange), d3.max(domainRange)]);

    timeseriesChart.yAxisAnnotation(projectDetails.getUnit(variableType)); 

   let xDomainValues = details.xDomain[0][variableType][0].domain
   let ticks = details.xDomain[0][variableType][0].ticks
   timeseriesChart.xDomain(xDomainValues);

  // Second X scale for brush slider

  // X Axis on top of chart
  

    timeseriesChart.color(colorscale);
    
    // Call timeseries chart
    d3.select(chartContainer)
      .datum(timeseriesData)
      .transition()
      .call(timeseriesChart);

  timeseriesChart.updateTicks(ticks)


     // Update Chart Title
    let variableSelectInput = document.querySelector('input[name=variable_checkboxes]:checked')
    let chartTitleDiv = document.getElementById('chartSection1Title')

    chartTitleDiv.innerHTML =variableSelectInput.id

    
 
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

    leafletFilters.updateIndividualLegend(options)
    leafletMap.updateIndividualRaster(options);
    
    
  },
  reloadMap(options, addMapLegend) {
    
    leafletMap.reloadMap(options);
    console.log(options)
    leafletFilters.init(options, addMapLegend, 'mapfilters2')

    
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
