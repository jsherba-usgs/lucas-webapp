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
import filters from './components/filters/filters_download';


// Import views
//import sectionDownload from './views/section_download';



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

  
  /*
  * INTIALIZATIONS FOR SECTION 1
  */
  //section1.init();



  

  addEventListener(document, 'filters.change', (e) => {
    console.log(e.detail)
    

    timestepBegin= parseInt(e.detail.timestep_begin)
    timestepEnd= parseInt(e.detail.timestep_end)

    const year = []

      for (var i = timestepBegin; i <= timestepEnd; i++) {
         year.push(i);
      }

    iterationBegin= parseInt(e.detail.iteration_begin)
    iterationEnd= parseInt(e.detail.iteration_end)

    const iterations = []

      for (var i = iterationBegin; i <= iterationEnd; i++) {
         iterations.push(i);
      }
    function setParams(e, variableType){
      const variableApiTypes = {
        'state_label_x': 'StateLabelX',
        'stock_type': 'StockType',
        'transition_group': 'TransitionGroup'
      }

      let group_by_values = "Timestep,Iteration,IDScenario,Stratum,SecondaryStratum," +  variableApiTypes[variableType]
      let params = {
          scenario: e.detail.scenario,
          secondary_stratum: e.detail.secondary_stratum,
          stratum: e.detail.stratum,
          timestep: year,
          iteration: iterations,
          pagesize: 10000,
        };
      if (variableType !== 'transition_group'){
        params[variableType] = e.detail.variable_detail
      }
        
        if (e.detail.sumby_id==='custom_group'){

          params.group_by=e.detail.sumby

        }else{
          params.group_by=group_by_values 
        }
        if (e.detail.sumby_id==='custom_group'&&e.detail.iteration_id==='percentile'){
              params.group_by+=',Iteration'
        }
        if (e.detail.iteration_id==='percentile'){
          //minPercentile = String(100 - parseInt(e.detail.iteration_percentile))
          maxPercentile = e.detail.iteration_percentile
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
      //updateFiltersLegend(e.detail);
    if (e.detail.variable ==="Land-Cover State"){
      
      let params = setParams(e, 'state_label_x')
      
      // Fetch data for state class and update charts
      let variableType= 'stateclasses/'
      service.loadCSV(params, variableType)
         
      }
    if (e.detail.variable ==="Carbon Stock"){

      let params = setParams(e, 'stock_type')
      let variableType= 'stocktypes/'
      service.loadCSV(params, variableType)
    }
    if (e.detail.variable ==="Land-Cover Transition"){
    
     let params = setParams(e, 'transition_group')
     let variableType= 'transitions/'
     service.loadCSV(params, variableType)

   }
  });

  // Intializing the filters starts the app on page load

  filters.init();


});

