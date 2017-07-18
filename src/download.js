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
import projects from './helpers/project-details'

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

  function leftPad(val = 1, length = 4) {
  const str = val.toString();
  return `${'0'.repeat(length - str.length)}${str}`;
  }
  /*
  * INTIALIZATIONS FOR SECTION 1
  */
  //section1.init();



  

  addEventListener(document, 'filters.change', (e) => {
    
    

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
      service.tabularDownload(params, variableType)
         
      }
    if (e.detail.variable ==="Carbon Stock"){

      let params = setParams(e, 'stock_type')
      let variableType= 'stocktypes/'
      service.tabularDownload(params, variableType)
    }
    if (e.detail.variable ==="Land-Cover Transition"){
    
     let params = setParams(e, 'transition_group')
     let variableType= 'transitions/'
     service.tabularDownload(params, variableType)

   }
  });

  addEventListener(document, 'filters-spatial.change', (e) => {
    
    let variable_detail = JSON.parse(e.detail.variable_detail);
    let params = {
          project:e.detail.project,
          scenario: e.detail.scenario,
          secondary_stratum: e.detail.secondary_stratum,
          stratum: e.detail.stratum,
          timestep_begin: e.detail.timestep_begin,
          timestep_end: e.detail.timestep_end,
          variable_detail: variable_detail.id ,
          variable_detail_type:variable_detail.type,
          iteration: e.detail.iteration,
          
        };
  
     
     
      if (params.secondary_stratum==='All'&&params.stratum==='All'){
            let strataJson = false
            let slug = "scenario-"+params.scenario.toString()+"-spatial-it"+leftPad(params.iteration)+"-"+params.variable_detail_type

            if (params.variable_detail != "1"){
                let transID = "-"+params.variable_detail
                slug += (transID)
            }
            let dateBegin =params.timestep_begin + "-01-01"
            let dateEnd = params.timestep_end + "-01-01"
            let urlPath = slug + "/" +dateBegin+ "/" + dateEnd
            
      
              //scenario-6385-spatial-it0015-sc/2001-01-01/2010-01-01/
              
              service.spatialDownload(urlPath, strataJson)


      }else{
        let selectedStrata
        if(params.secondary_stratum==="All"){
          selectedStrata = params.stratum

        }else{
          selectedStrata = params.secondary_stratum
        }
        
        selectedStrata = selectedStrata.replace(/'/g, "")

        

        let url = `http://127.0.0.1:8000/locations/${selectedStrata}/?format=json`
     
        console.log(url)
      
       fetch(url)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
           
            // projects.getDetailsForId(params.project).details.secondary_stratum.find((item) => item.id === params.secondary_stratum).geom
            strataJson =JSON.stringify(data)
            console.log(strataJson)

            let slug = "scenario-"+params.scenario.toString()+"-spatial-it"+leftPad(params.iteration)+"-"+params.variable_detail_type

            if (params.variable_detail != "1"){
                let transID = "-"+params.variable_detail
                slug += (transID)
            }
            let dateBegin =params.timestep_begin + "-01-01"
            let dateEnd = params.timestep_end + "-01-01"
            let urlPath = slug + "/" +dateBegin+ "/" + dateEnd
            
            
            console.log(strataJson)
            service.spatialDownload(urlPath, strataJson)






          })
       
        
    }    
      
  })

  // Intializing the filters starts the app on page load

  filters.init();


});

