// Import Node modules
import L from 'leaflet';

// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositronLabelsOnly, stateclassTiles } from './../../helpers/leaflet-layers';


/**
* EXPORT VARIABLE
**/
const model = {};


/**
* PRIVATE VARIABLES
**/
let map;
let mapContainer;
let settings;

/**
* PRIVATE FUNCTIONS
**/
function leftPad(val = 1, length = 4) {
  const str = val.toString();
  return `${'0'.repeat(length - str.length)}${str}`;
}

/**
* PUBLIC FUNCTIONS
**/
model.init = ({ selector, lat = 19.6, lng = -155.4, scenario = '6368', iteration = '1', year = '2001' }) => {
  // Initialize container
  if (!selector) {
    mapContainer = document.getElementById('map');
  } else {
    mapContainer = selector;
  }

  // Intialize Map object
  map = L.map(mapContainer, {
    center: [lat, lng],
    zoom: 9,
    minZoom: 5,
    maxZoom: 18,
    attributionControl: true,
    touchZoom: false,
    scrollWheelZoom: false,
    layers: [stateclassTiles, cartoDBPositronLabelsOnly],
  });

  settings = {
    year: year.toString(),
    scenario: scenario.toString(),
    iteration: iteration.toString(),
  };
};

model.updateRaster = (...args) => {
  let update = false;
  if (args && args[0]) {
    if (args[0].year && args[0].year !== settings.year) {
      settings.year = args[0].year;
      update = true;
    }
    if (args[0].scenario && args[0].scenario !== settings.scenario) {
      settings.scenario = args[0].scenario;
      update = true;
    }
    if (args[0].iteration && args[0].iteration !== settings.iteration) {
      settings.iteration = args[0].iteration;
      update = true;
    }
  }

  if (update) {
    const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${leftPad(settings.iteration)}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    stateclassTiles.setUrl(url);
  }
};

export default model;
