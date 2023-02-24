"use strict";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const kickstarterPledges = {
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
};
const movieSales = {
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
};
const videoGameSales = {
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
};

//Dimensions and important data
const w = window.screen.availWidth - 200;
const h = 750;
const margin = { top: 20, bottom: 20, left: 40, right: 40 };
const innerWidth = w - margin.left - margin.right;
const innerHeight = h - margin.top - margin.bottom;

const svg = d3.select("#graph").append("svg").attr("width", w).attr("height", h);

const container = svg
  .append("g")
  .attr("id", "conatiner")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//On mouse move method
const onMouseMove = (event) => {
  const tooltip = d3.select("#tooltip");
  const { name, category, value } = event.target.__data__.data;

  tooltip
    .style("left", `${event.clientX + 10}px`)
    .style("top", `${event.clientY - 90}px`)
    .style("opacity", 0.9)
    .attr("data-value", value)
    .html(`Name: ${name} <br> Category: ${category} <br> Value: ${value}`);
};
//On mouse out method
const onMouseOut = () => {
  const tooltip = d3.select("#tooltip");

  tooltip.style("opacity", 0);
};

const draw = (data) => {
  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => {
      return d.value;
    })
    .sort((a, b) => b.value - a.value); //Compute size of each rectangle from given value

  //Create a new tree map
  const tree = d3.treemap().size([innerWidth, innerHeight]).padding(1);

  //compute position of each element of the hierarchy
  const root = tree(hierarchy);

  //Create G elements
  const cell = container
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "cell")
    .attr("transform", (d) => {
      return `translate(${d.x0}, ${d.y0})`;
    });

  //Append rect element to each new G element
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

  //Append text to each new G element
  cell
    .append("text")
    .attr("fill", "white")
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .attr("x", 5)
    .attr("y", 10)
    .html((d) => d.data.name);
};

const update = (newData) => {
  const hierarchy = d3
    .hierarchy(newData)
    .sum((d) => {
      return d.value;
    })
    .sort((a, b) => b.value - a.value);

  const tree = d3.treemap().size([innerWidth, innerHeight]).padding(1);

  const root = tree(hierarchy);

  const cell = container.selectAll("g").data(root.leaves());

  //Exit and remove old values
  cell.exit().remove();

  //Enter
  const newCells = cell.enter().append("g");

  newCells.append("rect").transition().duration(750);

  newCells.append("text");

  //Update
  cell
    .transition()
    .duration(750)
    .attr("class", "cell")
    .attr("transform", (d) => {
      return `translate(${d.x0}, ${d.y0})`;
    });

  cell
    .select("rect")
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

  cell
    .select("text")
    .attr("fill", "white")
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .attr("x", 5)
    .attr("y", 10)
    .html((d) => d.data.name);
};

//Simple helper method to don't repeat yourself
const response = (response) => {
  return response.json();
};

Promise.all([
  fetch(kickstarterPledges.link).then(response),
  fetch(movieSales.link).then(response),
  fetch(videoGameSales.link).then(response),
]).then((data) => {
  const [kickstarter, movies, games] = data;

  d3.select("#data-diagram").on("change", function () {
    const value = d3.select(this).property("value"); //Gets the value of option element 

    switch (value) {
      case "Games":
        update(games);
        break;
      case "Movies":
        update(movies);
        break;
      case "Kikckstarter":
        update(kickstarter);
        break;
      default:
        update(games);
    }
  });

  draw(games);
  console.log("KickStart:", kickstarter, "Movies:", movies, "Games:", games);
});

//TODO:
//Add legend
//Add colored cells
