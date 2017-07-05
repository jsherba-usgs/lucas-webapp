import content from './leaflet_filters.html';
import { triggerEvent } from './../../helpers/utils';
import projects from './../../helpers/project-details';

const model = {};

let filtersContainer;
let projectId;
let details;
let projectSelect;
let scenarioSelect;
let secStratumSelect;
let stratumSelect;
let variableSelect;
let iterationInput;
let variableDetail;
let layers;


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
    if (selectbox.options[i].value !== 'All') {
      selectbox.remove(i);
    }
  }
}

function updateIterationInput() {
  
  details = projects.getDetailsForId(projectId).details;
  const id = scenarioSelect.value;
  const scenarioDetail = details.scenario.find((item) => item.id === id);
  iterationInput.forEach((iterationDiv) => {iterationDiv.max = scenarioDetail.iterations;});

  //iterationInput.max = scenarioDetail.iterations;

}

function updateYearInput() {
  
  details = projects.getDetailsForId(projectId).details;
  const id = scenarioSelect.value;
  const scenarioDetail = details.scenario.find((item) => item.id === id);
  yearInput.forEach((yearDiv) => {yearDiv.max = scenarioDetail.years[1], yearDiv.min = scenarioDetail.years[0]});
  //yearInput.max = scenarioDetail.years[1];
  //yearInput.min = scenarioDetail.years[0];
  
}

function updateVariableDetail() {
 

  variableDetail.options.length = 0
  const id = variableSelect.value;
  const getvariableDetail = details.variable.find((item) => item.id === id);
 // console.log(getvariableDetail)
  getvariableDetail.variable_detail.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableDetail.add(option);
    });
    variableDetail[0].selected = true
    variableDetail.disabled = false;
  }

function updateFields() {
 
 
  //if (details) {
    // Populate scenario select box
  /*  scenarioSelect = filtersContainer.querySelector('select[name=scenario]');
    removeOptions(scenarioSelect);
    details.scenario.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      scenarioSelect.add(option);
    });
    scenarioSelect[0].selected = true
    scenarioSelect.disabled = false;*/

  //  variableDetail = allFiltersContainer.querySelector('select[name=variable_detail]');
   // variableDetail.disabled = false;
    

 // }
}

function GetSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
     
      result.push({'id':opt.value, 'name':opt.text});
    }
  }
  return result;
}

model.update = () =>{
  
  filtersContainer = document.getElementById('mapfilters');
  filtersContainer.innerHTML = content;

  mapscenarioSelect = filtersContainer.querySelector('select[name=mapscenario]');

 filtersContainer2 = document.getElementById('filters');
  scenarioSelect = filtersContainer2.querySelector('select[name=scenario]');

  scenarios = GetSelectValues(scenarioSelect) 

  scenarios.forEach((scenario) => {
    
    const option = document.createElement('option');
    option.text = scenario.name;
    option.value = scenario.id;
    option.selected = true
    mapscenarioSelect.add(option);
  });
 mapscenarioSelect.disabled = false;

 // Populate iteration input box
iterationInput = filtersContainer.querySelector('input[name=iteration]');
iterationInput.disabled = false;

}

model.init = (options, addMapLegends) => {
  // Initialize container
 //const addMapLegends2 = addMapLegends()
 let scenarioOptions = options.scenario.split(",")

 filtersContainer = document.getElementById('mapfilters');

while (filtersContainer.hasChildNodes()) {
    filtersContainer.removeChild(filtersContainer.lastChild);
}
 scenarioOptions.forEach((scenarioval) => {

  filtersContainer.innerHTML += content
 /* $('#collapseExample2').collapse('show'),
  addMapLegends()*/

 });
 legendInput = filtersContainer.querySelectorAll('a');
 legendInputDiv = filtersContainer.querySelectorAll('div.collapsedivs');
 
 legendInput.forEach((legendDiv, index_val) => {
  index_string = index_val.toString()
  legendInput[index_val].hash = legendInput[index_val].hash+index_string, 
  legendInputDiv[index_val].id = legendInputDiv[index_val].id+index_string
  //$('#collapseExample'+index_string).collapse('toggle')
  //console.log(legendInputDiv[index_val])//.collapse('show')
 });
 addMapLegends()
 legendInputDiv.forEach((legendDiv, index_val) => {

  $('#collapseExample'+index_val.toString()).collapse('toggle');
  })


 mapscenarioSelect = filtersContainer.querySelectorAll('select[name=mapscenario]');
 
 filtersContainer2 = document.getElementById('filters');
 scenarioSelect = filtersContainer2.querySelector('select[name=scenario]');

 filtersContainer3 = document.getElementById('filters_project');
 projectSelect = filtersContainer3.querySelector('select[name=project]');

 scenarios = GetSelectValues(scenarioSelect) 
 selectedProjects = GetSelectValues(projectSelect)
 projectId = selectedProjects[0].id

 /*scenarios.forEach((scenario) => {
   
    const option = document.createElement('option');
    option.text = scenario.name;
    option.value = scenario.id;
   // option.selected = true
    mapscenarioSelect.forEach((scenarioDiv) => {scenarioDiv.add(option), scenarioDiv.disabled=false});
 });*/

scenarios.forEach((scenario, indexval) => {
  mapscenarioSelect.forEach((scenarioDiv, indexval2) => {
    const option = document.createElement('option');
    option.text = scenario.name;
    option.value = scenario.id;
    if (indexval === indexval2){
      option.selected = true
    }
    scenarioDiv.add(option), scenarioDiv.disabled=false
  })
})


layers = projects.getDetailsForId(projectId).details.layer;

layerInput = filtersContainer.querySelectorAll('select[name=maplayer]');

layers.forEach((layer, indexval) => {
  layerInput.forEach((layerDiv, indexval2) => {
      const option = document.createElement('option');
      option.text = layer.name;
      option.value = layer.id;
      if (indexval === 0){
      option.selected = true
      }
      layerDiv.add(option), layerDiv.disabled=false
    }) //mapscenarioSelect.disabled = false;
  })

iterationInput = filtersContainer.querySelectorAll('input[name=iteration]');
iterationInput.forEach((iterationDiv) => {iterationDiv.disabled = false;});
//iterationInput.disabled = false;

yearInput = filtersContainer.querySelectorAll('input[name=year]');
yearInput.forEach((yearDiv) => {yearDiv.disabled = false;});
yearInput.disabled = false;

scenarioSelect.onchange = updateYearInput;
scenarioSelect.onchange();

scenarioSelect.onchange = updateIterationInput;
scenarioSelect.onchange();

mapscenarioSelect.onchange = updateFields;
mapscenarioSelect.onchange();

  //updateFields()
  //updateVariableDetail()
  // Create a custom event that is dispatched when Update button on form is clicked
  const form3 =  filtersContainer.querySelectorAll('.mapform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  
  /*form3.onchange = function (e) {
    console.log(e)
    console.log("test")
    // prevent default
    e.preventDefault();
    // dispatch custom event
    triggerEvent(document, 'mapfilters.change', {
      detail: model.getValues()
    });
    
  };*/
 
  form3.forEach((filterform, i) => {
      filterform.onchange = function (e) {
   
    // prevent default
    e.preventDefault();
    // dispatch custom event
    triggerEvent(document, 'mapfilters.change', {
      detail: model.getValues(i)
    });
    
  }
  })

};

model.triggerChange = () => {
  //const form3 =  filtersContainer.querySelectorAll('.mapform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  const form3 =  filtersContainer.querySelectorAll('.mapform');
 form3.forEach((filterform, i) => {
    triggerEvent(document, 'mapfilters.change', {
      detail: model.getValues(i)
    });
    
 });
}

model.getValues = (i) => (
  {
    
    scenario: mapscenarioSelect[i].value,
    iteration_number: iterationInput[i].value,
    year: yearInput[i].value,
    layer: layerInput[i].value,
    index_val: i
  }
);

export default model;
