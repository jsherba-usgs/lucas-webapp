// Import Node modules
import L from 'leaflet';

import 'leaflet.sync'
// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositronLabelsOnly, stateclassTiles, CartoDB_DarkMatterNoLabels, Stamen_TonerLabels } from './../../helpers/leaflet-layers';
import projects from './../../helpers/project-details';

/**
* EXPORT VARIABLE
**/
const model = {};


/**
* PRIVATE VARIABLES
**/
let map;
let maps;
let individualMap;
let mapInfo;
let mapContainer;
let settings;
let feature;
let tempLayer;
let project;
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const info = L.control();

info.onAdd = function (test) {

  this._div = L.DomUtil.create('div', 'info leaflet-bar leaflet-control leaflet-control-custom');
  this._div.onclick = function(){
   
    modal.style.display = "block";
    individualMap=parseInt(test._container.id.split("_")[1])

    

    let scenarioOptions = document.querySelector('select[name=mapscenario]')

    for(var i = 0; i < scenarioOptions.length; i++){
      scenarioOptions[i].selected = false;
    }

    scenarioOptions.options.item(individualMap).selected = true;
    
    }
  this.update();

  return this._div;
};

selectYearNode = function(inputMap, year){
  inputMap._controlContainer.childNodes[1].childNodes[0].innerHTML = year
}
selectScenarioNode = function(inputMap, scenario){
  inputMap._controlContainer.childNodes[1].childNodes[1].innerHTML = scenario
}
selectIterationNode = function(inputMap, iteration){
  inputMap._controlContainer.childNodes[1].childNodes[2].innerHTML = iteration
}

info.update = function (year) {

  this._div.innerHTML = year || 2011;
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
model.init = ({ selector, lat = 22.234262, lng = -159.784857, scenario = '6368', iteration = '1', year = '2011', project = '7096' }) => {
  //model.init = ({ selector, lat = 43.5754794945, lng = -125.260128026, scenario = '6368', iteration = '1', year = '2011' }) => {
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
    layers: [CartoDB_DarkMatterNoLabels, stateclassTiles],
  });

  maps = [map]

  settings = {
    project: project.toString(),
    year: year.toString(),
    scenario: scenario.toString(),
    iteration: iteration.toString(),
    secondary_stratum: '',
    stratum: '',
    iteration_number: leftPad(iteration.toString()),
  };
  
 //info.addTo(maps[0]);
mapInfo = ['Year: ' + settings.year, 'Scenario: '+ settings.scenario, 'Iteration: ' +settings.iteration_number]
  for (j = 0; j < mapInfo.length; j++) {
       info.addTo(maps[0]);
       info.update(mapInfo[j]);
  }
 

};



model.updateRaster = (...args) => {
 //settings.iteration_number = leftPad(settings.iteration_number)
 
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
    if (args[0].iteration_number) {
        args[0].iteration_number =  leftPad(args[0].iteration_number)
    }
    if (args[0].iteration_number && args[0].iteration_number !== settings.iteration_number) {
      settings.iteration_number = args[0].iteration_number;
      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      project = projects.getDetailsForId(args[0].project);
      
      //const feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
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

      
      const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${settings.iteration_number}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
      
      selectYearNode(maps[i], 'Year: ' + settings.year)
     
      selectIterationNode(maps[i], 'Iteration: ' + settings.iteration_number)

      selectScenarioNode(maps[i], 'Scenario: ' + mapscenario)
      
      //info.update(settings.year);
      var tilelayer = maps[i]._layers[Object.keys(maps[i]._layers)[1]]
    
      tilelayer.setUrl(url);
       if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
          if (feature && feature.geometry){

              const tempLayer = L.geoJson(feature.geometry);
              maps[i].fitBounds(tempLayer.getBounds());
          }
        }

      
    }
  
  }
};


model.updateIndividualRaster = (...args) => {
 //settings.iteration_number = leftPad(settings.iteration_number)
 
 /*let update = false;
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
    if (args[0].iteration_number) {
        args[0].iteration_number =  leftPad(args[0].iteration_number)
    }
    if (args[0].iteration_number && args[0].iteration_number !== settings.iteration_number) {
      settings.iteration_number = args[0].iteration_number;
      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      const project = projects.getDetailsForId(args[0].project);
      const feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      
      update = true;
    }
  }*/
  modal.style.display = "none";
  update = true;
  if (update) {
      
      scenarios = settings.scenario.split(',')
      //scenario = args[0].value
      mapscenario = scenarios[individualMap]
      let iteration =  leftPad(args[0].iteration_number)
      let year = args[0].year
      let scenario = args[0].scenario
     
      
      const url = `http://127.0.0.1:8000/tiles/s${scenario}-it${iteration}-ts${year}-sc/{z}/{x}/{y}.png?style=lulc`;
      
      //selectYearNode(maps[individualMap], 'Year: ' + settings.year)
      selectYearNode(maps[individualMap], 'Year: ' + args[0].year)
     // selectIterationNode(maps[individualMap], 'Iteration: ' + settings.iteration_number)
       selectIterationNode(maps[individualMap], 'Iteration: ' + args[0].iteration_number)

       selectScenarioNode(maps[individualMap], 'Scenario: ' + args[0].scenario)
      //info.update(settings.year);
      var tilelayer = maps[individualMap]._layers[Object.keys(maps[individualMap]._layers)[1]]
    
      tilelayer.setUrl(url);
  
  }
};
model.resizeMap = () => {
   for (i = 0; i < maps.length; i++) {
        maps[i].invalidateSize();
   }
};

model.reloadMap = (...args) => {

  console.log(args[0])
  let update = true;
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
    if (args[0].stratum && args[0].stratum !== settings.stratum) {
      settings.stratum = args[0].stratum;
      project = projects.getDetailsForId(args[0].project);      
      feature = project.details.jsonlayer.strata.features.find((item) => item.properties.name === args[0].stratum);
      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      project = projects.getDetailsForId(args[0].project);      
      feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
      update = true;
    }
    if (args[0].project && args[0].project !== settings.project) {
      settings.project = args[0].project;
      project = projects.getDetailsForId(args[0].project);      
      feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
      update = true;
    }
  }
  

if (update) {
  
  console.log(args[0].secondary_stratum)
  
   d3.selectAll("#map > *").remove();
  mapContainer = document.getElementById('map');
  settings.iteration_number = leftPad("1")
  
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
      m.style.height = "100%"
      m.style.width = "50%"
    }else if (maps.length >=3){
      m.style.height = "50%"
      m.style.width = "50%"
     
    }else{
       m.style.height = "100%"
      m.style.width = "100%"
    }
  
  mapscenario = scenarios[i]

  mapContainer.appendChild(m)

  const CartoDB_DarkMatterNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});


  const stateclassTiles = L.tileLayer('http://127.0.0.1:8000/tiles/s6368-it0001-ts2011-sc/{z}/{x}/{y}.png', {
  attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
  });

 const Stamen_TonerLabels = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.{ext}', {
  //attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});
// https: also suppported.

 
  maps[i] =  L.map(id, {
      //center: ["22.234262", "-159.784857"],
      center: ["43.5754794945", "-125.260128026"],
      
      zoom: 9,
      minZoom: 5,
      maxZoom: 19,
      attributionControl: true,
      touchZoom: false,
      scrollWheelZoom: false,
      layers: [CartoDB_DarkMatterNoLabels, stateclassTiles],
      });

  
  mapInfo = ['Year: ' + settings.year, 'Scenario: '+ mapscenario, 'Iteration: ' +settings.iteration_number]
  for (j = 0; j < mapInfo.length; j++) {
       info.addTo(maps[i]);
       info.update(mapInfo[j]);
  }
    
 /* L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(maps[i]);*/

    
  const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${settings.iteration_number}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
  
  stateclassTiles.setUrl(url);
 // stateclassTiles2.addTo(maps[i])
   /* L.tileLayer(url, {
          attribution: 'USGS'
        }).addTo(maps[i]);*/

    if (feature.geometry) {
      console.log("test3")
      tempLayer = L.geoJson(feature.geometry);
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
