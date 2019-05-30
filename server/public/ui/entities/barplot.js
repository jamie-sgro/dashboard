class Barplot {
  constructor(width, height, margin) {
    this.width = width;
    this.height = height;
    this.margin = margin;

    this.canvas = d3.select("body")
      .append("svg")
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
      .domain([0, this.max])
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

    var colour = this.getColour();

    var widthScale = this.getWidthScale();

    var heightScale = this.getHeightScale();

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
          .on("click", this.onClick)
          .on("mouseover", this.onMouseover)
          .on("mouseout", this.onMouseOut)

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
  };



  onClick(data) {
    //Change marker size based on data value
    /*var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([scl/4, scl*4]);

    g.selectAll("circle")
      .transition()
      .duration(500)
      .attr("r", function(d) {
        return scl+radiusScale(d[data.name]);
      });*/

    d3.select(this)
      .call(alphaTween, 100, 0.6)

    //DEPRECIATED: removing marker variable
    /*for (i in mark) {
      var rad = radiusScale(Math.round(data[i][barName]))
      mark[i].setStyle({radius: rad})
    };*/
  };



  onMouseover(data) {
    var colour = barplot.getColour();

    g.selectAll("circle")
      .transition()
      .duration(300)
      .attr("fill", function(d) {
        return colour(d[data.name]);
      });


    d3.select(this)
      .call(alphaTween, 100, 0.3)
  };



  onMouseOut() {
    g.selectAll("circle")
      .transition()
      .delay(700)
      .duration(1300)
      .attr("fill", "blue")
      //.call(barplot.mouseout)

    //.attr("r", scl);

    //DEPRECIATED: removing marker variable
    /*for (i in mark) {
      mark[i].setStyle({radius: scl})
    };*/
  }
};

function alphaTween(path, duration, alpha) {
  var dummy = {};
  var col = path.attr("fill")

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween("fill", function() {
      var i = d3.interpolate(col, "transparent");
      i = d3.interpolate(col, i(alpha));
      return function(t) {
        path.attr("fill", i(t));
      };
    })
    .transition()
    .duration(duration*3)
    .tween("fill", function() {
      var i = d3.interpolate("transparent", col);
      i = d3.interpolate(path.attr("fill"), i(100000000));
      return function(t) {
        path.attr("fill", i(t));
      };
    })
}

function tween(path) {
  var dummy = {};

  d3.select(dummy)
    .transition()
    .duration(800)
    .tween("fill", function() {
      var i = d3.interpolateRgb("blue", "red");
      return function(t) {
        path.attr("fill", i(t));
      };
    })
};
