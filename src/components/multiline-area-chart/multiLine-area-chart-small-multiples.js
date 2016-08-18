import d3 from 'd3';
import tip from 'd3-tip';

d3.tip = tip;

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 40, bottom: 20, left: 60 };
  let width = 300;
  let height = 200;
  let color = d3.scale.ordinal()
      .domain([])
      .range(['#8c564b']);
  let chartClass = 'linechart';
  let xValue = (d) => d.date;
  let yValue = (d) => +d.value;
  let xDomain = [new Date(2001, 1), new Date(2061, 1)];
  let yDomain = [0, 100];
  let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Time Scale';
  const tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .html((d) => `${d.key}: ${d.values} km<sup>2</sup>`);

  /**
  * PRIVATE VARIABLES
  **/

  let data;
  let container;
  // X scale
  const xScale = d3.time.scale().nice();
  // Second X scale for brush slider
  const xScaleBrush = d3.time.scale().nice();
    // Y scale
  const yScale = d3.scale.linear();
  // X Axis on top of chart
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('top')
    .tickFormat(d3.time.format('%Y'))
    .tickValues([new Date(2001, 0), new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)])
  // X Axis for brush slider
  const xAxisBrush = d3.svg.axis()
    .scale(xScaleBrush)
    .orient('bottom');
  // First Y axis on the left side of chart
  const yAxis1 = d3.svg.axis()
    .scale(yScale)
    .orient('right');
  // Second Y axis on the right side of chart
  // Second Y axis uses the same yScale as first one
  const yAxis2 = d3.svg.axis()
    .scale(yScale)
    .outerTickSize(0)
    .orient('left');
  // Line function
  const line = d3.svg.line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));
  // Area function
  const area = d3.svg.area()
    .x((d) => xScale(xValue(d)))
    .y0((d) => yScale(+d.min))
    .y1((d) => yScale(+d.max));
  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'mouseover');


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
        .range([0, chartW])
        .domain(xDomain);

      yScale
        .rangeRound([chartH, 0])
        .domain(yDomain);

      // Update tick size for x and y axis
      xAxis.tickSize(chartH);
      yAxis1.tickSize(chartW);

      // Create a div and an SVG element for each element in
      // our data array. Note that data is a nested array
      // with each element containing another array of 'values'
      const div = d3.select(this).selectAll(`.${chartClass}`).data(_data);

      div.enter()
        .append('div')
          .attr('class', chartClass);

      div.exit()
        .remove();

      div.selectAll('svg').data([]).exit().remove();

      const svg = div.append('svg');

      // Add a group element called Container that hold all elements in the chart
      svg.append('g')
          .classed('container', true);

      container = svg.select('g.container');

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Add group element to Container to hold lines
      container.append('g').classed('timeseries-line', true);

       // Add group element to Container to hold areas
      container.append('g').classed('timeseries-area', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group-1 axis', true);
      container.append('g').classed('y-axis-group-2 axis', true);

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

      // Add line label to annotation
      annotation.append('text')
        .attr('y', 0 - margin.top)
        .attr('x', (chartW / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('line-label', true);

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

  exports.yDomain = function (_) {
    if (!_) return yDomain;
    yDomain = _;
    return this;
  };

  exports.xDomain = function (_) {
    if (!_) return xDomain;
    xDomain = _;
    return this;
  };

 /**
  * PUBLIC FUNCTIONS
  **/

  exports.render = function () {
    exports.drawAxes();
    exports.drawLabels();
    //container.each(exports.drawLines);
    exports.drawLines();
  };


  exports.drawAxes = function () {
    // Update the y-axis.
    container.select('.y-axis-group-1.axis')
      .transition().duration(1000)
      .call(yAxis1);

    // Update second y axis
    container.select('.y-axis-group-2.axis')
      .transition().duration(1000)
      .call(yAxis2);

    // Update y axis label
/*    svg.select('.y-axis-label')
      .text(yAxisAnnotation);*/

    // Update the x-axis.
    container.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);
  };

  exports.drawLabels = function () {
    container.select('.line-label')
      .transition().duration(1000)
      .text('')
      .text((d) => d.name);
  };


  exports.drawLines = function () {
    let lineContainer = container.select('g.timeseries-line');
    lineContainer.append('g').append('path');
    lineContainer.select('g').append('circle');

    lineContainer.call(tooltip);

    let lines = lineContainer.select('path');
    let circles = lineContainer.selectAll('circle').data((d) => d.values);


    // D3 UPDATE
    lines.transition().duration(1000)
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .style('stroke', (d) => color(d.name));

    circles.enter()
      .append('circle')
        .attr('r', 2.5)
        .attr('cx', (d) => xScale(xValue(d)))
        .attr('cy', (d) => yScale(yValue(d)))
        .style('fill', 'none')
        .style('stroke', (d) => color(d.name))
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);


    // D3 ENTER
    lines.enter()
      .append('g')
      .append('path')
        .attr('class', 'line')
        .attr('d', (d) => line(d.values))
        .style('stroke', (d) => color(d.name));


    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    lines.exit()
      .remove();
  };

  d3.rebind(exports, dispatch, 'on');

  return exports;
};

export default chart;
