/************************
*** DECLARE VARIABLES ***
************************/

const width = 800;
const height = 600;
const locHost = "http://localhost:3000/";



/*******************
*** MAIN ROUTINE ***
*******************/

var map = getMap();
mark = populateMarkers(map);



/********************
*** CREATE CANVAS ***
********************/

const canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)



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
  };

  return mark;
};



function addMarker(map, name, lat, lng, score) {
  options = {
    radius: 10,
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
    console.log(mark.name);
  });

  mark.on("mouseover", ()=> {
    mark.setRadius(20);
  });

  mark.on("mouseout ", ()=> {
    mark.setRadius(10);
  });

  mark.bindPopup(score);
  mark.name = name;
  return(mark);
};



//set up alerts
map.on("click", onMapClick);

function onMapClick(e) {
    console.log("You clicked the map at " + e.latlng);
};
