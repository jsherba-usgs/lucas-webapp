// Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/bar-chart/bar-chart.css';

// Import Helpers
import { stateclassColorScale, carbonstockColorScale } from './../helpers/colors';

// Import Components
import barChart from './../components/bar-chart/bar-chart-small-multiples';
//import chart from './../components/multiline-area-chart/multiLine-area-chart';
import chartSmallMultiples from './../components/multiline-area-chart/multiLine-area-chart-small-multiples';


/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('two');
const chartContainer = parentContainer.querySelector('.chart.multiples');
const showTotals = parentContainer.querySelector('.total');
const showChange = parentContainer.querySelector('.change');
const groupScenario = parentContainer.querySelector('.group_scenario');
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
    
  },
  updateChart(nestedData, colorScale) {

    timeseriesChart = chartSmallMultiples()
 /* const timeseriesData= nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
        //values: series.values,
        values: series.values.map(function(dd){
                key = dd.key
                values = dd.values[0].Mean
                min = dd.values[0].min
                max = dd.values[0].max
                return {key:key, min:min, max:max, values:values}
              })
      }
    ));*/


  /*const timeseriesData = nestedData.map((series) => (
      {
        key: series.key.split(' / ')[1],
       
        //values: series.values,
        values: series.values.map(function(dd){

              
                values= dd.values[0].Mean
                max =dd.values[0].max
                min=dd.values[0].min
                year= dd.values[0].Timestep + " / " + dd.values[0].StateLabelX
                name=series.key
                yearval= dd.values[0].Timestep.toString()
                key= dd.values[0].Timestep.toString()
                scenario= dd.values[0].ScenarioID
                state=dd.values[0].StateLabelX

               
                return {year:year, min:min, max:max, values:values, name:name, name:name, yearval:yearval,key:key,scenario:scenario, state:state}
              })
      }
    ));*/





    
   
    // Set x and y accessors for timeseries chart
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };

   
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);
   
    // Set y domain
   /*const domainRange = [];
  
    timeseriesData.forEach((series) =>
      //series.values.forEach((d) => domainRange.push(d.values))
      //series.values.forEach((d) => d.values.forEach((f) => domainRange.push(f.min, f.max)))

      series.values.forEach((d) => domainRange.push(d.min, d.max))
    );

    timeseriesChart.yDomain([d3.min(domainRange), d3.max(domainRange)]);*/

    timeseriesChart.color(colorScale);
    

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
      nestedData.forEach((series) => {
        
    
        let filteredValues = series.values.filter(function (el) {return el.key === minY || el.key === maxY});
        if (groupByScenario === true){
          filteredValues.forEach((row) => {
            decadalData.push(
              {
                year: row.key + " / " + series.key.split(' / ')[0],
                value: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: row.key,
                scenario: series.key.split(' / ')[1],
                state:series.key.split(' / ')[0],
                
              }
            );
          });
       }else{
         filteredValues.forEach((row) => {
            decadalData.push(
              {
                year: row.key + " / " +  series.key.split(' / ')[1],
                value: row.values[0].Mean,
                max:row.values[0].max,
                min:row.values[0].min,
                name:series.key,
                yearval: row.key,
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
        
       
        if (groupByScenario){
          
          yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.state}`
        }else{
          yearGroup = `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.scenario}`
        }

        decadalChange.push(
          {
            name: currentRow.name,
            value: nextRow.value - currentRow.value,
            min: nextRow.min -  currentRow.value,
            max: nextRow.max -  currentRow.value,
            scenario: currentRow.scenario,
            state:currentRow.state,
            year: yearGroup,
          }
        );
      }
    }


    totalLine = totalAreaLine(nestedData, groupByScenario)
    totalBar = totalArea(nestedData, groupByScenario)


    let isTotals = true
    showTotals.onclick = () => {
      showTotals.classList.add("active");
      showChange.classList.remove("active")
      isTotals = true
      totalBar = totalArea(nestedData, groupByScenario)
      totalLine = totalAreaLine(nestedData, groupByScenario)
      if (groupByScenario === true){  
        lineChartTotals = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(totalLine);
        

         d3.select(chartContainer)
          .datum(lineChartTotals)
          .transition()
          .call(timeseriesChart);

        barChartTotals = d3.nest()
        .key((d) => d.scenario)
        .entries(totalBar);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );

        }else{

          lineChartTotals = d3.nest()
          .key((d) => d.state)
          .key((d) => d.scenario)
          .entries(totalLine);
        

         d3.select(chartContainer)
          .datum(lineChartTotals)
          .transition()
          .call(timeseriesChart);

        barChartTotals = d3.nest()
        .key((d) => d.state)
        .entries(totalBar);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );

        }
      
    };

    showChange.onclick = () => {
      showTotals.classList.remove("active");
      showChange.classList.add("active")
      isTotals = false
      // Call bar charts - small multiples
      if (groupByScenario === true){
      lineChange = []
        sumValue = 0
        sumMax = 0
        sumMin = 0
        totalLine.forEach(calculateLineChange);

        decadalChange = [];
        totalBar.forEach(calculateBarChange);

        lineChartChange = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(lineChange);

        barChartChange = d3.nest()
          .key((d) => d.scenario)
          .entries(decadalChange);
            
      d3.select(chartContainer)
      .datum(lineChartChange)
      .transition()
      .call(timeseriesChart);

      d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );
      }else{
        lineChange = []
        sumValue = 0
        sumMax = 0
        sumMin = 0
        totalLine.forEach(calculateLineChange);

        decadalChange = [];
        totalBar.forEach(calculateBarChange);

        lineChartChange = d3.nest()
          .key((d) => d.state)
          .key((d) => d.scenario)
          .entries(lineChange);

        barChartChange = d3.nest()
          .key((d) => d.state)
          .entries(decadalChange);
            
      d3.select(chartContainer)
      .datum(lineChartChange)
      .transition()
      .call(timeseriesChart);

      d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );

      }
    };


   
   groupScenario.onclick = () => {
      groupScenario.classList.add("active");
      groupClass.classList.remove("active")
      groupByScenario = true
      totalBar = totalArea(nestedData, groupByScenario)
      totalLine = totalAreaLine(nestedData, groupByScenario)

      if (isTotals === true){
        
        lineChartTotals = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(totalLine);
        

         d3.select(chartContainer)
          .datum(lineChartTotals)
          .transition()
          .call(timeseriesChart);

        barChartTotals = d3.nest()
        .key((d) => d.scenario)
        .entries(totalBar);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );
          return barChartTotals
      }else{

        lineChange = []
        sumValue = 0
        sumMax = 0
        sumMin = 0
        totalLine.forEach(calculateLineChange);

        decadalChange = [];
        totalBar.forEach(calculateBarChange);

        lineChartChange = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(lineChange);

        barChartChange = d3.nest()
          .key((d) => d.scenario)
          .entries(decadalChange);

         d3.select(chartContainer)
          .datum(lineChartChange)
          .transition()
          .call(timeseriesChart);

        d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );
        return barChartChange
      }

      
    };

  groupClass.onclick = () => {
      groupScenario.classList.remove("active");
      groupClass.classList.add("active")
      groupByScenario = false
      totalBar = totalArea(nestedData, groupByScenario)
      totalLine = totalAreaLine(nestedData, groupByScenario)
  
      if (isTotals === true){

          lineChartTotals = d3.nest()
          .key((d) => d.state)
          .key((d) => d.scenario)
          .entries(totalLine);

         d3.select(chartContainer)
          .datum(lineChartTotals)
          .transition()
          .call(timeseriesChart);

        barChartTotals = d3.nest()
          .key((d) => d.state)
          .entries(totalBar);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );
          return barChartTotals
      }else{
        
        lineChange = []
        sumValue = 0
        sumMax = 0
        sumMin = 0
        totalLine.forEach(calculateLineChange);

        decadalChange = [];
        totalBar.forEach(calculateBarChange);


        lineChartChange = d3.nest()
          .key((d) => d.state)
          .key((d) => d.scenario)
          .entries(lineChange);

        barChartChange = d3.nest()
          .key((d) => d.state)
          .entries(decadalChange);

        d3.select(chartContainer)
          .datum(lineChartChange)
          .transition()
          .call(timeseriesChart);


        d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );
        return barChartChange
      }

      
    };

    // First time
    // Call bar charts - small multiples
  
  let barChartTotals = d3.nest()
      .key((d) => d.scenario)
      .entries(totalBar);

  let lineChartTotals = d3.nest()
      .key((d) => d.scenario)
      .key((d) => d.state)
      .entries(totalLine);
    
    d3.select(chartContainer)
      .datum(lineChartTotals)
      .transition()
      .call(timeseriesChart);
    
    d3.select(chartContainer)
      .datum(barChartTotals)
      .call(barChart()
        .color(colorScale)
      );
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
