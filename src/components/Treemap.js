import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function Treemap({ width, height, data }){
    const ref = useRef();
    
    const draw = () => {
      console.log('Data');
      console.log(data);
      const svg = d3.select(ref.current);
      svg.attr('width', width).attr('height', height);

      let hierarchy = {'children': data};
      console.log('Hierarchy'); 
      console.log(hierarchy);

      // Give the data to this cluster layout:
      var root = d3.hierarchy(hierarchy).sum(d => d.size);
  
      // initialize treemap
      d3.treemap()
          .size([width, height])
          .paddingTop(28)
          .paddingRight(5)
          .paddingInner(2)
          (root);
      
      const color = d3.scaleThreshold()
      .domain([0, 2, 4, 6, 8])
      .range(["#30CC5A", "#2F9E4F", "#35764E", "#8B444E", "#BF4045", "#F63538"]);

      // Select the nodes
      var nodes = svg
        .selectAll("g")
        .data(root.leaves());

      // draw rectangles
      nodes.enter()
          .append("rect")
          .attr('x', d => d.x0)
          .attr('y', d => d.y0)
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .style("fill", d => "#30CC5A") //color(d.data.value)

      nodes.exit().remove()

      // select node titles
      var nodeText = svg
          .selectAll("text")
          .data(root.leaves())

      // add the text
      nodeText.enter()
          .append("text")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .text(d =>  d.data.offices_n)
          .attr("font-size", "5px")
          .attr("fill", "white")
      
      // select node titles
      var nodeVals = svg
          .selectAll("vals")
          .data(root.leaves())  

      // add the values
      nodeVals.enter()
          .append("text")
          .attr("x", d => (d.x0 + d.x1)/2 - 10)
          .attr("y", d => (d.y0 + d.y1)/2 + 10)
          .text(d => d.data.size < 5 ? "" : d.data.id_offices)
          .attr("font-size", "15px")
          .attr("fill", "white")
  
      // add the parent node titles
      svg
      .selectAll("titles")
      .data(root.descendants().filter(d => d.depth === 1))
      .enter()
      .append("text")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0 + 21)
          .text(d => d.data.region_name)
          .attr("font-size", "15px");
  }

  useEffect(() => {
    draw();
  });


    return (
      <div>
        <svg ref={ref} />
      </div>
    )
}

export default Treemap;