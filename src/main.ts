// @ts-expect-error
import d3 = require("d3");

import { Barplot } from "./barplot.js";
import { Data, DataModel, DataPoint } from "./data.js";
import {
  matches,
  populateMarkers,
  recenterDashboard,
  reduceData,
  updateAllGraphs,
  updateGraphById,
} from "./map.js";
import { Margin } from "./Margin.js";
import { panel3Resize } from "./panel3.js";
import { ToggleButton } from "./widgets/ToggleButton.js";
import { DataList, DataListModel } from "./widgets/DataList.js";

export const markRad = 15;
export const markCol = "rgba(10,151,217, .8)";
export const colourBottom = "rgb(56, 94, 231)";
export const colourTop = "rgb(34, 236, 87)";
export const scaleToZoom = false;
export const panelHeight = 0.4;
export const panelWidth = 0.33;

//set default city
// @ts-ignore
// document.getElementById("popupInfo").class = 0;

let newBarplot = new Barplot(
  "#column-2",
  $(window).width() * panelWidth,
  getHeight(),
  { margin: new Margin(10, 20, 30, 60) }
);
$(window).on("resize", function () {
  newBarplot.resize();
});
let data: DataPoint[];
data = [
  { name: "Victoria", value: "5", description: "Victoria" },
  { name: "Vancouver", value: "10", description: "Vancouver" },
  { name: "Edmonton", value: "20", description: "Edmonton" },
  { name: "Calgary", value: "28", description: "Calgary" },
  { name: "Saskatoon", value: "34", description: "Saskatoon" },
  { name: "Regina", value: "38", description: "Regina" },
  { name: "Winnipeg", value: "40", description: "Winnipeg" },
  { name: "Windsor", value: "43", description: "Windsor" },
  { name: "London", value: "54", description: "London" },
  {
    name: "Kitchener, Cambridge, Waterloo",
    value: "55",
    description: "Kitchener, Cambridge, Waterloo",
  },
  {
    name: "St. Catharines, Niagara",
    value: "60",
    description: "St. Catharines, Niagara",
  },
  { name: "Hamilton", value: "70", description: "Hamilton" },
  { name: "Toronto", value: "81", description: "Toronto" },
  { name: "Montreal", value: "84", description: "Montreal" },
  { name: "Sherbrooke", value: "84", description: "Sherbrooke" },
  { name: "Quebec City", value: "94", description: "Quebec City" },
  { name: "Halifax", value: "98", description: "Halifax" },
  { name: "St. John's", value: "100", description: "St. John's" },
];
newBarplot.plot(data, [0, 0], [100, 100]);
newBarplot.updatePlot(data);

/******************
 *** ADD D3 TOOL ***
 ******************/
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

/*****************
 *** CREATE MARK ***
 *****************/

export var mark = populateMarkers();

/*********************
 *** MODIFY PANEL 3 ***
 *********************/

//set up svg ahead so the modular function can select instead of append
d3.select("#panel3").append("svg");

// panel3Resize();

// initPanel3();

/*********************
 *** CREATE BARPLOT ***
 *********************/

function getHeight(): number {
  if ($("#header").height()) {
    return $(window).height() - $("#header").height();
  } else {
    return $(window).height();
  }
}

export const barplot = new Barplot(
  "#column-3",
  $(window).width() * panelWidth,
  getHeight(),
  { margin: new Margin(10, 20, 30, 60) }
);
plotData(barplot);

function plotData(barplot: Barplot) {
  let data = Data.getSyncData();

  //only return the first datapoint to populate the graph
  var id = 0;
  let dataArray = reduceData(data[id]);
  barplot.id = id; //Currently use first row of .csv on graph init

  let min = Data.getMinPerVariable(data);
  let max = Data.getMaxPerVariable(data);

  barplot.plot(dataArray, min, max);
  updateGraphById(id, barplot);
}

let header = document.createElement("h1");
header.textContent = Data.getSyncData()[0].name;
document.getElementById("column-1").appendChild(header);

function leadLagOnClick() {
  barplot.isLeadLag = barplot.isLeadLag ? false : true;
}

let btn = new ToggleButton("btn-lead-lag", leadLagOnClick, {
  text: "Toggle Barplot",
  parentId: "column-1",
});

let datalist = populateDataList();

function onClick(id: number) {
  let name = Data.getSyncData()[id].name;
  header.textContent = name;
  newBarplot.applyStrokeByName(name);
  recenterDashboard();
  updateAllGraphs(id);
}

function populateDataList(): DataList {
  let data = Data.getSyncData();
  const dataListModel = data.map((city, id) => {
    return { id: id, value: city.name } as DataListModel;
  });
  return new DataList("cities-datalist", dataListModel, onClick, {
    parentId: "column-1",
  });
}

const cityNames = data.map((city) => city.name);

for(let i in cityNames){
  let elem = document.createElement("input");
  elem.setAttribute("type", "radio");
  elem.setAttribute("name", "irrSelectNo");
  elem.setAttribute("value", "N");
  elem.setAttribute("id","irrSelectNo"+i);
  elem.onclick = () => {onClick(Number(i))}
  let label = document.createElement("label");
  label.setAttribute("for", "irrSelectNo"+i);
  label.innerHTML = cityNames[i]

  document.getElementById("column-1").appendChild(elem);
  document.getElementById("column-1").appendChild(label);
  // cell3Div.appendChild(selecttag1);
}

/*********************
 *** DYNAMIC RESIZE ***
 *********************/

//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on("resize", function () {
  //update d3 barplot
  barplot.resize();

  //update panel3
  panel3Resize();

  // plotPanel3Resize();
});
