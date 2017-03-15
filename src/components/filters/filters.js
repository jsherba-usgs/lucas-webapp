import content from './filters.html';
import projectFilterContent from './filters_projects.html';
import percentileFilterContent from './filters_percentile.html';
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
  //const id = scenarioSelect.value;
  //const scenarioDetail = details.scenario.find((item) => item.id === id);
  //iterationInput.max = scenarioDetail.iterations;
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

    // Populate iteration input box

    iterationInput = filtersContainer.querySelector('input[name=iteration]');
    iterationInput.disabled = false;

    variableDetail = filtersContainer.querySelector('select[name=variable_detail]');
    variableDetail.disabled = false;

  }
}

model.init = () => {
  // Initialize container
  filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = content;

  // Initialize container
  filtersContainer2 = document.getElementById('filters_project');
  filtersContainer2.innerHTML = projectFilterContent;
  

  /*filtersContainer3 = document.getElementById('filters_percentile');
  filtersContainer3.innerHTML = percentileFilterContent;*/

  // Add list of projects to content
  projectSelect = filtersContainer2.querySelector('select[name=project]');

  projects.getList().forEach((project) => {
    const option = document.createElement('option');
    option.text = project;
    option.value = project;
    projectSelect.add(option);
  });

  projectSelect.onchange = updateFields;
  projectSelect.onchange();

  scenarioSelect.onchange = updateIterationInput;
  scenarioSelect.onchange();

  variableSelect.onchange = updateVariableDetail;
  variableSelect.onchange();

  // Create a custom event that is dispatched when Update button on form is clicked
  const form =  filtersContainer.querySelector('.filterform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  const form2 = filtersContainer2.querySelector('form')
  //const form2 = filtersContainer2.querySelector('form');
  form.onsubmit = function (e) {
    // prevent default
    e.preventDefault();
    // dispatch custom event
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };
 form2.onsubmit = function (e) {
    // prevent default
    e.preventDefault();
    // dispatch custom event
    console.log("test")
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };

  triggerEvent(document, 'filters.change', {
    detail: model.getValues()

  });

  

 

};



model.getValues = () => (
  {
    project: projectSelect.value,
    scenario: getOptionVals(scenarioSelect),
    stratum: stratumSelect.value,
    secondary_stratum: secStratumSelect.value,
    iteration: iterationInput.value,
    variable: variableSelect.value,
    variable_detail: getOptionVals(variableDetail)

  }
);

export default model;
