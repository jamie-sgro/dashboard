// @ts-expect-error
import d3 = require("d3");

import { Barplot } from "./Barplot.js";
import { Data, DataPoint } from "./Data.js";
import {
  matches,
  populateMarkers,
  recenterDashboard,
  reduceData,
  updateAllGraphs,
} from "./map.js";
import { Margin } from "./Margin.js";
import { panel3Resize } from "./panel3.js";
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
  { name: "test_a", value: "1" },
  { name: "test_b", value: "2" },
];
newBarplot.plot(data, [0, 2], [0, 2]);
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

//called once when the screen renders
function plotData(barplot: Barplot) {
  let data = Data.getSyncData();

  barplot.max = getMaxScore(data);

  //only return the first datapoint to populate the graph
  var id = 0;
  let dataArray = reduceData(data[id]);
  barplot.id = id; //Currently use first row of .csv on graph init

  var min = [];

  var max = [];
  var min = [];
  for (let col in dataArray) {
    max.push(getMax(data, dataArray[col].name));
    min.push(getMin(data, dataArray[col].name));
  }

  barplot.plot(dataArray, min, max);
  updateAllGraphs(id);
}

/** Parse maximum value of all possible values
 * that are not an average 'score' column i.e. prepended with "score"
 */
function getMaxScore(data) {
  let maxScore = 0;

  for (let rec in data) {
    for (let key in data[rec]) {
      if (matches(key, ["name", "lat", "lng"]) == false) {
        if (key.substring(0, 5) != "score") {
          if (Number(data[rec][key]) > Number(maxScore)) {
            maxScore = data[rec][key];
          }
        }
      }
    }
  }
  return maxScore;
}

function getMax(arr, key) {
  var rtn;
  for (var i in arr) {
    if (rtn == undefined || rtn < Number(arr[i][key])) {
      rtn = Number(arr[i][key]);
    }
  }
  return rtn;
}

function getMin(arr, key) {
  var rtn;
  for (var i in arr) {
    if (rtn == undefined || rtn > Number(arr[i][key])) {
      rtn = Number(arr[i][key]);
    }
  }
  return rtn;
}

let datalist = populateDataList();

function onClick(id: number) {
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
