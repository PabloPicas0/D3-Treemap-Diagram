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

  const hierarchy = d3.hierarchy(games).sum((d) => {
    return d.value;
  }).sort((a, b) => b.value - a.value); //Compute size of each rectangle from given value

  //Create a new tree map
  const tree = d3.treemap().size([innerWidth, innerHeight]).padding(1);

  //compute position of each element of the hierarchy
  const root = tree(hierarchy);

  conatainer
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "group")
    .append("rect")
    .attr("class", "tile")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", "navy");

  console.log("KickStart:", kickstarter, "Movies:", movies, "Games:", games, root);
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
