/************************
*** DECLARE VARIABLES ***
************************/

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
    console.log(mark.id);

    updateGraph(mark.id);
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


async function updateGraph(id) {
  data = await getData();

  for (key in data[id]) {
    if (matches(key, ["name","lat","lng","score"]) == false) {
      console.log({"name": key, "value": data[id][key]})
    }
  }

  dataArray = [20, 20, 40, 50, 60]
  canvas.selectAll("rect")
    .data(dataArray)
      .transition()
      .duration(800)
      .attr("width", function(d) {
        console.log(d)
        return widthScale(d);
      })
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

var dataArray = [
  {
    "name": "SDG1",
    "value": 10
  },
  {
    "name": "SDG2",
    "value": 20
  },
  {
    "name": "SDG3",
    "value": 30
  }
];

//var dataArray = [{"name":"Bob","value":33},{"name":"Robin","value":12},{"name":"Anne","value":41},{"name":"Mark","value":16},{"name":"Joe","value":59},{"name":"Eve","value":38},{"name":"Karen","value":21},{"name":"Kirsty","value":25},{"name":"Chris","value":30},{"name":"Lisa","value":47},{"name":"Tom","value":5},{"name":"Stacy","value":20},{"name":"Charles","value":13},{"name":"Mary","value":29}];

maxIndiScore = 60;

var margin = {
  top: 15,
  right: 25,
  bottom: 15,
  left: 60
};

var width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var canvas = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var colour = d3.scaleLinear()
  .domain([0, d3.max(dataArray, function(d){
    return d.value;
  })])
  .range(["red","blue"]);

dataArray.forEach(function(d) {
  d.value = +d.value;
});

var widthScale = d3.scaleLinear()
  .domain([0, d3.max(dataArray, function(d){
    return d.value;
  })])
  .range([0, width]);

var heightScale = d3.scaleBand()
  .range([height, 0])
  .padding(0.1)
  .domain(dataArray.map(function(d) {
    return d.name;
  }));

canvas.selectAll("rect")
  .data(dataArray)
  .enter()
    .append("rect")
      .attr("width", function(d) {
        return widthScale(d.value);
      })
      .attr("height", heightScale.bandwidth())
      .attr("fill", function(d) {
        return colour(d.value)
      })
      .attr("y", function(d) {
        return heightScale(d.name);
      });

      // add the x Axis
canvas.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(widthScale));

// add the y Axis
canvas.append("g")
  .call(d3.axisLeft(heightScale));
