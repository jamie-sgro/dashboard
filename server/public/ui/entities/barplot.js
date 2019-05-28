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

  getColour() {
    return d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range(["red","blue"]);
  };

  getWidthScale() {
    return d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([0, width]);
  };

  getHeightScale() {
    return d3.scaleBand()
      .range([height, 0])
      .padding(0.1)
      .domain(dataArray.map(function(d) {
        return d.name;
      }));
  };

  plot(canvas, dataArray) {

    dataArray.forEach(function(d) {
      d.value = +d.value;
    });

    var colour = this.getColour();

    var widthScale = this.getWidthScale();

    var heightScale = this.getHeightScale();

    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([scl/4, scl*4]);

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

            g.selectAll("circle")
              .transition()
              .duration(500)
              .attr("r", function(d) {
                console.log(scl)
                return radiusScale(d[barName]);
              });

            /*for (i in mark) {
              var rad = radiusScale(Math.round(data[i][barName]))
              mark[i].setStyle({radius: rad})
            };*/
          })
          .on("mouseover", function() {
            //build hook to change leaflet
            var barName = d3.select(this).attr("name");


            g.selectAll("circle")
              .transition()
              .duration(300)
              .attr("fill", function(d) {
                return colour(d[barName]);
              });

            /*for (i in mark) {
              //change colour based on width of rect
              mark[i].setStyle({fillColor: colour(data[i][barName])})
            };*/
          })
          .on("mouseout", function() {
            //build hook to change leaflet

            g.selectAll("circle")
              .transition()
              .delay(700)
              .duration(1300)
              .attr("fill", "blue")
              .attr("r", scl);

            /*for (i in mark) {
              mark[i].setStyle({fillColor: "blue", radius: scl})
            };*/
          });

    // add the x Axis
    canvas.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(widthScale));

    // add the y Axis
    canvas.append("g")
      .call(d3.axisLeft(heightScale));
  };



  updatePlot(canvas, dataArray) {

    var colour = this.getColour();
    var widthScale = this.getWidthScale();

    canvas.selectAll("rect")
      .data(dataArray)
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
