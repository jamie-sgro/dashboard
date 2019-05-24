/************************
*** DECLARE VARIABLES ***
************************/
const width = 800;
const height = 600;
const locHost = "http://localhost:3000/";



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

data = getData();

async function getData() {
  return new Promise((resolve, reject) => {
    postAjax(locHost + "getData", {}, (err, cb)=> {
      if (err) {
        try {
          errMsg = JSON.parse(err.responseText)
          console.log(errMsg.name + ": " + errMsg.message);
        } catch(e) {
          console.log(err.statusText);
        };
        return;
      };

      resolve(cb);
      return;
    });
  });
};



/*****************
*** CREATE MAP ***
*****************/

// initialize the map
var map = L.map('map');

map.setView([38, -100], 4);

mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 18,
    }).addTo(map);


async function populateMarkers() {
  await data;

  // add marker
  for (i in data) {
    console.log(data.name);
  };
};

addMarker("San Jose-Sunnyvale-Santa Clara, CA ", "36.9375", "-121.3542", "68.57");

function addMarker(name, lat, lng, score) {
  var mark = L.marker([lat, lng]).bindTooltip(name, {direction: 'left'}).addTo(map);
  mark.on("click", ()=> {
    //this is where hooks into .d3 should be made
    console.log("Marker clicked!");
  })
  mark.on("mouseover", ()=> {

  });
  mark.bindPopup(score);
  mark.name = name;
  return(mark);
}

//If I want the popup open by default
//marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

//set up alerts
map.on("click", onMapClick);

function onMapClick(e) {
    console.log("You clicked the map at " + e.latlng);
}


/********************
*** CREATE CANVAS ***
********************/

const canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
