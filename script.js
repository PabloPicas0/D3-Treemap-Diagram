"use strict";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const kickstarterPledges = {
  title: "Kickstarter Pledges",
  description: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
};
const movieSales = {
  title: "Movie Sales",
  description: "Top 100 Highest Grossing Movies Grouped By Genre",
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
};
const videoGameSales = {
  title: "Video Game Sales",
  description: "Top 100 Most Sold Video Games Grouped by Platform",
  link: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
};

// Dimensions and important data
const w = window.screen.availWidth - 240;
const h = 750;
const margin = { top: 20, bottom: 20, left: 40, right: 40 };
const innerWidth = w - margin.left - margin.right;

const svg = d3.select("#graph").append("svg").attr("width", w).attr("height", h);

const container = svg
  .append("g")
  .attr("id", "conatiner")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const legend = d3.select("#graph").append("svg").attr("id", "legend").attr("width", 500);

// Colors range for legend
const colorsRange = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
  "#9edae5",
  "#c49c94",
  "#e377c2",
  "#c7c7c7",
  "#ff9896",
  "#f7b6d2",
  "#dbdb8d",
  "#ffbb78",
  "#aec7e8",
  "#c5b0d5",
];

// Legend scale
const color = d3.scaleOrdinal().range(colorsRange);

const handleLegend = (data) => {
  const itemsContainer = legend.selectAll("g").data(data);

  // Exit and remove old values
  itemsContainer.exit().remove();

  // Enter + Update
  const newContainers = itemsContainer
    .enter()
    .append("g")
    .attr("class", "container")
    .attr("transform", (d, i) => {
      return `translate(${(i % 3) * 150}, ${Math.floor(i / 3) * 25})`;
    });

  newContainers
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("class", "legend-item")
    .attr("fill", (d) => color(d.name));
  newContainers
    .append("text")
    .attr("x", 25)
    .attr("y", 15)
    .text((d) => d.name);

  // Update old element as needed
  itemsContainer
    .select("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("class", "legend-item")
    .attr("fill", (d) => color(d.name));
  itemsContainer
    .select("text")
    .attr("x", 25)
    .attr("y", 15)
    .text((d) => d.name)
};

// On mouse move method
const onMouseMove = (event) => {
  const tooltip = d3.select("#tooltip");
  const { name, category, value } = event.target.__data__.data;

  tooltip
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY - 90}px`)
    .style("opacity", 0.9)
    .attr("data-value", value)
    .html(`Name: ${name} <br> Category: ${category} <br> Value: ${value}`);
};

// On mouse out method
const onMouseOut = () => {
  const tooltip = d3.select("#tooltip");

  tooltip.style("opacity", 0);
};

const update = (newData) => {
  const hierarchy = d3
    .hierarchy(newData)
    .sum((d) => {
      return d.value;
    })
    .sort((a, b) => b.value - a.value);

  const tree = d3.treemap().size([innerWidth, h]).padding(1);

  const root = tree(hierarchy);

  // Helpful Source that describes update cycles in D3: https://gist.github.com/mbostock/3808218
  const cell = container.selectAll("g").data(root.leaves());

  // Exit and remove old values
  cell.exit().remove();

  // Enter + Update
  const newCells = cell
    .enter()
    .append("g")
    .attr("class", "cell")
    .attr("transform", (d) => {
      return `translate(${d.x0}, ${d.y0})`;
    });

  newCells
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
    .attr("fill", (d) => {
      return color(d.data.category);
    });

  newCells
    .append("text") // append text node for each cell
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g)) // split the name and use that as data to create indiviual tspan elements
    .enter()
    .append("tspan") // append tspan node for each element of the string which got split
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .attr("x", 5)
    .attr("y", (d, i) => 13 + 10 * i) // offset the y positioning with the index of the data
    .text((d) => d);

  // Update old element as needed
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
    .attr("fill", (d) => {
      return color(d.data.category);
    });

  // Remove previous text on old element
  cell.selectAll("tspan").remove();

  // Add new text
  cell
    .select("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .attr("x", 5)
    .attr("y", (d, i) => 13 + 10 * i)
    .text((d) => d);

  handleLegend(newData.children);
};

// Simple helper method to don't repeat yourself
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
    const title = d3.select("#title");
    const description = d3.select("#description");
    const value = d3.select(this).property("value"); // Gets the value of option element

    switch (value) {
      case "Games":
        title.text(videoGameSales.title);
        description.text(videoGameSales.description);
        update(games);
        break;
      case "Movies":
        title.text(movieSales.title);
        description.text(movieSales.description);
        update(movies);
        break;
      case "Kikckstarter":
        title.text(kickstarterPledges.title);
        description.text(kickstarterPledges.description);
        update(kickstarter);
        break;
      default:
        update(games);
    }
  });

  update(games);
});