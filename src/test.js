// Import Node Modules
import smoothScroll from 'smooth-scroll';
import L from 'leaflet-tilelayer-geojson'
import d3 from 'd3';

// Import Styles
import './style/main.css';


// Import Helpers
import service from './helpers/api-service.js';
import {colorScaleDicLegend, colorScaleDic, dashed,dashedLegend, stateClassLegendLookup, stockLegendLookup, transitionClassLegendLookup, scenarioLegendLookup} from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletFilters from './components/map/leaflet_filters'
import projects from './helpers/project-details';
// Import views
import section1 from './views/section1';
import section2 from './views/section2';
import section3 from './views/section3';
import { loadtheme } from './theme/js/theme-lucas';



document.addEventListener('DOMContentLoaded', () => {
  /*
  * PAGE UI
  */
  // Intialize smooth scrolling
loadtheme()
 
$('#collapseExample').collapse('show');

  smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
  });

  const body = document.body;

  //const overlayOpenBtn = document.getElementById('overlayOpen');
  //const overlayCloseBtn = document.getElementById('overlayClose');

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
  /*function overlayOpen() {
    body.classList.add('is-overlay-visible');
  }
  function overlayClose() {
    body.classList.remove('is-overlay-visible');
  }
  overlayOpenBtn.addEventListener('click', overlayOpen);
  overlayCloseBtn.addEventListener('click', overlayClose);*/
  
function updateLineandBarLegend(typeParams, typelLookupDictionary, scenarioParams, scenarioLookupDictionary){
  //update stateclass legend
    //b = (typeof b !== 'undefined') ?  b : 1;
   // $('#collapseExample').collapse('show');
   // $('#collapseLineGraphSection2').collapse('show');
    let collapsedivsgraphs = document.getElementById('section1-graph-collapse');
    collapsedivsgraphs.classList.add("in");

    stateclassLegends = d3.selectAll('.legend-stateclass');
    //legendWidth = stateclassLegends.node().getBoundingClientRect().width;
    
    let stateclassRange = []
    let stateclassDomain = []
    
    typeParams.split(',').forEach(function(stateclassValue) {
        stateclassRange.push(typelLookupDictionary[stateclassValue])
        stateclassDomain.push(stateclassValue)
    });
    
    const stateclassColorScale = d3.scale.ordinal().domain(stateclassDomain).range(stateclassRange)
  
   d3.selectAll(".legend-stateclass > *").remove();
 
   stateclassLegends
      .append('svg')
      .attr('width', 350)
      .append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(25,20)');

    stateclassOrdinal = legend
      .shapePadding(10)
      .shapeWidth(25)
       .shape("rect")
        .useClass(false)
     // .orient('horizontal')
      .title('State Classes (km²):')
      .scale(stateclassColorScale);
    

    stateclassLegends.select('.legendOrdinal')
      .call(stateclassOrdinal);

 d3.selectAll(".legend-scenario > *").remove();

 let scenarioRange = []
 let scenarioDomain = []

  const scenarioLegends = d3.selectAll('.legend-scenario');

scenarioParams.split(',').forEach(function(scenarioValue) {
        scenarioRange.push(scenarioLookupDictionary[scenarioValue])
        scenarioDomain.push(scenarioValue)
    });


const scenarioColorScale = d3.scale.ordinal().domain(scenarioDomain).range(scenarioRange)
 scenarioLegends
    .append('svg')
    .attr('width', 150)
    .append('g')
    .attr('class', 'legendScenario')
    .attr('transform', 'translate(25,20)');

 let scenarioOrdinal = legend
    .shapePadding(25)
    .shapeWidth(36)
    .shape('line')
    //.labelOffset(20)
    .useClass(true)
    //.orient('horizontal')
    .title('Scenario:')
    .scale(scenarioColorScale);

 scenarioLegends.select('.legendScenario')
    .call(scenarioOrdinal);

  //let collapsedivsgraphs = document.getElementById('section1-graph-collapse');

   collapsedivsgraphs.classList.remove("in");
}
  
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
  
  /*let stateclassLegends = d3.selectAll('.legend-stateclass');
  let legendWidth = stateclassLegends.node().getBoundingClientRect().width;

 
  stateclassLegends
    .append('svg')
    .attr('width', 350)
    .append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(25,20)');


  let stateclassOrdinal = legend
    .shapePadding(legendWidth / 20)
    .shapeWidth(25)
   // .orient('horizontal')
    .title('State Classes (area in square kilometers):')
    .scale(colorScaleDicLegend["Land-Cover State"][0]);


  stateclassLegends.select('.legendOrdinal')
    .call(stateclassOrdinal);*/
const legend = d3.legend.color()
const stateclassColorScale = colorScaleDic["Land-Cover State"][0]
function addMapLegends(){

//stateclassLegendAll
  let stateclassLegendsAll = d3.selectAll('.legend-stateclass-all');

  stateclassLegendsAll
    .append('svg')
    .attr('width', 350)
    .append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(25,20)');

  stateclassOrdinalAll = legend
    .shapePadding(10)
    .shapeWidth(25)
     .shape("rect")
      .useClass(false)
   // .orient('horizontal')
    .title('State Classes (km²):')
    .scale(stateclassColorScale);


  stateclassLegendsAll.select('.legendOrdinal')
    .call(stateclassOrdinalAll);

}
// Scenario Legend


 
  

  // Filters legend
  const filtersLegend = Array.from(document.getElementsByClassName('legend-filters'));
  function updateFiltersLegend(d) {

    const content = `
      <ul>
        <li>Scenario ${d.scenario}</li>
        <li>Iteration ${d.iteration}</li>
        <li>${d.secondary_stratum}</li>
        <li>${d.stratum}</li>
        <li>${d.variable_detail}</li>
      </ul>
      <a data-scroll href="#filters">
        (Update)
      </a>`;

    filtersLegend.forEach((el) => {
      el.innerHTML = content;
    });

  }

  const projectLegend = Array.from(document.getElementsByClassName('legend-projects'));
  function updateProjectLegend(details) {
    
    const modelTitle = details.short_title

    
    const content = `
      <ul>
        
        <li>${modelTitle} </li>
      </ul>
      <a data-scroll href="#wrapper" class="projectScroll">
        (Update)
      </a>`;

    projectLegend.forEach((el) => {
      el.innerHTML = content;
    });

  }
  /*
  * FILTERS
  */
    let lucasVariable = 'Land-Cover State'

     function variableHasChanged(e){
        if (lucasVariable === e.detail.variable){
          return false;
        }else {
          lucasVariable = e.detail.variable
          return true;
        }
      }

  addEventListener(document, 'mapfilters.change', (e) => {
   
    section1.removeLayers()
    section1.updateIndividualMap(e.detail, addMapLegends)
  })

  

  


  function setParams(e, variableType){

    details = projects.getDetailsForId(e.detail.project).details;
    const year = []
    
    for (var i = details.years[0][variableType][0].start; i <= details.years[0][variableType][0].end; i++) {
       year.push(i);
    }

    const variableApiTypes = {
      'state_label_x': 'StateLabelX',
      'stock_type': 'StockType',
      'transition_group': 'TransitionGroup'
    }

    let group_by_values = "Timestep,Iteration,IDScenario," +  variableApiTypes[variableType]
    let params = {
        scenario: e.detail.scenario,
        secondary_stratum: e.detail.secondary_stratum,
        stratum: e.detail.stratum,
        timestep: year,
        pagesize: 1000,
      };
    if (variableType !== 'transition_group'){
      params[variableType] = e.detail.variable_detail
    }
    params.group_by=group_by_values 
    if (e.detail.iteration_type==='single_iteration'){
          params.iteration =  e.detail.iteration
      
    }else{
        params.percentile = "Iteration, "+maxPercentile

    }
      /*if (params.stratum === 'All') {
        delete params.stratum;
      };
      if (params.secondary_stratum === 'All') {
        delete params.secondary_stratum;
      }*/
      
    return params
  }

  addEventListener(document, 'filters.change', (e) => {
    document.getElementById("one").style.display = 'block';
    document.getElementById("two").style.display = 'block';
    document.getElementById("three").style.display = 'block';
    
    
   function addframe(){
   
    let scenarios = e.detail.scenario
    let lastScenario = scenarios.split(",").slice(-1).pop()
    e.detail.scenario = e.detail.scenario + "," + lastScenario
    section1.reloadMap(e.detail, addMapLegends);
  }
  function removeframe(){
    let scenarios = e.detail.scenario.split(",").slice(0,-1).join(",")
     e.detail.scenario = scenarios
    section1.reloadMap(e.detail, addMapLegends);
  }
  document.getElementById("addframe").onclick = addframe;
  document.getElementById("removeframe").onclick = removeframe;
    // Update ul element
   


    
    section1.reloadMap(e.detail, addMapLegends)
    // Update section 1 map
    //section1.updateMap(e.detail);

   // section1.reloadMap(e.detail, addMapLegends)



    minPercentile = String(100 - parseInt(e.detail.iteration))
    maxPercentile = e.detail.iteration
    
    let details = projects.getDetailsForId(e.detail.project).details;

     updateFiltersLegend(e.detail);
    updateProjectLegend(details);
    
    // Setup query params for fetching data from API

    if (e.detail.variable ==="Land-Cover State"){
      section1.chartStatus('loading');
      section2.chartStatus('loading');
      document.getElementById("three").style.display = 'none';
      let params = setParams(e, 'state_label_x')
      
      // Fetch data for state class and update charts
     
      service.loadStates(params)

        .then((data) => {
          const renameTotalAreaByYear = d3.nest()
            .entries(data)
            .map(function(group) {
              
              if (e.detail.iteration_type==='single_iteration'){
              return {
                StateLabelX: group.StateLabelX,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group.sum,
                min: group.sum,
                Mean: group.sum,
                
              }
            }else{
              return {
                StateLabelX: group.StateLabelX,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group["pc(sum, "+maxPercentile+")"],
                min: group["pc(sum, "+minPercentile+")"],
                Mean:   group["pc(sum, 50)"],
                

            }
          }
            });

         
          // Group data by stateclass and year, calculate total area (amount)
         
          const totalAreaByYear = d3.nest()
            .key((d) => d.StateLabelX+" / "+d.ScenarioID)
            .key((d) => d.Timestep)
             //.rollup((v) => d3.sum(v, (d) => d.Mean))
            .entries(renameTotalAreaByYear);
          
          // Update section 1 charts

          
          section1.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0], details, 'state_label_x');
          section1.sliderupdate(details, 'state_label_x')
      
          // Update section 2 charts
          
          section2.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0], details, 'state_label_x');
          

         


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
      
       // updateLineandBarLegend(params.state_label_x, stateClassLegendLookup, params.scenario, scenarioLegendLookup)
       
    }
    if (e.detail.variable ==="Carbon Stock"){
      section1.chartStatus('loading');
      section2.chartStatus('loading');
      document.getElementById("three").style.display = 'none';
     
        let params = setParams(e, 'stock_type')

        // Fetch data for state class and update charts
        service.loadCarbonStocks(params)
          .then((data) => {
            const renameTotalAreaByYear = d3.nest()
              .entries(data)
              .map(function(group) {
               
             if (e.detail.iteration_type==='single_iteration'){
              return {
                StockType: group.StockType,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group.sum,
                min: group.sum,
                Mean: group.sum,
                
              }
            }else{
              return {
                StockType: group.StockType,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group["pc(sum, "+maxPercentile+")"],
                min: group["pc(sum, "+minPercentile+")"],
                Mean:   group["pc(sum, 50)"],
                

            }
          }
              });
              
              
            // Group data by stateclass and year, calculate total area (amount)
           
            const totalAreaByYear = d3.nest()
              .key((d) => d.StockType+" / "+d.ScenarioID)
              .key((d) => d.Timestep)
               //.rollup((v) => d3.sum(v, (d) => d.Mean))
              .entries(renameTotalAreaByYear);
            
            // Update section 1 charts
            

            section1.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0], details, 'stock_type');
            section1.sliderupdate(details, 'state_label_x')
      
          // Update section 2 charts
          
            section2.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0], details, 'stock_type');
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

         // updateLineandBarLegend(params.stock_type, stockLegendLookup, params.scenario, scenarioLegendLookup)
    }
    if (e.detail.variable ==="Land-Cover Transition"){
      section1.chartStatus('loading');
      section3.chartStatus('loading');
      //document.getElementById("two").style.display = 'none';
     let transitionGroups = e.detail.variable_detail.split(",")
     let params = setParams(e, 'transition_group')

        // Fetch data for state class and update charts
        service.loadTransitions(params)
          .then((data) => {
            const renameTotalAreaByYear = d3.nest()
              .entries(data)
              .map(function(group) {
                /*return {
                  TransitionGroup: group.TransitionGroup,
                  ScenarioID: group.IDScenario,
                  Timestep: group.Timestep,
                  max: group["pc(sum, 95)"],
                  min: group["pc(sum, 5)"],
                  Mean:   group["pc(sum, 50)"],
                  
                }*/
            if (e.detail.iteration_type==='single_iteration'){
              return {
                TransitionGroup: group.TransitionGroup,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group.sum,
                min: group.sum,
                Mean: group.sum,
                
              }
            }else{
              return {
                TransitionGroup: group.TransitionGroup,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group["pc(sum, "+maxPercentile+")"],
                min: group["pc(sum, "+minPercentile+")"],
                Mean:   group["pc(sum, 50)"],
                

            }
          }

              });
              

           const totalAreaByYearAll = d3.nest()
              .key((d) => d.TransitionGroup+" / "+d.ScenarioID)
              
              .key((d) => d.Timestep)
               //.rollup((v) => d3.sum(v, (d) => d.Mean))
              .entries(renameTotalAreaByYear);

           let groupVariable = e.detail.variable_detail.split(",")
          
  
            const totalAreaAll2 = totalAreaByYearAll.filter(function (d) { return groupVariable.includes(d["key"].split(' / ')[0])})
            const totalAreaAll3 = totalAreaByYearAll.filter(function (d) { if (groupVariable.includes(d["key"].split(':')[0]) || groupVariable.includes(d["key"].split(' / ')[0])) return true}  )
            
            // Update section 1 charts
           
            

          section1.updateChart(totalAreaAll2, colorScaleDic[e.detail.variable][0], details, 'transition_group');
          section1.sliderupdate(details, 'transition_group')
      
          // Update section 2 charts
          
          section2.updateChart(totalAreaAll2, colorScaleDic[e.detail.variable][0], details, 'transition_group');

          section3.updateChart(totalAreaAll3, colorScaleDic["Land-Cover Transition Types"][0], transitionGroups, details, 'transition_group');
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
         
         // updateLineandBarLegend(e.detail.variable_detail, transitionClassLegendLookup, scenarioLegendLookup, '.legend-stateclass.legend-section1')
    }
    // Fetch data for transitions and update charts

  });

  // Intializing the filters starts the app on page load



 

  filters.init();
  //leafletFilters.init();


});

