(async()=>{

  // tree data
  const rootNodeId = '1';
  const rootNodeColor = '#e91e63';

  // Gradient
  const color1 = '#e91e63';
  const color2 = '#ffff00';
  const color3 = '#00ff00';
  const divisions =  10;

  // Classifier
  const maxThresh = 100;
  const minThresh = 0;


  const getLinks = async (data) => {
    const interactions = await data;
    const count = data.length;
    const colorGradient = new Gradient();
    colorGradient.setGradient(color1, color2, color3);

    const links = (count !==0? (interactions.map((m)=>{
      return {
        name: m.target,
        parent: m.source,
        desc: `node: ${m.target}`,
        children: null,
        risk: m.risk,
        color: getClassification(
          Number(m.risk),
          maxThresh,
          minThresh,
          divisions,
          (colorGradient.getArray()
        ).reverse())
      };
    })) : []);

    return links;
  }

  const treeStruct = buildTreeStruct(rootNodeId, rootNodeColor, await getLinks(interactions));
  
  // ************** Generate the tree diagram	 *****************
  let margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;
      
  let i = 0,
      duration = 750,
      root;
  
  let tree = d3.layout.tree()
      .size([height, width]);
  
  let diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
  
  let svg = d3.select("body").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  root = treeStruct;
  root.x0 = height / 2;
  root.y0 = 0;
    
  update(root);
  
  d3.select(self.frameElement).style("height", "500px");
  
  function update(source) {
  
    // Compute the new tree layout.
    let nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });
  
    // Update the nodes…
    let node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
    // Enter any new nodes at the parent's previous position.
    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);
  
    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d.color });
  
    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);
  
    // Transition nodes to their new position.
    let nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
    nodeUpdate.select("circle")
        .attr("r", 10)
        .style("fill", function(d) { return d.color });
  
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    let nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();
  
    nodeExit.select("circle")
        .attr("r", 1e-6);
  
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
  
    // Update the links…
    let link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
  
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          let o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        }).style("stroke", function(d) { return d.source.color });
  
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          let o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
})();
