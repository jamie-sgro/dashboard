// @ts-nocheck

class D3Map {
  constructor(width, height, margin) {

  };
};



function mapResize() {
  h = ($(window).height()*(1-panelHeight)) - 10

  if ($('#header').height()) {
    h -= $('#header').height();
  }

  w = ($(window).width() * (1-panelWidth));
  $("#map").height(h).width(w).css({position:'absolute'});
  map.invalidateSize();
};



function getMap() {
  map = L.map('map');

  map.setView([50, -87], 4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 8,
        minZoom: 2,
      }).addTo(map);

  var legend = L.control({position: "bottomright"});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += `<i style="background: ` + colourBottom + `"></i><span>Minimum Score</span><br>`;
    div.innerHTML += `<i style="background: ` + colourTop + `"></i><span>Maximum Score</span><br>`;
    return div;
  };

  legend.addTo(map);

  mapResize();

  map.doubleClickZoom.disable();

  return map;
};



function addMarker(map, name, lat, lng) {

  options = {
    radius: scl,
    stroke: false,
    color: "black",
    opacity: 1,
    fill: true,
    fillColor: "red",
    fillOpacity: 0,
  };

  var mark = L.circleMarker([lat, lng], options).addTo(map);

  mark.on("click", ()=> {

    //this is where hooks into .d3 should be made
    updateGraph(mark.id);

    //this is where hooks into panel 3 should be made
    updatePanel3(mark.id);
  });

  mark.on("mouseover", ()=> {
    //mark.setRadius(20);
  });

  mark.on("mouseout ", ()=> {
    //mark.setRadius(scl);
  });

  mark.bindTooltip(name, {direction: 'left'})

  mark.content = `<h1>name</h1>`

  mark.name = name;
  return(mark);
};



// take dataset and calculate metrics for the mark[i].table element
function getMarkScore(mark, data, scoreName) {
  //vet variable
  if (typeof(scoreName) != "string") {
    throw "Error in getMarkScore()\nscoreName variable must be a string matching a .csv header";
  };

  //get relative ranking
  var arr = [];
  for (i in data) {
    arr.push(getAverageScore(data[i], scoreName));
  };
  var sorted = arr.slice().sort(function(a,b) {
    return b-a;
  });
  var rank = arr.slice().map(function(v){
    return sorted.indexOf(v) + 1;
  });

  //get average score between all cities
  var sum = 0;
  var avg = 0;
  if (arr.length) {
    sum = arr.reduce(function(a, b) {
      return a + b;
    });
    avg = sum / arr.length;
  }

  var standing;

  for (i in data) {
    let city = data[i]
    //get relative standing
    standing = Math.round(((city[scoreName] / avg) - 1) * 100)

    if (standing > 0) {
      standing = "<font color='green'>&#x25B2;" + standing + "% above average</font>";
    } else if (standing < 0) {
      standing = "<font color='red'>&#x25BC;" + standing + "% below average</font>";
    } else {
      standing = "No average standing available";
    };

    if (mark[i].table == undefined) {
      mark[i].table = {};
      mark[i].score = {};
    };

    //get score type without the "score$"
    jsonName = scoreName.substring(6);
    averageRaw =  getAverageScore(city, scoreName);
    average = Math.round(averageRaw * 100) / 100

    mark[i].table[jsonName] = generateTable(
      city.name, 
      average,
      rank[i] + " (of " + rank.length + ")", 
      standing);

    //record relative ranking for panel3 barchart selection
    mark[i].score[jsonName] = rank[i]
  };
};



function generateTable(name, score, rank, standing) {
  return `<h1 style="margin:0; padding:10">` + name + `</h1>
  <table style="width:100%; margin:0", id="leaflet">
    <tr>
      <th>Score</th>
      <th>Ranking</th>
      <th>Standing</th>
    </tr>
    <tr>
      <td>` + score + `</td>
      <td>` + rank + `</td>
      <td>` + standing + `</td>
    </tr>
  </table>`
};



async function populateMarkers(map) {
  let data = Data.getSyncData();

  // add marker
  var mark = [];

  for (i in data) {
    //create marker element
    mark[i] = addMarker(map, data[i].name, data[i].lat, data[i].lng);

    //attach array number to JSON object
    mark[i].id = i;
  };

  /* get metrics to create table
      - run through .csv headers, if header starts with "score", calculate metrics
        for that respective column
  */
  for (header in data[0]) {
    if (header.substring(0, 5) == "score") {
      // header variable represents the full string of a column containing raw
      //  score values
      getMarkScore(mark, data, header);
    };
  };


  return mark;
};



function onMapClick(e) {
  g.selectAll("circle")
    .each(function(d,i) {
      d3.select(this).call(attrTween, 500, "r", scl)
    })

  for (i in mark) {
    mark[i].setStyle({radius: scl})
  }

  //center screen onClick
  $('html, body').animate({scrollTop: $("#dashboard").offset().top}, 800);
};



/**********************
*** UPDATE BARCHART ***
**********************/

//updateGraph() is called when a leaflet marker is clicked

function updateGraph(id) {
  if (!id) {
    id = barplot.id;
  };

  updateMarker(id);

  let data = Data.getSyncData();

  dataArray = reduceData(data[id]);

  barplot.updatePlot(barplot.canvas, dataArray);
};



function updateMarker(id) {
  //reset pervious marker
  g.select("circle#id" + barplot.id)
    .call(attrTween, 800, "stroke", "white")

  //highlight new marker
  g.select("circle#id" + id)
    .moveToFront()
    .call(attrTween, 800, "stroke", "black")
};



/* @reduceData(object)
  - provide JSON object, removes data not used in graph visualization (i.e name
    and coordinates) and returns an array ready for d3 to use.
*/
function reduceData(data) {

  rtn = [];
  for (key in data) {
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

function matches(key, search) {
  for (i in search) {
    if (key == search[i]) {
      return true;
    };
  };
  return false;
};



async function d3PopulateMarkers(map) {
  let data = Data.getSyncData();


    g.selectAll("circle")
      .data(data)
      .enter()
        .append("circle")
        .attr("id", function(d, i) {
          return "id" + i;
        })
        .attr("r", 0)
        .attr("cx", function(d) {

          // layerPointToLatLng() ran on second monitor with coords from dataset
          // (the variable 'd') returns uncaught promise
          // - relies on update() function to properly init coordinates
          // - currently throw a dummy coordinate [0, 0]
          return map.layerPointToLatLng([0, 0]).x;
        })
        .attr('cy', function(d) {
          return map.layerPointToLatLng([0, 0]).y;
        })
        .attr("stroke","white")
        .attr("stroke-width", 1)
        .attr("fill", markCol)
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
      if (scaleToZoom) {
        //get pxl distance between two coords
        x1 = map.latLngToLayerPoint([0,1]).x
        x2 = map.latLngToLayerPoint([0,0]).x

        scl = (x1-x2);
      }

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
