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

  const legend = d3.select("#graph").append("svg").attr("id", "legend").attr("width", 500)

  const handleLegend = (data) => { 
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

    const itemsContainer = legend.selectAll("g").data(data)

    itemsContainer.exit().remove()

    const newContainers = itemsContainer.enter().append("g").attr("class", "container")

    newContainers.append("rect")
    newContainers.append("text").text(d => d.name)

    itemsContainer.select("text").text(d => d.name)
  }

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

const update = (newData) => {
  const hierarchy = d3
    .hierarchy(newData)
    .sum((d) => {
      return d.value;
    })
    .sort((a, b) => b.value - a.value);

  const tree = d3.treemap().size([innerWidth, innerHeight]).padding(1);

  const root = tree(hierarchy);

  //Helpful Source: https://gist.github.com/mbostock/3808218
  const cell = container.selectAll("g").data(root.leaves());

  //Exit and remove old values
  cell.exit().remove();

  //Enter + Update
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
    .attr("fill", "navy");

  newCells
    .append("text")
    .attr("fill", "white")
    .attr("font-size", 10)
    .style("pointer-events", "none")
    .attr("x", 5)
    .attr("y", 10)
    .html((d) => d.data.name);

  //Update old element as needed
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

    handleLegend(newData.children)
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
    const title = d3.select("#title");
    const description = d3.select("#description");
    const value = d3.select(this).property("value"); //Gets the value of option element

    switch (value) {
      case "Games":
        title.text("Video Game Sales");
        description.text("Top 100 Most Sold Video Games Grouped by Platform");
        update(games);
        break;
      case "Movies":
        title.text("Movie Sales");
        description.text("Top 100 Highest Grossing Movies Grouped By Genre");
        update(movies);
        break;
      case "Kikckstarter":
        title.text("Kickstarter Pledges");
        description.text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");
        update(kickstarter);
        break;
      default:
        update(games);
    }
  });

  update(games);
  console.log("KickStart:", kickstarter, "Movies:", movies, "Games:", games);
});

//TODO:
//Add legend
//Add colored cells
