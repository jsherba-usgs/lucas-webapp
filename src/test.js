// Import Node Modules
import smoothScroll from 'smooth-scroll';
import d3 from 'd3';

// Import Styles
import './style/main.css';


// Import Helpers
import service from './helpers/api-service.js';
import {colorScaleDicLegend, colorScaleDic, dashed,dashedLegend } from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
import leafletMap from './components/map/index';
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
  const legend = d3.legend.color()
  const stateclassLegends = d3.selectAll('.legend-stateclass');
  const legendWidth = stateclassLegends.node().getBoundingClientRect().width;

  stateclassLegends
    .append('svg')
    .attr('width', legendWidth)
    .append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(25,20)');


  let stateclassOrdinal = legend
    .shapePadding(legendWidth / 20)
    .shapeWidth(25)
    .orient('horizontal')
    .title('State Classes (area in square kilometers):')
    .scale(colorScaleDicLegend["Land-Cover State"][0]);

  
  stateclassLegends.select('.legendOrdinal')
    .call(stateclassOrdinal);

// Scenario Legend
 const scenarioLegends = d3.selectAll('.legend-scenario');

 scenarioLegends
    .append('svg')
    .attr('width', legendWidth)
    .append('g')
    .attr('class', 'legendOrdinal')
    .attr('transform', 'translate(25,20)');

 let scenarioOrdinal = legend
    .shapePadding(legendWidth / 20)
    .shapeWidth(36)
    .shape('line')
    .labelOffset(20)
    .useClass(true)
    .orient('horizontal')
    .title('Scenario:')
    .scale(dashedLegend);

 scenarioLegends.select('.legendOrdinal')
    .call(scenarioOrdinal);
  

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
  // Add event listener to document for filters.change event
  addEventListener(document, 'filters.change', (e) => {
    
    // Change chart state to loading
    section1.chartStatus('loading');
    section2.chartStatus('loading');
    //section3.chartStatus('loading');
   // leafletFilters.init();


    // Update ul element
    updateFiltersLegend(e.detail);
    
    // Update section 1 map
    //section1.updateMap(e.detail);

    section1.reloadMap(e.detail);

    minPercentile = String(100 - parseInt(e.detail.iteration))
    maxPercentile = e.detail.iteration
    // Setup query params for fetching data from API
   
    if (variableHasChanged(e)){
      
      d3.selectAll(".legend-stateclass > *").remove();
      d3.selectAll("svg.multiLinePlusArea").remove();

     stateclassLegends
        .append('svg')
        .attr('width', legendWidth)
        .append('g')
        .attr('class', 'legendOrdinal')
        .attr('transform', 'translate(25,20)');

      stateclassOrdinal = legend
        .shapePadding(legendWidth / colorScaleDicLegend[e.detail.variable][1])
        .shapeWidth(25)
         .shape("rect")
          .useClass(false)
        .orient('horizontal')
        .title('State Classes (area in square kilometers):')
        .scale(colorScaleDicLegend[e.detail.variable][0]);


  
      stateclassLegends.select('.legendOrdinal')
        .call(stateclassOrdinal);


        
    }

    if (e.detail.variable ==="Land-Cover State"){

      let params = {
        scenario: e.detail.scenario,
        //iteration: e.detail.iteration,
        secondary_stratum: e.detail.secondary_stratum,
        stratum: e.detail.stratum,
        state_label_x: e.detail.variable_detail,
        group_by:"Timestep,StateLabelX,Iteration,IDScenario",
        percentile: "Iteration, "+maxPercentile,
        pagesize: 1000,
      };
      if (params.stratum === 'All') {
        delete params.stratum;
      };
      if (params.secondary_stratum === 'All') {
        delete params.secondary_stratum;
      }

      
      // Fetch data for state class and update charts
      service.loadStates(params)

        .then((data) => {
          const renameTotalAreaByYear = d3.nest()
            .entries(data)
            .map(function(group) {
              return {
                StateLabelX: group.StateLabelX,
                ScenarioID: group.IDScenario,
                Timestep: group.Timestep,
                max: group["pc(sum, "+maxPercentile+")"],
                min: group["pc(sum, "+minPercentile+")"],
                Mean:   group["pc(sum, 50)"],
                
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

    }
    if (e.detail.variable ==="Carbon Stock"){
      let params = {
          scenario: e.detail.scenario,
          //iteration: e.detail.iteration,
          secondary_stratum: e.detail.secondary_stratum,
          stratum: e.detail.stratum,
          stock_type: e.detail.variable_detail,
          group_by:"Timestep,StockType,Iteration,IDScenario",
          percentile: "Iteration, 95",
          pagesize: 1000,
        };
        if (params.stratum === 'All') {
          delete params.stratum;
        }
        if (params.secondary_stratum === 'All') {
          delete params.secondary_stratum;
        }

        // Fetch data for state class and update charts
        service.loadCarbonStocks(params)
          .then((data) => {
            const renameTotalAreaByYear = d3.nest()
              .entries(data)
              .map(function(group) {
                return {
                  StockType: group.StockType,
                  ScenarioID: group.IDScenario,
                  Timestep: group.Timestep,
                  max: group["pc(sum, 95)"],
                  min: group["pc(sum, 5)"],
                  Mean:   group["pc(sum, 50)"],
                  
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

    }
    if (e.detail.variable ==="Land-Cover Transition"){


      section3.chartStatus('loading');
      let params = {
          scenario: e.detail.scenario,
          //iteration: e.detail.iteration,
          secondary_stratum: e.detail.secondary_stratum,
          stratum: e.detail.stratum,
          //transition_group: e.detail.variable_detail,
          group_by:"Timestep,TransitionGroup,Iteration,IDScenario",
          percentile: "Iteration, 95",
          pagesize: 1000,
        };
        if (params.stratum === 'All') {
          delete params.stratum;
        }
        if (params.secondary_stratum === 'All') {
          delete params.secondary_stratum;
        }

        // Fetch data for state class and update charts
        service.loadTransitions(params)
          .then((data) => {
            const renameTotalAreaByYear = d3.nest()
              .entries(data)
              .map(function(group) {
                return {
                  TransitionGroup: group.TransitionGroup,
                  ScenarioID: group.IDScenario,
                  Timestep: group.Timestep,
                  max: group["pc(sum, 95)"],
                  min: group["pc(sum, 5)"],
                  Mean:   group["pc(sum, 50)"],
                  
                }

              });
              
              
            // Group data by stateclass and year, calculate total area (amount)
           
           /* const totalAreaByYear = d3.nest()
              .key((d) => d.TransitionGroup+":"+d.ScenarioID)
              .key((d) => d.TransitionGroup)
              .key((d) => d.Timestep)
               .rollup((v) => d3.sum(v, (d) => d.Mean))
              .entries(renameTotalAreaByYear);*/

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
            section3.updateChart(totalAreaAll3);
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
  leafletFilters.init();
});
