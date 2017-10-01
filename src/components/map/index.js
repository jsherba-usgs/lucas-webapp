// Import Node modules
import L from 'leaflet';
import Spinner from 'spin';
import 'leaflet.sync'

// Import Styles
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

// Import helpers
import { cartoDBPositron, stateclassTiles} from './../../helpers/leaflet-layers';
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
  
 

};

model.removeTimeSeriesRasters = (...args) => {

  scenarios = settings.scenario.split(',')
    
    
    for (i = 0; i < maps.length; i++) {
      
      mapscenario = scenarios[i]

     

      maps[i].eachLayer(function(layer){

        stateclassGroups[i].clearLayers()
       
    
      });
 

 }
}

model.mapLayers = () =>{
  
   let groupLength = stateclassGroups[0].getLayers().length
   
    return groupLength
}
model.preLoadRasters = (slider,d, startYear, endYear) => {
 
  // let startYear = project.details.years.start
   //let endYear = project.details.years.end
      //const feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
      //feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
   

   //let startYear = project.details.years[0][variableType][0].start
    //let endYear = project.details.years[0][variableType][0].end
   let yearArray = range(startYear,endYear,5)
   //console.log(maps[0]._layers)
   //console.log(maps[0]._tilePane.childElementCount)
   let yearLength = yearArray.length
   let layerKeys = maps[0]._tilePane.childElementCount//Object.keys(maps[0]._layers)
   
   
   if (layerKeys < yearLength){
    
   slider.playbackRate(0)
  
   let loadRasters = function(slider, d){
    mapStatus('loading')

    scenarios = settings.scenario.split(',')

    
    let lastMap = maps.length-1
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
          //  url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${iterationval}-ts${yearstring}-sc/{z}/{x}/{y}.png`;
           
          }else{
           
          // url = 'http://127.0.0.1:8000/tiles/s'+mapscenario.toString()+'-it0000-ts'+yearstring.toString()+'-tgap'+layer.toString()+'/{z}/{x}/{y}.png?style='+layer.toString();
      
             url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it0000-ts${yearstring}-tgap${layer}/{z}/{x}/{y}.png?style=${layer}`
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
        stateclassGroups[i].setZIndex(5)

        if (i === lastMap){
        let startLayer = (yearLength-1)/2
        stateclassGroups[i].getLayers()[startLayer].on("load",function() {mapStatus('loaded'), slider.playbackRate(.5)});
       // stateclassLayers.addTo(maps[i]);
      }

     
        
       
      }
    }

   loadRasters(slider, d)
   
   

  }


}

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
      //feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
      feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
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
      
      
      
       maps[i].eachLayer(function(layer){
        
        
        if (layer.options && layer.options.id && layer.options.id === settings.year.toString()){
            
            layer.setOpacity(1)
            

        }else if (layer.options && layer.options.id){
          layer.setOpacity(0)
        }
      })
     

       if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
          if (feature && feature.geom){

              const tempLayer = L.geoJson(feature.geom);
              maps[i].fitBounds(tempLayer.getBounds());
          }
        }

     
    }
  
  }
 
};


model.updateIndividualRaster = (...args) => {
 //settings.iteration_number = leftPad(settings.iteration_number)


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
       
       //url = 'http://127.0.0.1:8000/tiles/s'+scenario.toString()+'-it0000-ts'+year.toString()+'-tgap'+layer.toString()+'/{z}/{x}/{y}.png?style='+layer.toString();
       url = `http://127.0.0.1:8000/tiles/s${scenario}-it0000-ts${year}-tgap${layer}/{z}/{x}/{y}.png?style=${layer}`
         
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
  //console.log(args[0].year)
  settings.year=2011
  if (args && args[0]) {
    /*if (args[0].year && args[0].year !== settings.year) {
      settings.year = args[0].year;
      update = true;
    }*/
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
      feature = project.details.stratum.find((item) => item.id === args[0].stratum);


      update = true;
    }
    if (args[0].secondary_stratum && args[0].secondary_stratum !== settings.secondary_stratum) {
      settings.secondary_stratum = args[0].secondary_stratum;
      project = projects.getDetailsForId(args[0].project);      
      feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);

      update = true;
    }
    if (args[0].project && args[0].project !== settings.project) {
      settings.project = args[0].project;
      project = projects.getDetailsForId(args[0].project);      
      //feature = project.details.jsonlayer.sec_strata.features.find((item) => item.properties.name === args[0].secondary_stratum);
      feature = project.details.secondary_stratum.find((item) => item.id === args[0].secondary_stratum);
     
      update = true;
    }
  }
  

if (update) {
  
   d3.selectAll("#map > *").remove();
  mapContainer = document.getElementById('map');
  settings.iteration_number = leftPad("1")
  
 // mapContainer.remove();

  scenarios = settings.scenario.split(',').slice(0,3)

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


  const cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
 // attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});



  const stateclassTiles = L.tileLayer('http://127.0.0.1:8000/tiles/s6370-it0001-ts2011-sc/{z}/{x}/{y}.png', {
 // attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  opacity: 1,
  subdomains: 'abcd',
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
  });


const mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/defjeff/cj5o5h3i04zp82smolfwvzwmh/tiles/256/%7Bz%7D/%7Bx%7D/%7By%7D?access_token=pk.eyJ1IjoiZGVmamVmZiIsImEiOiJjajVtd24xMzgzYWRyMzNvMmo5cWo3ZTM4In0.Jgu3IRnkLYwpDOzdhuMkHw', {
 // attribution: 'LULC: <a href="http://landcarbon.org">LandCarbon</a>',
  maxZoom: 19,
  opacity: 1,
  subdomains: 'abcd',
  //scenario: '6368',
  //iteration: '0001',
  //year: '2001'
  });

const Esri_WorldImagery = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash;'
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

var style = {
    "clickable": true,
    "color": "#00D",
    "fillColor": "#00D",
    "weight": 1.0,
    "opacity": 0.3,
    "fillOpacity": 0.2
};
var hoverStyle = {
    "fillOpacity": 0.5
};


let strataMap = maps[i]
let secStrataName = project.details.jsonlayer.sec_strata.name
let strataName = project.details.jsonlayer.strata.name
let secStratUrl = `http://127.0.0.1:8000/vtiles/${secStrataName}/{z}/{x}/{y}.geojson`;
let stratUrl  = `http://127.0.0.1:8000/vtiles/${strataName}/{z}/{x}/{y}.geojson`;

let strat_TileLayer = new L.TileLayer.GeoJSON(stratUrl, {
        clipTiles: true,
        unique: function (feature) {
            return feature.id; 
        }
    }, 
    {
        style: style,
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                var popupString = '<div class="popup">';
                
                for (var k in feature.properties) {
                    var v = feature.properties[k];
                    if (k==='label'){
                     
                      popupString += v + '<br />';

                    }
                }
            }
            if (!(layer instanceof L.Point)) {
                 var popup = L.popup()
                 layer.on("click", function (e) {
                     // var bounds = layer.getBounds();
                      var popupContent = popupString;
                      popup.setLatLng([e.latlng.lat,e.latlng.lng])
                      popup.setContent(popupContent);
                      strataMap.openPopup(popup);
                });
               layer.on('mouseover', function (e) {
                    
                    layer.setStyle(hoverStyle);

                    //layer.bindPopup(popupString, {className: 'my-popup'}).openPopup();
                    /* popup
                        .setLatLng([e.latlng.lat,e.latlng.lng])
                        .setContent(popupString)
                        .openOn(strataMap);

                          
                      layer.bindPopup(popup); */


                });
                layer.on('mouseout', function () {
                   
                    layer.setStyle(style);
                    /*strataMap.closePopup();*/
                    //stratamap.closePopup(popup);
                    
                });
            }
        }
    }
)
    

let sec_Strat_TileLayer = new L.TileLayer.GeoJSON(secStratUrl, {
        clipTiles: true,
        unique: function (feature) {
            return feature.id; 
        }
    }, 
    {
        style: style,
        onEachFeature: function (feature, layer) {

            if (feature.properties) {
                var popupString = '<div class="popup">';
                
                for (var k in feature.properties) {
                    var v = feature.properties[k];
                    if (k==='label'){
                      //popupString += k + ': ' + v + '<br />';
                      popupString += v + '<br />';

                    }
                }
            }
            if (!(layer instanceof L.Point)) {
                 var popup = L.popup()
                 layer.on("click", function (e) {
                     // var bounds = layer.getBounds();
                      var popupContent = popupString;
                      popup.setLatLng([e.latlng.lat,e.latlng.lng])
                      popup.setContent(popupContent);
                      strataMap.openPopup(popup);
                });
                layer.on('mouseover', function (e) {
                    
                    layer.setStyle(hoverStyle);

                    //layer.bindPopup(popupString, {className: 'my-popup'}).openPopup();
              


                });
                layer.on('mouseout', function () {
                   
                    layer.setStyle(style);
                   // strataMap.closePopup();
                    //stratamap.closePopup(popup);
                    
                });
            }
        }
    }
)

var baseMaps = {
 /* "mapBox": mapboxTiles,*/
    "Grayscale": cartoDBPositron,
    "Imagery": Esri_WorldImagery
    
};
let stratumLabel = project.details.stratum_label
let secondaryStratumLabel = project.details.secondary_stratum_label
var overlayMaps = {
    [secondaryStratumLabel]: sec_Strat_TileLayer,
    [stratumLabel]: strat_TileLayer,
    "LUCAS": stateclassTiles
};
  

  L.control.layers(baseMaps, overlayMaps).addTo(maps[i]);

  
  let mapId= "map_"+i.toString()
  let allMapData = document.getElementById(mapId);
  const mapControls = allMapData.querySelectorAll('input[name=leaflet-base-layers]')
  mapControls.forEach(function(control, index){
    control.id = "inputBase_"+index.toString()
    const label = document.createElement("label");
    label.className = 'custom-layer-control'
    label.htmlFor = "inputBase_"+index.toString()
    control.parentNode.insertBefore(label, control.nextSibling);
    
  })
  const layersSelect = allMapData.querySelectorAll('div[class=leaflet-control-layers-overlays] > label > input[class=leaflet-control-layers-selector]')
  layersSelect.forEach(function(control, index){
    control.id = "inputLayer_"+index.toString()
    const label = document.createElement("label");
    label.htmlFor = "inputLayer_"+index.toString()
    label.className = 'custom-layer-control'
    
    //label.htmlFor = "custom-layer-control";
    control.parentNode.insertBefore(label, control.nextSibling);
    
  })
  


  //stateclassTiles.addTo(maps[i]) 
  const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${settings.iteration_number}-ts${settings.year}-sc/{z}/{x}/{y}.png?style=lulc`;
  //const url = `http://127.0.0.1:8000/tiles/s${mapscenario}-it${settings.iteration_number}-ts${settings.year}-sc/{z}/{x}/{y}.png`;
  
  stateclassTiles.setUrl(url);


  if (args[0].secondary_stratum === "All" & args[0].stratum === "All"){

    tempLayer = L.geoJson(feature.geom);
        maps[i].fitBounds(tempLayer.getBounds())
  } else if(args[0].stratum === "All"){
    let secStratumVal = args[0].secondary_stratum.replace(/'/g, '').replace(/ /g, "");
    let locationPath = `http://127.0.0.1:8000/locations/${secStratumVal}/`
    let currentMap = maps[i]
    
    $.ajax({
      type: "GET",
      url: locationPath,
      dataType: 'json',
      success: function (response) {
          
          let strataResponse = response
          let geojsonLayer = L.geoJson(strataResponse);
          
          currentMap.fitBounds(geojsonLayer.getBounds());
      }
  });

  }else{
    let stratumVal = args[0].stratum.replace(/'/g, '').replace(/ /g, "");
    let locationPath = `http://127.0.0.1:8000/locations/${stratumVal}/`
    let currentMap = maps[i]
    $.ajax({
      type: "GET",
      url: locationPath,
      dataType: 'json',
      success: function (response) {
          
          let strataResponse = response
          let geojsonLayer = L.geoJson(strataResponse);
         
          currentMap.fitBounds(geojsonLayer.getBounds());
      }
  });

  }
  
 

  //let test = `http://127.0.0.1:8000/locations/${secStratumVal}/`&#39;
  
  //let locationPath = `http://127.0.0.1:8000/locations/${secStratumVal}/`

  

   
        
       // console.log(maps[i])


        
 /* $.getJSON(test, function(data) {
    console.log(data)
    console.log(feature.geom)
        tempLayer = L.geoJson(data);
        maps[i].fitBounds(tempLayer.getBounds());
    })*/

  /*  if (feature.geom) {
      
      tempLayer = L.geoJson(feature.geom);
        maps[i].fitBounds(tempLayer.getBounds());
    }*/
      
  }

  pairs(maps).forEach(function(pair){
      pair[0].sync(pair[1])
      pair[1].sync(pair[0])
    });

  }

};

export default model;
