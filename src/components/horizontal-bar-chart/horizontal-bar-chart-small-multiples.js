import d3 from 'd3';
import tip from 'd3-tip';

d3.tip = tip;

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 50, bottom: 20, left: 150 };
  let width = 300;
  let height = 200;
  let color = d3.scale.ordinal()
      .domain([])
      .range(['#c3c0c0']);
  let chartClass = 'horizontal-bar';
  let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Linear Scale';
  let yValue = (d) => d.name;
  let xValue = (d) => +d.value;

  /**
  * PRIVATE VARIABLES
  **/

  let data;
  let container;
  let yRoundBands = 0.2;
  let chartW;
  let chartH;
  const tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .html((d) => `${yValue(d)}: ${xValue(d)} km<sup>2</sup>`);



  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'mouseover');


  function exports(_selection) {
    _selection.each(function (_data) {
      chartW = width - margin.left - margin.right;
      chartH = height - margin.top - margin.bottom;

      // Set local variable for input data.
      // Transformation of this data has already
      // been done by the time it reaches chart.
      data = _data;

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

      // Add group element to Container for y axis
      container.append('g').classed('y-axis-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('bars', true);

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add Y axis label to annotation


      // Add series label to annotation
      annotation.append('text')
        .attr('y', 0 - margin.top)
        .attr('x', (chartW / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('series-label', true);

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

      // Update the outer dimensions.
      container.transition()
        .attr('width', width)
        .attr('height', height);

      // Update the inner dimensions.
      svg.selectAll('g.container')
        .attr({ transform: `translate(${margin.left}, ${margin.top})` });

      // Update the x-axis.
      container.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });

      // Update the y-axis
/*      container.select('.y-axis-0-group.axis')
        .attr({ transform: `translate(${xScale(0)}, 0)` });*/

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
    container.each(exports.drawChart);
    exports.drawLabels();
  };

  exports.drawLabels = function () {
    container.select('.series-label')
      .transition().duration(1000)
      .text('TRANSITION PATHWAYS');
  };

  exports.drawChart = function (chartData) {
    // For each chart the Y axis and X axis domain is different
    // So create a new scle and axis each for each chart

    // X scale
    const maxX = d3.max(chartData.values, (d) => xValue(d));
    const xScale = d3.scale.linear()
      .range([0, chartW])
      .domain([0, maxX]);

    // Y scale
    const yDomain = chartData.values.map((d) => yValue(d));
    const yScale = d3.scale.ordinal()
      .rangeRoundBands([0, chartH], yRoundBands)
      .domain(yDomain);

    // X Axis on bottom of chart
    const xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    // Y axis on the left side of chart
    const yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

     // Update the y-axis.
    d3.select(this).select('.y-axis-group.axis')
      .transition().duration(1000)
      .call(yAxis);

    // Draw x axis with category labels
/*    d3.select(this).select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);*/

    const barsContainer = d3.select(this).select('g.bars');
    const bars = barsContainer.selectAll('rect').data((c) => c.values);
    const valueLabels = barsContainer.selectAll('text.value').data((c) => c.values);

    const barHeight = d3.min([30, yScale.rangeBand()]);

    // D3 UPDATE
    bars.transition().duration(1000)
      .attr('class', (d) => yValue(d))
      .attr('x', () => xScale(0))
      .attr('y', (d) => yScale(yValue(d)))
      .attr('width', (d) => xScale(xValue(d)))
      .attr('height', barHeight)
      .style('fill', (d) => color(yValue(d)));

    valueLabels.transition().duration(1000)
        .attr('class', 'value')
        .attr('x', (d) => xScale(xValue(d)) + 2)
        .attr('y', (d) => yScale(yValue(d)) + (barHeight / 2))
        .text((d) => `${xValue(d)}`)
        .style('font-size', '10px')
        .style('font-family', 'sans-serif')
        .style('text-anchor', 'start');

    // D3 ENTER
    bars.enter()
      .append('rect')
        .attr('class', (d) => yValue(d))
        .attr('x', () => xScale(0))
        .attr('y', (d) => yScale(yValue(d)))
        .attr('width', (d) => xScale(xValue(d)))
        .attr('height', barHeight)
        .style('fill', (d) => color(yValue(d)))
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide);

    valueLabels.enter()
      .append('text')
        .attr('class', 'value')
        .attr('x', (d) => xScale(xValue(d)) + 2)
        .attr('y', (d) => yScale(yValue(d)) + (barHeight / 2))
        .text((d) => `${xValue(d)}`)
        .style('font-size', '10px')
        .style('font-family', 'sans-serif')
        .style('text-anchor', 'start');

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    bars.exit()
      .remove();

    valueLabels.exit()
      .remove();
  };

  d3.rebind(exports, dispatch, 'on');

  return exports;
};

export default chart;
