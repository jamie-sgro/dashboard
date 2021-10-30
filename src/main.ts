// @ts-expect-error
import d3 = require('d3');

import { Barplot } from './barplot.js';
import { Data } from './data.js';
import {
  populateMarkers,
  recenterDashboard,
  updateAllGraphs,
  updateGraphById,
} from './map.js';
import { Margin } from './Margin.js';
import { panel3Resize } from './panel3.js';
import { ToggleButton } from './widgets/ToggleButton.js';
import { DataListModel } from './widgets/DataListModel.js';
import { RadioButton } from './widgets/RadioButton.js';
import { VerticalLine } from './annotations/VerticalLine.js';

export const markRad = 15;
export const markCol = 'rgba(10,151,217, .8)';
export const colourBottom = 'rgb(56, 94, 231)';
export const colourTop = 'rgb(34, 236, 87)';
export const scaleToZoom = false;
export const panelHeight = 0.4;
export const panelWidth = 0.33;

//set default city
// @ts-ignore
// document.getElementById("popupInfo").class = 0;

/*********************
 *** DRAW MEAN PLOT ***
 **********************/

let avgBarplot = new Barplot(
  '#column-3',
  $(window).width() * panelWidth,
  getHeight(),
  { margin: new Margin(10, 20, 30, 60) }
);
$(window).on('resize', function () {
  avgBarplot.resize();
});

// let rankingMethod = Data.getPseudoGeometricMeanForCity
// let meanCountry =  Data.getAverageCountry(rankingMethod)

// let rankingMethod = Data.getArithmenticMeanForCity
// let meanCountry =  Data.getAverageCountry(rankingMethod)

let meanCountry = Data.get_condorcet_ranking_all_variables()
avgBarplot.drawAverageCountry(meanCountry);

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
d3.select('#panel3').append('svg');

// panel3Resize();

// initPanel3();

/*********************
 *** CREATE BARPLOT ***
 *********************/

function getHeight(): number {
  if ($('#header').height()) {
    return $(window).height() - $('#header').height();
  } else {
    return $(window).height();
  }
}

export const barplot = new Barplot(
  '#column-2',
  $(window).width() * panelWidth,
  getHeight(),
  { margin: new Margin(10, 20, 30, 60) }
);
plotData(barplot);
barplot.annotation.verticalLines.push(
  new VerticalLine(barplot, 0, { text: 'Farthest from Target' })
);
barplot.annotation.verticalLines.push(
  new VerticalLine(barplot, 1, { text: 'Target', colour: colourBottom })
);

function plotData(barplot: Barplot) {
  let data = Data.getSyncData();

  //only return the first datapoint to populate the graph
  var id = 0;
  let dataArray = data[id].data;
  barplot.id = id; //Currently use first row of .csv on graph init

  let min = Data.getMinPerVariable(data);
  let max = Data.getMaxPerVariable(data);

  barplot.plot(dataArray, min, max);
  updateGraphById(id, barplot);
}

let header = document.createElement('h1');
header.textContent = Data.getSyncData()[0].name;
document.getElementById('column-1').appendChild(header);

function leadLagOnClick() {
  barplot.isLeadLag = barplot.isLeadLag ? false : true;
}

let btn = new ToggleButton('btn-lead-lag', leadLagOnClick, {
  text: 'Toggle Barplot',
  parentId: 'column-1',
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
  updateAllGraphs(id);
}

function populateRadioButton(): RadioButton {
  let data = Data.getSyncData();
  const dataListModel = data.map((city, id) => {
    return { id: id, value: city.name } as DataListModel;
  });
  return new RadioButton('cities-radiobutton', dataListModel, onClick, {
    parentId: 'column-1',
  });
}

/*********************
 *** DYNAMIC RESIZE ***
 *********************/

//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on('resize', function () {
  //update d3 barplot
  barplot.resize();

  //update panel3
  panel3Resize();

  // plotPanel3Resize();
});
