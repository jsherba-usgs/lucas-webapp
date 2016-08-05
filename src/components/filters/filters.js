import content from './filters.html';

const module = {};

let filtersContainer;

function addContent() {
  filtersContainer.innerHTML = content;
}

module.init = (el) => {
  // Initialize container
  if (!el) {
    filtersContainer = document.getElementById('filters');
  } else {
    filtersContainer = el;
  }

  // Add content
  filtersContainer.innerHTML = content;
};

export default module;