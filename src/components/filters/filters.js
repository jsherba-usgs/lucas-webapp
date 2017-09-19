import content from './filters.html';
import projectFilterContent from './filters_projects.html';
import percentileFilterContent from './filters_percentile.html';
import { triggerEvent } from './../../helpers/utils';
import projects from './../../helpers/project-details';

const model = {};

let filtersContainer;
let filtersContainer2;
let projectId;
let details;
let projectSelect;
let scenarioSelect;
let secStratumSelect;
let stratumSelect;
let variableSelect;
let variableSelectInput
let iterationInput;
let variableDetail;
let variableDetailInput;
let iterationTypeSelect;
let strataOverlayOpenBtn;
let strataOverlayCloseBtn;
const headerContentContainer = document.getElementById('header_content');
const headerTitleContainer = document.getElementById('header_title');
let iterationInputSingle
let iterationInputPercentile

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


function getCheckBoxVals(selection) {

  let selectedBoxesVals=[];
  for (var i=0;i<selection.length;i++) {
      
      selectedBoxesVals.push(selection[i].value);
      
  }
  selectedBoxString = selectedBoxesVals.join(",")
  return selectedBoxString
}

function removeOptions(selectbox) {
  for (let i = 0; i < selectbox.options.length; i++) {
    //if (selectbox.options[i].value !== 'All') {
      selectbox.remove(i)
      i--
    //}
  }
}

function togglePercentileDropdown(){
if (percentileCheckbox.checked) {
    iterationPercentile.disabled = false;
    iterationSingle.disabled = true;
    //iterationPercentile.id = "percentile"
    
} else {
    iterationPercentile.disabled = true;
    //iterationPercentile.id = "single_iteration"
}
}

function toggleSingleIterationDropdown(){
  if (singleIterationCheckbox.checked) {
      iterationSingle.disabled = false;
      iterationPercentile.disabled = true;
      //sumby.id = "custom_group"
     
  } else {
      iterationSingle.disabled = true;
     // sumby.id = "group"
  }

}
function updateScenarioVariables(){
  scenarioSelectInput = document.querySelectorAll('input[name=scenario_checkboxes]:checked')
  updateIterationInput()

}

function updateIterationInput() {

  //let iterationInputChecked = document.querySelectorAll('input[name=iteration-checkbox]:checked')
  details.iteration.forEach(function(item){
      if (item.id === 'percentile'){
         console.log("test1")

          /*iterationInputPercentile.name = item.name
          iterationInputPercentile.type = item.type
          iterationInputPercentile.min =  item.min
          iterationInputPercentile.max =  item.max
          iterationInputPercentile.value = item.value*/

          iterationPercentile.name = item.name
          iterationPercentile.type = item.type
          iterationPercentile.min =  item.min
          iterationPercentile.max =  item.max
          iterationPercentile.value = item.value

      }else{
        console.log("test2")
        /*iterationInputSingle.name = item.name
        iterationInputSingle.type = item.type
        iterationInputSingle.min =  item.min
        iterationInputSingle.max =  item.max
        iterationInputSingle.value = item.value*/

        iterationSingle.name = item.name
        iterationSingle.type = item.type
        iterationSingle.min =  item.min
        iterationSingle.max =  item.max
        iterationSingle.value = item.value
         console.log("test3")
      }
    })
  }
  

function updateVariableDetailInput(){
  variableDetailInput = document.querySelectorAll('input[name=variable_detail_checkboxes]:checked')
}
function updateVariableDetail() {
  variableSelectInput = document.querySelectorAll('input[name=variable_checkboxes]:checked')
  const id = getCheckBoxVals(variableSelectInput);
  const getvariableDetail = details.variable.find((item) => item.id === id);

    
    //variableDetail = filtersContainer.querySelector('div[name=variable_detail]');
    while (variableDetail.firstChild) {
    variableDetail.removeChild(variableDetail.firstChild);
    }
    first = true;
    getvariableDetail.variable_detail.forEach((item) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "variable_detail_checkboxes";//item.name;
      checkbox.value = item.id;
      checkbox.id =item.id;
      if (first){
        checkbox.checked = true;
      }
      first = false;
      variableDetail.appendChild(checkbox);

      const label = document.createElement('label')
      label.htmlFor = item.id;
      label.classList.add('checkbox_class');
      label.appendChild(document.createTextNode(item.id));

      variableDetail.appendChild(label);

      variableDetail.appendChild(document.createElement("br"));   
    });
  variableDetailInput = document.querySelectorAll('input[name=variable_detail_checkboxes]:checked')

  /*variableDetail.options.length = 0
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
    variableDetail.setAttribute('size',variableDetail.childElementCount);*/
  }


function updateFields() {
  
  projectId = this.options[this.selectedIndex].value;

  details = projects.getDetailsForId(projectId).details;
  headerContentContainer.innerHTML = details.header_description;
  headerTitleContainer.innerHTML = details.header_title;
   //update header description
  if (details) {
    
    scenarioSelect = filtersContainer.querySelector('div[name=scenario]');
    while (scenarioSelect.firstChild) {
    scenarioSelect.removeChild(scenarioSelect.firstChild);
    }
    
    first = true;
    details.scenario.forEach((item) => {

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "scenario_checkboxes";//item.name;
      checkbox.value = item.id;
      checkbox.id =item.name;
      if (first){
        checkbox.checked = true;
      }
      first = false;
      scenarioSelect.appendChild(checkbox);

      const label = document.createElement('label')
      label.htmlFor = item.name;
      label.classList.add('checkbox_class');
      label.appendChild(document.createTextNode(item.name));

      scenarioSelect.appendChild(label);

      scenarioSelect.appendChild(document.createElement("br"));   
    });
    scenarioSelectInput = document.querySelectorAll('input[name=scenario_checkboxes]:checked')

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
   /* variableSelect = filtersContainer.querySelector('select[name=variable]');
    removeOptions(variableSelect);
    details.variable.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      variableSelect.add(option);
    });
    variableSelect.disabled = false;*/
     variableSelect = filtersContainer.querySelector('div[name=variable]');
    while (variableSelect.firstChild) {
    variableSelect.removeChild(variableSelect.firstChild);
    }
    first = true
    details.variable.forEach((item) => {
      const checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.name = "variable_checkboxes";//item.name;
      checkbox.value = item.id;
      checkbox.id =item.id;
      if (first){
        checkbox.checked = true;
      }
      first = false;
      variableSelect.appendChild(checkbox);


      const label = document.createElement('label')
      label.htmlFor = item.id;
      label.classList.add('checkbox_class');

      const img = document.createElement("img")
      img.src = item.image_path
      img.className = "variableImages"

      const span = document.createElement('span')
      span.innerHTML = item.id;
      span.classList.add('checkbox_span')

      label.appendChild(img);
      label.appendChild(document.createElement("br")); 
      //label.appendChild(document.createTextNode(item.id));
      label.appendChild(span); 

      variableSelect.appendChild(label);

    });
    variableSelect.disabled = false;

    variableSelectInput = document.querySelectorAll('input[name=variable_checkboxes]:checked')

    // Populate iteration input box
    //iterationTypeSelect = filtersContainer.querySelector('select[name=iteration_type]');
    //iterationTypeSelect.disabled = false;
    

    iterationInputSingle = filtersContainer.querySelector('input[name=iteration-single]');
    //iterationInputSingle.disabled = false;

    iterationInputPercentile = filtersContainer.querySelector('input[name=iteration-percentile]');
    //iterationInputPercentile.disabled = false;
    
    variableDetail = filtersContainer.querySelector('div[name=variable_detail]');
    variableDetail.disabled = false;

    scenarioSelect.onchange = updateScenarioVariables;
    scenarioSelect.onchange();


    variableSelect.onchange = updateVariableDetail;
    variableSelect.onchange();
  

    variableDetail.onchange = updateVariableDetailInput;
    variableDetail.onchange()
  }
}

model.init = () => {
  // Initialize container
  
  filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = content;

  // Initialize container
  filtersContainer2 = document.getElementById('filters_project');
  filtersContainer2.innerHTML = projectFilterContent;
  
  percentileCheckbox = filtersContainer.querySelector('input[id=percentileIteration]');
 
  percentileCheckbox.checked = true
  singleIterationCheckbox  =filtersContainer.querySelector('input[id=singleIteration]');


  iterationPercentile = filtersContainer.querySelector('input[name=iteration-percentile]');
  iterationSingle = filtersContainer.querySelector('input[name=iteration-single]');

  percentileCheckbox.onchange = togglePercentileDropdown;
  percentileCheckbox.onchange()
  singleIterationCheckbox.onchange = toggleSingleIterationDropdown;
  /*filtersContainer3 = document.getElementById('filters_percentile');
  filtersContainer3.innerHTML = percentileFilterContent;*/

  // Add list of projects to content
  projectSelect = filtersContainer2.querySelector('select[name=project]');

  projects.getList().forEach((project) => {
    const option = document.createElement('option');
    option.text = project.name;
    option.value = project.id;
    projectSelect.add(option);
  });
  
  
  

  projectSelect.onchange = updateFields;
  projectSelect.onchange();
  /*scenarioSelect.onchange = updateScenarioVariables;
  scenarioSelect.onchange();
  

  variableSelect.onchange = updateVariableDetail;
  variableSelect.onchange();
  

  variableDetail.onchange = updateVariableDetailInput;*/

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
    
    triggerEvent(document, 'filters.change', {
      detail: model.getValues()
    });
  };


  triggerEvent(document, 'filters.change', {
    detail: model.getValues()

  });

 secStrataOverlayOpenBtn= document.getElementById('secStrataOverlayOpen');
  secStrataOverlayOpenBtn.addEventListener("click", function(){
    strataOverlayOpen(['secondary_stratum','nonSpatial']);
}, false);
  strataOverlayOpenBtn= document.getElementById('strataOverlayOpen');
  strataOverlayOpenBtn.addEventListener("click", function(){
    strataOverlayOpen(['stratum','nonSpatial']);
}, false);



  //strataOverlayOpenBtn= document.getElementById('strataOverlayOpen');
  //strataOverlayOpenBtn.addEventListener('click', strataOverlayOpen);
  // Open, close overlay
  function strataOverlayOpen(strataType) {
    stratamap.eachLayer(function (layer) {
    stratamap.removeLayer(layer);
  });

    let layerName
    let bbGeoJsonLayer
    if (strataType[0]==='secondary_stratum'){
      layerName = details.jsonlayer.sec_strata.name;
      bbGeoJsonLayer = details.jsonlayer.sec_strata.bb

    }else{
      layerName = details.jsonlayer.strata.name;
      bbGeoJsonLayer = details.jsonlayer.strata.bb
    }
    
  
    
    var geojsonURL = `http://127.0.0.1:8000/vtiles/${layerName}/{z}/{x}/{y}.geojson`;
    
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

    

  



    stratamodal.style.display = "block";
    const strataspan = document.getElementById("closeModal")

    // When the user clicks on <span> (x), close the modal
    strataspan.onclick = function() {
        stratamodal.style.display = "none";
    }
   
    var geojsonTileLayer = new L.TileLayer.GeoJSON(geojsonURL, {
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
                    
                    let stratum_type
                    let spatial
                    if (strataType[0]==='secondary_stratum'){
                        stratum_type = 'secondary_stratum'
                    }else{
                        stratum_type = 'stratum'
                    }
                    if (strataType[1]==='spatial'){
                        spatial = '-spatial'
                    }else{
                        spatial = ''
                    }
                    let selectBox =`select[name=${stratum_type}${spatial}]`

                    layer.on('click', function (e) {

                      

                     let filterValue = e.target.feature.properties.label.split(" County")[0]
                     filtersContainer.querySelector(selectBox).value = filterValue
                     stratamodal.style.display = "none";
                    
                     
                    });
                   
                   
                }
                if (!(layer instanceof L.Point)) {
                     var popup = L.popup()
                    layer.on('mouseover', function (e) {
                        
                        layer.setStyle(hoverStyle);

                        layer.bindPopup(popupString, {className: 'my-popup'}).openPopup();
                        //popup.className = 'my-popup'
                        //popup.offset = L.point(0,-50)

                        /*popup
                          .setLatLng([e.latlng.lat,e.latlng.lng])
                          .setContent(popupString)
                          .openOn(stratamap);

                          
                        layer.bindPopup(popup);
                        $('.leaflet-popup').css('z-index','100000')*/


                    });
                    layer.on('mouseout', function () {
                       
                        layer.setStyle(style);
                        stratamap.closePopup();
                        //stratamap.closePopup(popup);
                        
                    });
                }
            }
        }
    )
    cartoDBPositron.addTo(stratamap)
    geojsonTileLayer.addTo(stratamap)
    // 
    stratamap.invalidateSize();
  
    stratamap.fitBounds(bbGeoJsonLayer);
  }
  
  /*strataOverlayCloseBtn = document.getElementById('strataoverlayClose');
  strataOverlayCloseBtn.addEventListener('click', strataoverlayClose);
  function strataoverlayClose() {
    document.body.classList.remove('is-overlay-visible2');
  }*/
 


const stratamodal = document.getElementById('strataModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == stratamodal) {
        stratamodal.style.display = "none";
    }
}


let cartoDBPositron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
 // attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OSM</a>, Map Tiles: <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19,
});

var stratamap = new L.Map('strata-leaflet', {
      center: ["22.234262", "-159.784857"],
      
      zoom: 4,
      //minZoom: 5,
      maxZoom: 19,
      attributionControl: true,
      touchZoom: true,
      scrollWheelZoom: false,
      //layers: [cartoDBPositron],
      });

var ourCustomControl = L.Control.extend({
 
  options: {
    position: 'topright' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

    container.style.backgroundColor = 'white';
    container.style.width = '30px';
    container.style.height = '30px';
    container.innerHTML = '&times';
    container.id = "closeModal";
    return container;
  }
})
    
stratamap.addControl(new ourCustomControl());


};



model.getValues = () => (
  {

    project: projectSelect.value,
    scenario: getCheckBoxVals(scenarioSelectInput),
    stratum: stratumSelect.value,
    secondary_stratum: secStratumSelect.value,
    iteration: (iterationPercentile.disabled == true ? iterationSingle.value : iterationPercentile.value),//iterationInput.value,
    iteration_type: (percentileCheckbox.checked == true ? percentileCheckbox.value : singleIterationCheckbox.value), //iterationTypeSelect.value,
    variable: getCheckBoxVals(variableSelectInput),
    variable_detail: getCheckBoxVals(variableDetailInput)

  }
);

export default model;
