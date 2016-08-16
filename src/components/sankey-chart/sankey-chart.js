// Adapted from d3-simple-sankey

/* eslint-disable */
import d3 from 'd3';
import { sankeyGraph } from './sankey';

function sankeyGraphChart() {
  /**
  * PUBLIC VARIABLES
  **/
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = 1000;
  let height = 480;
  const chartClass = 'sankey';
  let color = d3.scale.category20c();
  let nodeWidth = 15;
  let nodePadding = 10;
  let formatNumber = d3.format(',.0f'); // zero decimal places
  let format = (d) => formatNumber(d);

  /**
  * PRIVATE VARIABLES
  **/
  let svg;

  function chart(selection) {
    selection.each(function (graph, idx) {
      const chartW = width - margin.left - margin.right;
      const chartH = height - margin.top - margin.bottom;

      // Select the s*vg element, if it exists.
      svg = d3.select(this).selectAll('svg').data([graph]);

      /**
      * Append the elements which need to be inserted only once to svgEnter
      * Following is a list of elements that area inserted into the svg once
      **/
      const svgEnter = svg.enter()
        .append('svg')
        .classed('sankey', true);

      // Add a group element called Container that hold all elements in the chart
      const container = svgEnter
        .append('g');

      // Set the sankey diagram properties
      var sankey = sankeyGraph()
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .size([chartW, chartH]);

      var path = sankey.link();


      // Group element to hold links and nodes
      const linksContainer = container.append('g').classed('links', true);
      const nodesContainer = container.append('g').classed('nodes', true);

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

      chart.update = function update(data) {

        sankey
            .nodes(data.nodes)
            .links(data.links)
            .layout(32);

        // add in the links
        var links = linksContainer.selectAll('.link')
            .data(data.links);

        links.enter()
          .append('path')
          .attr('class', 'link')
            .append('title');

        links
          .attr('d', path)
          .style('stroke-width', function(d) {
            return Math.max(1, d.dy);
          })
          .sort(function(a, b) {
            return b.dy - a.dy;
          });

        // add the link titles
        links.select('title')
          .text(function(d) {
            return d.source.name + ' → ' +
              d.target.name + '\n' + format(d.value);
          });

        links
          .exit().remove();

        // add in the nodes
        var nodes = nodesContainer.selectAll('.node')
          .data(data.nodes);

        var enterNodes = nodes.enter()
          .append('g')
          .attr('class', 'node');

        enterNodes
          .append('rect')
            .append('title');

        enterNodes
          .append('text');

        nodes
          .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          });

        // add the rectangles for the nodes
        nodes.select('rect')
          .attr('height', function(d) {
            return d.dy;
          })
          .attr('width', sankey.nodeWidth())
          .style('fill', function(d) {
            return d.color = color(d.name.replace(/ .*/, ''));
          })
          .style('stroke', function(d) {
            return d3.rgb(d.color).darker(2);
          })
          .select('title')
          .text(function(d) {
            return d.name + '\n' + format(d.value);
          });

        // add in the title for the nodes
        nodes.select('text')
          .attr('x', -6)
          .attr('y', function(d) {
            return d.dy / 2;
          })
          .attr('dy', '.35em')
          .attr('text-anchor', 'end')
          .attr('transform', null)
          .text(function(d) {
            return d.name;
          })
          .filter(function(d) {
            return d.x < width / 2;
          })
          .attr('x', 6 + sankey.nodeWidth())
          .attr('text-anchor', 'start');

        nodes.exit().remove();
      };

      chart.update(graph);
    });
  }

  /**
  * PUBLIC GETTERS AND SETTERS
  **/

  chart.width = function (_) {
    if (!_) return width;
    width = parseInt(_);
    return this;
  };

  chart.height = function (_) {
    if (!_) return height;
    height = parseInt(_);
    return this;
  };

  chart.margin = function (_) {
    if (!_) return margin;
    margin = _;
    return this;
  };

  chart.color = function (_) {
    if (!_) return color;
    color = _;
    return this;
  };

  return chart;
}

export default sankeyGraphChart;


