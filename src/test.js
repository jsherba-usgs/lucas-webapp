// Import Node Modules
import smoothScroll from 'smooth-scroll';
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

// Import views
import section1 from './views/section1';
import section2 from './views/section2';
import section3 from './views/section3';


document.addEventListener('DOMContentLoaded', () => {
  /*
  * PAGE UI
  */
  // Intialize smooth scrolling
 
$('#collapseExample').collapse('show');

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

  // Add event listener to document for filters.change event

  /*const mapExpandButton = document.getElementById('mapexpand');
  mapExpandButton.addEventListener("click", expandmap);

  const chartExpandButton = document.getElementById('chartexpand');
  chartExpandButton.addEventListener("click", expandchart);*/


  /*function expandmap(){
      
      let isfull = window.getComputedStyle(document.getElementById("chartarticle"),null).getPropertyValue('display')
      
      if (isfull === "block"){
        section1.sliderremove()

         document.getElementById("mapexpandicon").className = "fa fa-compress";
         document.getElementById("chartarticle").className = "col half hidden";

         document.getElementById("mapslider").className = "chroniton-slider";
         document.getElementById("mapslidercontrol").className = "controls";
         section1.sliderinit()

       }else{
         section1.sliderremove()
         document.getElementById("mapslider").className = "placeholdclass1";
         document.getElementById("mapslidercontrol").className = "placeholdclass2";
        

         document.getElementById("mapexpandicon").className = "fa fa-expand";
         document.getElementById("chartarticle").className = "col half";

         section1.sliderinit()
       }
   section1.resizeMap()
    //section1.reloadMap(e.detail);
   }

   
   function expandchart(){

      let isfull = window.getComputedStyle(document.getElementById("maparticle"),null).getPropertyValue('display')
      
      if (isfull === "block"){
          document.getElementById("chartexpandicon").className = "fa fa-compress";
         document.getElementById("maparticle").className = "col half hidden";
         document.getElementById("chartarticle").style.maxWidth = "100%";
       }else{
         document.getElementById("chartexpandicon").className = "fa fa-expand";
        document.getElementById("chartarticle").style.maxWidth = "50%";
        document.getElementById("maparticle").className = "col half";

        document.getElementById("chartarticle").className = "col half";
        
        
       }
    section1.resizeMap()
    section1.resizeChart()
   }*/

   const year = []

    for (var i = 2011; i <= 2061; i++) {
       year.push(i);
    }
  function setParams(e, variableType){
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
      if (params.stratum === 'All') {
        delete params.stratum;
      };
      if (params.secondary_stratum === 'All') {
        delete params.secondary_stratum;
      }
      
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
    updateFiltersLegend(e.detail);
    
    // Update section 1 map
    //section1.updateMap(e.detail);

    section1.reloadMap(e.detail, addMapLegends)



    minPercentile = String(100 - parseInt(e.detail.iteration))
    maxPercentile = e.detail.iteration
    

    
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


        
          section1.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0]);
      
          // Update section 2 charts
          
          section2.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0]);




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
      
        updateLineandBarLegend(params.state_label_x, stateClassLegendLookup, params.scenario, scenarioLegendLookup)
       
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
            
            section1.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0]);
        
            // Update section 2 charts
            
            section2.updateChart(totalAreaByYear, colorScaleDic[e.detail.variable][0]);
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

          updateLineandBarLegend(params.stock_type, stockLegendLookup, params.scenario, scenarioLegendLookup)
    }
    if (e.detail.variable ==="Land-Cover Transition"){
      section1.chartStatus('loading');
      section3.chartStatus('loading');
      //document.getElementById("two").style.display = 'none';
     let transitionGroups = e.detail.variable_detail.split(",")
     let params = setParams(e, 'transition_group')

      /*let params = {
          scenario: e.detail.scenario,
          //iteration: e.detail.iteration,
          secondary_stratum: e.detail.secondary_stratum,
          stratum: e.detail.stratum,
          //transition_group: e.detail.variable_detail,
          group_by:"Timestep,TransitionGroup,Iteration,IDScenario",
          percentile: "Iteration, 95",
          timestep: year,
          pagesize: 1000,
        };
        if (params.stratum === 'All') {
          delete params.stratum;
        }
        if (params.secondary_stratum === 'All') {
          delete params.secondary_stratum;
        }*/

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
            
            section1.updateChart(totalAreaAll2, colorScaleDic[e.detail.variable][0]);
        
            // Update section 2 charts
            section2.updateChart(totalAreaAll2, colorScaleDic[e.detail.variable][0]);

            //section3.updateChart(totalAreaByYear, e.detail.variable_detail);
            //section3.chartStatus('loading');
            section3.updateChart(totalAreaAll3, colorScaleDic["Land-Cover Transition Types"][0], transitionGroups);
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
         
          updateLineandBarLegend(e.detail.variable_detail, transitionClassLegendLookup, '.legend-stateclass.legend-section1')
    }
    // Fetch data for transitions and update charts
   /* service.loadTransitions(params)
      .then((data) => {
        // Group data by transition group and year, calculate total area (amount)
        const totalAreaByYear = d3.nest()
          .key((d) => d.TransitionGroup).sortKeys(d3.ascending)
          .key((d) => d.Timestep)
          .rollup((v) => d3.sum(v, (d) => d.Amount))
          .entries(data);

        // Update section 3 ag contraction chart
        section3.updateChart(totalAreaByYear);
      })
      .catch((error) => {
        if (error.message.indexOf('No data') > -1) {
          d3.selectAll('#three .chart')
            .classed('no-data', true)
            .select('svg')
              .remove();
        }
        console.log(error);
      });*/
  });

  // Intializing the filters starts the app on page load



 

  filters.init();
  //leafletFilters.init();


});

