/************************
*** DECLARE VARIABLES ***
************************/

var scl;
//const width = 800;
//const height = 400;
const locHost = "http://localhost:3000/";



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
scl = .01*map.latLngToLayerPoint([0,50]).x - map.latLngToLayerPoint([0,0]).x;

L.svg().addTo(map);
var g = d3.select("#map").select("svg").append("g")

d3PopulateMarkers(map);

//DEPRECIATED
//move about d3PopulateMarkers() to use .d3 cirlce mouseEvents
mark = populateMarkers(map);

//set up alerts
map.on("click", onMapClick);

function onMapClick(e) {
  console.log("You clicked the map at " + e.latlng);
  g.selectAll("circle")
    .each(function(d,i) {
      d3.select(this).call(attrTween, 500, "r", scl)
    })
};



/*********************
*** CREATE BARPLOT ***
*********************/

var margin = {
  top: 15,
  right: 25,
  bottom: 20,
  left: 60
};

var width = ($(window).width()/2) - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

const barplot = new Barplot(width, height, margin);

plotData();


//called once when the screen renders
async function plotData() {
  data = await getData();

  barplot.max = getMaxScore(data)

  //only return the first datapoint to populate the graph
  dataArray = reduceData(data[0]);

  barplot.plot(barplot.canvas, dataArray);
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
