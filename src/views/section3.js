 // Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';
import './../components/sankey-chart/sankey-chart.css';

// Import Helpers
import { stateclassColorScale } from './../helpers/colors';

// Import Components
import lineChart from './../components/multiline-area-chart/multiLine-area-chart-small-multiples';
import sankeyChart from './../components/sankey-chart/sankey-chart';

/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('three');
const timeseriesContainer = parentContainer.querySelector('.chart.timeseries');
const sankeyContainer = parentContainer.querySelector('.chart.sankey');
let timeseriesChart;
let transitionsChart;

const view = {
  init() {

    // Add loading class
    // TODO: Refactor this, expose another method on view maybe, e.g. view.setStatus('loading')
    timeseriesContainer.classList.add('loading');

    function getTooltipContent() {
      return '<p>label</p>';
    }

    // Set x and y accessors
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };

    timeseriesChart = lineChart()
      .width(timeseriesContainer.offsetWidth)
      .height(250)
      .yAxisAnnotation('Area (square kilometers)')
      .xValue(xAccessor)
      .yValue(yAccessor)
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


    // sankey chart
    transitionsChart = sankeyChart()
      .width(sankeyContainer.offsetWidth)
      .height(250);
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

    const re = /[:->]/;
    // Filter timeseries data for Transition Types
    function filterTransitionTypes(row) {
      if (!row.name.match(re)) {
        //console.log('Transition type', row);
        return true;
      }
      return false;
    }

    // Filter timeseries data for Transition Pathways
    function filterTransitionPathways(row) {
      if (row.name.match(re)) {
        console.log('Transition pathway', row);
        return true;
      }
      return false;
    }

    const transitionPathways = timeseriesData.filter(filterTransitionPathways);

    const dummyData = {
      "nodes":[
      {"node":0,"name":"node0"},
      {"node":1,"name":"node1"},
      {"node":2,"name":"node2"},
      {"node":3,"name":"node3"},
      {"node":4,"name":"node4"}
      ],
      "links":[
      {"source":0,"target":2,"value":2},
      {"source":1,"target":2,"value":2},
      {"source":1,"target":3,"value":2},
      {"source":0,"target":4,"value":2},
      {"source":2,"target":3,"value":2},
      {"source":2,"target":4,"value":2},
      {"source":3,"target":4,"value":4}
      ]};
    // Call sankey chart
    d3.select(sankeyContainer)
      .datum(dummyData)
      .transition()
      .call(transitionsChart);


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

  }
};

export default view;
