// Import Node modules
import L from 'leaflet';

import 'leaflet.sync'
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
let maps
let mapInfo;
let mapContainer;
let settings;
let feature;
let tempLayer;
let stateclassTiles2 = stateclassTiles
let cartoDBPositronLabelsOnly2 = cartoDBPositronLabelsOnly

const info = L.control();

info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  this.update();

  return this._div;
};

selectYearNode = function(inputMap, year){
  inputMap._controlContainer.childNodes[1].childNodes[0].innerHTML = year
}
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

function createMapVariables(input){
  var accounts = [];

  for (var i = 0; i < input.length; i++) {
      accounts[i] = "whatever";
  }

  return accounts;
}

function pairs(arr) {
      var res = [],
        l = arr.length;
      for(var i=0; i<l; ++i)
        for(var j=i+1; j<l; ++j)
          res.push([arr[i], arr[j]]);
      return res;
}
/**
* PUBLIC FUNCTIONS
**/
model.init = ({ selector, lat = 22.234262, lng = -159.784857, scenario = '6368', iteration = '1', year = '2001' }) => {
  // Initialize container
  if (!selector) {
    mapContainer = document.getElementById('map');
  } else {
    mapContainer = selector;
  }

  
  //console.log(scenarios)
  
  
  
  // Intialize Map object
 map = L.map(mapContainer, {
    center: [lat, lng],
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    attributionControl: true,
    touchZoom: false,
    scrollWheelZoom: false,
    layers: [stateclassTiles, cartoDBPositronLabelsOnly],
  });

  maps = [map]

  settings = {
    year: year.toString(),
    scenario: scenario.toString(),
    iteration: iteration.toString(),
    secondary_stratum: '',
    iteration_number: iteration.toString(),
  };
  
 info.addTo(maps[0]);

 

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
      /*if (feature.geom) {
        const tempLayer = L.geoJson(feature.geom);
        map.fitBounds(tempLayer.getBounds());
      }*/
      update = true;
    }
  }

  if (update) {
    scenarios = settings.scenario.split(',')
    for (i = 0; i < maps.length; i++) {

      mapscenario = scenarios[i]
      
      const url = `http://stage.landcarbon.org/tiles/s${mapscenario}-it${'0001'}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
      
      selectYearNode(maps[i], 'Year: ' + settings.year)
      
      //info.update(settings.year);
      var tilelayer = maps[i]._layers[Object.keys(maps[i]._layers)[0]]
    
      tilelayer.setUrl(url);
       if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
          if (feature && feature.geom){

              const tempLayer = L.geoJson(feature.geom);
              maps[i].fitBounds(tempLayer.getBounds());
          }
        }
   }

  }
};


model.reloadMap = (...args) => {
 
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
      feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      /*if (feature.geom) {
        tempLayer = L.geoJson(feature.geom);
        map.fitBounds(tempLayer.getBounds());
      }*/
      update = true;
    }
  }
  

if (update) {
  console.log(settings)
 
   d3.selectAll("#map > *").remove();
  mapContainer = document.getElementById('map');
  
 // mapContainer.remove();

  scenarios = settings.scenario.split(',')
 
  maps = createMapVariables(scenarios)
  
  for (i = 0; i < maps.length; i++) {

    var id = "map_"+ i.toString();
    var test = "test_"+ i.toString();
    var m = document.createElement('div')
    m.className="map"
    m.id=id
    m.style.background = 'white';
    if (maps.length >1 && maps.length <3){
      m.style.height = "50%"
      m.style.width = "100%"
    }else if (maps.length >=3){
      m.style.height = "50%"
      m.style.width = "50%"
     
    }else{
       m.style.height = "100%"
      m.style.width = "100%"
    }
  
  mapscenario = scenarios[i]

  mapContainer.appendChild(m)

  const stateclassTiles = L.tileLayer('http://stage.landcarbon.org/tiles/s6368-it0001-ts2001-sc/{z}/{x}/{y}.png', {
  attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
  });

  const cartoDBPositronLabelsOnly = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
  //attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
  });
 
  maps[i] =  L.map(id, {
      center: ["22.234262", "-159.784857"],
      zoom: 9,
      minZoom: 5,
      maxZoom: 19,
      attributionControl: true,
      touchZoom: false,
      scrollWheelZoom: false,
      layers: [stateclassTiles, cartoDBPositronLabelsOnly],
      });

  
  mapInfo = ['Year: ' + settings.year, 'Scenario: '+ mapscenario, 'Iteration: ' +settings.iteration_number]
  for (j = 0; j < mapInfo.length; j++) {
       info.addTo(maps[i]);
       info.update(mapInfo[j]);
  }
    
 /* L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(maps[i]);*/

    
  const url = `http://stage.landcarbon.org/tiles/s${mapscenario}-it${'0001'}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
  
  stateclassTiles.setUrl(url);
 // stateclassTiles2.addTo(maps[i])
   /* L.tileLayer(url, {
          attribution: 'USGS'
        }).addTo(maps[i]);*/

    if (feature.geom) {
      tempLayer = L.geoJson(feature.geom);
        maps[i].fitBounds(tempLayer.getBounds());
    }
      
  }
  pairs(maps).forEach(function(pair){
      pair[0].sync(pair[1])
      pair[1].sync(pair[0])
    });

 
  // Intialize Map object
 

  
    //console.log(leftPad(settings.iteration))
    //const url = `http://stage.landcarbon.org/tiles/s${settings.scenario}-it${leftPad(settings.iteration)}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
    
   

  }

};

export default model;
