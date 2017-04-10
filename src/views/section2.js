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
    this.chartStatus('loaded');
    chartContainer.classList.remove('no-data');

    // Filter nested data
    // Filter function returns true for year 1, and then every 10th year
    function yearFilter(row, idx) {
      if (idx === 0 || (idx % 10 === 0)) {
        return true;
      }
      return false;
    }
    
    const decadalData = [];
    nestedData.forEach((series) => {
      const filteredValues = series.values.filter(yearFilter);
      filteredValues.forEach((row) => {
        decadalData.push(
          {
            name: series.key,
            value: row.values[0].Mean,
            year: row.key,
          }
        );
      });
    });
    const barChartTotals = d3.nest()
      .key((d) => d.year)
      .entries(decadalData);

    // Caluclate Net change
    const decadalChange = [];
    function calculateChange(currentRow, idx, arr) {
      const nextRow = arr.find((record) => {
        if (parseInt(record.year) === (parseInt(currentRow.year) + 10) &&
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
            year: `${nextRow.year} - ${currentRow.year}`,
          }
        );
      }
    }
    decadalData.forEach(calculateChange);
    const barChartChange = d3.nest()
      .key((d) => d.year)
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
    console.log(barChartTotals)
    console.log(colorScale)
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
