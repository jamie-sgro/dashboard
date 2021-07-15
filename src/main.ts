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


/*********************
*** DRAW MEAN PLOT ***
**********************/
drawMeanPlot(avgBarplot);

function drawMeanPlot(avgBarplot : Barplot) {//: DataPoint[] {
  let countryData = Data.getSyncData();
  let meanCountryData : DataPoint[] = [];
  countryData.forEach((d) => addMeanCity(d));

  function addMeanCity(cityData : DataModel) {
    let citySummary: DataPoint = {
      name:         cityData.name,
      description:  cityData.name,
      value:        (avgCityData(cityData.data) * 100).toString()
    };
    meanCountryData.push(citySummary);
  }

  avgBarplot.plot(meanCountryData, [0, 0], [100, 100]);
  avgBarplot.updatePlot(meanCountryData);
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
