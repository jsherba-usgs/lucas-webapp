{
"nodes":[
{"node":0,"name":"node0"},
{"node":1,"name":"node1"},
{"node":2,"name":"node2"},
{"node":3,"name":"node3"},
{"node":4,"name":"node4"}
],
"links":[
{"source":0,"target":2,"value":2},
{"source":1,"target":2,"value":2},
{"source":1,"target":3,"value":2},
{"source":0,"target":4,"value":2},
{"source":2,"target":3,"value":2},
{"source":2,"target":4,"value":2},
{"source":3,"target":4,"value":4}
]}

        // Move to other file

 /*       console.log(plotData);
        const links = [];
        plotData.forEach((series) => {
          series.values.forEach((year, i) => {
            if (i === 0 || (i % 10 === 0)) {
              const source = series.values[i];
              const target = series.values[i + 10];
              if (target) {
                const change = Math.abs(source.values - target.values);
                links.push({
                  source: `${series.name}-${source.key}`,
                  target: `${series.name}-${target.key}`,
                  value: source.values,
                });
              }
            }
          });
        });
        console.log(links);*/
        
        //set up graph in same style as original example but empty
/*        const graph = {"nodes" : [], "links" : []};
        links.forEach(function (d) {
          graph.nodes.push({ "name": d.source });
          graph.nodes.push({ "name": d.target });
          graph.links.push({ "source": d.source,
                             "target": d.target,
                             "value": +d.value });
        });*/

        // return only the distinct / unique nodes
/*        graph.nodes = d3.keys(d3.nest()
          .key(function (d) { return d.name; })
          .map(graph.nodes));*/

        // loop through each link replacing the text with its index from node
/*        graph.links.forEach(function (d, i) {
          graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
          graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });*/

        //now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
/*        graph.nodes.forEach(function (d, i) {
          graph.nodes[i] = { "name": d };
        });*/