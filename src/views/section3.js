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
import sankeyDataTransform from './../components/sankey-chart/sankey-data';
import barChart from './../components/bar-chart/bar-chart-small-multiples';

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
        return true;
      }
      return false;
    }

    const transitionPathways = timeseriesData
      .filter(filterTransitionPathways)
      .map((series) => {
        const name = series.name.split(':');
        series.tgroup = name[0].trim();
        if (series.tgroup !== 'FIRE') {
          series.source = name[1].split('-')[0].trim();
          series.target = name[1].split('>')[1].trim();
        } else {
          series.source = name[1].trim();
          series.target = '';
        }
        series.values = d3.sum(series.values, (d) => d.values);
        delete series.type;
        return series;
      });
    console.log(transitionPathways);

    const dummyData = d3.nest()
        .key((d) => d.tgroup)
        .key((d) => `${d.source}-${d.target}`)
        //.rollup((v) => d3.sum(v.values, (d) => d.values))
        .entries(transitionPathways);

    console.log('duumu', dummyData);
    //const sankeyData = sankeyDataTransform(dummyData);
    //console.log(sankeyData);

    // Call sankey chart
/*    d3.select(sankeyContainer)
      .datum(sankeyData)
      .transition()
      .call(transitionsChart);*/

    // First time
    // Call bar charts - small multiples
    d3.select(sankeyContainer)
      .datum(dummyData)
      .call(barChart()
        .height(250)
        .color(stateclassColorScale)
      );


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
