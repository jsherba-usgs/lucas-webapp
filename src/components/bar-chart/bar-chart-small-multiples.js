import d3 from 'd3';
import tip from 'd3-tip';

d3.tip = tip;

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 40, bottom: 20, left: 60 };
  let width = 400;
  let height = 250;
  let color = d3.scale.category10();
  let chartClass = 'barchart';
  let yAxisAnnotation = 'Linear Scale';
  let xAxisAnnotation = 'Ordinal Scale';
  //let xValue = function(d) { return d.name; };
  let xValue = function(d) { return d.year; };
  let yValue = function(d) { return +d.value; };
  let yMaxValue = function(d) { return +d.max; };
  let yMinValue = function(d) { return +d.min; };
  let errorBarWidth = 4

  /**
  * PRIVATE VARIABLES
  **/

  let data;
  let container;
  let xRoundBands = 0.2;
  const tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .html((d) => `${d.year}: ${d.value} km<sup>2</sup>`);

  // X scale
  const xScale = d3.scale.ordinal();

  // Y scale
  const yScale = d3.scale.linear();

  // X Axis on bottom of chart
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat((d) => d.substring(0, 5));

  // First Y axis on the left side of chart
  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'brushmove');


  function exports(_selection) {
    _selection.each(function (_data) {
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;

      // Set local variable for input data.
      // Transformation of this data has already
      // been done by the time it reaches chart.
      data = _data;

      // Setup scales
      xScale
        .rangeRoundBands([0, chartW], xRoundBands)
        //.domain(data[0].values.map((d) => xValue(d)));
        .domain(data[0].values.map((d) => xValue(d)));
      // .domain(["2011","2061"])
      
      let maxY = d3.max(data, (c) => d3.max(c.values, (d) => yMaxValue(d)));
      let minY = d3.min(data, (c) => d3.min(c.values, (d) => yMinValue(d)));

      if (minY < 0 && maxY <0){
        maxY=0
      }
      /*if (minY===maxY){
        maxY=0
      }*/
      // If all values are +ve, force a 0 baseline for y axis
     if (minY > 0) {
        minY = 0;
      }
      yScale
        .range([chartH, 0]).nice()
        .domain([minY, maxY]);

      // Create a div and an SVG element for each element in
      // our data array. Note that data is a nested array
      // with each element containing another array of 'values'
      const div = d3.select(this).selectAll(`.${chartClass}`).data(data);

      div.enter()
        .append('div')
          .attr('class', chartClass);

      div.exit()
        .remove();

      div.selectAll('svg').data([]).exit().remove();

      const svg = div.append('svg');

      // Add a group element called Container that hold all elements in the chart
      svg.append('g')
          .attr('class', 'container');

      container = svg.selectAll('g.container');

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);
      container.append('g').classed('x-axis-0-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('bars', true);

      container.append('g').classed('barsPattern', true);

      container.append('g').classed('errorBars', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group axis', true);

      // Group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add Y axis label to annotation
      annotation.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (chartH / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('y-axis-label', true);

      // Add Y axis label to annotation
      annotation.append('text')
        .attr('y', 0 - margin.top)
        .attr('x', (chartW / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('year-label', true);

      container.call(tooltip);

      /*
      *  End of all the elements appended to svg only once
      */

      /*
      *  Following actions happen every time the svg is generated
      */
      // Update the outer dimensions.
      svg.transition()
        .attr('width', width)
        .attr('height', height);

      // Update the inner dimensions.
      svg.selectAll('g.container')
        .attr({ transform: `translate(${margin.left}, ${margin.top})` });

      // Update the x-axis.
      container.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });

      // Update the x-axis-0
      container.select('.x-axis-0-group.axis')
        .attr({ transform: `translate(0, ${yScale(0)})` });

      exports.render();
    });
  }


/**
  * PUBLIC GETTERS AND SETTERS
  **/



  exports.width = function (_) {
    if (!_) return width;
    width = parseInt(_);
    return this;
  };

  exports.height = function (_) {
    if (!_) return height;
    height = parseInt(_);
    return this;
  };

  exports.margin = function (_) {
    if (!_) return margin;
    margin = _;
    return this;
  };

  exports.color = function (_) {
    if (!_) return color;
    color = _;
    return this;
  };

  exports.yValue = function (_) {
    if (!_) return yValue;
    yValue = _;
    return this;
  };

  exports.xValue = function (_) {
    if (!_) return xValue;
    xValue = _;
    return this;
  };

  exports.yAxisAnnotation = function (_) {
    if (!_) return yAxisAnnotation;
    yAxisAnnotation = _;
    return this;
  };

  exports.chartClass = function (_) {
    if (!_) return chartClass;
    chartClass = _;
    return this;
  };

 /**
  * PUBLIC FUNCTIONS
  **/

  exports.render = function () {
    exports.drawAxes();
 
    exports.drawLabels();
   
    container.each(exports.drawErrorBars);
 
    container.each(exports.drawBars);


    
  };


  exports.drawAxes = function () {
    // Update the y-axis.
    container.select('.y-axis-group.axis')
      .transition().duration(1000)
      .call(yAxis);

    // Draw x axis with category labels
    container.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);

    // Draw 0 x axis only if data has negative values
    if (d3.min(yScale.domain()) < 0) {
      container.select('.x-axis-0-group.axis')
        .transition().duration(1000)
        .call(xAxis.tickFormat('').tickSize(0));
    }
  };

  

  exports.drawLabels = function () {
    container.select('.year-label')
      .transition().duration(1000)
      .text('')
      .text((d) => d.key);
  };


  exports.drawBars = function () {
    
    const barsContainer = container.select('g.bars');
    const bars = barsContainer.selectAll('rect').data((c) => c.values);

    const barsContainerPattern = container.select('g.barsPattern');
    const barsPattern = barsContainerPattern.selectAll('rect').data((c) => c.values);

    const pattern = d3.scale.ordinal()
    .range([
     '0',
     '4'
    ]).domain([
      '6370',
      '6385'
    ]);
     
    // D3 UPDATE
    bars.transition().duration(1000)
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
      //.style('fill', (d) => color(xValue(d).split(" / ")[0]));
       .style('fill', (d) => color( d.state));

    barsPattern.transition().duration(1000)
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
     // .attr('fill', (d) => 'url('+'#'+'diagonalHatch'+d.name.split(" / ")[1]+')');
      .attr('fill', (d) => 'url('+'#'+'diagonalHatch'+d.scenario+')');

    // D3 ENTER
    bars.enter()
      .append('rect')
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
      //.style('fill', (d) => color(xValue(d).split(" / ")[0]))
      .style('fill', (d) => color(d.state))
      .on('mouseout', tooltip.hide);

    barsPattern.enter()
      .append('rect')
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
      //.attr('fill', (d) => 'url('+'#'+'diagonalHatch'+xValue(d).split(" / ")[1]+')')
       .attr('fill', (d) => 'url('+'#'+'diagonalHatch'+d.scenario+')')
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide);


    barsPattern.enter()
    .append('defs')
    .append('pattern')
      //.attr('id', (d) => 'diagonalHatch'+xValue(d).split(" / ")[1])
      .attr('id', (d) => 'diagonalHatch'+d.scenario)
      .attr('patternUnits', 'userSpaceOnUse')
     // .attr('width', (d) => pattern(xValue(d).split(" / ")[1]))
     // .attr('height', (d) => pattern(xValue(d).split(" / ")[1]))
     .attr('width', (d) => pattern(d.scenario))
     .attr('height', (d) => pattern(d.scenario))
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1);
 
    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    bars.exit()
      .remove();

    barsPattern.exit()
      .remove();
  };

  exports.drawErrorBars = function() {
 
    const errorBarsContainer = container.select('g.errorBars');
    const errorBars = errorBarsContainer.selectAll('rect').data((c) => c.values);


    // D3 UPDATE
    errorBars.transition().duration(1000)
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(yValue(d)+(d.max-d.min) - (d.value - d.min)))
      .attr('x', (d) => xScale(xValue(d))+(xScale.rangeBand()/2)-(errorBarWidth/2)) 
    // .attr('x', (d) => xScale(d.name)+(xScale.rangeBand()/2)-(errorBarWidth/2)) 
      .attr('height', (d) => Math.abs(yScale(d.max) - yScale(d.min)))
      .attr('width', errorBarWidth)
      .style('fill', "#d3d3d3");




    // D3 ENTER
    errorBars.enter()
      .append('rect')
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(yValue(d)+(d.max-d.min) - (d.value - d.min)))
      .attr('x', (d) => xScale(xValue(d))+(xScale.rangeBand()/2)-(errorBarWidth/2)) //.attr('x', (d) => xScale(xValue(d)))
     //.attr('x', (d) => xScale(d.name)+(xScale.rangeBand()/2)-(errorBarWidth/2)) 
      .attr('height', (d) => Math.abs(yScale(d.max) - yScale(d.min)))
      .attr('width', errorBarWidth)
      .style('fill', "#d3d3d3");

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    errorBars.exit()
      .remove();
    
    

  };

  d3.rebind(exports, dispatch, 'on');

  return exports;
};

export default chart;
