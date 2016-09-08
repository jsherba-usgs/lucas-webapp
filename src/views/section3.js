 // Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';
import './../components/horizontal-bar-chart/horizontal-bar-chart-small-multiples.css';

// Import Components
import lineChart from './../components/multiline-area-chart/line-chart-small-multiples';
import hbarChart from './../components/horizontal-bar-chart/horizontal-bar-chart-small-multiples';

/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('three');
const timeseriesContainer = parentContainer.querySelector('.chart.timeseries');
const hbarsContainer = parentContainer.querySelector('.chart.pathways');
let timeseriesChart;
let pathwaysChart;
let loading1;
let loading2;

const view = {
  init() {
    // Set x and y accessors
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };

    timeseriesChart = lineChart()
      .width(timeseriesContainer.offsetWidth)
      .height(250)
      .xValue(xAccessor)
      .yValue(yAccessor);

    // horizontal bar chart
    pathwaysChart = hbarChart()
      .height(250)
      .width(hbarsContainer.offsetWidth - 70)
      .yValue((d) => d.pathway)
      .xValue((d) => +d.total);
  },
  updateChart(nestedData) {
    this.chartStatus('loaded');
    timeseriesContainer.classList.remove('no-data');
    hbarsContainer.classList.remove('no-data');

    // Remap nested data for plotting
    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
        values: series.values,
      }
    ));

    const re = /[:->]/;
    // Filter timeseries data for Transition Types
    function filterTransitionTypes(row) {
      if (!row.name.match(re)) {
        return true;
      }
      return false;
    }

    // Filter timeseries data for Transition Pathways
    function filterTransitionPathways(row) {
      if (row.name.match(re)) {
        return true;
      }
      return false;
    }

    const transitionPathways = timeseriesData
      .filter(filterTransitionPathways)
      .map((series) => {
        const name = series.name.split(':');
        series.tgroup = name[0].trim();
        series.pathway = name[1].trim();
        series.total = d3.sum(series.values, (d) => d.values);
        return series;
      });

    const transitionPathwaysNested = d3.nest()
      .key((d) => d.tgroup)
      .sortKeys(d3.ascending)
      .entries(transitionPathways);


    // Call horizontal bar charts - small multiples
    d3.select(hbarsContainer)
      .datum(transitionPathwaysNested)
      .call(pathwaysChart);


    const transitionTypes = timeseriesData.filter(filterTransitionTypes);
    // Set y domain
    const domainRange = [];
    transitionTypes.forEach((series) =>
      series.values.forEach((d) => domainRange.push(d.values))
    );
    timeseriesChart.yDomain([0, d3.max(domainRange)]);

    // Call timeseries chart
    d3.select(timeseriesContainer)
      .datum(transitionTypes)
      .transition()
      .call(timeseriesChart);
  },
  chartStatus(status) {
    switch (status) {
      case 'loading':
        loading1 = new Spinner().spin(timeseriesContainer);
        loading2 = new Spinner().spin(hbarsContainer);
        break;
      case 'loaded':
        loading1.stop();
        loading2.stop();
        break;
      default:
        timeseriesContainer.classList.remove('no-data');
        hbarsContainer.classList.remove('no-data');
    }
  }
};

export default view;
