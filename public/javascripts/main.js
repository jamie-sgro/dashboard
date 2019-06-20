/************************
*** DECLARE VARIABLES ***
************************/

var scl;
const markRad = 15;
const markCol = "rgba(10,151,217, .8)";
const scaleToZoom = false;
const locHost = "http://localhost:3000/";
const panelHeight = 0.40;
const panelWidth = 0.50;



/***************
*** GET DATA ***
***************/

// import .csv
function postAjax(url, data, callback) {
  $.ajax({
    type: "POST",
    data: JSON.stringify(data),
    url: url,
  }).done((data)=> {
    callback(null, data);
  }).fail((jqXHR, textStatus, errorThrown)=> {
    callback(jqXHR, null);
  });
};



function getData() {
  if (!getData.promise) {
    getData.promise = new Promise((resolve, reject) => {
      postAjax(locHost + "getData", {}, (err, cb)=> {
        if (err) {
          console.log("Error: " + err.statusText);
          console.log(err)
          reject(err);
          return;
        };

        resolve(cb.data);
      });
    });
  };
  return getData.promise;
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
mark = populateMarkers(map);

//set up alerts
map.on("click", onMapClick);

function onMapClick(e) {
  console.log("You clicked the map at " + e.latlng);
  g.selectAll("circle")
    .each(function(d,i) {
      d3.select(this).call(attrTween, 500, "r", scl)
    })

  for (i in mark) {
    mark[i].setStyle({radius: scl})
  }
};



/*********************
*** CREATE BARPLOT ***
*********************/

//Barplot(width, height, margin)
const barplot = new Barplot(
  $(window).width()-50,
  ($(window).height()*panelHeight),
  {top: 35, right: 25, bottom: 20, left: 60}
);

plotData();

//called once when the screen renders
async function plotData() {
  data = await getData();

  barplot.max = getMaxScore(data)

  //only return the first datapoint to populate the graph
  dataArray = reduceData(data[0]);
  barplot.title = data[0].name; //Currently use first row of .csv on graph init

  barplot.plot(dataArray);
};



function getMaxScore(data) {
  maxScore = 0;

  for (rec in data) {
    for (key in data[rec]) {
      if (matches(key, ["name","lat","lng","score"]) == false) {
        if (Number(data[rec][key]) > Number(maxScore)) {
            maxScore = data[rec][key];
        };
      };
    };
  };
  return maxScore;
};



//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on("resize", function() {
  //update leaflet map
  mapResize();

  //update d3 barplot
  barplot.resize();
});
