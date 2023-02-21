"use strict";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const kickstarterPledges =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSales = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const draw = (data) => {
  const [kickstarter, movies, games] = data;

  console.log(kickstarter, movies, games)
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
