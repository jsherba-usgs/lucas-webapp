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
 
  minPercentile = String(100 - parseInt(e.detail.iteration))
  maxPercentile = e.detail.iteration 

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
        pagesize: 10000,
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
    //updateFiltersLegend(e.detail);
    if (e.detail.variable ==="Land-Cover State"){
      
      let params = setParams(e, 'state_label_x')
      console.log(params)
      // Fetch data for state class and update charts
      
      service.loadStatesCSV(params)

        
       
      
       
    }
  });

  // Intializing the filters starts the app on page load

  filters.init();


});

