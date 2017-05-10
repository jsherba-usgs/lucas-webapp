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

const view = {
  init() {

  },
  updateChart(nestedData, colorScale) {

    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');
    let maxY = d3.max(nestedData[0].values, (d) => d.key);
    let minY = d3.min(nestedData[0].values, (d) => d.key);
    let diff = maxY-minY

    // Filter nested data
    // Filter function returns true for year 1, and then every 10th year
   
    /*function yearFilter(row, idx) {
      if (idx === 0 || idx === totalY) {
        return true;
      }
      return false;
    }*/
   
    let groupByScenario = true
  
    function  totalArea(nestedData, groupByScenario){
      let decadalData = [];
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
   decadalData = totalArea(nestedData, groupByScenario)
   
  let barChartTotals = d3.nest()
      //.key((d) => d.name.split(' / ')[1])
       //.key((d) => d.scenario)
      .key((d) => d.scenario)
      .entries(decadalData);

   

    // Caluclate Net change
    let decadalChange = [];
    function calculateChangeScenario(currentRow, idx, arr) {

      let nextRow = arr.find((record) => {
        
        if (parseInt(record.year.split(' / ')[0]) === (parseInt(currentRow.year.split(' / ')[0]) + diff) &&
            record.name === currentRow.name) {
          return true;
        }
        return false;
      });
      if (nextRow) {

        decadalChange.push(
          {
            name: currentRow.name,
            value: nextRow.value - currentRow.value,
            min: nextRow.min -  currentRow.value,
            max: nextRow.max -  currentRow.value,
            scenario: currentRow.scenario,
            state:currentRow.state,
            year: `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.state}`,
          }
        );
      }
    }

    function calculateChangeState(currentRow, idx, arr) {

      let nextRow = arr.find((record) => {
        
        if (parseInt(record.year.split(' / ')[0]) === (parseInt(currentRow.year.split(' / ')[0]) + diff) &&
            record.name === currentRow.name) {
          
          return true;
        }
        return false;
      });
      if (nextRow) {

        decadalChange.push(
          {
            name: currentRow.name,
            value: nextRow.value - currentRow.value,
            min: nextRow.min -  currentRow.value,
            max: nextRow.max -  currentRow.value,
            scenario: currentRow.scenario,
            state:currentRow.state,
            year: `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.scenario}`,
          }
        );
      }
    }



    decadalData.forEach(calculateChangeScenario);
    
    let barChartChange = d3.nest()
      .key((d) => d.scenario)
      .entries(decadalChange);

    let isTotals = true
    showTotals.onclick = () => {
      showTotals.classList.add("active");
      showChange.classList.remove("active")
      // Call bar charts - small multiples
      isTotals = true
      d3.select(chartContainer)
        .datum(barChartTotals)
        .call(barChart()
          .color(colorScale)
        );
    };

    showChange.onclick = () => {
      showTotals.classList.remove("active");
      showChange.classList.add("active")
      isTotals = false
      // Call bar charts - small multiples
      d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );
    };


   
   groupScenario.onclick = () => {
      groupScenario.classList.add("active");
      groupClass.classList.remove("active")
      groupByScenario = true
      decadalData = totalArea(nestedData, groupByScenario)
      

      if (isTotals === true){

        barChartTotals = d3.nest()
        .key((d) => d.scenario)
        .entries(decadalData);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );
          return barChartTotals
      }else{
        decadalChange = [];
        decadalData.forEach(calculateChangeScenario);

        barChartChange = d3.nest()
          .key((d) => d.scenario)
          .entries(decadalChange);

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
      decadalData = totalArea(nestedData, groupByScenario)
      

      if (isTotals === true){
        barChartTotals = d3.nest()
          .key((d) => d.state)
          .entries(decadalData);

        d3.select(chartContainer)
          .datum(barChartTotals)
          .call(barChart()
            .color(colorScale)
        );
          return barChartTotals
      }else{
        
        decadalChange = [];
    
        decadalData.forEach(calculateChangeState);
        

        barChartChange = d3.nest()
          .key((d) => d.state)
          .entries(decadalChange);

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
