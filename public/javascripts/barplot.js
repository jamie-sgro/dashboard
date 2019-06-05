class Barplot {
  constructor(width, height, margin) {
    this.margin = margin;
    this.width = width;
    this.height = height;

    this.getWidth = function(path, obj) {
      path.attr("width", obj.width + obj.margin.left + obj.margin.right)
    }

    this.getHeight = function(path, obj) {
      path.attr("height", obj.height + obj.margin.top + obj.margin.bottom)
    }

    this.svg = d3.select("body")
      .append("svg")
        .call(this.getWidth, this)
        .call(this.getHeight, this)
        //.attr("width", this.width + this.margin.left + this.margin.right)
        //.attr("height", this.height + this.margin.top + this.margin.bottom)

    this.canvas = this.svg
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
      .range([0, this.width - margin.left]);
  };

  getHeightScale() {
    return d3.scaleBand()
      .range([this.height, 0])
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
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(widthScale));

    // add the y Axis
    canvas.append("g")
      .attr("class", "y axis")
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
    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(dataArray, function(d){
        return d.value;
      })])
      .range([scl/4, scl*4]);

    g.selectAll("circle")
      .each(function(d,i) {
        d3.select(this).call(attrTween, 500, "r", scl+radiusScale(d[data.name]))
      })

    var myCol = d3.select(this).attr("fill")

    d3.select(this)
      .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .4))

    //DEPRECIATED: removing marker variable
    for (i in mark) {
      var rad = Math.round(scl+radiusScale(d3.select(this).data()[0].value))
      mark[i].setStyle({radius: rad})
    };
  };



  onMouseover(data) {
    var colour = barplot.getColour();

    g.selectAll("circle")
      .each(function(d,i) {
        //concurrent transitions that overlap the same attribute should have the
        //same duration so that the newest tween overwrites the old one
        d3.select(this).call(attrTween, 300, "fill", colour(d[data.name]))
      })

    var myCol = d3.select(this).attr("fill")

    d3.select(this)
      .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .7))
  };



  onMouseOut() {
    g.selectAll("circle")
      .each(function(d,i) {
        d3.select(this).call(attrTween, 300, "fill", "blue")
      })


    //DEPRECIATED: removing marker variable
    /*for (i in mark) {
      mark[i].setStyle({radius: scl})
    };*/
  }




  resize() {
    barplot.width = $(window).width() - this.margin.left - this.margin.right;
    barplot.height = ($(window).height()/2) - this.margin.top - this.margin.bottom;

    var widthScale = barplot.getWidthScale();

    var heightScale = barplot.getHeightScale();

    barplot.canvas.selectAll("rect")
      .attr("width", function(d) {
        return widthScale(d.value);
      })
      .attr("height", heightScale.bandwidth())
      .attr("y", function(d) {
        return heightScale(d.name);
      })

    // add the x Axis
    barplot.canvas.selectAll("g.x.axis")
      .attr("transform", "translate(0," + barplot.height + ")")
      .call(d3.axisBottom(widthScale));

    // add the y Axis
    barplot.canvas.selectAll("g.y.axis")
      .call(d3.axisLeft(heightScale));

    barplot.svg
    .attr("width", barplot.width + barplot.margin.left + barplot.margin.right)
    .attr("height", barplot.height + barplot.margin.top + barplot.margin.bottom)
  };
};

function setAlpha(c, v) {
  var c = d3.rgb(c);
  c.opacity = v;

  return c;
}

function attrTween(path, duration, attr, endRes) {
  var dummy = {};
  var colour = barplot.getColour();

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function() {
      var lerp = d3.interpolate(path.attr(attr), endRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
}



function resetTween(path, duration, attr, endRes, peakRes) {
  var dummy = {};
  var colour = barplot.getColour();

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function() {
      var lerp = d3.interpolate(path.attr(attr), peakRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
    .transition()
    .duration(duration*3)
    .tween(attr, function() {
      var lerp = d3.interpolate(peakRes, endRes);
      return function(t) {
        path.attr(attr, lerp(t));
      };
    })
}



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
