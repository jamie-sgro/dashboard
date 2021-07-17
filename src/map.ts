// @ts-expect-error
import L = require("leaflet")

import { Data, DataModel, DataPoint } from "./data.js";
import { barplot, colourBottom, colourTop, panelHeight, panelWidth } from "./main.js";
import { getMarkScore, Mark } from "./panel3.js";




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
    updateGraphById(id);

    //this is where hooks into panel 3 should be made
    // updatePanel3(id);
}

export function updateGraphById(id, graph = barplot) {
  let data = Data.getSyncData();

  const dataArray = data[id].data;

  graph.updatePlot(dataArray);
};

/** provide JSON object, removes data not used in graph visualization (i.e name) 
 * and returns an array ready for d3 to use.
*/
export function reduceData(data: DataModel): DataPoint[] {
  return data.data;

  let rtn: DataPoint[] = [];
  for (let key in data) {
    if (matches(key, ["name"]) == false) {
      if (key.substring(0, 5) != "score") {
        rtn.push({ "name": key.split("|")[0], "value": data[key], "description": key.split("|")[1] }); // TODO: decouple at the data model level
      };
    };
  };
  return rtn;
};

export function populateMarkers() {
  let data = Data.getSyncData();

  // add marker
  var mark: Mark[] = [];

  for (let i in data) {
    /* Create marker element
      Note: stubbed lat lng since this is currently deprecated */
    mark[i] = addMarker(data[i].name, 0, 0) as Mark;

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



export function recenterDashboard() {
  //center screen onClick
  $('html, body').animate({scrollTop: $("#dashboard").offset().top}, 800);
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

