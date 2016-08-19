// Adapted from http://www.d3noob.org/2013/02/formatting-data-for-sankey-diagrams-in.html
import d3 from 'd3';

const dataToNodeMap = (data) => {
  const graph = {
    nodes: [],
    links: data,
  };


  graph.links.forEach((d) => {
    graph.nodes.push({ name: d.source });
    graph.nodes.push({ name: d.target });
  });

  // return only the distinct / unique nodes
  graph.nodes = d3.keys(d3.nest()
    .key((d) => d.name)
    .map(graph.nodes));

  // loop through each link replacing the text with its index from node
  graph.links.forEach((d, i) => {
    graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
    graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
  });

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  graph.nodes.forEach((d, i) => {
    graph.nodes[i] = { name: d };
  });

  return graph;
};

export default dataToNodeMap;