"use strict";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const kickstarterPledges =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSales = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

//Dimensions and important data
const w = window.screen.availWidth - 200;
const h = 750;
const margin = { top: 20, bottom: 20, left: 40, right: 40 };
const innerWidth = w - margin.left - margin.right;
const innerHeight = h - margin.top - margin.bottom;

const svg = d3.select("#graph").append("svg").attr("width", w).attr("height", h);

const conatainer = svg
  .append("g")
  .attr("id", "conatiner")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const draw = (data) => {
  const [kickstarter, movies, games] = data;

  const onMouseMove = (event) => {
    const tooltip = d3.select("#tooltip");

    //Data for tooltip
    const { name, category, value } = event.target.__data__.data;

    tooltip
      .style("left", `${event.clientX + 10}px`)
      .style("top", `${event.clientY - 90}px`)
      .style("opacity", 0.9)
      .attr("data-value", value)
      .html(`Name: ${name} <br> Category: ${category} <br> Value: ${value}`);
  };

  const onMouseOut = () => {
    const tooltip = d3.select("#tooltip");

    tooltip.style("opacity", 0);
  };

  const hierarchy = d3
    .hierarchy(games)
    .sum((d) => {
      return d.value;
    })
    .sort((a, b) => b.value - a.value); //Compute size of each rectangle from given value

  //Create a new tree map
  const tree = d3.treemap().size([innerWidth, innerHeight]).padding(1);

  //compute position of each element of the hierarchy
  const root = tree(hierarchy);

  //G element for each rectangle
  const cell = conatainer
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "cell")
    .attr("transform", (d) => {
      return `translate(${d.x0}, ${d.y0})`;
    });

  //Cell elements
  cell
    .append("rect")
    .on("mousemove", onMouseMove)
    .on("mouseout", onMouseOut)
    .transition()
    .duration(750)
    .attr("class", "tile")
    .attr("data-value", (d) => d.data.value)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", "navy");

  //Text elements
  cell
    .append("text")
    .attr("fill", "white")
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => {
      return 10 + i * 10;
    })
    .text((d) => d);

  console.log("KickStart:", kickstarter, "Movies:", movies, "Games:", games);
};

//Simple helper method to don't repeat yourself
const response = (response) => {
  return response.json();
};

Promise.all([
  fetch(kickstarterPledges).then(response),
  fetch(movieSales).then(response),
  fetch(videoGameSales).then(response),
]).then((data) => draw(data));

//TODO:
//Add legend
//Add colored cells
//Add switch between data
//Add animation between data switching
