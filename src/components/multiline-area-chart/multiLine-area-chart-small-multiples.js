import d3 from 'd3';
import { dashed, strokeHatch } from '../../helpers/colors';

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 30, right: 20, bottom: 20, left:80 };
  
  let width = 400;
  let height = 250;
  const chartClass = 'multiLinePlusAreaSmallMultiple';
  let container;
  let domainRange;
  //let xValue = (d) => d.date;
  //let yValue = (d) => +d.value;
  let xDomain = [new Date(2011, 1), new Date(2061, 1)];
  let yAxisAnnotation = 'Area (square kilometers)'
  let yDomain = [0, 100];
  //let color = d3.scale.category10();
  //let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Time Scale';
  
  /**
  * PRIVATE VARIABLES
  **/
  let svg;
  let data;
  let chartW;
  let chartH;
  // X scale
  const xScale = d3.time.scale().nice();
  // Second X scale for brush slider
  const xScaleBrush = d3.time.scale().nice();
    // Y scale
  const yScale = d3.scale.linear();

  // X Axis on top of chart
  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.time.format('%Y'))
    .tickValues([new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)])

  // X Axis for brush slider
  const xAxisBrush = d3.svg.axis()
    .scale(xScaleBrush)
    .orient('bottom');
  // First Y axis on the left side of chart
  let yAxis1 = d3.svg.axis()
    .scale(yScale)
    .orient('left');
  // Second Y axis on the right side of chart
  // Second Y axis uses the same yScale as first one
  /*const yAxis2 = d3.svg.axis()
    .scale(yScale)
    .outerTickSize(0)
    .orient('left');*/
  // Line function
  const line = d3.svg.line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

const area = d3.svg.area()
    .x((d) => xScale(xValue(d)))
    .y0(function(d) { return yScale(+d.min)})
    .y1(function(d) { return yScale(+d.max)});
  // Area function
 /* const area = d3.svg.area()
    .x((d) => xScale(xValue(d)))
    .y0(function(d) { return d.values, function(d) { return yScale(+d.min); }})
    .y1(function(d) { return d.values, function(d) { return yScale(+d.max); }});*/
    //.y0((d) => yScale(yValue(d)))
    //.y1((d) => yScale(yValue(d)));

    //.y0((d) => yScale(yValue(d)))
    //.y1((d) => yScale(yValue(d)+20));
  
  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'brushmove');

  // TODO: Make it responsive
  // http://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in


  function exports(_selection) {

    _selection.each(function (_data) {


     
      chartW = width - margin.left - margin.right;
      chartH = height - margin.top - margin.bottom;

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
      //xAxis.tickSize(-(chartH-20));
      //yAxis1.tickSize(-(chartW-20));

      xAxis.tickSize(5);
      yAxis1.tickSize(5);


      // Select the s*vg element, if it exists.
    
      const div = d3.select(this).selectAll(`.${chartClass}`).data(_data);

      data = _data;

      div.enter()
        .append('div')
          .attr('class', chartClass);
          

      div.exit()
        .remove();

      div.selectAll('svg').data([]).exit().remove();

      svg = div.append('svg').attr('width', width).attr('height', height);

      // Add a group element called Container that hold all elements in the chart
      svg.append('g')
          .attr('class', 'container')
          .attr({ transform: `translate(${margin.left}, ${margin.top})`});
          //.attr("transform", "translate(80, 15)");
        // .attr("transform","translate(${margin.left}, ${margin.top})");
          

      container = svg.selectAll('g.container');   

      svg = d3.select(this).selectAll('svg').data([_data]);
      data = _data;

      
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
      /*container = svgEnter
        .append('g')
        .classed('', true);*/

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('timeseries-area', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group-1 axis', true);
      container.append('g').classed('y-axis-group-2 axis', true);

      // Add group element to Container tp hold data that will be drawn as lines
      container.append('g').classed('timeseries-line', true);

      container.append('g').classed('mouse-over-effects', true);

      // Group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add Y axis label to annotation
      annotation.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - (margin.left - 20))
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
    /* container.append('svg:rect')
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
          dispatch.click(mouse, xScale);
        });*/




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
        .attr({ transform: `translate(${margin.left}, ${margin.top})`});

      // Update the x-axis.
      container.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });

      container.select('.x-axis-0-group.axis')
        .attr({ transform: `translate(0, ${yScale(0)})` });
        
      // Call render chart function
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

  /*exports.getColor = function (seriesName) {
    if (!seriesName) return '#000';
    return color(seriesName);
  };*/

  exports.render = function () {
  
    exports.drawAxes();
    exports.drawLabels();
   //container.each(exports.drawAxes);
    container.each(exports.drawArea);
    container.each(exports.drawLines)
     
    //container.each(exports.drawMouseOverElements);
    exports.drawMouseOverElements();
  };


  exports.onBrush = function (brush) {
    xScale.domain(brush.empty() ? xScaleBrush.domain() : brush.extent());
    this.drawAxes();
    this.drawArea();
    this.drawLines();
  };

  exports.drawAxes = function () {
    // Update the y-axis.
   
  let indexval = 0
  container.each(function(d, i) {
        
        domainRange = [];
       
           
             d.values.forEach(function(element2) {

                element2.values.forEach(function(element3) {

                  
                  domainRange.push(element3.min, element3.max)
                
             })
          })
       
   
        yDomain = [d3.min(domainRange), d3.max(domainRange)]
    
        yScale
            .rangeRound([chartH, 0])
            .domain(yDomain);

        yAxis1 //= d3.svg.axis()
        .scale(yScale)
        .orient('left');

     
      let filtercon = d3.select(container[indexval][0])
       
     
         filtercon.select('.y-axis-group-1.axis')
          .transition().duration(1000)
          .call(yAxis1);
        
          indexval += 1
  

        

    })

  // Update y axis label
       container.select('.y-axis-label')
          .text(yAxisAnnotation);

        // Update the x-axis.
        container.select('.x-axis-group.axis')
          .transition().duration(1000)
          .call(xAxis);

        /*if (d3.min(yScale.domain()) < 0) {
      container.select('.x-axis-0-group.axis')
        .transition().duration(1000)
        .call(xAxis.tickFormat('').tickSize(0));
    }*/



  };

  exports.drawLabels = function () {
    container.select('.year-label')
      .transition().duration(1000)
      .text('')
      .text((d) => d.key);
  };


  exports.drawLines = function () {

    // Add a group element for every timeseries. The path (line) for each time series
    // is added to this group element. This is useful for changing the drawing order of
    // lines on hover or click events.

    // D3 UPDATE
   
    let indexval = 0
    container.each(function(d, i) {
      
      let filtercon = d3.select(container[indexval][0])

      const lineGroupContainer = filtercon.select('g.timeseries-line');
      const lineGroups = lineGroupContainer.selectAll('path.line').data((c) => c.values);
       const lineLabels = lineGroupContainer.selectAll('text').data((c) => c.values);
        
        domainRange = [];
       
           
             d.values.forEach(function(element2) {

                element2.values.forEach(function(element3) {

                  
                  domainRange.push(element3.min, element3.max)
                
             })
          })
       
   
        yDomain = [d3.min(domainRange), d3.max(domainRange)]

       
    yScale
      .domain(yDomain)

     
     lineGroups.transition().duration(1000)
      .attr('class', 'line')
      
      .attr('d', (d) => line(d.values))
      //.style("stroke-dasharray", (d) => (dashed(d.name.split(" / ")[1])))
      .style("stroke-dasharray", (d) => (strokeHatch(d.values[0].scenario)))
      //.style('stroke', (d) => color(d.name.split(" / ")[0]));
      .style('stroke', (d) => color(d.values[0].state));

    // D3 ENTER
    lineGroups.enter()
      .append('g')
        //.attr('class', (d) => d.name)
        .attr('class', (d) => d.state)
      .append('path')
          
        .attr('class', 'line')
        .attr('d', (d) => line(d.values))
        //.style("stroke-dasharray", (d) => (dashed(d.name.split(":")[1])))
        //.style("stroke-dasharray", (d) => (dashed(d.name.split(" / ")[1])))
        //.style('stroke', (d) => color(d.name.split(" / ")[0]));
        .style("stroke-dasharray", (d) => (strokeHatch(d.values[0].scenario)))
        .style('stroke', (d) => color(d.values[0].state));

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    lineGroups.exit()
      .remove();
    lineLabels.exit()
      .remove();

       indexval += 1

    })
    

   
    
    
  };

   exports.drawArea = function () {
   
     let indexval = 0
    container.each(function(d, i) {

      let filtercon = d3.select(container[indexval][0])

      const lineGroupContainer = filtercon.select('g.timeseries-line');
      const areaGroupContainer = filtercon.select('g.timeseries-area');
      const areaGroups = areaGroupContainer.selectAll('path.area').data((c) => c.values);
        
        domainRange = [];
       
           
             d.values.forEach(function(element2) {

                element2.values.forEach(function(element3) {

                  
                  domainRange.push(element3.min, element3.max)
                
             })
          })
       
   
        yDomain = [d3.min(domainRange), d3.max(domainRange)]

       
    yScale
      .domain(yDomain)


    

  
    // D3 UPDATE
    areaGroups.transition().duration(1000)
      .attr('class', 'area')
      .attr('d', (d) => area(d.values));

    // D3 ENTER
    areaGroups.enter()
      .append('g')
        .attr('class', (d) => d.state)
      .append('path')
        .attr('class', 'area')
        .attr('d', (d) => area(d.values));

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished


    areaGroups.exit()
      .remove();

      indexval += 1
      })
    

  };

  exports.drawMouseOverElements = function () {



    let indexval = 0
    container.each(function(d, i) {


     domainRange = [];
       
           
             d.values.forEach(function(element2) {

                element2.values.forEach(function(element3) {

                  
                  domainRange.push(element3.min, element3.max)
                
             })
          })
       
   
      let  yDomain = [d3.min(domainRange), d3.max(domainRange)]


      let filtercon = d3.select(container[indexval][0])
   
    // Mouse over effect
    let mouseG = filtercon.select('g.mouse-over-effects');

    // Add black vertical line to follow mouse
    mouseG.append('path') 
      .attr('class', 'mouse-line2')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', '0');

    // Select all plotted lines
    let lines =mouseG.selectAll('.line');

    // Add circles at intersection of all plotted lines and black vertical line
    let mousePerLine = mouseG.selectAll('.mouse-per-line')
      //.data(data)
      .data((c) => c.values)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line');

    mousePerLine.append('circle')
      .attr('r', 3)
      .style('stroke', '#888')
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .style('opacity', '0');

    mousePerLine.append('text')
      .attr('transform', 'translate(10,3)');

    // Append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect')
      .attr('width', chartW) // can't catch mouse events on a g element
      .attr('height', chartH)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        mouseG.select('.mouse-line2')
          .style('opacity', '0');
        mouseG.selectAll('g.mouse-per-line circle')
          .style('opacity', '0');
        mouseG.selectAll('g.mouse-per-line text')
          .style('opacity', '0');
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        mouseG.select('.mouse-line2')
          .style('opacity', '1');
        mouseG.selectAll('g.mouse-per-line circle')
          .style('opacity', '1');
        mouseG.selectAll('g.mouse-per-line text')
          .style('opacity', '1');
      })
      .on('mousemove', function () { 
   // mouse moving over canvas
        let mouse = d3.mouse(this);
        mouseG.select('.mouse-line2')
          .attr('d', () => {
            let d = `M${mouse[0]}, ${chartH}`;
            d += ` ${mouse[0]}, 0`;
            return d;
          });

        mouseG.selectAll('g.mouse-per-line')
          .attr('transform', function (d) {
            let x0 = xScale.invert(mouse[0]).getFullYear();
            let bisect = d3.bisector((c) => parseInt(c.key)).right;
            let idx = bisect(d.values, x0);
            let d0 = d.values[idx - 1];
            let d1 = d.values[idx];
            let datum;
          //  let variablename = d.name.split(" / ")[0]
           // let scenario = d.name.split(" / ")[1]
            //let textcolor = color(d.name.split(" / ")[0])
            if (d1) {
              datum = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
            } else {
              datum = d0;
            }
            //let textval = variablename + " " + scenario + " " + datum.values
            d3.select(this).select('text')
              .text(datum.values)
             // .style('fill', textcolor);
           
             yScale
              .domain(yDomain)
              
            return `translate(${mouse[0]}, ${yScale(datum.values)})`;
          });
      });
      indexval += 1
    })
  };

  /*exports.moveTooltip = function (year) {

    mouseG.select('.mouse-line2')
      .style('opacity', '1');
    mouseG.selectAll('.mouse-per-line circle')
      .style('opacity', '1');
    mouseG.selectAll('.mouse-per-line text')
      .style('opacity', '1');

    const mouse = xScale(new Date(year, 0, 1));
    mouseG.select('.mouse-line2')
      .attr('d', () => {
        let d = `M${mouse}, ${chartH}`;
        d += ` ${mouse}, 0`;
        return d;
      });

    mouseG.selectAll('.mouse-per-line')
      .attr('transform', function (d) {
        const x0 = year;
        const bisect = d3.bisector((c) => parseInt(c.key)).right;
        const idx = bisect(d.values, x0);
        const d0 = d.values[idx - 1];
        const d1 = d.values[idx];
        let datum;
        if (d1) {
          datum = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
        } else {
          datum = d0;
        }

        d3.select(this).select('text')
          .text(datum.values);
  
        return `translate(${mouse}, ${yScale(datum.values)})`;
      });
  };*/


  d3.rebind(exports, dispatch, 'on');


  return exports;
};

export default chart;
