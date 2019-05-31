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



//updateGraph() is called when a leaflet marker is clicked

async function updateGraph(id) {
  data = await getData();

  dataArray = reduceData(data[id]);

  barplot.updatePlot(barplot.canvas, dataArray);
};



async function d3PopulateMarkers(map) {
  data = await getData();

    g.selectAll("circle")
      .data(data)
      .enter()
        .append("circle")
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
          d3.select(this)
            .style("cursor", "pointer")
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("cursor", "default")
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

      /*for (i in mark) {
        mark[i].setStyle({radius: scl})
      };*/
    };
};
