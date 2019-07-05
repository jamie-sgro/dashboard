function getPanel3Height() {
  //start with panel3 html height
  rtn = parseInt($("#panel3").css("height"));

  //reduce by padding in .css
  rtn -= parseInt($("#panel3").css("padding")) * 2;

  //reduce by text height if there's no table, else reduce by table height
  if ($("#popupInfo").css("height") != "0px") {
    rtn -= parseInt($("#popupInfo").css("height"));
  } else {
    rtn -= parseInt($("#popupInfo").children().css("height"));
    rtn -= parseInt($("#leaflet").css("height"));
  };

  return rtn;
};

function panel3Resize() {
  pos = {};
  pos.top = ($(window).height()*(1-panelHeight));

  if ($('#header').height()) {
    pos.top -= $('#header').height();
  };

  //hardcoded based on orig height of the elem
  pos.top += 50;

  pos.width = $(window).width() * (1-panelWidth);

  pos.height = ($(window).height()*(panelHeight)) - 27;

  $("#panel3").css({
    top: pos.top,
    width: pos.width,
    height: pos.height
  });

  //set up svg bounds with padding for panel3 graph
  d3.select("#panel3").select("svg")
    .attr("width", "100%")
    .attr("height", getPanel3Height())
};

async function plotPanel3() {
  var rawData = await getData();

  var keyPhrase = "score$" + getCheckedRadio()
  console.log(keyPhrase)

  var width = parseInt($("#panel3 svg").css("width"))
  //var height = parseInt($("#panel3 svg").css("height"))
  var height = getPanel3Height()

  //parse needed data from rawData
  panel3Data = [];
  for (i in rawData) {
    panel3Data.push({name: rawData[i].name, value: rawData[i][keyPhrase]})
  }

  //sort data in descending order
  panel3Data.sort(function(x, y) {
    return d3.descending(x.value, y.value)
  })

  var x = d3.scaleBand()
    .range([0, width])
    .padding(0)
    .domain(panel3Data.map(function(d) {
      return d.name;
    }))

  var y = d3.scaleLinear()
    .domain([0, d3.max(panel3Data, function(d) {
      return d.value
    })])
    .range([height, 0]);

  d3.select("#panel3")
    .select("svg")
    .selectAll("rect")
      .data(panel3Data)
      .enter()
      .append("rect")
        .attr("id", function(d, i) {
          return "id" + i;
        })
        .attr("x", function(d) {
          return x(d.name);
        })
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
          return height - y(d.value);
        })
        .attr("fill", "#EFEFEF")
        .attr("stroke", "#D0CFD4")
};
