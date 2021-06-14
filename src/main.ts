/************************
*** DECLARE VARIABLES ***
************************/

var scl;
const markRad = 15;
const markCol = "rgba(10,151,217, .8)";
const colourBottom = "rgb(56, 94, 231)";
const colourTop = "rgb(34, 236, 87)";
const scaleToZoom = false;
const locHost = "http://localhost:3000/"
// const locHost = "https://www.sdsn-canada-dashboard.tk/";
const panelHeight = 0.40;
const panelWidth = 0.40;

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
*** CREATE MAP ***
*****************/

var map = getMap();

if (scaleToZoom) {
  scl = map.latLngToLayerPoint([0,1]).x - map.latLngToLayerPoint([0,0]).x;
} else {
  scl = markRad;
}


L.svg().addTo(map);
var g = d3.select("#map").select("svg").append("g")

d3PopulateMarkers(map);

//DEPRECIATED
//move about d3PopulateMarkers() to use .d3 circle mouseEvents
var mark = populateMarkers(map);

//set up alerts
map.on("click", onMapClick);



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

class Margin {
  top: number
  right: number
  bottom: number
  left: number

  constructor(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}

//Barplot(width, height, margin)
const barplot = new Barplot(
  ($(window).width()*panelWidth),
  getHeight(),
  new Margin(10, 20, 30, 60)
);

plotData();
var dataArray: DataPoint[]

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
  for (var i in dataArray) {

  };

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



/*********************
*** DYNAMIC RESIZE ***
*********************/

//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on("resize", function() {
  //update leaflet map
  mapResize();

  //update d3 barplot
  barplot.resize();

  //update panel3
  panel3Resize();

  plotPanel3Resize();
});
