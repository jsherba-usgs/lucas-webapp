import content from './filters_download.html';
import projectFilterContent from './filters_projects_download.html';
import percentileFilterContent from './filters_percentile_download.html';
import { triggerEvent } from './../../helpers/utils';
import projects from './../../helpers/project-details';

const model = {};

let filtersContainer;
let filtersContainer2;
let projectId;
let details;
let projectSelect;
let scenarioSelect;
let scenarioSelectInput
let scenarioSelectInputSpatial
let secStratumSelect;
let stratumSelect;
let secStratumSelectSpatial;
let stratumSelectSpatial;
let variableSelect;
let variableSelectInput
let variableDetailInputSpatial
let iterationInput;
let iterationInputSpatial;
let variableDetail;
let iterationTypeSelect;
let strataOverlayOpenBtn
let strataOverlayCloseBtn
let first


function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}
function getCheckBoxVals(selection) {

  let selectedBoxesVals=[];
  for (var i=0;i<selection.length;i++) {
      
      selectedBoxesVals.push(selection[i].value);
      
  }
  selectedBoxString = selectedBoxesVals.join(",")
  return selectedBoxString
}


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
    //if (selectbox.options[i].value !== 'All') {
      selectbox.remove(i)
      i--
    //}
  }
}
function onScenarioChange () {
    scenarioSelectInput = document.querySelectorAll('input[name=scenario_checkboxes]:checked')
    updateIterationInput()
    updateTimesteps()
  }
function onScenarioChangeSpatial() {
    scenarioSelectInputSpatial = document.querySelectorAll('input[name=scenario_checkboxes_spatial]:checked')

    updateIterationInputSpatial();
    updateTimestepsSpatial();
  }


function updateIterationSpatialByLayer(){
  console.log(variableDetailInputSpatial[0].value)
  let variableDetailSpatialCode = JSON.parse(variableDetailInputSpatial[0].value);
    if (variableDetailSpatialCode.id!="1"){
      
      //iterationInputSpatial.value="0"
      iterationInputSpatial.disabled = true;
  
    }else{

      
      iterationInputSpatial.disabled = false;
    }
}
  

function updateIterationInput() {
  
     const id = "single_iteration"
    const getIterationDetail = details.iteration.find((item) => item.id === id);
    
    iterationInput.name = getIterationDetail.name
    iterationInput.type = getIterationDetail.type
    iterationInput.min =  getIterationDetail.min
    iterationInput.max =  getIterationDetail.max
    iterationInput.value = getIterationDetail.min
     
    iterationInputEnd.name = getIterationDetail.name
    iterationInputEnd.type = getIterationDetail.type
    iterationInputEnd.min =  getIterationDetail.min
    iterationInputEnd.max =  getIterationDetail.max
    iterationInputEnd.value = getIterationDetail.max
  }

function updateIterationInputSpatial(){
  const id = "single_iteration"
  const getIterationDetail = details.iteration.find((item) => item.id === id);

  iterationInputSpatial.name = getIterationDetail.name
  iterationInputSpatial.type = getIterationDetail.type
  iterationInputSpatial.min =  getIterationDetail.min
  iterationInputSpatial.max =  getIterationDetail.max
  iterationInputSpatial.value = getIterationDetail.value
  
}

  function togglePercentileDropdown(){
  if (percentileCheckbox.checked) {
      iterationPercentile.disabled = false;
      iterationPercentile.id = "percentile"
      
  } else {
      iterationPercentile.disabled = true;
      iterationPercentile.id = "single_iteration"
  }
}

function toggleSumbyDropdown(){
  if (sumbyCheckbox.checked) {
      sumby.disabled = false;
      sumby.id = "custom_group"
     
  } else {
      sumby.disabled = true;
      sumby.id = "group"
  }

}

function updateTimesteps(){
 
   const timestepDetails = (details.timestep[0])
   timestepBegin.name = timestepDetails.name
   timestepBegin.type = timestepDetails.type
   timestepBegin.min =  timestepDetails.min
   timestepBegin.max =  timestepDetails.max
   timestepBegin.value = timestepDetails.min
   timestepEnd.name = timestepDetails.name
   timestepEnd.type = timestepDetails.type
   timestepEnd.min =  timestepDetails.min
   timestepEnd.max =  timestepDetails.max
   timestepEnd.value = timestepDetails.max
}

function updateTimestepsSpatial(){
   const timestepDetails = (details.timestep[0])
   
   timestepBeginSpatial.name = timestepDetails.name
   timestepBeginSpatial.type = timestepDetails.type
   timestepBeginSpatial.min =  timestepDetails.min
   timestepBeginSpatial.max =  timestepDetails.max
   timestepBeginSpatial.value = timestepDetails.min
   timestepEndSpatial.name = timestepDetails.name
   timestepEndSpatial.type = timestepDetails.type
   timestepEndSpatial.min =  timestepDetails.min
   timestepEndSpatial.max =  timestepDetails.max
   timestepEndSpatial.value = timestepDetails.max
}



function updateVariableSelect (){

  variableSelectInput = document.querySelectorAll('input[name=variable_checkboxes]:checked')
  updateVariableDetail()
}

function updateVariableSelectSpatial (){

  variableSelectInputSpatial = document.querySelectorAll('input[name=variable_checkboxes_spatial]:checked')
  updateVariableDetailSpatial()
}

function updateVariableDetailInput(){
  
  variableDetailInput = document.querySelectorAll('input[name=variable__detail_checkboxes]:checked')
  
}

function updateVariableDetail() {
  

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


  }

function updateVariableDetailInputSpatial(){

variableDetailInputSpatial = document.querySelectorAll('input[name=variable_detail_checkboxes_spatial]:checked')
updateIterationSpatialByLayer()
updateVariableDetailSpatial()
}

function updateVariableDetailSpatial() {
  

  const id = getCheckBoxVals(variableSelectInputSpatial);
  
  const getvariableDetailSpatial = details.layerDownload.find((item) => item.name === id);

    
    //variableDetail = filtersContainer.querySelector('div[name=variable_detail]');
    while (variableDetailSpatial.firstChild) {
    variableDetailSpatial.removeChild(variableDetailSpatial.firstChild);
    }
    first = true;
    getvariableDetailSpatial.values.forEach((item) => {
      let id = item.id
      let type= item.type_code
      let value_object = JSON.stringify({"id":id,"type": type})
      const checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.name = "variable_detail_checkboxes_spatial";//item.name;
      checkbox.value = value_object;
      checkbox.id =item.name+'_spatial';
      if (first){
        checkbox.checked = true;
      }
      first = false;
      variableDetailSpatial.appendChild(checkbox);

      const label = document.createElement('label')
      label.htmlFor = item.name+"_spatial";
      label.classList.add('checkbox_class');
      label.appendChild(document.createTextNode(item.name));

      variableDetailSpatial.appendChild(label);

      variableDetailSpatial.appendChild(document.createElement("br"));   
    });


  }



function updateFields() {
  
  projectId = this.options[this.selectedIndex].value;

  details = projects.getDetailsForId(projectId).details;

  if (details) {

    sumby = filtersContainer.querySelector('select[name=sumby]')
    sumby.id = "group"
    removeOptions(sumby);
    details.sumby.forEach((item) => {
      
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      sumby.add(option);
    });
    

    // Populate scenario select box
  
    scenarioSelectInput = document.querySelectorAll('input[name=scenario_checkboxes]:checked')
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
    //scenarioSelect[0].selected = true
    //scenarioSelect.disabled = false;

    //scenarioSelect.setAttribute('size',scenarioSelect.childElementCount);


    // Populate scenario select box spatial
    scenarioSelectInputSpatial = document.querySelectorAll('input[name=scenario_checkboxes_spatial]:checked')
    scenarioSelectSpatial = filtersContainer.querySelector('div[name=scenario_spatial]');
    while (scenarioSelectSpatial.firstChild) {
    scenarioSelectSpatial.removeChild(scenarioSelectSpatial.firstChild);
    }
    first = true;
    details.scenario.forEach((item) => {
      const checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.name = "scenario_checkboxes_spatial";//item.name;
      checkbox.value = item.id;
      checkbox.id =item.name+"_spatial";
      if (first){
        checkbox.checked = true;
      }
      first = false;
      scenarioSelectSpatial.appendChild(checkbox);

      const label = document.createElement('label')
      label.htmlFor = item.name+"_spatial";
      label.classList.add('checkbox_class');
      label.appendChild(document.createTextNode(item.name));

      scenarioSelectSpatial.appendChild(label);

      scenarioSelectSpatial.appendChild(document.createElement("br"));   
    });
   /* scenarioSelectSpatial = filtersContainer.querySelector('select[name=scenario-spatial]');
    removeOptions(scenarioSelectSpatial);
    details.scenario.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.id;
      scenarioSelectSpatial.add(option);
    });*/
    //scenarioSelectSpatial[0].selected = true
    scenarioSelectSpatial.disabled = false;



    //Update secondary stratum label
    let secStratumSelectLabel = filtersContainer.querySelector('label[name=secondary_stratum_label]');
    var text_to_change = secStratumSelectLabel.childNodes[0];
    text_to_change.nodeValue = details.secondary_stratum_label;


    //secStratumSelectLabel.innerHTML = details.secondary_stratum_label
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

    let secStratumSelectSpatialLabel = filtersContainer.querySelector('label[name=secondary_stratum_spatial_label]');
    var text_to_change = secStratumSelectSpatialLabel.childNodes[0];
    text_to_change.nodeValue = details.secondary_stratum_label;
    //secStratumSelectSpatialLabel.innerHTML = details.secondary_stratum_label

    secStratumSelectSpatial = filtersContainer.querySelector('select[name=secondary_stratum-spatial]');
    removeOptions(secStratumSelectSpatial);
    details.secondary_stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      secStratumSelectSpatial.add(option);
    });
   
    secStratumSelectSpatial.disabled = false;

    let stratumSelectLabel = filtersContainer.querySelector('label[name=stratum_label]');
    var text_to_change = stratumSelectLabel.childNodes[0];
    text_to_change.nodeValue = details.stratum_label;
    //stratumSelectLabel.innerHTML = details.stratum_label

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

    let stratumSelectSpatialLabel = filtersContainer.querySelector('label[name=stratum_spatial_label]');
    var text_to_change = stratumSelectSpatialLabel.childNodes[0];
    text_to_change.nodeValue = details.stratum_label;
    //stratumSelectSpatialLabel.innerHTML = details.stratum_label

    stratumSelectSpatial = filtersContainer.querySelector('select[name=stratum-spatial]');
    removeOptions(stratumSelectSpatial);
    details.stratum.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.id;
      option.value = item.id;
      stratumSelectSpatial.add(option);
    });
    stratumSelectSpatial.disabled = false;

  


     // Populate variable select box

     
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


    variableSelectSpatial = filtersContainer.querySelector('div[name=variable_spatial]');
    while (variableSelectSpatial.firstChild) {
    variableSelectSpatial.removeChild(variableSelectSpatial.firstChild);
    }
    first = true
    details.layerDownload.forEach((item) => {
      const checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.name = "variable_checkboxes_spatial";//item.name;
      checkbox.value = item.name;
      checkbox.id =item.name+"_spatial";
      if (first){
        checkbox.checked = true;
      }
      first = false;
      variableSelectSpatial.appendChild(checkbox);


      const label = document.createElement('label')
      label.htmlFor = item.name+"_spatial";
      label.classList.add('checkbox_class');

      const img = document.createElement("img")
      img.src = item.image_path

      const span = document.createElement('span')
      span.innerHTML = item.name;
      span.classList.add('checkbox_span')

      label.appendChild(img);
      label.appendChild(document.createElement("br")); 
      //label.appendChild(document.createTextNode(item.id));
      label.appendChild(span); 

      variableSelectSpatial.appendChild(label);

    });
    variableSelectSpatial.disabled = false;
     // Populate variable select box
    /*variableSelectSpatial = filtersContainer.querySelector('select[name=variable-spatial]');
    removeOptions(variableSelectSpatial);
    details.layerDownload.forEach((item) => {
      const option = document.createElement('option');
      option.text = item.name;
      option.value = item.name;
      variableSelectSpatial.add(option);
    });
    variableSelectSpatial.disabled = false;*/






   document.getElementById('summaryToolsCollapse').classList.remove("in");
    
    onScenarioChange();
    onScenarioChangeSpatial();

  }
}

model.init = () => {
  
  /*let iteration1 = document.getElementById('iteration1');
  let iteration2 = document.getElementById('iteration2');
  let iteration1Label = document.getElementById("iteration1Label")*/
  filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = content;

  /*iterationTypeSelect = filtersContainer.querySelector('select[name=iteration_type]');
  iterationTypeSelect.disabled = false;*/
  percentileCheckbox =filtersContainer.querySelector('input[name=percentile-checkbox]');
  sumbyCheckbox =filtersContainer.querySelector('input[name=sumby-checkbox]');

  iterationInput = filtersContainer.querySelector('input[name=iteration]');
  iterationInput.disabled = false;

  iterationPercentile = filtersContainer.querySelector('input[name=iteration-percentile]');
  iterationPercentile.id = "single_iteration"

  
  
  iterationInputEnd = filtersContainer.querySelector('input[name=iteration-end]');
  iterationInputEnd.disabled = false;

  iterationInputSpatial = filtersContainer.querySelector('input[name=iteration-spatial]');
  iterationInputSpatial.disabled = false;

  timestepBegin = filtersContainer.querySelector('input[name=timestep-begin]');
  timestepBegin.disabled = false;

  timestepEnd = filtersContainer.querySelector('input[name=timestep-end]');
  timestepEnd.disabled = false;

  timestepBeginSpatial = filtersContainer.querySelector('input[name=timestep-begin-spatial]');
  timestepBeginSpatial.disabled = false;

  timestepEndSpatial = filtersContainer.querySelector('input[name=timestep-end-spatial]');
  timestepEndSpatial.disabled = false;

  variableSelect = filtersContainer.querySelector('div[name=variable]');
  variableSelect.disabled = false;

  variableSelectSpatial = filtersContainer.querySelector('div[name=variable_spatial]');
  variableSelectSpatial.disabled = false;

  variableDetail = filtersContainer.querySelector('div[name=variable_detail]');
  variableDetail.disabled = false;

  variableDetailSpatial = filtersContainer.querySelector('div[name=variable_detail_spatial]');
  variableDetailSpatial.disabled = false;

  // Initialize container
  filtersContainer2 = document.getElementById('filters_project');
  filtersContainer2.innerHTML = projectFilterContent;
  

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

  scenarioSelect.onchange = onScenarioChange//updateIterationInput;updateTimesteps;
  scenarioSelectSpatial.onchange = onScenarioChangeSpatial//updateIterationInputSpatial;updateTimestepsSpatial;
  //scenarioSelect.onchange = updateTimesteps;
  //scenarioSelectSpatial.onchange = updateTimestepsSpatial;
  scenarioSelect.onchange();
  scenarioSelectSpatial.onchange();

  /*iterationTypeSelect.onchange = updateIterationInput;
  iterationTypeSelect.onchange();*/
  variableSelect.onchange = updateVariableSelect//updateVariableDetail;
  variableSelectSpatial.onchange = updateVariableSelectSpatial //updateVariableDetailSpatial;
  variableSelect.onchange();
  variableSelectSpatial.onchange()

  variableDetail.onchange = updateVariableDetailInput
  variableDetail.onchange();
  variableDetailSpatial.onchange = updateVariableDetailInputSpatial;
  variableDetailSpatial.onchange();
  
  percentileCheckbox.onchange = togglePercentileDropdown;
  sumbyCheckbox.onchange = toggleSumbyDropdown;


  // Create a custom event that is dispatched when Update button on form is clicked
  const form =  filtersContainer.querySelector('.filterform');//document.querySelectorAll('form.update')filtersContainer.querySelector('form');
  const formSpatial = filtersContainer.querySelector('.filterform-spatial')

  /*var mymap = L.map('mapid').setView([51.505, -0.09], 13);
 L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 18
        
      }).addTo(mymap);*/
 
  
  //const form2 = filtersContainer2.querySelector('form');
  form.onsubmit = function (e) {

    // prevent default
    e.preventDefault();
    // dispatch custom event
     triggerEvent(document, 'filters.change', {
      detail: model.getValues()

    });


  };

  formSpatial.onsubmit = function (e) {

    // prevent default
    e.preventDefault();
    // dispatch custom event
     triggerEvent(document, 'filters-spatial.change', {
      detail: model.getValuesSpatial()

    });


  };


  secStrataOverlayOpenBtn= document.getElementById('secStrataOverlayOpen');
  secStrataOverlayOpenBtn.addEventListener("click", function(){
    strataOverlayOpen(['secondary_stratum','nonSpatial']);
}, false);
  strataOverlayOpenBtn= document.getElementById('strataOverlayOpen');
  strataOverlayOpenBtn.addEventListener("click", function(){
    strataOverlayOpen(['stratum','nonSpatial']);
}, false);

  secStrataOverlayOpenSpatialBtn = document.getElementById('secStrataOverlayOpenSpatial');
  secStrataOverlayOpenSpatialBtn.addEventListener("click", function(){
    strataOverlayOpen(['secondary_stratum','spatial']);
}, false);
  strataOverlayOpenSpatialBtn=document.getElementById('strataOverlayOpenSpatial');
  strataOverlayOpenSpatialBtn.addEventListener("click", function(){
    strataOverlayOpen(['strata','spatial']);
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

                        
                        popup
                          .setLatLng([e.latlng.lat,e.latlng.lng])
                          .setContent(popupString)
                          .openOn(stratamap);

                          
                        layer.bindPopup(popup);
                        $('.leaflet-popup').css({'bottom': '530px', 'z-index':'1000'})


                    });
                    layer.on('mouseout', function () {
                        layer.setStyle(style);
                        stratamap.closePopup(popup);
                        
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
model.getValuesSpatial = () => (
  {

    project: projectSelect.value,
    scenario: getCheckBoxVals(scenarioSelectInputSpatial),
    stratum: stratumSelectSpatial.value,
    secondary_stratum: secStratumSelectSpatial.value,
    iteration: (iterationInputSpatial.disabled == true ? "0" : iterationInputSpatial.value),
    variable: getCheckBoxVals(variableSelectInputSpatial),
    variable_detail: getCheckBoxVals(variableDetailInputSpatial),
    timestep_begin: timestepBeginSpatial.value,
    timestep_end: timestepEndSpatial.value

  }
);


model.getValues = () => (
  {

    project: projectSelect.value,
    scenario: getCheckBoxVals(scenarioSelectInput),//getOptionVals(scenarioSelect),
    stratum: stratumSelect.value,
    secondary_stratum: secStratumSelect.value,
    iteration_percentile: iterationPercentile.value,
    iteration_begin: iterationInput.value,
    iteration_end: iterationInputEnd.value,
    iteration_id: iterationPercentile.id,
    sumby_id: sumby.id,
    sumby:sumby.value,
    variable: getCheckBoxVals(variableSelectInput),//variableSelect.value,
    variable_detail: getCheckBoxVals(variableDetailInput),
    timestep_begin: timestepBegin.value,
    timestep_end: timestepEnd.value

  }
);

export default model;
