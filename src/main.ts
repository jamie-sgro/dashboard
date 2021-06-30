// @ts-expect-error
import d3 = require("d3");


import { Barplot } from "./barplot.js";
import { Data, DataPoint } from "./data.js";
import { matches, populateMarkers, reduceData, updateAllGraphs } from "./map.js";
import { Margin } from "./Margin.js";
import { initPanel3, panel3Resize, plotPanel3Resize } from "./panel3.js";
import { DataList, DataListModel } from "./widgets/DataList.js";

export const markRad = 15;
export const markCol = "rgba(10,151,217, .8)";
export const colourBottom = "rgb(56, 94, 231)";
export const colourTop = "rgb(34, 236, 87)";
export const scaleToZoom = false;
export const panelHeight = 0.40;
export const panelWidth = 0.33;

//set default city
// @ts-ignore
document.getElementById("popupInfo").class = 0;



/******************
*** ADD D3 TOOL ***
******************/
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
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
d3.select("#panel3")
  .append("svg")

panel3Resize();

initPanel3();



/*********************
*** CREATE BARPLOT ***
*********************/

function getHeight(): number {
  if ($('#header').height()) {
    return $(window).height() - $('#header').height();
  } else {
    return $(window).height();
  };
};

//Barplot(width, height, margin)
export const barplot = new Barplot(
  ($(window).width()*panelWidth),
  getHeight(),
  new Margin(10, 20, 30, 60),
  );
  plotData();
  export var dataArray: DataPoint[]
  
  //called once when the screen renders
  function plotData() {
    let data = Data.getSyncData();
    
    barplot.max = getMaxScore(data)
    
    //only return the first datapoint to populate the graph
    // @ts-ignore
    var id = document.getElementById("popupInfo").class;
    dataArray = reduceData(data[id]);
    barplot.id = id; //Currently use first row of .csv on graph init
    
    var min = [];
    
    var max = [];
    var min = [];
    for (let col in dataArray) {
      max.push(getMax(data, dataArray[col].name))
      min.push(getMin(data, dataArray[col].name))
    }
    
    barplot.plot(dataArray, min, max);
    updateAllGraphs(id)
};


/** Parse maximum value of all possible values
 * that are not an average 'score' column i.e. prepended with "score"
 */
function getMaxScore(data) {
  let maxScore = 0;

  for (let rec in data) {
    for (let key in data[rec]) {
      if (matches(key, ["name","lat","lng"]) == false) {
        if (key.substring(0, 5) != "score") {
          if (Number(data[rec][key]) > Number(maxScore)) {
              maxScore = data[rec][key];
          };
        };
      };
    };
  };
  return maxScore;
};



function getMax(arr, key) {
  var rtn;
  for (var i in arr) {
    if (rtn == undefined || rtn < Number(arr[i][key])) {
      rtn = Number(arr[i][key]);
    };
  };
  return rtn;
};



function getMin(arr, key) {
  var rtn;
  for (var i in arr) {
    if (rtn == undefined || rtn > Number(arr[i][key])) {
      rtn = Number(arr[i][key]);
    };
  };
  return rtn;
};



let datalist = populateDataList();

function populateDataList(): DataList {
  let data = Data.getSyncData();
  const dataListModel = data.map((city, id) => {
    return {id: id, value: city.name} as DataListModel
  });
  return new DataList("cities-datalist", dataListModel, updateAllGraphs, {parentId: "col-1"});
}



/*********************
*** DYNAMIC RESIZE ***
*********************/

//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on("resize", function() {
  //update d3 barplot
  barplot.resize();

  //update panel3
  panel3Resize();

  plotPanel3Resize();
});
