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
let loading;

const view = {
  init() {

  },
  updateChart(nestedData, colorScale) {
    console.log(nestedData)
    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');
    let maxY = d3.max(nestedData[0].values, (d) => d.key);
    let minY = d3.min(nestedData[0].values, (d) => d.key);
    let diff = maxY-minY
    console.log(maxY)
    // Filter nested data
    // Filter function returns true for year 1, and then every 10th year
   
    /*function yearFilter(row, idx) {
      if (idx === 0 || idx === totalY) {
        return true;
      }
      return false;
    }*/
   
    const decadalData = [];
  

    nestedData.forEach((series) => {
      
  
      const filteredValues = series.values.filter(function (el) {return el.key === minY || el.key === maxY});
      
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
    });
    
    const barChartTotals = d3.nest()
      .key((d) => d.name.split(' / ')[1])
      .entries(decadalData);

    // Caluclate Net change
    const decadalChange = [];
    function calculateChange(currentRow, idx, arr) {

      const nextRow = arr.find((record) => {
        
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
           // name: `${nextRow.year} - ${currentRow.year}`,
            value: nextRow.value - currentRow.value,
            min: nextRow.min -  currentRow.value,
            max: nextRow.max -  currentRow.value,
           // year: currentRow.name,
            scenario: currentRow.scenario,
            state:currentRow.state,
            year: `${currentRow.yearval.substring(2,4)}-${nextRow.yearval.substring(2,4)} / ${currentRow.state}`
            //year: `${nextRow.year}`,
          }
        );
      }
    }


    decadalData.forEach(calculateChange);
    
    const barChartChange = d3.nest()
      .key((d) => d.name.split(' / ')[1])
      .entries(decadalChange);
   
    showTotals.onclick = () => {
      // Call bar charts - small multiples

      d3.select(chartContainer)
        .datum(barChartTotals)
        .call(barChart()
          .color(colorScale)
        );
    };

    showChange.onclick = () => {

      // Call bar charts - small multiples
      d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(colorScale)
        );
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
