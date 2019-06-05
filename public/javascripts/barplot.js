class Barplot {
  constructor(width, height, margin) {
    this.margin = margin;
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - margin.top - margin.bottom;

    /* the (path, obj) convention is used to denote:
        path = d3 element
        obj = the barplot element typically evoked though 'this.'

      - note that the 'this.' element is overwritten by d3 regardless of the
        class
    */
    this.getSvgSize = function(path, obj) {
      path
        .attr("width", obj.width + obj.margin.left + obj.margin.right)
        .attr("height", obj.height + obj.margin.top + obj.margin.bottom);
    }

    this.svg = d3.select("body")
      .append("svg")
        .call(this.getSvgSize, this);

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
      .range([0, this.width - this.margin.left - this.margin.right]);
  };

  getHeightScale() {
    return d3.scaleBand()
      .range([this.height, 0])
      .padding(0.1)
      .domain(dataArray.map(function(d) {
        return d.name;
      }));
  };



  /* @getAttr(d3object, oject)
    - constructor for reused attributes for barplot. All updates to common
      atrributes are stored in this single function for rapid updating
    - the attributes object should be an array of strings that match d3
      attributes
  */
  getAttr(path, attributes) {
    var widthScale = barplot.getWidthScale();
    var heightScale = barplot.getHeightScale();
    var colour = barplot.getColour();

    for (key in attributes) {
      switch (attributes[key]) {
        case "width":
          path.attr("width", function(d) {
            return widthScale(d.value);
          });
          break;
        case "height":
          path.attr("height", heightScale.bandwidth())
          break;
        case "fill":
          path.attr("fill", function(d) {
            return colour(d.value)
          })
          break;
        case "y":
          path.attr("y", function(d) {
            return heightScale(d.name);
          })
          break;
      };
    };
  };



  getXAxis(path, obj) {
    path
      .attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisBottom(obj.getWidthScale()));
  }

  getYAxis(path, obj) {
    path
      .call(d3.axisLeft(obj.getHeightScale()));
  }



  plot(dataArray) {
    this.canvas.selectAll("rect")
      .data(dataArray)
      .enter()
        .append("rect")
          .attr("name", function(d) {
            return d.name;
          })
          .call(this.getAttr, ["width", "height", "fill", "y"])
          .on("click", this.onClick)
          .on("mouseover", this.onMouseover)
          .on("mouseout", this.onMouseOut);

    // add the x Axis
    this.canvas.append("g")
      .attr("class", "x axis")
      .call(this.getXAxis, this);

    // add the y Axis
    this.canvas.append("g")
      .attr("class", "y axis")
      .call(this.getYAxis, this);
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



  updatePlot(canvas, dataArray) {
    canvas.selectAll("rect")
      .data(dataArray)
        .transition()
        .duration(800)
        .call(this.getAttr, ["width", "fill"])
  };



  resize() {
    this.width = $(window).width() - 50 - this.margin.left - this.margin.right;
    this.height = ($(window).height()*screenPanel) - this.margin.top - this.margin.bottom;

    this.canvas.selectAll("rect")
      .call(this.getAttr, ["width", "height", "y"])

    this.canvas.selectAll("g.x.axis")
      .call(this.getXAxis, this)

    this.canvas.selectAll("g.y.axis")
      .call(this.getYAxis, this)

    this.svg
      .call(this.getSvgSize, this)
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
