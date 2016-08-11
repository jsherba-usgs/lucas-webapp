import d3 from 'd3';

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 10, right: 40, bottom: 20, left: 60 };
  let width = 1000;
  let height = 480;
  const chartClass = 'multiLinePlusArea';
  let xValue = (d) => d.date;
  let yValue = (d) => +d.value;
  let xDomain = [new Date(2001, 1), new Date(2061, 1)];
  let yDomain = [0, 100];
  let color = d3.scale.category10();
  let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Time Scale';

  /**
  * PRIVATE VARIABLES
  **/

  let svg;
  let data;
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
  const dispatch = d3.dispatch('click', 'mouseout', 'brushmove');

  // TODO: Make it responsive
  // http://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in


  function exports(_selection) {
    _selection.each(function (_data) {
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;

      xScale
        .range([0, chartW])
        .domain(xDomain);

      xScaleBrush
        .range([0, chartW])
        .domain(xScale.domain());

      yScale
        .rangeRound([chartH, 0])
        .domain(yDomain);

      // Update tick size for x and y axis
      xAxis.tickSize(chartH);
      yAxis1.tickSize(chartW);

      // Select the s*vg element, if it exists.
      svg = d3.select(this).selectAll('svg').data([_data]);
      data = _data;

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

      // Add a marker style (http://bl.ocks.org/dustinlarimer/5888271)
      defs.append('marker')
        .attr('id', 'marker_stub')
        .attr('markerWidth', 5)
        .attr('markerHeight', 10)
        .attr('markerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('viewBox', '-1 -5 2 10')
        .append('svg:path')
          .attr('d', 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z')
          .attr('fill', '#DDD');


      // Add a group element called Container that hold all elements in the chart
      const container = svgEnter
        .append('g')
        .classed('', true);

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('timeseries-area', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group-1 axis', true);
      container.append('g').classed('y-axis-group-2 axis', true);

      // Add group element to Container tp hold data that will be drawn as lines
      container.append('g').classed('timeseries-line', true);

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
        .attr({ width, height });

      // Update the inner dimensions.
      svg.select('g')
        .attr({ transform: `translate(${margin.left}, ${margin.top})` });

      // Update the x-axis.
      svg.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });
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

  exports.yAxisAnnotation = function (_) {
    if (!_) return yAxisAnnotation;
    yAxisAnnotation = _;
    return this;
  };

 /**
  * PUBLIC FUNCTIONS
  **/

  exports.getColor = function (seriesName) {
    if (!seriesName) return '#000';
    return color(seriesName);
  };

  exports.render = function () {
    this.drawAxes();
    this.drawArea();
    this.drawLines();
  };


  exports.onBrush = function (brush) {
    xScale.domain(brush.empty() ? xScaleBrush.domain() : brush.extent());
    this.drawAxes();
    this.drawArea();
    this.drawLines();
  };

  exports.drawAxes = function () {
    // Update the y-axis.
    svg.select('.y-axis-group-1.axis')
      .transition().duration(1000)
      .call(yAxis1);

    // Update second y axis
    svg.select('.y-axis-group-2.axis')
      .transition().duration(1000)
      .call(yAxis2);

    // Update y axis label
    svg.select('.y-axis-label')
      .text(yAxisAnnotation);

    // Update the x-axis.
    svg.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);
  };


  exports.drawArea = function () {
    const areaData = data.filter((series) => {
      if (series.type === 'area') {
        return series;
      }
      return null;
    });
    const areaGroupContainer = svg.select('g.timeseries-area');
    const areaGroups = areaGroupContainer.selectAll('path.area').data(areaData);

    // D3 UPDATE
    areaGroups.transition().duration(1000)
      .attr('class', 'area')
      .attr('d', (d) => area(d.values));

    // D3 ENTER
    areaGroups.enter()
      .append('g')
        .attr('class', (d) => d.name)
      .append('path')
        .attr('class', 'area')
        .attr('d', (d) => area(d.values));

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    areaGroups.exit()
      .remove();
  };

  exports.drawLines = function () {
    const lineData = data.filter((series) => {
      if (series.type === 'line') {
        return series;
      }
      return null;
    });
    const lineGroupContainer = svg.select('g.timeseries-line');
    const lineGroups = lineGroupContainer.selectAll('path.line').data(lineData);
    const lineLabels = lineGroupContainer.selectAll('text').data(lineData);

    // Add a group element for every timeseries. The path (line) for each time series
    // is added to this group element. This is useful for changing the drawing order of
    // lines on hover or click events.

    // D3 UPDATE
    lineGroups.transition().duration(1000)
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .style('stroke', (d) => color(d.name));

    // D3 ENTER
    lineGroups.enter()
      .append('g')
        .attr('class', (d) => d.name)
      .append('path')
        .attr('class', 'line')
        .attr('d', (d) => line(d.values))
        .style('stroke', (d) => color(d.name));

    lineLabels.enter()
      .append('text')
        .attr("transform", (d) => {
          console.log(d.name, d.values[0].values);
          return "translate(0," + (d.values[0].values) + ")"
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style('fill', (d) => color(d.name))
        .text((d) => d.name);


    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    lineGroups.exit()
      .remove();
  };


  d3.rebind(exports, dispatch, 'on');


  return exports;
};

export default chart;
