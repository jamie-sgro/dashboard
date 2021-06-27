// @ts-expect-error
import L = require("leaflet")

import { Data, DataModel, DataPoint } from "./data.js";
import { barplot, colourBottom, colourTop, panelHeight, panelWidth } from "./main.js";
import { getMarkScore, updatePanel3, Mark } from "./panel3.js";




export function mapResize(map) {
  let h = ($(window).height()*(1-panelHeight)) - 10

  if ($('#header').height()) {
    h -= $('#header').height();
  }

  let w = ($(window).width() * (1-panelWidth));
  $("#map").height(h).width(w).css({position:'absolute'});
  map.invalidateSize();
};



export function getMap() {
  // TODO: this function has the div dimensions we need for the new dropdown
  let newMap = L.map('map');

  newMap.setView([50, -87], 4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 8,
        minZoom: 2,
      }).addTo(newMap);

  // @ts-ignore
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += `<i style="background: ` + colourBottom + `"></i><span>Minimum Score</span><br>`;
    div.innerHTML += `<i style="background: ` + colourTop + `"></i><span>Maximum Score</span><br>`;
    return div;
  };

  legend.addTo(newMap);

  mapResize(newMap);

  newMap.doubleClickZoom.disable();

  return newMap;
};



function addMarker(name, lat, lng) {
  var mark = L.circleMarker([lat, lng]);

  // @ts-ignore
  mark.name = name;
  return(mark);
};


export function updateAllGraphs(id: number) {
    //this is where hooks into .d3 should be made
    updateGraph(id);

    //this is where hooks into panel 3 should be made
    updatePanel3(id);

    recenterDashboard();
}



export function populateMarkers() {
  let data = Data.getSyncData();

  // add marker
  var mark: Mark[] = [];

  for (let i in data) {
    //create marker element
    mark[i] = addMarker(data[i].name, data[i].lat, data[i].lng) as Mark;

    //attach array number to JSON object
    mark[i].id = i;
  };

  /* get metrics to create table
      - run through .csv headers, if header starts with "score", calculate metrics
        for that respective column
  */
  for (let header in data[0]) {
    if (header.substring(0, 5) == "score") {
      // header variable represents the full string of a column containing raw
      //  score values
      getMarkScore(mark, data, header);
    };
  };


  return mark;
};



function recenterDashboard() {
  //center screen onClick
  $('html, body').animate({scrollTop: $("#dashboard").offset().top}, 800);
};



/**********************
*** UPDATE BARCHART ***
**********************/

//updateGraph() is called when a leaflet marker is clicked

export function updateGraph(id, graph = barplot) {
  if (!id) {
    id = graph.id;
  };

  let data = Data.getSyncData();

  const dataArray = reduceData(data[id]);

  graph.updatePlot(graph.canvas, dataArray);
};



/** provide JSON object, removes data not used in graph visualization (i.e name
    and coordinates) and returns an array ready for d3 to use.
*/
export function reduceData(data: DataModel): DataPoint[] {

  let rtn: DataPoint[] = [];
  for (let key in data) {
    if (matches(key, ["name","lat","lng"]) == false) {
      if (key.substring(0, 5) != "score") {
        rtn.push({"name": key, "value": data[key]});
      };
    };
  };
  return rtn;
};



/* @matches(string, object)
  - if any item in the array 'search' is the key string, return true, else false
*/

export function matches(key, search) {
  for (let i in search) {
    if (key == search[i]) {
      return true;
    };
  };
  return false;
};

