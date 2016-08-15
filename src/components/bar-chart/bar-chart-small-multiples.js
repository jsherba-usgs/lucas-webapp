import d3 from 'd3';

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 40, bottom: 20, left: 60 };
  let width = 300;
  let height = 250;
  let color = d3.scale.category10();
  let yAxisAnnotation = 'Linear Scale';
  let xAxisAnnotation = 'Ordinal Scale';
  let xValue = function(d) { return d.name; };
  let yValue = function(d) { return d.value; };

  /**
  * PRIVATE VARIABLES
  **/

  let data;
  let container;
  let xRoundBands = 0.2;

  // X scale
  const xScale = d3.scale.ordinal();

  // Y scale
  const yScale = d3.scale.linear();

  // X Axis on bottom of chart
  const xAxis = d3.svg.axis()
    .scale(xScale);

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
        .domain(data[0].values.map((d) => xValue(d)));

      const maxY = d3.max(data, (c) => d3.max(c.values, (d) => yValue(d)));
      let minY = d3.min(data, (c) => d3.min(c.values, (d) => yValue(d)));

      // If all values are +ve, force a 0 baseline for y axis
      if (minY > 0) {
        minY = 0;
      }
      yScale
        .range([chartH, 0]).nice()
        .domain([minY, maxY]);

      console.log(yScale(0));

      // Create a div and an SVG element for each element in
      // our data array. Note that data is a nested array
      // with each element containing another array of 'values'
      let div = d3.select(this).selectAll('.chart').data(data);
      
      div.enter()
        .append('div')
          .attr('class', 'chart')
        .append('svg')
        .append('g')
          .attr('class', 'container');

      let  svg = div.select('svg');

      // Add a group element called Container that hold all elements in the chart
      container = svg.select('g.container');


      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);
      container.append('g').classed('x-axis-0-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('bars', true);

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
          const mouse = d3.mouse(this);
          // Dispatch click event
          dispatch.click(mouse);
        });


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

 /**
  * PUBLIC FUNCTIONS
  **/

  exports.render = function () {
    exports.drawAxes();
    container.each(exports.drawBars);
  };


  exports.drawAxes = function () {

    // Update the y-axis.
    container.select('.y-axis-group.axis')
      .transition().duration(1000)
      .call(yAxis);

    // Remove comments to draw x axis with category labels
/*    container.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);*/

    // Draw 0 x axis only if data has negative values
    if (d3.min(yScale.domain()) < 0) {
      container.select('.x-axis-0-group.axis')
        .transition().duration(1000)
        .call(xAxis.tickFormat('').tickSize(0));
    }

  };


  exports.drawBars = function (c, i) {

    const barsContainer = container.select('g.bars');
    const bars = barsContainer.selectAll('rect').data((c) => c.values);

    // D3 UPDATE
    bars.transition().duration(1000)
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
      .style('fill', (d) => color(xValue(d)));


    // D3 ENTER
    bars.enter()
      .append('rect')
      .attr('class', (d) => xValue(d))
      .attr('y', (d) => yScale(Math.max(0, yValue(d))))
      .attr('x', (d) => xScale(xValue(d)))
      .attr('height', (d) => Math.abs(yScale(yValue(d)) - yScale(0)))
      .attr('width', xScale.rangeBand())
      .style('fill', (d) => color(xValue(d)));

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
