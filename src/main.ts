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
import { DataList } from "./widgets/DataList.js";
import { DataListModel } from "./widgets/DataListModel.js";
import { RadioButton } from "./widgets/RadioButton.js";

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

let avgBarplot = new Barplot(
  "#column-2",
  $(window).width() * panelWidth,
  getHeight(),
  { margin: new Margin(10, 20, 30, 60) }
);
$(window).on("resize", function () {
  avgBarplot.resize();
});
let data: DataPoint[];
data = [
  { name: "Windsor", value: "0.523914824", description: "Windsor", nonNormalValue: "0.523914824" },
  { name: "St. John's", value: "0.550804241", description: "St. John's", nonNormalValue: "0.550804241" },
  { name: "Sherbrooke", value: "0.563877292", description: "Sherbrooke", nonNormalValue: "0.563877292" },
  { name: "St. Catharines, Niagara", value: "0.579313058", description: "St. Catharines, Niagara", nonNormalValue: "0.579313058" },
  { name: "Halifax", value: "0.584855557", description: "Halifax", nonNormalValue: "0.584855557" },
  { name: "Quebec City", value: "0.61164794294", description: "Quebec City", nonNormalValue: "0.61164794294" },
  { name: "Winnipeg", value: "0.622137428", description: "Winnipeg", nonNormalValue: "0.622137428" },
  { name: "Montreal", value: "0.638424117", description: "Montreal", nonNormalValue: "0.638424117" },
  { name: "London", value: "0.638577745", description: "London", nonNormalValue: "0.638577745" },
  { name: "Saskatoon", value: "0.639751891", description: "Saskatoon", nonNormalValue: "0.639751891" },
  { name: "Toronto", value: "0.641217199", description: "Toronto", nonNormalValue: "0.641217199" },
  { name: "Regina", value: "0.652578651", description: "Regina", nonNormalValue: "0.652578651" },
  { name: "Hamilton", value: "0.668070434", description: "Hamilton", nonNormalValue: "0.668070434" },
  { name: "Kitchener, Cambridge, Waterloo", value: "0.673147867", description: "Kitchener, Cambridge, Waterloo", nonNormalValue: "0.673147867" },
  { name: "Vancouver", value: "0.695830997", description: "Vancouver", nonNormalValue: "0.695830997" },
  { name: "Calgary", value: "0.696674863", description: "Calgary", nonNormalValue: "0.696674863" },
  { name: "Victoria", value: "0.699868017", description: "Victoria", nonNormalValue: "0.699868017" },
  { name: "Edmonton", value: "0.706197578", description: "Edmonton", nonNormalValue: "0.706197578" },
];
avgBarplot.plot(data, [0, 0], [1, 1]);
avgBarplot.updatePlot(data);

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

let datalist = populateRadioButton();

/**
 * \brief   Is called when the user clicks on any city radio button.
 *          Rerenders the city bar plot with values form the city.
 * @param   id : Index of the radio button.
 */
function onClick(id: number) {
  let city = Data.getSyncData()[id];
  let name = city.name;
  header.textContent = name;
  avgBarplot.applyStrokeByName(name);
  recenterDashboard();
  avgCityData(city.data);
  updateAllGraphs(id);
}

/**
 * \brief   Averages the city data.
 * @param   cityData : The array of DataPoint describing the city.
 * @returns Returns the average of the city's DataPoint values.
 */
function avgCityData(cityData: DataPoint[]): number {
  let sum = 0.0;
  let numElements = 0;
  cityData.forEach((d) => addDataPointElement(d.value));
  function addDataPointElement(dataPointValue: string) {
    sum += parseFloat(dataPointValue);
    ++numElements;
  }
  let avg = sum / numElements;
  return avg;
}

function populateRadioButton(): RadioButton {
  let data = Data.getSyncData();
  const dataListModel = data.map((city, id) => {
    return { id: id, value: city.name } as DataListModel;
  });
  return new RadioButton("cities-radiobutton", dataListModel, onClick, {
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
