 // Import Node Modules
import d3 from 'd3';
import 'd3-svg-legend';
import Spinner from 'spin';

// Import Styles
import './../components/multiline-area-chart/multiLine-area-chart.css';
import './../components/horizontal-bar-chart/horizontal-bar-chart-small-multiples.css';

// Import Components
import chartSmallMultiplesTransition from './../components/multiline-area-chart/multiLine-area-chart-small-multiples';
import hbarChart from './../components/horizontal-bar-chart/horizontal-bar-chart-stacked';

//import  from './../helpers/project-details';
/*
* PRIVATE VARIABLES
*/
const parentContainer = document.getElementById('three');
//const timeseriesContainer = parentContainer.querySelector('.chart.timeseries');
const hbarsContainer = parentContainer.querySelector('.chart.pathways');
const timeSeriesContainer = parentContainer.querySelector('.chart.timeseries');
const groupScenario = parentContainer.querySelector('.group_scenario');
const groupClass = parentContainer.querySelector('.group_class');
let timeseriesChart;
let pathwaysChart;
let loading;




const view = {
  init() {
    // Set x and y accessors
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };


    // horizontal bar chart
    pathwaysChart = hbarChart()
      .height(250)
      .width(hbarsContainer.offsetWidth - 70)
      .yValue((d) => d.pathway)
      .xValue((d) => +d.total);
  },
  updateChart(nestedData, colorScale, transitionGroups) {
    timeseriesChart = chartSmallMultiplesTransition();
    const yAccessor = function (d) { return +d.values; };
    const xAccessor = function (d) { return new Date(d.key, 0, 1); };
    timeseriesChart.yValue(yAccessor);
    timeseriesChart.xValue(xAccessor);

    timeseriesChart.color(colorScale);

    timeseriesChart
       .height(250)
       .width(timeSeriesContainer.offsetWidth)
    timeSeriesContainer.classList.remove('no-data');

  
    
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

 
  

  let transitionPathwaysNestedMap = transitionPathwaysNested.map(function(d) {
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
    transitionPathwaysNestedMap.forEach(function(groupval){
      groupval.forEach(function(groupval2){
      stack(groupval2)
      })
    })
  
let  groupByScenario = true
function  totalArea(transitionPathwaysNestedMap, groupByScenario){
    var dataset = transitionPathwaysNestedMap.map(function (transgroups) {
      return transgroups.map(function (pathways){
        return pathways.map(function (groups){

    //return groups.map(function (d, i) {
        if (groupByScenario === true){
          return  {
            x: groups[0].y,
            y: groups[0].group,
            x0: groups[0].y0,
            group: groups[0].x,
            pathway: groups[0].pathway
          }
            
      }else{
           return  {
            // Invert the x and y values, and y0 becomes x0
            x: groups[0].y,
            y: groups[0].x,
            x0: groups[0].y0,
            group: groups[0].group,
            pathway: groups[0].pathway
          }
      }
      })  
    })

  })
  return dataset  
}

let maxY = d3.max(nestedData[0].values, (d) => d.key);
let minY = d3.min(nestedData[0].values, (d) => d.key);

function  totalAreaLine(nestedData, groupByScenario, transitionGroups){
      let lineData = [];
      console.log(transitionGroups)
      

      nestedData.forEach((series) => {
      

       // let filteredValues = series.values.filter(function (el) {return el.key >= minY || el.key <= maxY});
       //let filteredValues = series.values.filter(function (el) {return el.values[0].TransitionGroup !== "AGRICULTURAL CONTRACTION"});
       let filteredValues = series.values.filter(function (el) {return !transitionGroups.includes(el.values[0].TransitionGroup)});
        
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
                state:series.key.split(' / ')[0].split(": ")[1],
                
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
                state:series.key.split(' / ')[0].split(": ")[1],
                
              }
            );
          });
       }
      });
    return lineData 
   }
 //console.log(transitionPathways)
 let pathwayValues = totalAreaLine(nestedData, groupByScenario, transitionGroups)

 lineChartTotals = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(pathwayValues);
        

 d3.select(timeSeriesContainer)
  .datum(lineChartTotals)
  .transition()
  .call(timeseriesChart);


 let dataset = totalArea(transitionPathwaysNestedMap, groupByScenario)

 dataset = [].concat.apply([], dataset)
 dataset = [].concat.apply([], dataset)

  dataset= d3.nest()
      .key((d) => d.group)
      .sortKeys(d3.ascending)
      .entries(dataset); 
   
   groupScenario.onclick = () => {
      groupScenario.classList.add("active");
      groupClass.classList.remove("active")
      groupByScenario = true

  pathwayValues = totalAreaLine(nestedData, groupByScenario, transitionGroups)


 lineChartTotals = d3.nest()
          .key((d) => d.scenario)
          .key((d) => d.state)
          .entries(pathwayValues);
        

 d3.select(timeSeriesContainer)
  .datum(lineChartTotals)
  .transition()
  .call(timeseriesChart);


      let dataset = totalArea(transitionPathwaysNestedMap, groupByScenario)
     dataset = [].concat.apply([], dataset)
     dataset = [].concat.apply([], dataset)

  dataset= d3.nest()
      .key((d) => d.group)
      .sortKeys(d3.ascending)
      .entries(dataset); 

      d3.select(hbarsContainer)
      .datum(dataset)
      .call(pathwaysChart);
      
    };

  groupClass.onclick = () => {
      groupScenario.classList.remove("active");
      groupClass.classList.add("active")
      groupByScenario = false

  pathwayValues = totalAreaLine(nestedData, groupByScenario, transitionGroups)


 lineChartTotals = d3.nest()
          .key((d) => d.state)
          .key((d) => d.scenario)
          .entries(pathwayValues);
        

 d3.select(timeSeriesContainer)
  .datum(lineChartTotals)
  .transition()
  .call(timeseriesChart);
      
      let dataset = totalArea(transitionPathwaysNestedMap, groupByScenario)
     dataset = [].concat.apply([], dataset)
     dataset = [].concat.apply([], dataset)

  dataset= d3.nest()
      .key((d) => d.group)
      .sortKeys(d3.ascending)
      .entries(dataset); 

        d3.select(hbarsContainer)
      .datum(dataset)
      .call(pathwaysChart);

      
    };


        // Call horizontal bar charts - small multiples
    d3.select(hbarsContainer)
      .datum(dataset)
      .call(pathwaysChart);


  },
  chartStatus(status) {
    
    switch (status) {
      case 'loading':
        //loading1 = new Spinner().spin(timeseriesContainer);
        loading = new Spinner().spin(hbarsContainer);
        break;
      case 'loaded':
        //loading1.stop();
        loading.stop();
        break;
      default:
       // timeseriesContainer.classList.remove('no-data');
        hbarsContainer.classList.remove('no-data');
    }
    
  }
};

export default view;
