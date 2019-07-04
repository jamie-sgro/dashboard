/************************
*** DECLARE VARIABLES ***
************************/

var scl;
const markRad = 15;
const markCol = "rgba(10,151,217, .8)";
const scaleToZoom = false;
//const locHost = "https://sdsn-dashboard.localtunnel.me/";
const locHost = "http://localhost:3000/"
const panelHeight = 0.40;
const panelWidth = 0.40;

//set default city
document.getElementById("popupInfo").class = 0;



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



/*********************
*** MODIFY PANEL 3 ***
*********************/

function getPanel3Height() {
  //start with panel3 html height
  rtn = parseInt($("#panel3").css("height"));

  //reduce by padding in .css
  rtn -= parseInt($("#panel3").css("padding")) * 2;

  //reduce by text height if there's no table, else reduce by table height
  if ($("#popupInfo").css("height") != "0px") {
    rtn -= parseInt($("#popupInfo").css("height"));
  } else {
    rtn -= parseInt($("#popupInfo").children().css("height"));
    rtn -= parseInt($("#leaflet").css("height"));
  };

  return rtn;
};



//set up svg ahead so the modular function can select instead of append
d3.select("#panel3")
  .append("svg")

function panel3Resize() {
  pos = {};
  pos.top = ($(window).height()*(1-panelHeight));

  if ($('#header').height()) {
    pos.top -= $('#header').height();
  };

  //hardcoded based on orig height of the elem
  pos.top += 50;

  pos.width = $(window).width() * (1-panelWidth);

  pos.height = ($(window).height()*(panelHeight)) - 27;

  $("#panel3").css({
    top: pos.top,
    width: pos.width,
    height: pos.height
  });

  //set up svg bounds with padding for panel3 graph
  d3.select("#panel3").select("svg")
    .attr("width", "100%")
    .attr("height", getPanel3Height())
};

panel3Resize();

var width = parseInt($("#panel3 svg").css("width"))
var height = parseInt($("#panel3 svg").css("height"))
var testData = [
  {name: "one", value: "100"},
  {name: "two", value: "200"},
  {name: "three", value: "300"},
  {name: "four", value: "250"}
];

testData.sort(function(x, y) {
  return d3.descending(x.value, y.value)
})

var x = d3.scaleBand()
  .range([0, width])
  .padding(0)
  .domain(testData.map(function(d) {
    return d.name;
  }))

var y = d3.scaleLinear()
  .domain([0, d3.max(testData, function(d) {
    return d.value
  })])
  .range([height, 0]);

formatScoreData("score$arithmetic");

async function formatScoreData(keyPhrase) {
  db = await getData();

  rtn = [];
  for (i in db) {
    rtn.push({name: db[i].name, value: db[i][keyPhrase]})
  }

  console.log(rtn)

  return rtn;
};

  d3.select("#panel3")
    .select("svg")
    .selectAll("rect")
      .data(testData)
      .enter()
      .append("rect")
        .attr("id", function(d) {
          return d.name;
        })
        .attr("x", function(d) {
          return x(d.name);
        })
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.value);
        })
        .attr("fill", "#EFEFEF")
        .attr("stroke", "#D0CFD4")

/*********************
*** CREATE BARPLOT ***
*********************/

function getHeight() {
  if ($('#header').height()) {
    return $(window).height() - $('#header').height();
  } else {
    return $(window).height();
  };
};

//Barplot(width, height, margin)
const barplot = new Barplot(
  ($(window).width()*panelWidth),
  getHeight(),
  {top: 10, right: 20, bottom: 30, left: 60}
);

plotData();

//called once when the screen renders
async function plotData() {
  data = await getData();

  barplot.max = getMaxScore(data)

  //only return the first datapoint to populate the graph
  var id = document.getElementById("popupInfo").class;
  dataArray = reduceData(data[id]);
  barplot.title = data[id].name; //Currently use first row of .csv on graph init

  barplot.plot(dataArray);
};



function getMaxScore(data) {
  maxScore = 0;

  for (rec in data) {
    for (key in data[rec]) {
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
});
