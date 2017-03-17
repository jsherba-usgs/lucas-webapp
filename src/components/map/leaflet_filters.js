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


function updateFields() {

  console.log("test2")
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

  }
}

model.init = () => {
  // Initialize container
  filtersContainer = document.getElementById('mapfilters');
  filtersContainer.innerHTML = content;

  updateFields()

  // Create a custom event that is dispatched when Update button on form is clicked
  const form =  filtersContainer.querySelector('.mapform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  
  form.onsubmit = function (e) {
    // prevent default
    e.preventDefault();
    // dispatch custom event
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };
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
