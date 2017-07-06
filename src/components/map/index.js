// Import Node modules
import L from 'leaflet';
import Spinner from 'spin';
import 'leaflet.sync'
// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositron, cartoDBPositronLabelsOnly, stateclassTiles, stateclassTilesNext, CartoDB_DarkMatterNoLabels, Stamen_TonerLabels } from './../../helpers/leaflet-layers';
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
let stateclassGroup
let stateclassGroups
let individualMap;
let mapInfo;
let mapContainer;
let settings;
let feature;
let tempLayer;
let project;
//const modal = document.getElementById('myModal');
//const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
/*span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}*/

/*const info = L.control();

info.onAdd = function (test) {

  this._div = L.DomUtil.create('div', 'info leaflet-bar leaflet-control leaflet-control-custom');
  this._div.onclick = function(){
   
 
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
};*/

/**
* PRIVATE FUNCTIONS
**/
function mapStatus (status){
  //mapContainer = document.getElementById('map');
    switch (status) {
      case 'loading':
        maploading = new Spinner().spin( mapContainer);
        break;
      case 'loaded':
        maploading.stop();
        break;
      default:
        mapContainer.classList.add('no-data');
    }
  }

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

function  createGroupVariables(scenarios){
  var groups = [];

  for (var i = 0; i < scenarios.length; i++) {
      groups[i] =  new L.layerGroup()
  }

  return groups;
}

function pairs(arr) {
      var res = [],
        l = arr.length;
      for(var i=0; i<l; ++i)
        for(var j=i+1; j<l; ++j)
          res.push([arr[i], arr[j]]);
      return res;
}

function range(start, stop, step){
        var a=[start], b=start;
        while(b<stop){b+=step;a.push(b)}
        return a;
      };
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
  
  stateclassGroup = new L.layerGroup()

  stateclassGroups = [stateclassGroup]
  
  // Intialize Map object
 map = L.map(mapContainer, {
    center: [lat, lng],
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    attributionControl: true,
    touchZoom: false,
    scrollWheelZoom: false,
    subdomains: 'abc',
    layers: [cartoDBPositron, stateclassTiles],
  });

  maps = [map]

  settings = {
    project: project.toString(),
    year: year.toString(),
    scenario: scenario.toString(),
    iteration: iteration.toString(),
    secondary_stratum: '',
    stratum: '',
    layer: [1],
    iteration_number: leftPad(iteration.toString()),
    iteration_array: [leftPad(iteration.toString())],
  };
  
 //info.addTo(maps[0]);
/*mapInfo = ['Year: ' + settings.year, 'Scenario: '+ settings.scenario, 'Iteration: ' +settings.iteration_number]
  for (j = 0; j < mapInfo.length; j++) {
       info.addTo(maps[0]);
       info.update(mapInfo[j]);
  }*/
 

};

model.removeTimeSeriesRasters = (...args) => {
  scenarios = settings.scenario.split(',')
    
    //let startYear = parseInt(args[0].year)
    for (i = 0; i < maps.length; i++) {
      
      mapscenario = scenarios[i]

      //let layerKeys = Object.keys(maps[i]._layers)

      maps[i].eachLayer(function(layer){

        stateclassGroups[i].clearLayers()
       
        /*if (layer.options && layer.options.id){ //&& layer.options.id !== settings.year.toString()){
          
          maps[i].removeLayer(layer);
        }*/
      });
 

 }
}

model.mapLayers = () =>{
  
   let groupLength = stateclassGroups[0].getLayers().length
   
    return groupLength
}
model.preLoadRasters = (slider,d) => {
   

   let yearArray = range(2011,2061,5)

   let layerKeys = Object.keys(maps[0]._layers)
   if (layerKeys.length < yearArray.length){
   slider.playbackRate(0)
  
   let loadRasters = function(slider, d){
    mapStatus('loading')

    scenarios = settings.scenario.split(',')

    
    
    //let startYear = parseInt(args[0].year)
    for (i = 0; i < maps.length; i++) {
      

      layer = settings.layer[i].toString()
     
      iterationval = settings.iteration_array[i]
      
      mapscenario = scenarios[i]
        
      let stateclassLayers = []

      for (var j = 0; j < yearArray.length; j++) {
        
    
          let yearstring = yearArray[j].toString()
          
          //const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${iterationval}-ts${yearstring}-sc/{z}/{x}/{y}.png?style=lulc`;
         let url
          if (layer === "1"){

           url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${iterationval}-ts${yearstring}-sc/{z}/{x}/{y}.png?style=lulc`;
           
          }else{
           
           url = 'http://127.0.0.1:8000/tiles/s'+mapscenario.toString()+'-it0000-ts'+yearstring.toString()+'-tgap'+layer.toString()+'/{z}/{x}/{y}.png?style='+layer.toString();;
             
          }
          
          
         let stateclassTiles = L.tileLayer(url, {
            attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
            maxZoom: 19,
            opacity: 0,
            subdomains: 'abcd',
            //scenario: '6368',
            //iteration: '0001',
            id: yearstring,
            });
        
          stateclassGroups[i].addLayer(stateclassTiles)
          //stateclassLayers.push(stateclassTiles)
        }
       
       // var streets = new L.layerGroup(stateclassLayers).addTo(maps[i]);
        stateclassGroups[i].addTo(maps[i]);
        //stateclassLayers[10].on("load",function() { console.log('layersloaded'), slider.playbackRate(.5)});
        
        stateclassGroups[i].getLayers()[10].on("load",function() {mapStatus('loaded'), slider.playbackRate(.5)});
       // stateclassLayers.addTo(maps[i]);


     
        
       
      }
    }

   loadRasters(slider, d)
   
   

  }


}

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
    let filtersContainer = document.getElementById('mapfilters');
    let yearInput = filtersContainer.querySelectorAll('input[name=year]');
    yearInput.forEach((inputYearVal) => {

        inputYearVal.value = settings.year.toString()

      })
    for (i = 0; i < maps.length; i++) {

      mapscenario = scenarios[i]
      
      
      //const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${iterationval}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
      
      /*selectYearNode(maps[i], 'Year: ' + settings.year)
     
      selectIterationNode(maps[i], 'Iteration: ' + settings.iteration_number)

      selectScenarioNode(maps[i], 'Scenario: ' + mapscenario)*/
      
       maps[i].eachLayer(function(layer){
        
        
        if (layer.options && layer.options.id && layer.options.id === settings.year.toString()){
            
            layer.setOpacity(1)
            

        }else if (layer.options && layer.options.id){
          layer.setOpacity(0)
        }
      })
     

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
 
/* let update = false;
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
 // modal.style.display = "none";

   update = true;
  if (update) {
      
      let individualMap = args[0].index_val
      let scenarios = settings.scenario.split(',')
      //scenario = args[0].value
      //let mapscenario = scenarios[individualMap]
      let iteration =  leftPad(args[0].iteration_number)
      let year = args[0].year
      let scenario = args[0].scenario
      let layer = args[0].layer
      
      //settings.iteration_number = args[0].iteration_number
      settings.iteration_array[individualMap] = leftPad(args[0].iteration_number.toString())
      settings.year = args[0].year
      scenarios[individualMap] = args[0].scenario
      settings.scenario = scenarios.toString()
      settings.layer[individualMap] = args[0].layer
     

      let url
      if (layer === "1"){

       url = `http://127.0.0.1:8000/tiles/s${scenario}-it${iteration}-ts${year}-sc/{z}/{x}/{y}.png?style=lulc`;
       
      }else{
       
       url = 'http://127.0.0.1:8000/tiles/s'+scenario.toString()+'-it0000-ts'+year.toString()+'-tgap'+layer.toString()+'/{z}/{x}/{y}.png?style='+layer.toString();
         
      }
     
      
      
      let tilelayer = maps[individualMap]._layers[Object.keys(maps[individualMap]._layers)[1]]

      tilelayer.setUrl(url);
  
  }
};
model.resizeMap = () => {
   for (i = 0; i < maps.length; i++) {
        maps[i].invalidateSize();
   }
};



model.reloadMap = (...args) => {

  
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
  
   d3.selectAll("#map > *").remove();
  mapContainer = document.getElementById('map');
  settings.iteration_number = leftPad("1")
  
 // mapContainer.remove();

  scenarios = settings.scenario.split(',')
 
  maps = createMapVariables(scenarios)
  stateclassGroups = createGroupVariables(scenarios)
  
  for (i = 0; i < maps.length; i++) {

    settings.layer[i] = 1

    settings.iteration_array[i] = settings.iteration_number

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
      m.style.height = "100%"
      m.style.width = "33.3333%"
     
    }else{
       m.style.height = "100%"
      m.style.width = "100%"
    }
  
  mapscenario = scenarios[i]

  mapContainer.appendChild(m)

  const CartoDB_DarkMatterNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
 // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

  const cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
 // attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});



  const stateclassTiles = L.tileLayer('http://127.0.0.1:8000/tiles/s6368-it0001-ts2011-sc/{z}/{x}/{y}.png', {
 // attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  opacity: 1,
  subdomains: 'abcd',
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
      layers: [cartoDBPositron, stateclassTiles],
      });

    
  const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${settings.iteration_number}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
  
  stateclassTiles.setUrl(url);

    if (feature.geometry) {
      
      tempLayer = L.geoJson(feature.geometry);
        maps[i].fitBounds(tempLayer.getBounds());
    }
      
  }
  pairs(maps).forEach(function(pair){
      pair[0].sync(pair[1])
      pair[1].sync(pair[0])
    });

  }

};

export default model;
