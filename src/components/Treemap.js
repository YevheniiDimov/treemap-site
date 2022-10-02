import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';

function retrieveValues(data, token, setReceivedCallback, setMessageCallback) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  var formdata = new FormData();

  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
  };
  fetch("https://idmvs.ugis.org.ua/api/dboard/get/statdeltastart", requestOptions)
    .then(response => response.json())
    .then(async result => {
      if (data != null) {
        let offices = JSON.parse(result).rows;
        console.log('Offices: ');
        console.log(offices);

        if (!offices) {
          throw new Error("Помилка: Дані офісів наразі недоступні. Скоріше за все жоден офіс не працює.");
        }

        for (let region of data) {
          for (let office of region.children) {
            let office_values = offices.find(o => o.office_id === office.id_offices);
            if (office_values !== undefined) {
              office.value = -office_values.avgm;
            }
            else {
              console.log('Skipping missing office ' + office.offices_n);
            }
          }
        }

        setReceivedCallback(true);
        console.log('Successfully retrieved office values, Data:');
        console.log(data);
      }
      else {
        throw new Error("Помилка: дані ще не отримані");
      }
    })
    .catch(error => {
      console.log('Values Error: ' + error);
      setMessageCallback(error.message);
    });
}

function Treemap({ width, height, data, token}){
    const [receivedValues, setReceivedValues] = useState(false);
    const [message, setMessage] = useState("Отримання значень...");
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
          .style("fill", d => color(d.data.value));

      nodes.exit().remove()
      
      // select node titles
      var nodeVals = svg
          .selectAll("vals")
          .data(root.leaves())  

      // add the values
      nodeVals.enter()
          .append("text")
            .attr("x", d => (d.x0 + d.x1)/2 - 15)
            .attr("y", d => (d.y0 + d.y1)/2 + 5)
            .text(d => d.data.size < 5 ? "" : d.data.offices_n)
            .attr("font-size", "12px")
            .attr("fill", "white")
  
      // add the parent node titles
      svg
      .selectAll("titles")
      .data(root.descendants().filter(d => d.depth === 1))
      .enter()
      .append("text")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0 + 20)
          .text(d => d.data.region_name)
          .attr("font-size", "10px");
  }

  useEffect(() => {
    if (receivedValues) {
      draw();
    }
  });

  console.log('Retrieving values... (First)');
  retrieveValues(data, token, setReceivedValues, setMessage);

  setInterval(() => {
    console.log('Retrieving values...');
    retrieveValues(data, token, setReceivedValues, setMessage);
  }, 6E5); // Ten minutes

  return (
      <div>
        { receivedValues 
        ? <svg ref={ref} />
        : <h1>{message}</h1>
        }
      </div>
    )
}

export default Treemap;