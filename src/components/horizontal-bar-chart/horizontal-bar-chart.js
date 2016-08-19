import d3 from 'd3';

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 40, bottom: 20, left: 60 };
  let width = 500;
  let height = 250;
  const chartClass = 'horizontal-bar';
  let color = d3.scale.category10();
  let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Linear Scale';

  /**
  * PRIVATE VARIABLES
  **/

  let svg;
  let data;

  // X scale
  const xScale = d3.scale.linear();

  // Y scale
  const yScale = d3.scale.ordinal();

  // X Axis on bottom of chart
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  // First Y axis on the left side of chart
  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(0)
    .tickPadding(6);


  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'brushmove');

  // TODO: Make it responsive
  // http://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in


  function exports(_selection) {
    _selection.each(function (_data) {
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;

      // Select the s*vg element, if it exists.
      svg = d3.select(this).selectAll('svg').data([_data]);
      data = _data;


      xScale
        .range([0, chartW])
        .domain(d3.extent(data, function(d) { return d.value; })).nice();

      yScale
        .rangeRoundBands([0, chartH], 0.1)
        .domain(data.map(function(d) { return d.name; }));

      /**
      * Append the elements which need to be inserted only once to svgEnter
      * Following is a list of elements that area inserted into the svg once
      **/
      const svgEnter = svg.enter()
          .append('svg')
          .classed(chartClass, true);

      // Add defintions of graphical objects to be used later inside
      // a def container element.
      const defs = svgEnter.append('defs');

      // Add a clip path for hiding parts of graph out of bounds
      defs.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
          .attr('width', chartW)
          .attr('height', chartH);


      // Add a group element called Container that hold all elements in the chart
      const container = svgEnter
        .append('g')
        .classed('', true);

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('bars', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group axis', true);

      // Group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add Y axis label to annotation
/*      annotation.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - margin.left)
          .attr('x', 0 - (chartH / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .classed('y-axis-label', true);*/

      // Hover line for click events
      container.append('g')
        .append('line')
          .classed('hover-line', true)
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', chartH)
          .style('stroke-opacity', 0);

      // Invisible rect for mouse tracking since you
      // can't catch mouse events on a g element
      container.append('svg:rect')
        .attr('width', chartW)
        .attr('height', chartH)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () {
          dispatch.mouseout();
        })
        .on('click', function () {
          var mouse  = d3.mouse(this);
          // Dispatch click event
          dispatch.click(mouse, xScale);
        });

      // Adds a div to svg's parent div
      d3.select(this).append('div')
        .attr('class', 'chart-tooltip hidden');
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
      svg.select('g')
        .attr({ transform: `translate(${margin.left}, ${margin.top})` });

      // Update the x-axis.
      svg.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });

      // Update the y-axis.
      svg.select('.y-axis-group.axis')
        .attr({ transform: `translate(${xScale(0)}, 0)` });
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

  exports.yAxisAnnotation = function (_) {
    if (!_) return yAxisAnnotation;
    yAxisAnnotation = _;
    return this;
  };

 /**
  * PUBLIC FUNCTIONS
  **/

  exports.render = function () {
    this.drawAxes();
    this.drawBars();
  };


  exports.drawAxes = function () {
    // Update the y-axis.
    svg.select('.y-axis-group.axis')
      .transition().duration(1000)
      .call(yAxis);


    // Update y axis label
/*    svg.select('.y-axis-label')
      .text(yAxisAnnotation);*/

    // Update the x-axis.
    svg.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);
  };


  exports.drawBars = function () {

    const barsContainer = svg.select('g.bars');
    const bars = barsContainer.selectAll('rect').data(data);

    // D3 UPDATE
    bars.transition().duration(1000)
      .attr('class', 'value')
      .attr("x", function(d) { return xScale(Math.min(0, d.value)); })
      .attr("y", function(d) { return yScale(d.name); })
      .attr("width", function(d) { return Math.abs(xScale(d.value) - xScale(0)); })
      .attr("height", yScale.rangeBand());

    // D3 ENTER
    bars.enter()
      .append('rect')
        .attr('class', 'value')
        .attr("x", function(d) { return xScale(Math.min(0, d.value)); })
        .attr("y", function(d) { return yScale(d.name); })
        .attr("width", function(d) { return Math.abs(xScale(d.value) - xScale(0)); })
        .attr("height", yScale.rangeBand());
      

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    bars.exit()
      .remove();
  };

 
  d3.rebind(exports, dispatch, 'on');


  return exports;
};

export default chart;
