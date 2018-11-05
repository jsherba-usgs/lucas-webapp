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
//import section2 from './views/section2';
//import section3 from './views/section3';
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
  section1.init();

  /*
  * INTIALIZATIONS FOR SECTION 2
  */
  //section2.init();

  /*
  * INTIALIZATIONS FOR SECTION 3
  */
  //section3.init();

  /*
  * ADD COMMON LEGEND ELEMENTS
  */

  
 
const legend = d3.legend.color()
const stateclassColorScale = colorScaleDic["Land-Cover State"][0]

function addMapLegends(){

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

  document.getElementById("one").style.display = 'block';
  //  document.getElementById("two").style.display = 'block';
  //  document.getElementById("three").style.display = 'block';

    let initialDetails = {iteration:"95",iteration_type:"percentile",project:"7096",scenario:"6370",secondary_stratum:"All",stratum:"All",variable:"Land-Cover State",variable_detail:"Agriculture"}

    let scenarios = initialDetails.scenario


function addframe(){
    
    if (scenarios.split(",").length <3){
    let lastScenario = scenarios.split(",").slice(-1).pop()
    initialDetails.scenario = initialDetails.scenario + "," + lastScenario
    section1.reloadMap(initialDetails, addMapLegends);
    document.getElementById('addremoveframe').onclick = function() { removeframe(); }
    document.getElementById('addremoveframe').innerText= "Remove Map Frame";
    }
  }

  function removeframe(){
    if (initialDetails.scenario.split(",").length >=2){
      let scenarios = initialDetails.scenario.split(",").slice(0,-1).join(",")
       initialDetails.scenario = scenarios
      section1.reloadMap(initialDetails, addMapLegends);
      document.getElementById('addremoveframe').onclick = function() { addframe(); }
      document.getElementById('addremoveframe').innerText= "Add Map Frame";
    }
  }


   /*function addframe(){
    
    if (scenarios.split(",").length <3){
    let lastScenario = scenarios.split(",").slice(-1).pop()
    initialDetails.scenario = initialDetails.scenario + "," + lastScenario
    section1.reloadMap(initialDetails, addMapLegends);
    }
  }

  function removeframe(){
    if (initialDetails.scenario.split(",").length >=2){
      let scenarios = initialDetails.scenario.split(",").slice(0,-1).join(",")
       initialDetails.scenario = scenarios
      section1.reloadMap(initialDetails, addMapLegends);
    }
  }*/


  

  //document.getElementById( "testButton" ).onclick = testAdd;
  document.getElementById('addremoveframe').onclick = addframe;
 // document.getElementById("addframe").onclick = addframe;
  //document.getElementById("removeframe").onclick = removeframe;
    

  section1.reloadMap(initialDetails, addMapLegends)

/*  addEventListener(document, 'filters.change', (e) => {
    document.getElementById("one").style.display = 'block';
  //  document.getElementById("two").style.display = 'block';
  //  document.getElementById("three").style.display = 'block';
    

   function addframe(){
   
    let scenarios = e.detail.scenario
    
    if (scenarios.split(",").length <3){
    let lastScenario = scenarios.split(",").slice(-1).pop()
    e.detail.scenario = e.detail.scenario + "," + lastScenario
    section1.reloadMap(e.detail, addMapLegends);
    }
  }
  function removeframe(){
    if (e.detail.scenario.split(",").length >=2){
      let scenarios = e.detail.scenario.split(",").slice(0,-1).join(",")
       e.detail.scenario = scenarios
      section1.reloadMap(e.detail, addMapLegends);
    }
  }
  document.getElementById("addframe").onclick = addframe;
  document.getElementById("removeframe").onclick = removeframe;
    
  console.log(e.detail)
  section1.reloadMap(e.detail, addMapLegends)
   
  });*/

  // Intializing the filters starts the app on page load
 

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

  /*smoothScroll.init({
    updateURL: false,
    easing: 'easeInOutCubic',
  });*/

});

