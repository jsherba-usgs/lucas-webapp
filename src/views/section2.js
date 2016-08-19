// Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';

// Import Styles
import './../components/bar-chart/bar-chart.css';
import './../components/horizontal-bar-chart/horizontal-bar-chart.css';


// Import Helpers
import { stateclassColorScale } from './../helpers/colors';

// Import Components
import barChart from './../components/horizontal-bar-chart/horizontal-bar-chart';


/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('two');
const chartContainer = parentContainer.querySelector('.chart.multiples');
const showTotals = parentContainer.querySelector('.total');
const showChange = parentContainer.querySelector('.change');

const view = {
  init() {
    // Add loading class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    chartContainer.classList.add('loading');
  },
  update(nestedData) {
    // Remove loading/no-data class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    chartContainer.classList.remove('loading');
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
            value: row.values,
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

    console.log('bar chart', barChartTotals);

    showTotals.onclick = () => {
      // Call bar charts - small multiples

      d3.select(chartContainer)
        .datum(barChartTotals)
        .call(barChart()
          .color(stateclassColorScale)
        );
    };

    showChange.onclick = () => {
      // Call bar charts - small multiples
      d3.select(chartContainer)
        .datum(barChartChange)
        .call(barChart()
          .color(stateclassColorScale)
        );
    };

    // First time
    // Call bar charts - small multiples
    d3.select(chartContainer)
      .datum(barChartTotals)
      .call(barChart()
        .color(stateclassColorScale)
      );

  }
};

export default view;
