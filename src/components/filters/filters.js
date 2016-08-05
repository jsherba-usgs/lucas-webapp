import content from './filters.html';

const module = {};

let filtersContainer;
let scenario;
let stratum;
let secondaryStratum;

module.init = (el) => {
  // Initialize container
  if (!el) {
    filtersContainer = document.getElementById('filters');
  } else {
    filtersContainer = el;
  }

  // Add content
  filtersContainer.innerHTML = content;

  scenario = filtersContainer.querySelector('select[name=scenario]').value;
  stratum = filtersContainer.querySelector('select[name=stratum]').value;
  secondaryStratum = filtersContainer.querySelector('select[name=secondary_stratum]').value;
};

module.scenario = (...args) => {
  if (args.length > 0) {
    scenario = args[0];
    filtersContainer.querySelector('select[name=scenario]').value = scenario;
    return scenario;
  }
  return scenario;
};

export default module;