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
        reject(err);
        return;
      };

      resolve(cb.data);
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

populateMarkers();

async function populateMarkers() {
  await data.then((res)=> {
    // add marker
    for (i in res) {
      addMarker(res[i].name, res[i].lat, res[i].lng, res[i].score);
    };
  });
};



function addMarker(name, lat, lng, score) {
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
