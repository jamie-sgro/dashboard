/************************
*** DECLARE VARIABLES ***
************************/

const markerRad = 10;
//const width = 800;
//const height = 400;
const locHost = "http://localhost:3000/";



/*******************
*** MAIN ROUTINE ***
*******************/

var map = getMap();
mark = populateMarkers(map);



/********************
*** CREATE CANVAS ***
********************/

/*
const canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
*/


/****************
*** FUNCTIONS ***
****************/

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
  }
  return getData.promise;
};



/*****************
*** CREATE MAP ***
*****************/

function getMap() {
  map = L.map('map');

  map.setView([38, -100], 4);

  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
      }).addTo(map);

  return map;
};



async function populateMarkers(map) {
  data = await getData();

  // add marker
  mark = [];

  for (i in data) {
    mark[i] = addMarker(map, data[i].name, data[i].lat, data[i].lng, data[i].score);

    //attach array number to JSON object
    mark[i].id = i;
  };

  return mark;
};



function addMarker(map, name, lat, lng, score) {
  options = {
    radius: markerRad,
    stroke: true,
    color: "black",
    opacity: 1,
    fill: true,
    fillColor: "blue",
    fillOpacity: 0.8,
  };

  var mark = L.circleMarker([lat, lng], options).bindTooltip(name, {direction: 'left'}).addTo(map);

  mark.on("click", ()=> {
    //this is where hooks into .d3 should be made
    console.log(mark.id);

    updateGraph(mark.id);
  });

  mark.on("mouseover", ()=> {
    mark.setRadius(20);
  });

  mark.on("mouseout ", ()=> {
    mark.setRadius(markerRad);
  });

  mark.bindPopup(score);
  mark.name = name;
  return(mark);
};


async function updateGraph(id) {
  data = await getData();

  dataArray = [];

  for (key in data[id]) {
    if (matches(key, ["name","lat","lng","score"]) == false) {
      dataArray.push({"name": key, "value": data[id][key]})
    }
  }

  barplot.updatePlot(dataArray);
};



function matches(key, search) {
  for (i in search) {
    if (key == search[i]) {
      return true;
    };
  };
  return false;
};


//set up alerts
map.on("click", onMapClick);

function onMapClick(e) {
  console.log("You clicked the map at " + e.latlng);
};



//d3 barplot

var dataArray = [{name: "SDG1", value: "28.24"},
{name: "SDG2", value: "14.09"},
{name: "SDG3", value: "52.56"},
{name: "SDG4", value: "30.74"},
{name: "SDG5", value: "19.7"},
{name: "SDG6", value: "99.81"},
{name: "SDG7", value: "100"},
{name: "SDG8", value: "56.63"},
{name: "SDG9", value: "24.63"},
{name: "SDG10", value: "40.02"},
{name: "SDG11", value: "69.61"},
{name: "SDG12", value: "72.78"},
{name: "SDG13", value: "54.18"},
{name: "SDG15", value: "83.84"},
{name: "SDG16", value: "56.74"}];

//var dataArray = [{"name":"Bob","value":33},{"name":"Robin","value":12},{"name":"Anne","value":41},{"name":"Mark","value":16},{"name":"Joe","value":59},{"name":"Eve","value":38},{"name":"Karen","value":21},{"name":"Kirsty","value":25},{"name":"Chris","value":30},{"name":"Lisa","value":47},{"name":"Tom","value":5},{"name":"Stacy","value":20},{"name":"Charles","value":13},{"name":"Mary","value":29}];

async function getMaxScore() {
  maxScore = 0;
  data = await getData();

  for (rec in data) {
    for (key in data[rec]) {
      if (matches(key, ["name","lat","lng","score"]) == false) {
        if (data[rec][key] > maxScore) {
          maxScore = data[rec][key];
        };
      };
    };
  };
  console.log(maxScore);
  return maxScore;
};

var margin = {
  top: 15,
  right: 25,
  bottom: 20,
  left: 60
};

var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

const barplot = new Barplot(width, height, margin);

barplot.plot(barplot.canvas);
