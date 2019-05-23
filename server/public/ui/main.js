/************************
*** DECLARE VARIABLES ***
************************/
const width = 800;
const height = 600;
const locHost = "http://127.0.0.1:3000/"



/********************
*** CREATE CANVAS ***
********************/

const canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
