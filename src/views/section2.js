// Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/bar-chart/bar-chart.css';

// Import Helpers
import { stateclassColorScale, carbonstockColorScale, scenarioLegendLookup, transitionColorScale, scenarioLookupDictionary, patternHatch, strokeHatch} from './../helpers/colors';
import projectDetails from './../helpers/project-details.js';
// Import Components
import barChart from './../components/bar-chart/bar-chart-small-multiples';
//import chart from './../components/multiline-area-chart/multiLine-area-chart';
import chartSmallMultiples from './../components/multiline-area-chart/multiLine-area-chart-small-multiples';
import {downloadCSV, exportTableToCSV} from './../helpers/csv-service';

/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('two');
const chartContainer = parentContainer.querySelector('.chart.multiples');
const showTotals = parentContainer.querySelector('.total');
const showChange = parentContainer.querySelector('.change');
const groupScenario = parentContainer.querySelector('.group_scenario');
const showGraphType = parentContainer.querySelector('.group_type');
const groupClass = parentContainer.querySelector('.group_class');
let loading;
let yearGroup;
let groupByScenario = true
let decadalChange = [];
let lineChange = []
let sumValue = 0
let sumMax = 0
let sumMin = 0
const view = {
  init() {
      const section2Table = document.getElementById("downloadsection2")
      section2Table.onclick = function(e) {
        e.preventDefault();
        
      exportTableToCSV("lucas.csv", parentContainer)

    }
  },
  updateChart(nestedData, colorScale, details, variableType) {

    timeseriesChart = chartSmallMultiples()
    timeSeriesBarChart = barChart()

    
    const section2 = document.getElementById("two")

    const scenarioGroupCheckbox = section2.querySelector('option[id=scenarioGroup]');
    
    //scenarioGroupCheckbox.checked = true

    const totalChangeCheckbox = section2.querySelector('option[id=totalChange]');
   
    //totalChangeCheckbox.checked = true
    
   
    // Set x and y accessors for timeseries chart
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };

   
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);

    
    let xDomainValues = details.xDomain[0][variableType][0].domain
   
    timeseriesChart.xDomain(xDomainValues);
    
    timeseriesChart.color(colorScale);
    
    timeseriesChart.yAxisAnnotation(projectDetails.getUnit(variableType)); 
    timeSeriesBarChart.yAxisAnnotation(projectDetails.getUnit(variableType));

    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');
    let maxY = d3.max(nestedData[0].values, (d) => d.key);
    let minY = d3.min(nestedData[0].values, (d) => d.key);
    let diff = maxY-minY


    function  totalAreaLine(nestedData, groupByScenario){
      let lineData = [];
     
      nestedData.forEach((series) => {
      

        let filteredValues = series.values.filter(function (el) {return el.key >= minY || el.key <= maxY});
        
        if (groupByScenario === true){
          filteredValues .forEach((row) => {
            lineData.push(
              {
                year: row.key + " / " + series.key.split(' / ')[0],
                values: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: row.key,
                key: row.key,
                scenario: series.key.split(' / ')[1],
                state:series.key.split(' / ')[0],
                
              }
            );
          });
       }else{
         filteredValues.forEach((row) => {
            lineData.push(
              {
                year: row.key + " / " +  series.key.split(' / ')[1],
                values: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: row.key,
                key: row.key,
                scenario: series.key.split(' / ')[1],
                state:series.key.split(' / ')[0],
                
              }
            );
          });
       }
      });
    return lineData 
   }
  
    function  totalArea(nestedData, groupByScenario){
      let decadalData = []
      let barLength = nestedData.length
      nestedData.forEach((series, index) => {
        if (index > barLength/2){
          index = index-(barLength/2)
        }
        console.log(barLength)
        let filteredValues = series.values.filter(function (el) {return el.key === minY || el.key === maxY});
        let yearShort
       
        if (groupByScenario === true){
          filteredValues.forEach((row) => {
             
           if (barLength >= 10){
               yearShort = row.key.substring(2,4)
            }else{
                yearShort = row.key
            }
             console.log(index)
             
            decadalData.push(
              {
                year: row.key + " / " + series.key.split(' / ')[0],
                value: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: series.key.split(' / ')[0]+"_"+yearShort,
                scenario: series.key.split(' / ')[1],
                state:series.key.split(' / ')[0],
                
              }
            );
          });
       }else{
         filteredValues.forEach((row, index2) => {
           if (barLength >= 10 ){
               yearShort = row.key.substring(2,4)
            }else{
                yearShort = row.key
            }
           
            decadalData.push(
              {
                year: row.key + " / " + series.key.split(' / ')[1],
                value: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: series.key.split(' / ')[1]+"_"+yearShort,
                scenario: series.key.split(' / ')[1],
                state:series.key.split(' / ')[0],
                
              }
            );
          });
       }
      });
    return decadalData
   }
    
    function calculateLineChange(currentRow, idx, arr) {
       
       const nextRow = arr.find((record) => {

        if (parseInt(record.yearval) === (parseInt(currentRow.yearval) + 1) &&
            record.name === currentRow.name && parseInt(currentRow.yearval) === parseInt(minY)) {
           sumValue = 0
           sumMax = 0
           sumMin = 0
           lineChange.push(
              { 
              name: currentRow.name,
              values: 0,
              min: 0,
              max: 0,
              scenario: currentRow.scenario,
              state:currentRow.state,
              year: currentRow.year,
              yearval: currentRow.key,
              key: currentRow.key,
              });
          return true
          
        }else if (parseInt(record.yearval) === (parseInt(currentRow.yearval) + 1) &&
            record.name === currentRow.name){
            return true

        }
       
        return false;
      });
      if (nextRow) {
        
        sumValue += (nextRow.values - currentRow.values)
        sumMax = sumValue + (currentRow.max - currentRow.values)
        sumMin = sumValue - (currentRow.values - currentRow.min)
        //sumMin += (nextRow.min - currentRow.values)
        //sumMax += (nextRow.max - currentRow.values)
        lineChange.push(
          {
            name: currentRow.name,
            values: sumValue,
            min: sumMin,
            max: sumMax,
            scenario: nextRow.scenario,
            state:nextRow.state,
            year: nextRow.year,
            yearval: nextRow.key,
            key: nextRow.key,
          }
        );
      }
      
    }

    
    function calculateBarChange(currentRow, idx, arr) {

      let nextRow = arr.find((record) => {
        
        if (parseInt(record.year.split(' / ')[0]) === (parseInt(currentRow.year.split(' / ')[0]) + diff) &&
            record.name === currentRow.name) {
          
          return true;
        }
        return false;
      });
      if (nextRow) {
        
       
        /*if (groupByScenario){
          
          yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.state}`
        }else{
          yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.scenario}`
        }*/
        let yearChange = `${currentRow.year.substring(2,4)}-${nextRow.year.substring(2,4)}`
        let newYearVal
        if (groupByScenario){
          
          //yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.state}`
          newYearVal = currentRow.state+"_"+yearChange
        }else{
         // yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.scenario}`
         newYearVal = currentRow.scenario+"_"+yearChange
        }
        
         
        decadalChange.push(
          {
            name: currentRow.name,
            value: nextRow.value - currentRow.value,
            min: nextRow.min -  currentRow.value,
            max: nextRow.max -  currentRow.value,
            scenario: currentRow.scenario,
            state:currentRow.state,
            year: currentRow.year,
            yearval: newYearVal

          }
        );
      }
    }

    


    
function updateGraphDisplay(){
    
      let totalChange = showTotals.options[showTotals.selectedIndex].value
      let classScenario = groupScenario.options[groupScenario.selectedIndex].value
      let graphType = showGraphType.options[showGraphType.selectedIndex].value
      timeseriesChart.color(colorScale);
      totalBar = totalArea(nestedData, groupByScenario)
      totalLine = totalAreaLine(nestedData, groupByScenario)
      

      let legendData= d3.nest()
    .key((d) => d.scenario)
    .key((d) => d.state)
    .entries(totalBar);
    updateLineandBarLegend(legendData)

      if (totalChange === "Totals"&&classScenario==="Group Scenario"){
        
        if (graphType === "Line Graph"){
          d3.selectAll('.barchart').selectAll("*").remove();
          lineChartTotals = d3.nest()
            .key((d) => d.scenario)
            .key((d) => d.state)
            .entries(totalLine);
          

           d3.select(chartContainer)
            .datum(lineChartTotals)
            .transition()
            .call(timeseriesChart)
       
        }else{
          d3.selectAll('.multiLinePlusAreaSmallMultiple').selectAll("*").remove();
          barChartTotals = d3.nest()
          .key((d) => d.scenario)
          .entries(totalBar);

          d3.select(chartContainer)
            .datum(barChartTotals)
            .call(timeSeriesBarChart
              .color(colorScale)
          );
       }
      }else if(totalChange === "Net Change"&&classScenario==="Group Scenario"){
        
        if (graphType === "Line Graph"){
          d3.selectAll('.barchart').selectAll("*").remove();
            lineChange = []
            sumValue = 0
            sumMax = 0
            sumMin = 0
            totalLine.forEach(calculateLineChange);

            

            lineChartChange = d3.nest()
              .key((d) => d.scenario)
              .key((d) => d.state)
              .entries(lineChange);

              d3.select(chartContainer)
              .datum(lineChartChange)
              .transition()
              .call(timeseriesChart)
          }else{
          d3.selectAll('.multiLinePlusAreaSmallMultiple').selectAll("*").remove();

            decadalChange = [];
            totalBar.forEach(calculateBarChange);

            barChartChange = d3.nest()
              .key((d) => d.scenario)
              .entries(decadalChange);

             
             

            d3.select(chartContainer)
            .datum(barChartChange)
            .call(timeSeriesBarChart
              .color(colorScale)
            );
            return barChartChange
          }
      }else if(totalChange === "Totals"&&classScenario==="Group Class"){
        if (graphType === "Line Graph"){
          d3.selectAll('.barchart').selectAll("*").remove();
          lineChartTotals = d3.nest()
            .key((d) => d.state)
            .key((d) => d.scenario)
            .entries(totalLine);

           d3.select(chartContainer)
            .datum(lineChartTotals)
            .transition()
            .call(timeseriesChart)
         
        }else{
          d3.selectAll('.multiLinePlusAreaSmallMultiple').selectAll("*").remove();
          barChartTotals = d3.nest()
            .key((d) => d.state)
            .entries(totalBar);

          d3.select(chartContainer)
            .datum(barChartTotals)
            .call(timeSeriesBarChart
              .color(colorScale)
          );
            return barChartTotals
     
        }

      }else if(totalChange === "Net Change"&&classScenario==="Group Class"){

        if (graphType === "Line Graph"){
          d3.selectAll('.barchart').selectAll("*").remove();
          lineChange = []
          sumValue = 0
          sumMax = 0
          sumMin = 0
          totalLine.forEach(calculateLineChange);



          lineChartChange = d3.nest()
            .key((d) => d.state)
            .key((d) => d.scenario)
            .entries(lineChange);

          d3.select(chartContainer)
          .datum(lineChartChange)
          .transition()
          .call(timeseriesChart)
        }else{
          d3.selectAll('.multiLinePlusAreaSmallMultiple').selectAll("*").remove();

         decadalChange = [];
          totalBar.forEach(calculateBarChange);


        barChartChange = d3.nest()
          .key((d) => d.state)
          .entries(decadalChange);


        d3.select(chartContainer)
        .datum(barChartChange)
        .call(timeSeriesBarChart
          .color(colorScale)
        );
        return barChartChange

      }
    }
   } 
  
    showTotals.onclick = () => {
      updateGraphDisplay()
      
    };

   
   groupScenario.onclick = () => {
    updateGraphDisplay()
      
    };

  showGraphType.onclick = () => {
      updateGraphDisplay()
  }

    // First time
    // Call bar charts - small multiples




   /* timeseriesChart.color(colorScale);
      
      groupByScenario = true
      totalBar = totalArea(nestedData, groupByScenario)
      totalLine = totalAreaLine(nestedData, groupByScenario)

      
        
    lineChartTotals = d3.nest()
      .key((d) => d.scenario)
      .key((d) => d.state)
      .entries(totalLine);
    

     d3.select(chartContainer)
      .datum(lineChartTotals)
      .transition()
      .call(timeseriesChart)
      
    barChartTotals = d3.nest()
    .key((d) => d.scenario)
    .entries(totalBar);

    d3.select(chartContainer)
      .datum(barChartTotals)
      .call(timeSeriesBarChart
        .color(colorScale)
    );*/
  

  updateGraphDisplay()

  let ticks = details.xDomain[0][variableType][0].ticks
    timeseriesChart.updateTicks(ticks)
  
  function updateLineandBarLegend(legendData){
    
    const collapseSection2 = document.getElementById('collapseLineGraphSection2')
    //collapseSection2.classList.add("in");
    d3.selectAll(".legend-section2-body > *").remove();
    
    let sectionLegend = document.getElementById("legend-section2-body")
    console.log("newtest")
    legendData.forEach(function(scenarioObject){
      
      let scenario = projectDetails.getNameForID(scenarioObject['key'])
      let scenario_id = scenarioObject['key']
      scenarioObject.values.forEach(function(stateObject, indexID){
        

        let barClass = "bar_scenario"+scenario_id+ "_" + indexID.toString()
        let lineClass = "line_scenario"+scenario_id+ "_" + indexID.toString()
        
        let state=stateObject['key']
        let start = stateObject.values[0].value
        let end = stateObject.values[1].value
        let changeTotal = end-start
        let percentChange =((end-start)/start)*100
        percentChange= percentChange.toFixed(1);
        const tableRow = document.createElement("tr");
        const barCol = document.createElement("td");
        barCol.width="100px";
        barCol.className= barClass;
      
        const lineCol = document.createElement("td");
        lineCol.width="100px"
        lineCol.className = lineClass;
        const scenarioCol = document.createElement("td");
        scenarioCol.innerHTML = scenario
        const stateCol = document.createElement("td");
        stateCol.innerHTML = state
        const startCol = document.createElement("td");
        startCol.innerHTML=start.toString()
        const endCol = document.createElement("td");
        endCol.innerHTML=end.toString()
        const changeCol = document.createElement("td");
        changeCol.innerHTML=changeTotal.toString()
        const pChangeCol = document.createElement("td");
        pChangeCol.innerHTML=percentChange.toString()
        tableRow.appendChild(barCol)
        tableRow.appendChild(lineCol)
        tableRow.appendChild(stateCol)
        tableRow.appendChild(scenarioCol)
        tableRow.appendChild(startCol)
        tableRow.appendChild(endCol)
        tableRow.appendChild(changeCol)
        tableRow.appendChild(pChangeCol)
        sectionLegend.appendChild(tableRow)

        

        let color = colorScale(state)
        //let pattern = scenarioLegendLookup[scenario]
        
        barClass="."+barClass
        let pattern= patternHatch(scenario_id)
        d3.select(barClass).append("svg").attr("width", 50).attr("height", 32).append("rect").attr("width", 40).attr("height", 30).style("fill", color).attr("transform", "translate(0,10)")
        d3.select(barClass).select("svg").attr('xmlns', "http://www.w3.org/2000/svg").append('defs').append('pattern').attr('id', barClass).attr('patternUnits', 'userSpaceOnUse').attr('width', '10').attr('height', '10').append('image').attr('xlink:href',pattern).attr('x','0').attr('y','0').attr('height','10').attr('width','10') 
        d3.select(barClass).select("svg").append("rect").attr("width", 40).attr("height", 30).attr("transform", "translate(0,10)").style("fill", "url(#"+barClass+")")//.attr("fill", 'url('+'#'+'diagonalHatch'+scenario+')')
        
        lineClass="."+lineClass
        let strokeArray = strokeHatch(scenario_id)
        d3.select(lineClass).append("svg").attr("height", 10).attr("width", 100).append("line").attr("x1", 0).attr("x2", 40).attr("y1", 0).attr("y2", 0).attr("stroke", color).attr('stroke-width', '5').attr('stroke-dasharray',strokeArray);   
        
      })
    })
 
     //collapseSection2.classList.remove("in");
    }    
    //updateLineandBarLegend(legendData)


  function updateLineandBarLegendSection1(legendData){
    
    const collapseSection1 = document.getElementById('section1-graph-collapse')
    collapseSection1.classList.add("in");
    d3.selectAll(".legend-section1-body > *").remove();
    
    let sectionLegend1 = document.getElementById("legend-section1-body")

    legendData.forEach(function(scenarioObject){
     
      let scenario = projectDetails.getNameForID(scenarioObject['key'])
      let scenario_id = scenarioObject['key']
      scenarioObject.values.forEach(function(stateObject, indexID){
        
        
        
        let lineClass = "line1_scenario"+scenario_id+ "_" + indexID.toString()
        
        let state=stateObject['key']
        
        
        const tableRow = document.createElement("tr");
        tableRow.className = "section1_legend"
        const lineCol = document.createElement("td");
        lineCol.width="100px"
        lineCol.className = lineClass;
        const scenarioCol = document.createElement("td");
        scenarioCol.innerHTML = scenario
        const stateCol = document.createElement("td");
        stateCol.innerHTML = state
       
        
        tableRow.appendChild(lineCol)
        tableRow.appendChild(stateCol)
        tableRow.appendChild(scenarioCol)
        
        sectionLegend1.appendChild(tableRow)

        

        let color = colorScale(state)
       
        
        lineClass="."+lineClass
        let strokeArray = strokeHatch(scenario_id)
        d3.select(lineClass).append("svg").attr("height", 10).attr("width", 100).append("line").attr("x1", 0).attr("x2", 40).attr("y1", 0).attr("y2", 0).attr("stroke", color).attr('stroke-width', '5').attr('stroke-dasharray',strokeArray);   
        
      })
    })
   
     collapseSection1.classList.remove("in");
    }    
    //updateLineandBarLegendSection1(legendData)




  },
  chartStatus(status) {
    switch (status) {
      case 'loading':
        loading = new Spinner().spin(chartContainer);
        break;
      case 'loaded':
        loading.stop();
        break;
      default:
        chartContainer.classList.add('no-data');
    }
  }
};

export default view;
