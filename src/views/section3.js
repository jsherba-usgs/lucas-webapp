 // Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';
import './../components/horizontal-bar-chart/horizontal-bar-chart-small-multiples.css';

// Import Components
import lineChart from './../components/multiline-area-chart/line-chart-small-multiples';
import hbarChart from './../components/horizontal-bar-chart/horizontal-bar-chart-stacked';


/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('three');
//const timeseriesContainer = parentContainer.querySelector('.chart.timeseries');
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

    /*timeseriesChart = lineChart()
      .width(timeseriesContainer.offsetWidth)
      .height(250)
      .xValue(xAccessor)
      .yValue(yAccessor);*/

    // horizontal bar chart
    pathwaysChart = hbarChart()
      .height(250)
      .width(hbarsContainer.offsetWidth - 70)
      .yValue((d) => d.pathway)
      .xValue((d) => +d.total);
  },
  updateChart(nestedData) {
    this.chartStatus('loaded');
    //timeseriesContainer.classList.remove('no-data');
    hbarsContainer.classList.remove('no-data');
   
    // Remap nested data for plotting
    const timeseriesData = nestedData.map((series) => (
      {
        name: series.key,
        type: 'line',
      //  values: series.values,
       values: series.values.map(function(dd){
                key = dd.key
                values = dd.values[0].Mean
                min = dd.values[0].min
                max = dd.values[0].max
                return {key:key, min:min, max:max, values:values}
              })
      }
    ));

    //let dataVariablesSplit = dataVariables.split(',');

    const re = /[:->]/;
    // Filter timeseries data for Transition Types
    function filterTransitionTypes(row) {
      if (!row.name.match(re)) {
        return true;
      }
      return false;
    }
    /* function filterTransitionTypes(row) {

       return dataVariablesSplit.includes(row.name)
    }*/

    // Filter timeseries data for Transition Pathways
    function filterTransitionPathways(row) {
      if (row.name.match(re)) {
        return true;
      }
      return false;
    }
    
  console.log(timeseriesData)
    const transitionPathways = timeseriesData
      .filter(filterTransitionPathways)
      .map((series) => {
        const name = series.name.split(' / ')[0];
        const name2 = name.split(':');
        series.scenario=series.name.split(' / ')[1]
        series.tgroup = name2[0].trim();
        series.pathway = name2[1].trim();
        series.total = d3.sum(series.values, (d) => d.values);
        
        return series;
      });


     scenarios = transitionPathways.map(function (d) {
        return d.pathway;
      })
     
  
  const transitionPathwaysNested = d3.nest()
      .key((d) => d.tgroup)
      .key((d) => d.scenario)
      .sortKeys(d3.ascending)
      .entries(transitionPathways);

    
     
   dataset = transitionPathwaysNested.map(function(d) {
    return d.values.map(function (t) {
          return t.values.map(function (o) {
            return [{
              y: o.total,
              x: o.name.split(' / ')[1],
              group: d.key,
              pathway: o.pathway
            }];
          });
        });
      })

    stack = d3.layout.stack();
    dataset.forEach(function(groupval){
      groupval.forEach(function(groupval2){
      stack(groupval2)
      })
    })
    //stack(dataset);

    var dataset = dataset.map(function (transgroups) {
      return transgroups.map(function (pathways){
        return pathways.map(function (groups){

    //return groups.map(function (d, i) {
          return  {
            // Invert the x and y values, and y0 becomes x0
            x: groups[0].y,
            y: groups[0].x,
            x0: groups[0].y0,
            group: groups[0].group,
            pathway: groups[0].pathway
            
        };
      })  
    })  
  })

 dataset = [].concat.apply([], dataset)
 dataset = [].concat.apply([], dataset)

  dataset= d3.nest()
      .key((d) => d.group)
      .sortKeys(d3.ascending)
      .entries(dataset); 
   
  
        // Call horizontal bar charts - small multiples
    d3.select(hbarsContainer)
      .datum(dataset)
      .call(pathwaysChart);



   /* const transitionTypes = timeseriesData.filter(filterTransitionTypes);

   
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
      .call(timeseriesChart);*/


  },
  chartStatus(status) {
    
    switch (status) {
      case 'loading':
        //loading1 = new Spinner().spin(timeseriesContainer);
        loading2 = new Spinner().spin(hbarsContainer);
        break;
      case 'loaded':
        //loading1.stop();
        loading2.stop();
        break;
      default:
       // timeseriesContainer.classList.remove('no-data');
        hbarsContainer.classList.remove('no-data');
    }
    
  }
};

export default view;
