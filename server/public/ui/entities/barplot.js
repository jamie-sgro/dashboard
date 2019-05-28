class Barplot {
  constructor(width, height, margin) {
    this.width = width;
    this.height = height;
    this.margin = margin;

    this.canvas = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

  plot(canvas) {
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

    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([markerRad/4, markerRad*4]);

    canvas.selectAll("rect")
      .data(dataArray)
      .enter()
        .append("rect")
          .attr("name", function(d) {
            return d.name;
          })
          .attr("width", function(d) {
            return widthScale(d.value);
          })
          .attr("height", heightScale.bandwidth())
          .attr("fill", function(d) {
            return colour(d.value)
          })
          .attr("y", function(d) {
            return heightScale(d.name);
          })
          .on("click", function() {
            //build hook to change leaflet
            var barName = d3.select(this).attr("name");

            for (i in mark) {
              var rad = radiusScale(Math.round(data[i][barName]))
              mark[i].setStyle({radius: rad})
            };
          })
          .on("mouseover", function() {
            //build hook to change leaflet
            var barName = d3.select(this).attr("name");

            for (i in mark) {
              //change colour based on width of rect
              mark[i].setStyle({fillColor: colour(data[i][barName])})
            };
          })
          .on("mouseout", function() {
            //build hook to change leaflet
            var barName = d3.select(this).attr("name");
            for (i in mark) {
              mark[i].setStyle({fillColor: "blue", radius: markerRad})
            };
          });

    // add the x Axis
    canvas.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(widthScale));

    // add the y Axis
    canvas.append("g")
      .call(d3.axisLeft(heightScale));
  };



  updatePlot(data) {
    canvas.selectAll("rect")
      .data(data)
        .transition()
        .duration(800)
        .attr("width", function(d) {
          return widthScale(d.value);
        })
        .attr("fill", function(d) {
          return colour(d.value)
        })
  }
};
