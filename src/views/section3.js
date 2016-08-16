// Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';

// Import Helpers
import { stateclassColorScale } from './../helpers/colors';

// Import Components
import lineChart from './../components/multiline-area-chart/multiLine-area-chart';


/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('three');
const timeseriesContainer = parentContainer.querySelector('.chart.timeseries');
let timeseriesChart;

const view = {
  init() {

    // Add loading class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    timeseriesContainer.classList.add('loading');

    function getTooltipContent() {
      return '<p>label</p>';
    }

    timeseriesChart = lineChart()
      .width(timeseriesContainer.offsetWidth)
      .height(timeseriesContainer.offsetHeight || 300)
      .yAxisAnnotation('Area (square kilometers)')
      .color(stateclassColorScale)
      .on('click', (mousePos, xScale) => {
        const html = getTooltipContent(mousePos, xScale);
        const xPos = Math.round(mousePos[0] + 75); // adding right chart margin
        const yPos = Math.round(mousePos[1] + 0); // adding top chart margin

        d3.select('.chart-tooltip')
          .style('left', `${xPos}px`)
          .style('top', `${yPos}px`)
          .html(html);

        d3.select('.hover-line')
          .attr('x1', mousePos[0])
          .attr('x2', mousePos[0])
          .style('stroke-opacity', 1);

        d3.select('.chart-tooltip').classed('hidden', false);
      })
      .on('mouseout', () => {
        // Hide the tooltip
        d3.select('.chart-tooltip').classed('hidden', true);
        d3.select('.hover-line')
          .style('stroke-opacity', 0);
      });
  },
  update(nestedData) {
    // Remove loading/no-data class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    timeseriesContainer.classList.remove('loading');
    timeseriesContainer.classList.remove('no-data');

    // Remap nested data for plotting
    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
        values: series.values,
      }
    ));

    // Set x and y accessors
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);

    // Filter timeseries data for transition groups
    function filterTGroups(row) {
      console.log(row);
      if (row.name === 'AGRICULTURAL CONTRACTION') {
        return true;
      }
      return false;
    }

    const filteredData = timeseriesData.filter(filterTGroups);
    console.log(filteredData);

    // Set y domain
    const domainRange = [];
    filteredData.forEach((series) =>
      series.values.forEach((d) => domainRange.push(d.values))
    );
    timeseriesChart.yDomain([0, d3.max(domainRange)]);

    // Call timeseries chart
    d3.select(timeseriesContainer)
      .datum(filteredData)
      .transition()
      .call(timeseriesChart);

  }
};

export default view;
