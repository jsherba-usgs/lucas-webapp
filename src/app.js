// Import Node Modules
//import smoothScroll from '../node_modules/smooth-scroll/smooth-scroll.js';
//import smoothScroll from 'smooth-scroll';
import SmoothScroll from 'smooth-scroll'
//import 'bootstrap';
import d3 from 'd3';

// Import Styles
//import './theme/css/bootstrap.css';
import './style/main.css';


// Import Helpers
import service from './helpers/api-service.js';
import {colorScaleDicLegend, colorScaleDic, dashed,dashedLegend, stateClassLegendLookup, stockLegendLookup, transitionClassLegendLookup, scenarioLegendLookup} from './helpers/colors';
import { addEventListener, triggerEvent } from './helpers/utils';

// Import Components
import filters from './components/filters/filters';
//import leafletFilters from './components/map/leaflet_filters'
import projects from './helpers/project-details';
// Import views
import section1 from './views/section1';
import section2 from './views/section2';
import section3 from './views/section3';
//import { loadtheme } from './theme/js/theme-lucas';

document.addEventListener('DOMContentLoaded', () => {
  
  /*
  * PAGE UI
  */

  const body = document.body;

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
  
  /*
  * INTIALIZATIONS FOR SECTION 1
  */

  function loadMapSection() {
    section1.init();

    const legend = d3.legend.color()
    const stateclassColorScale = colorScaleDic["Land-Cover State"][0]

    function addMapLegends() {

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


    let lucasVariable = 'Land-Cover State'

    function variableHasChanged(e) {
      if (lucasVariable === e.detail.variable) {
        return false;
      } else {
        lucasVariable = e.detail.variable
        return true;
      }
    }

    addEventListener(document, 'mapfilters.change', (e) => {

      section1.removeLayers()
      section1.updateIndividualMap(e.detail, addMapLegends)
    })

    document.getElementById("one").style.display = 'block';
    //  document.getElementById("two").style.display = 'block';
    //  document.getElementById("three").style.display = 'block';

    let initialDetails = {
      iteration: "95",
      iteration_type: "percentile",
      project: "7096",
      scenario: "6370",
      secondary_stratum: "All",
      stratum: "All",
      variable: "Land-Cover State",
      variable_detail: "Agriculture"
    }

    let scenarios = initialDetails.scenario


    function addframe() {

      if (scenarios.split(",").length < 3) {
        let lastScenario = scenarios.split(",").slice(-1).pop()
        initialDetails.scenario = initialDetails.scenario + "," + lastScenario
        section1.reloadMap(initialDetails, addMapLegends);
        document.getElementById('addremoveframe').onclick = function () {
          removeframe();
        }
        document.getElementById('addremoveframe').innerText = "Remove Map Frame";
      }
    }

    function removeframe() {
      if (initialDetails.scenario.split(",").length >= 2) {
        let scenarios = initialDetails.scenario.split(",").slice(0, -1).join(",")
        initialDetails.scenario = scenarios
        section1.reloadMap(initialDetails, addMapLegends);
        document.getElementById('addremoveframe').onclick = function () {
          addframe();
        }
        document.getElementById('addremoveframe').innerText = "Add Map Frame";
      }
    }

    document.getElementById('addremoveframe').onclick = addframe;

    section1.reloadMap(initialDetails, addMapLegends)

    // Open, close overlay
    function overlayOpen() {
      body.classList.add('is-overlay-visible');
    }

    function overlayClose() {
      body.classList.remove('is-overlay-visible');
    }

    const overlayOpenBtns = document.querySelectorAll('.overlayOpen');
    for (var i = 0; i < overlayOpenBtns.length; i++) {
      overlayOpenBtns[i].addEventListener('click', overlayOpen)
    }
    const overlayCloseBtn = document.getElementById('overlayClose');
    overlayCloseBtn.addEventListener('click', overlayClose)

  };

  function loadGraphSection() {
    let projectStart = "7096"
    let scenarioStart = 'option[value="7096"]'
    filters.init(scenarioStart,projectStart);

    let lucasVariable = 'Land-Cover State'

     function variableHasChanged(e){
        if (lucasVariable === e.detail.variable){
          return false;
        }else {
          lucasVariable = e.detail.variable
          return true;
        }
      }

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
     
    if (e.detail.iteration_type==='single_iteration'){
        let group_by_values = "Timestep,Iteration,IDScenario," +  variableApiTypes[variableType]
        params.group_by=group_by_values
        params.iteration =  e.detail.iteration
      
    }else{
        iteration_top = String(parseInt(e.detail.iteration)+1000)
        iteration_bottom = String((100-parseInt(e.detail.iteration))+1000)
        params.iteration = iteration_bottom +',1050,'+iteration_top
        

    }
      
    return params
  }
 
  addEventListener(document, 'filters.change', (e) => {
   
    document.getElementById("two").style.display = 'block';
    minPercentile = String(100 - parseInt(e.detail.iteration))
    maxPercentile = e.detail.iteration
    
    let details = projects.getDetailsForId(e.detail.project).details;

    //updateFiltersLegend(e.detail);
    //updateProjectLegend(details);
    
    // Setup query params for fetching data from API

    if (e.detail.variable ==="Land-Cover State"){
      section2.chartStatus('loading');
      
      let params = setParams(e, 'state_label_x')
      
      // Fetch data for state class and update charts
      
      service.loadStates(params)

        .then((data) => {
          
          const percentile_dictionary = d3.nest()
          .key(function(d) { return d.IDScenario; })
          .key(function(d) { return d.StateLabelX; })
          .key(function(d) { return d.Timestep; })
          .key(function(d) { return d.Iteration; })
          .rollup()
          .map(data)
         
          data.forEach(function(element) {
            let iteration_vals = params.iteration.split(',')
            if (element.Iteration === 1050){
            
            element.max = percentile_dictionary[element.IDScenario][element.StateLabelX][element.Timestep][parseInt(iteration_vals[2])][0]['Amount']
            element.min = percentile_dictionary[element.IDScenario][element.StateLabelX][element.Timestep][parseInt(iteration_vals[0])][0]['Amount']
            element.Mean =percentile_dictionary[element.IDScenario][element.StateLabelX][element.Timestep][1050][0]['Amount']
          }

          })
          data = data.filter(function(el) {
              return el.Iteration === 1050;
          });
          
         
          const totalAreaByYear = d3.nest()
            .key((d) => d.StateLabelX+" / "+d.IDScenario)
            .key((d) => d.Timestep)
            
            .entries(data);
          
      
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
      
       
    }
    if (e.detail.variable ==="Carbon Stock"){
      
      section2.chartStatus('loading');
     
     
        let params = setParams(e, 'stock_type')

        // Fetch data for state class and update charts
        service.loadCarbonStocks(params)
          .then((data) => {

          const percentile_dictionary = d3.nest()
          .key(function(d) { return d.IDScenario; })
          .key(function(d) { return d.StockType; })
          .key(function(d) { return d.Timestep; })
          .key(function(d) { return d.Iteration; })
          .rollup()
          .map(data)
         
          data.forEach(function(element) {
            let iteration_vals = params.iteration.split(',')
            if (element.Iteration === 1050){
            
            element.max = parseFloat(percentile_dictionary[element.IDScenario][element.StockType][element.Timestep][parseInt(iteration_vals[2])][0]['Amount'].toFixed(2));
            element.min = parseFloat(percentile_dictionary[element.IDScenario][element.StockType][element.Timestep][parseInt(iteration_vals[0])][0]['Amount'].toFixed(2));
            element.Mean =parseFloat(percentile_dictionary[element.IDScenario][element.StockType][element.Timestep][1050][0]['Amount'].toFixed(2));
          }

          })
          data = data.filter(function(el) {
              return el.Iteration === 1050;
          });
              
            // Group data by stateclass and year, calculate total area (amount)
           
            const totalAreaByYear = d3.nest()
              .key((d) => d.StockType+" / "+d.IDScenario)
              .key((d) => d.Timestep)
              .entries(data);
            
            
            
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

         
    }
    if (e.detail.variable ==="Land-Cover Transition"){
      
      section3.chartStatus('loading');
     section3.init()
     let transitionGroups = e.detail.variable_detail.split(",")
     let params = setParams(e, 'transition_group')

        // Fetch data for state class and update charts
        service.loadTransitions(params)
          .then((data) => {
             const percentile_dictionary = d3.nest()
          .key(function(d) { return d.IDScenario; })
          .key(function(d) { return d.TransitionGroup; })
          .key(function(d) { return d.Timestep; })
          .key(function(d) { return d.Iteration; })
          .rollup()
          .map(data)
         
          data.forEach(function(element) {
            let iteration_vals = params.iteration.split(',')
            if (element.Iteration === 1050){
            
            element.max = percentile_dictionary[element.IDScenario][element.TransitionGroup][element.Timestep][parseInt(iteration_vals[2])][0]['Amount']
            element.min = percentile_dictionary[element.IDScenario][element.TransitionGroup][element.Timestep][parseInt(iteration_vals[0])][0]['Amount']
            element.Mean =percentile_dictionary[element.IDScenario][element.TransitionGroup][element.Timestep][1050][0]['Amount']
          }

          })
          data = data.filter(function(el) {
              return el.Iteration === 1050;
          });
              
              
           const totalAreaByYearAll = d3.nest()
              .key((d) => d.TransitionGroup+" / "+d.IDScenario)
              
              .key((d) => d.Timestep)
               
              .entries(data);

           let groupVariable = e.detail.variable_detail.split(",")
          
  
            const totalAreaAll2 = totalAreaByYearAll.filter(function (d) { return groupVariable.includes(d["key"].split(' / ')[0])})
            const totalAreaAll3 = totalAreaByYearAll.filter(function (d) { if (groupVariable.includes(d["key"].split(':')[0]) || groupVariable.includes(d["key"].split(' / ')[0])) return true}  )
            
            // Update section 1 charts
           
            

          
      
          // Update section 2 charts
          
          //section3.updateChart(totalAreaAll2, colorScaleDic[e.detail.variable][0], details, 'transition_group');

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
         
         
    }
  })
  }
/*smoothScroll.init({
  updateURL: false,
  easing: 'easeInOutCubic',
});*/

//Create function to move between different tabs
function setTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

//Run functions on tab click
const tabSummary = document.getElementById('tabSummary');
tabSummary.onclick = function (e) {
  setTab(e, "Summary")
}

const tabMap = document.getElementById('tabMap');
tabMap.onclick = function (e) {

  setTab(e, "Map")
  loadMapSection()

}
const tabGraph = document.getElementById('tabGraph');
tabGraph.onclick = function (e) {
  setTab(e, "Graph")
  loadGraphSection()
}

const tabDownload = document.getElementById('tabDownload');
tabDownload.onclick = function (e) {
  setTab(e, "Download")
}

document.getElementById("tabGraph").click();

});

