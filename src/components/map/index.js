// Import Node modules
import L from 'leaflet';

// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositronLabelsOnly, stateclassTiles } from './../../helpers/leaflet-layers';
import projects from './../../helpers/project-details';

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
const info = L.control();
info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
info.update = function (year) {
  this._div.innerHTML = year || 2001;
};

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
    secondary_stratum: '',
  };

  info.addTo(map);

  function style(feature) {
    return {
        //fillColor: getColor(feature.properties.density),
        //weight: 2,
        //opacity: 1,
        color: '#87a449',
        //dashArray: '3',
        fillOpacity: 0
    };
  };

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#87a449',
        dashArray: '',
        fillOpacity: 0.7
    })

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  };
  function resetHighlight(e) {
    islandLayer.resetStyle(e.target);
  };
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  };

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  project = projects.getDetailsForId('7096')

  island = project.details.islands
  
  const islandLayer = L.geoJson(island[0].geom,{
    style: style,
    onEachFeature: onEachFeature
    }).addTo(map);
  

var extentControl = L.Control.extend({
options: {
    position: 'topleft'
},
onAdd: function (map) {
    
    var container = L.DomUtil.create('div', 'extentControl');
    container.style.backgroundColor = 'white';
    container.style.width = '30px';
    container.style.height = '30px';
    $(container).on('click', function () {
        map.fitBounds(islandLayer.getBounds());
    });
    return container;
   }
})

map.addControl(new extentControl());

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
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      const project = projects.getDetailsForId(args[0].project);
      const feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      if (feature.geom) {
        const tempLayer = L.geoJson(feature.geom);
        map.fitBounds(tempLayer.getBounds());
      }
      update = true;
    }
  }

  if (update) {
    const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${leftPad(settings.iteration)}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    info.update(settings.year);
    stateclassTiles.setUrl(url);
   

  }
};

export default model;
