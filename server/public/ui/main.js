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
    //data: data,
    url: url,
    //contentType: 'application/json',
    //datatype: "json"
  }).done((data)=> {
    callback(null, data);
  }).fail((jqXHR, textStatus, errorThrown)=> {
    callback(jqXHR, null);
  });
};

postAjax(locHost + "getData", {}, (err, cb)=> {
  console.log(cb);
});



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


// add marker

var marker = L.marker([36.9375, -121.3542]).addTo(map);
marker.on("click", ()=> {
  console.log("Marker clicked!")
})

//If I want the popup open by default
//marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

marker.bindPopup("68.57")

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
