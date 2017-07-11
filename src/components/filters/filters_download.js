import content from './filters_download.html';
import projectFilterContent from './filters_projects_download.html';
import percentileFilterContent from './filters_percentile_download.html';
import { triggerEvent } from './../../helpers/utils';
import projects from './../../helpers/project-details';

const model = {};

let filtersContainer;
let filtersContainer2;
let projectId;
let details;
let projectSelect;
let scenarioSelect;
let secStratumSelect;
let stratumSelect;
let secStratumSelectSpatial;
let stratumSelectSpatial;
let variableSelect;
let iterationInput;
let iterationInputSpatial;
let variableDetail;
let iterationTypeSelect;
let strataOverlayOpenBtn
let strataOverlayCloseBtn


function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function getOptionVals(selection) {
  let details = [];
  Object.keys(selection).forEach((key) => {
    if (selection[key].selected === true){
      details.push(selection[key].value)
    }
  });
  detailsString = details.join(",")
  return detailsString
};

function removeOptions(selectbox) {
  for (let i = 0; i < selectbox.options.length; i++) {
    //if (selectbox.options[i].value !== 'All') {
      selectbox.remove(i)
      i--
    //}
  }
}
function onScenarioChange () {
    updateIterationInput()
    updateTimesteps()
  }
function onScenarioChangeSpatial() {
    updateIterationInputSpatial();
    updateTimestepsSpatial();
  }

function updateIterationInput() {
 
  const id = iterationTypeSelect.value;
  if (id === 'percentile'){
    removeClass(iteration1, 'field')  
    addClass(iteration1, 'field-full')  
    iteration2.style.display = "none"
    const getIterationDetail = details.iteration.find((item) => item.id === id);
    iteration1Label.innerHTML = getIterationDetail.label
    //const input = document.createElement('input');
    iterationInput.name = getIterationDetail.name
    iterationInput.type = getIterationDetail.type
    iterationInput.min =  getIterationDetail.min
    iterationInput.max =  getIterationDetail.max
    iterationInput.value = getIterationDetail.value

  }else if (id === "single_iteration"){
    removeClass(iteration1, 'field-full')
    addClass(iteration1, 'field')  
    iteration2.style.display = "block"
    
    const getIterationDetail = details.iteration.find((item) => item.id === id);
    iteration1Label.innerHTML = getIterationDetail.label
    iterationInput.name = getIterationDetail.name
    iterationInput.type = getIterationDetail.type
    iterationInput.min =  getIterationDetail.min
    iterationInput.max =  getIterationDetail.max
    iterationInput.value = getIterationDetail.min
     
    iterationInputEnd.name = getIterationDetail.name
    iterationInputEnd.type = getIterationDetail.type
    iterationInputEnd.min =  getIterationDetail.min
    iterationInputEnd.max =  getIterationDetail.max
    iterationInputEnd.value = getIterationDetail.max
  }
}
function updateIterationInputSpatial(){
  const id = "single_iteration"
  const getIterationDetail = details.iteration.find((item) => item.id === id);

  iterationInputSpatial.name = getIterationDetail.name
  iterationInputSpatial.type = getIterationDetail.type
  iterationInputSpatial.min =  getIterationDetail.min
  iterationInputSpatial.max =  getIterationDetail.max
  iterationInputSpatial.value = getIterationDetail.value
  
}

function updateTimesteps(){
   const timestepDetails = (details.timestep[0])
   timestepBegin.name = timestepDetails.name
   timestepBegin.type = timestepDetails.type
   timestepBegin.min =  timestepDetails.min
   timestepBegin.max =  timestepDetails.max
   timestepBegin.value = timestepDetails.min
   timestepEnd.name = timestepDetails.name
   timestepEnd.type = timestepDetails.type
   timestepEnd.min =  timestepDetails.min
   timestepEnd.max =  timestepDetails.max
   timestepEnd.value = timestepDetails.max
}

function updateTimestepsSpatial(){
   const timestepDetails = (details.timestep[0])
   
   timestepBeginSpatial.name = timestepDetails.name
   timestepBeginSpatial.type = timestepDetails.type
   timestepBeginSpatial.min =  timestepDetails.min
   timestepBeginSpatial.max =  timestepDetails.max
   timestepBeginSpatial.value = timestepDetails.min
   timestepEndSpatial.name = timestepDetails.name
   timestepEndSpatial.type = timestepDetails.type
   timestepEndSpatial.min =  timestepDetails.min
   timestepEndSpatial.max =  timestepDetails.max
   timestepEndSpatial.value = timestepDetails.max
}

function updateVariableDetail() {
  variableDetail.options.length = 0
  const id = variableSelect.value;
  const getvariableDetail = details.variable.find((item) => item.id === id);
  getvariableDetail.variable_detail.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableDetail.add(option);
    });
    variableDetail[0].selected = true
    variableDetail.disabled = false;
    variableDetail.setAttribute('size',variableDetail.childElementCount);
  }

function updateVariableDetailSpatial(){
  variableDetailSpatial.options.length = 0
  const id = variableSelectSpatial.value;
  const getvariableDetailSpatial = details.variable.find((item) => item.id === id);
  getvariableDetailSpatial.variable_detail.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableDetailSpatial.add(option);
    });
    variableDetailSpatial[0].selected = true
    variableDetailSpatial.disabled = false;
    variableDetailSpatial.setAttribute('size',variableDetailSpatial.childElementCount);
  }


function updateFields() {
  
  projectId = this.options[this.selectedIndex].value;

  details = projects.getDetailsForId(projectId).details;

  if (details) {



    // Populate scenario select box
    scenarioSelect = filtersContainer.querySelector('select[name=scenario]');
    removeOptions(scenarioSelect);
    details.scenario.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      scenarioSelect.add(option);
    });
    scenarioSelect[0].selected = true
    scenarioSelect.disabled = false;

    scenarioSelect.setAttribute('size',scenarioSelect.childElementCount);


    // Populate scenario select box spatial
    scenarioSelectSpatial = filtersContainer.querySelector('select[name=scenario-spatial]');
    removeOptions(scenarioSelectSpatial);
    details.scenario.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      scenarioSelectSpatial.add(option);
    });
    scenarioSelectSpatial[0].selected = true
    scenarioSelectSpatial.disabled = false;

    scenarioSelectSpatial.setAttribute('size',scenarioSelectSpatial.childElementCount);

    // Populate secondary stratum select box
    secStratumSelect = filtersContainer.querySelector('select[name=secondary_stratum]');
    removeOptions(secStratumSelect);
    details.secondary_stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      secStratumSelect.add(option);
    });
    secStratumSelect.disabled = false;

    secStratumSelectSpatial = filtersContainer.querySelector('select[name=secondary_stratum-spatial]');
    removeOptions(secStratumSelectSpatial);
    details.secondary_stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      secStratumSelectSpatial.add(option);
    });
   
    secStratumSelectSpatial.disabled = false;

    // Populate stratum select box
    stratumSelect = filtersContainer.querySelector('select[name=stratum]');
    removeOptions(stratumSelect);
    details.stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      stratumSelect.add(option);
    });
    stratumSelect.disabled = false;

    stratumSelectSpatial = filtersContainer.querySelector('select[name=stratum-spatial]');
    removeOptions(stratumSelectSpatial);
    details.stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      stratumSelectSpatial.add(option);
    });
    stratumSelectSpatial.disabled = false;

   

     // Populate variable select box
    variableSelect = filtersContainer.querySelector('select[name=variable]');
    removeOptions(variableSelect);
    details.variable.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableSelect.add(option);
    });
    variableSelect.disabled = false;

     // Populate variable select box
    variableSelectSpatial = filtersContainer.querySelector('select[name=variable-spatial]');
    removeOptions(variableSelectSpatial);
    details.variable.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableSelectSpatial.add(option);
    });
    variableSelectSpatial.disabled = false;


    
    onScenarioChange();
    onScenarioChangeSpatial();

  }
}

model.init = () => {

  let iteration1 = document.getElementById('iteration1');
  let iteration2 = document.getElementById('iteration2');
  let iteration1Label = document.getElementById("iteration1Label")
  filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = content;

  iterationTypeSelect = filtersContainer.querySelector('select[name=iteration_type]');
  iterationTypeSelect.disabled = false;

  iterationInput = filtersContainer.querySelector('input[name=iteration]');
  iterationInput.disabled = false;

  iterationInputEnd = filtersContainer.querySelector('input[name=iteration-end]');
  iterationInputEnd.disabled = false;

  iterationInputSpatial = filtersContainer.querySelector('input[name=iteration-spatial]');
  iterationInputSpatial.disabled = false;

  timestepBegin = filtersContainer.querySelector('input[name=timestep-begin]');
  timestepBegin.disabled = false;

  timestepEnd = filtersContainer.querySelector('input[name=timestep-end]');
  timestepEnd.disabled = false;

  timestepBeginSpatial = filtersContainer.querySelector('input[name=timestep-begin-spatial]');
  timestepBeginSpatial.disabled = false;

  timestepEndSpatial = filtersContainer.querySelector('input[name=timestep-end-spatial]');
  timestepEndSpatial.disabled = false;

  variableDetail = filtersContainer.querySelector('select[name=variable_detail]');
  variableDetail.disabled = false;

  variableDetailSpatial = filtersContainer.querySelector('select[name=variable_detail-spatial]');
  variableDetailSpatial.disabled = false;

  // Initialize container
  filtersContainer2 = document.getElementById('filters_project');
  filtersContainer2.innerHTML = projectFilterContent;
  

  // Add list of projects to content
  projectSelect = filtersContainer2.querySelector('select[name=project]');

  projects.getList().forEach((project) => {
    const option = document.createElement('option');
    option.text = project.name;
    option.value = project.id;
    projectSelect.add(option);
  });
  




  projectSelect.onchange = updateFields;
  projectSelect.onchange();

  scenarioSelect.onchange = onScenarioChange//updateIterationInput;updateTimesteps;
  scenarioSelectSpatial.onchange = onScenarioChangeSpatial//updateIterationInputSpatial;updateTimestepsSpatial;
  //scenarioSelect.onchange = updateTimesteps;
  //scenarioSelectSpatial.onchange = updateTimestepsSpatial;
  scenarioSelect.onchange();
  scenarioSelectSpatial.onchange();

  iterationTypeSelect.onchange = updateIterationInput;
  iterationTypeSelect.onchange();

  variableSelect.onchange = updateVariableDetail;
  variableSelectSpatial.onchange = updateVariableDetailSpatial;
  variableSelect.onchange();
  variableSelectSpatial.onchange()

  // Create a custom event that is dispatched when Update button on form is clicked
  const form =  filtersContainer.querySelector('.filterform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  //const form2 = filtersContainer2.querySelector('form')
 
  
  //const form2 = filtersContainer2.querySelector('form');
  form.onsubmit = function (e) {

    // prevent default
    e.preventDefault();
    // dispatch custom event
     triggerEvent(document, 'filters.change', {
      detail: model.getValues()

    });


  };


 /*form2.onsubmit = function (e) {
    // prevent default
    e.preventDefault();
    // dispatch custom event
    
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };*/


  /*triggerEvent(document, 'filters.change', {
    detail: model.getValues()

  });*/

  
  strataOverlayOpenBtn= document.getElementById('strataoverlayOpen');
  strataOverlayOpenBtn.addEventListener('click', strataoverlayOpen);
  // Open, close overlay
  function strataoverlayOpen() {
    
    //document.body.classList.add('is-overlay-visible2');
    stratamodal.style.display = "block";
    stratamap.invalidateSize();
    stratamap.fitBounds(geojsonLayer.getBounds());
  }
  
  /*strataOverlayCloseBtn = document.getElementById('strataoverlayClose');
  strataOverlayCloseBtn.addEventListener('click', strataoverlayClose);
  function strataoverlayClose() {
    document.body.classList.remove('is-overlay-visible2');
  }*/
 


const stratamodal = document.getElementById('strataModal');
const strataspan = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
strataspan.onclick = function() {
    stratamodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == stratamodal) {
        stratamodal.style.display = "none";
    }
}

jsonstrata = projects.getDetailsForId(projectId).details.jsonlayer.sec_strata

jsonstrata.features.shift();

var stratamap = new L.Map('strata-leaflet', {
  'center': [37.8, -96],
  'zoom': 4,
  'layers': [
    L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
  ]
});



    var selected
    
    // Create new geojson layer
   var geojsonLayer = new L.GeoJSON(jsonstrata, {
      // Set default style
      'style': function () {
        return {
          'color': 'yellow',
        }
      }, 
      onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name, {closeButton: false});
                layer.on('mouseover', function() { layer.openPopup(); });
                layer.on('mouseout', function() { layer.closePopup(); });
            }
        },
    }).on('click', function (e) {
      
     filtersContainer.querySelector('select[name=secondary_stratum]').value = e.layer.feature.properties.name
     stratamodal.style.display = "none";
      // Check for selected
      /*if (selected) {
        // Reset selected to default style
        e.target.resetStyle(selected)
      }
      // Assign new selected
      selected = e.layer
      // Bring selected to front
      selected.bringToFront()
      // Style selected
      selected.setStyle({
        'color': 'red'
      })*/
    }).addTo(stratamap)


    




};



model.getValues = () => (
  {

    project: projectSelect.value,
    scenario: getOptionVals(scenarioSelect),
    stratum: stratumSelect.value,
    secondary_stratum: secStratumSelect.value,
    iteration: iterationInput.value,
    iteration_end: iterationInputEnd.value,
    iteration_type: iterationTypeSelect.value,
    variable: variableSelect.value,
    variable_detail: getOptionVals(variableDetail),
    timestep_begin: timestepBegin.value,
    timestep_end: timestepEnd.value

  }
);

export default model;
