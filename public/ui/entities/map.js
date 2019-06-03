class D3Map {
  constructor(width, height, margin) {

  };
};



function getMap() {
  map = L.map('map');

  map.setView([38, -100], 4);

  mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; ' + mapLink + ' Contributors',
        maxZoom: 18,
      }).addTo(map);

  map.doubleClickZoom.disable();

  return map;
};



//DEPRECIATED
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



//DEPRECIATED
function addMarker(map, name, lat, lng, score) {
  options = {
    radius: scl,
    stroke: false,
    color: "black",
    opacity: 1,
    fill: true,
    fillColor: "red",
    fillOpacity: 0,
  };

  var mark = L.circleMarker([lat, lng], options).bindTooltip(name, {direction: 'left'}).addTo(map);

  mark.on("click", ()=> {
    //this is where hooks into .d3 should be made
    updateGraph(mark.id);
  });

  mark.on("mouseover", ()=> {
    //mark.setRadius(20);
  });

  mark.on("mouseout ", ()=> {
    //mark.setRadius(scl);
  });

  mark.bindPopup(score);
  mark.name = name;
  return(mark);
};



/**********************
*** UPDATE BARCHART ***
**********************/

//updateGraph() is called when a leaflet marker is clicked

async function updateGraph(id) {
  data = await getData();

  dataArray = reduceData(data[id]);

  barplot.updatePlot(barplot.canvas, dataArray);
};



/* @reduceData(object)
  - provide JSON object, removes data not used in graph visualization (i.e name
    and coordinates) and returns an array ready for d3 to use.
*/
function reduceData(data) {

  rtn = [];
  for (key in data) {
    if (matches(key, ["name","lat","lng","score"]) == false) {
      rtn.push({"name": key, "value": data[key]})
    };
  };
  return rtn;
};



/* @matches(string, object)
  - if any item in the array 'search' is the key string, return true, else false
*/

function matches(key, search) {
  for (i in search) {
    if (key == search[i]) {
      return true;
    };
  };
  return false;
};



async function d3PopulateMarkers(map) {
  data = await getData();

    g.selectAll("circle")
      .data(data)
      .enter()
        .append("circle")
        .attr("id", function(d, i) {
          return i;
        })
        .attr("r", 0)
        .attr("cx", function(d) {
          return map.layerPointToLatLng([d.lat, d.lng]).x;
        })
        .attr('cy', function(d) {
          return map.layerPointToLatLng([d.lat, d.lng]).y;
        })
        .attr("stroke","black")
        .attr("stroke-width", 1)
        .attr("fill", "blue")
        .attr("pointer-events","visible")
        .on("mouseover", function() {

          var myCol = d3.select(this).attr("fill")

          d3.select(this)
            .style("cursor", "pointer")
            .call(attrTween, 100, "fill", setAlpha(myCol, .4))
        })
        .on("mouseout", function() {

          var myCol = d3.select(this).attr("fill")

          d3.select(this)
            .style("cursor", "default")
            .call(attrTween, 100, "fill", setAlpha(myCol, 1))
        })
        .on("click", function() {
          updateGraph(d3.select(this).attr("id"))
        })

    function mouseover(obj) {
      obj
        .style("cursor", "pointer")
        .transition()
        .duration(300)
          .style("opacity", .3)
    }

    function mouseout(obj) {
      obj
        .style("cursor", "default")
        .transition()
        .duration(600)
          .style("opacity", 1)
    }

    map.on("zoomend", update);
  	update();

    function update() {
      //get pxl distance between two coords
      x1 = map.latLngToLayerPoint([0,50]).x
      x2 = map.latLngToLayerPoint([0,0]).x

      scl = .01*(x1-x2);

      g.selectAll("circle")
        .attr("r", scl)
        .attr("transform", function(d) {
          return "translate("+
            map.latLngToLayerPoint([d.lat, d.lng]).x +","+
            map.latLngToLayerPoint([d.lat, d.lng]).y +")";
          })

      for (i in mark) {
        mark[i].setStyle({radius: scl})
      };
    };
};