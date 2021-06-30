// @ts-expect-error
import d3 = require("d3");

import { DataPoint } from "./data.js";
import { Margin } from "./Margin.js";
import { assertType } from "./utils.js";

const markCol = "rgba(10,151,217, .8)";
const panelWidth = 0.40;
const scl = 15;
const colourBottom = "rgb(56, 94, 231)";
const colourTop = "rgb(34, 236, 87)";
   
export class Barplot {
  canvas: any
  id: number
  max: number
  margin: Margin;
  width: number;
  height: number;
  // g: any
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  dataArray: DataPoint[]

  constructor(width, height, margin: Margin) {
    this.margin = margin;
    this.width = width;
    this.height = height - this.margin.top - this.margin.bottom;
    // this.g = g

    this.svg = d3.select("#col-3")
      .append("svg")
        .attr("class", "barplot svg")
        .call(this.getSvgSize, this);

    this.canvas = this.svg
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the div for the tooltip
    this.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  };
  
  static selectAttrAsString(obj: any, attr: string): number {
    return  Number(d3.select(obj).attr(attr))
  }

  /** the (path, obj) convention is used to denote:
    path = d3 element
    obj = the barplot element typically evoked though 'this.'

  - note that the 'this.' element is overwritten by d3 regardless of the
    class
  */
  getSvgSize(path, obj) {
    path
      .attr("width", obj.width)
      .attr("height", obj.height + obj.margin.top + obj.margin.bottom)

    $(".barplot.svg").css({left: $(window).width()*(1-panelWidth)});
  };

  getColour() {
    let max = Number(d3.max(this.dataArray, (d: DataPoint) => {
      return d.value;
    }))
    return d3.scaleLinear()
      .domain([0, max])
      // @ts-ignore
      .range([colourBottom,colourTop]);
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
      .domain(this.dataArray.map(function(d) {
        return d.name;
      }));
  };
  
  
  
  /* @getAttr(d3object, oject)
    - constructor for reused attributes for barplot. All updates to common
      atrributes are stored in this single function for rapid updating
    - the attributes object should be an array of strings that match d3
      attributes
  */
  getAttr(path, obj, attributes) {
    var widthScale = obj.getWidthScale();
    var heightScale = obj.getHeightScale();
    var colour = obj.getColour();

    for (let key in attributes) {
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
        case "fillTransparent":
          path.attr("fill", function(d) {
            const rtn = colour(d.value);
            return setAlpha(rtn, 0);
          })
          break;
        case "y":
          path.attr("y", function(d) {
            return heightScale(d.name);
          })
          break;
        case "cx":
          path.attr("cx", function(d) {
            return widthScale(d.value);
          });
          break;
        case "cy":
          path.attr("cy", function(d) {
            return heightScale(d.name);
          })
          break;
        case "r":
          path.attr("r", heightScale.bandwidth()/2)
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


  /** Fired when switch/slider checkbox is triggered (in home.html)
   * swithces leadLag opacity on or off
   * changes rect size to match min and max of the variable it's measuring
   */
  toggleLeadLag() {
    var widthScale = this.getWidthScale();

    // @ts-ignore
    if (document.getElementById("leadLag").checked) {
      var colour = this.getColour();

      // turn leadLag marker visible
      this.canvas.selectAll("rect.leadLag")
        .each(function(d,i) {
          d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          d3.select(this).call(attrTween, 800, "stroke", "white");
        })

        this.canvas.selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", function() {
          let rtn = this.selectAttrAsString(this, "min");
          rtn = widthScale(rtn);
          return "translate(" + rtn + ", 0)";
        })
        .attr("width", function() {
          let rtn = this.selectAttrAsString(this, "max");
          rtn -= Number(d3.select(this).attr("min"));
          return widthScale(rtn);
        })
        .attr("fill", function() {
          let rtn = this.selectAttrAsString(this, "min");
          rtn += Number(d3.select(this).attr("max"));
          rtn /= 2;
          rtn = colour(rtn)
          rtn = setAlpha(rtn, 0.5)
          return rtn;
        })
        .attr("stroke", "black")
    } else {

      // turn leadLag marker invisible
      this.canvas.selectAll("rect.leadLag")
        .each(function() {
          var myCol = d3.select(this).attr("fill");
          d3.select(this).call(attrTween, 800, "fill", setAlpha(myCol, 0));
          d3.select(this).call(attrTween, 800, "stroke", "rgba(0,0,0,0)");
        })


      this.canvas.selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", "translate(0, 0)")
        .attr("stroke", "rgba(0,0,0,0)")


      console.log(this.id)
      // updateGraph(null, this)
    };
  };


  /** Ran once on screen load, instantiates every d3 elem in second panel
   */
  plot(dataArray: DataPoint[], min: number[], max: number[]): void {
    this.dataArray = dataArray
    var widthScale = this.getWidthScale();

    this.canvas.selectAll("rect.bar")
      .data(this.dataArray)
      .enter()
        .append("rect")
          .attr("class", "bar")
          .attr("name", function(d) {
            d.name = d.name.split("|")[0]
            d.name = d.name
            return d.name
          })
          .attr("min", function(d, i) {
            return min[i];
          })
          .attr("max", function(d, i) {
            return max[i];
          })
          .attr("width", function(d) {
            return widthScale(0);
          })
          .call(this.getAttr, this, ["height", "fill", "y"])
          .attr("stroke", "rgba(0,0,0,0)")
          .style("cursor", "pointer")
          // .on("click", this.onClick)
          .on("mouseover", (d, i) => {
            this.onMouseover(d, i)
          })
          .on("mouseout", () => {
            this.onMouseOut()
          })
          .on('mousemove', () => {
            this.onMouseMove()
          })
          
    let width = this.width
    // add markers for leadLag plot
    this.canvas.selectAll("rect.leadLag")
      .data(dataArray)
      .enter()
        .append("rect")
          .attr("class", "leadLag")
          .attr("widthFactor", 0.05)
          //invisible until first marker is selected
          .call(this.getAttr, this, ["x", "y", "height", "fillTransparent"])
          .attr("width", function() {
            var widthFactor = Number(d3.select(this).attr("widthFactor"));
            return width * widthFactor;
          })
          .attr("stroke", "rgba(0,0,0,0)")
          .attr("pointer-events","none")


    // add the x Axis
    this.canvas.append("g")
      .attr("class", "x axis")
      .call(this.getXAxis, this);

    // add the y Axis
    this.canvas.append("g")
      .attr("class", "y axis")
      .call(this.getYAxis, this);
  };


  /** Excplicitely cast `this` into a d3.BaseType 
   * because d3 often co-opts the `this` keyword */
  get baseType() {
    return this as unknown as d3.BaseType
  }



  onClick(data) {
    console.log(d3.select(this.baseType).attr("min"))
    console.log(d3.select(this.baseType).attr("max"))
    // change marker size based on data value
    var radiusScale = d3.scaleLinear()
      .domain([0, Number(d3.max(this.dataArray, function(d: DataPoint){
        return d.value;
      }))])
      .range([scl/2, scl*2]);

    // @ts-ignore
    if (!document.getElementById("leadLag").checked) {
      var myCol = d3.select(this.baseType).attr("fill");

      d3.select(this.baseType)
        .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .4))
    };
  };


  onMouseover(data: DataPoint, index: number) {
    assertType(this, Barplot)

    //remove old text
    this.tooltip
      .html(data.name)

    //remove old img
    this.tooltip
      .selectAll("img")
      .remove()

    //try to append now image
    this.tooltip
      .html(data.name.split("|")[1])
      // .append("img")
      //   .attr("class", "picture")
      //   .attr("src", function(d) {
      //     return "public/images/sdg-icons/" + data.name + ".png";
      //   })
      //   .on("error", function(d) {
      //     barplot.tooltip
      //       .html(data.name)
      //   })

    this.tooltip
      .transition()
      .duration(200)
      .style("opacity", 1)

    this.tooltip
      .transition()
      .delay(2000)
      .on("end", function() {
        d3.select(this)
          .html(d3.select(this).html() +
          " " + data.value)
        })
    checkOffScreen(this);

    this.flashRect(index)
  };

  /**
   * Highlight barplot rectangle if NOT in leadLag mode
   * @param index The index value of the barplot rectangle being modified
   */
  flashRect(index: number): void {
    // @ts-ignore
    if (document.getElementById("leadLag").checked) return;
    
    let currectRect = this.getRectByIndex(index)
    let myCol = currectRect.attr("fill")

    currectRect
      .call(resetTween, 100, "fill", setAlpha(myCol, 1), setAlpha(myCol, .7))
  }

  getRectByIndex(index: number): d3.Selection<any, any, any, any> {
    return d3.select(this.canvas.selectAll("rect.bar")._groups[0][index])
  }

  onMouseMove() {
    assertType(this, Barplot);
    this.tooltip
      // @ts-ignore
      .style("left", (d3.event.pageX + 10) + "px")
      // @ts-ignore
      .style("top", (d3.event.pageY) + "px")

    checkOffScreen(this);
  }



  onMouseOut() {
    assertType(this, Barplot);
    this.tooltip.transition()
        .duration(200)
        .style("opacity", 0)
  }



/* @updatePlot(svg, data)
  - run on marker click, resizes rectangle/circle attributes according to data
*/
  updatePlot(canvas, dataArray) {
    this.dataArray = dataArray
    var widthScale = this.getWidthScale();
    var colour = this.getColour();

    // @ts-ignore
    if (!document.getElementById("leadLag").checked) {
      canvas.selectAll("rect.bar")
        .data(this.dataArray)
          .each(function(d, i) {
            d3.select(this).call(attrTween, 800, "width", widthScale(d.value));
            d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          })
    };

    canvas.selectAll("rect.leadLag")
      .data(this.dataArray)
        .each(function(d, i) {
          var widthFactor = Number(d3.select(this).attr("widthFactor"));
          var xPos = widthScale(d.value) * (1 - widthFactor);
          d3.select(this).call(attrTween, 800, "x", xPos);
          // @ts-ignore
          if (document.getElementById("leadLag").checked) {
            d3.select(this).call(attrTween, 800, "fill", colour(d.value));
          };
        })
  };



  resize() {
    this.width = ($(window).width()*panelWidth);
    this.height = ($(window).height()-50) - this.margin.top - this.margin.bottom;

    var widthScale = this.getWidthScale();

    // update .rect width based on if leadLag mode is toggled
    // @ts-ignore
    if (document.getElementById("leadLag").checked) {
      this.canvas.selectAll("rect.bar")
        .attr("width", function() {
          var rtn = Number(d3.select(this).attr("max"));
          rtn -= Number(d3.select(this).attr("min"));
          return widthScale(rtn);
        })
    } else {
      this.canvas.selectAll("rect.bar")
        .call(this.getAttr, this, ["width"])
    };

    // update .rect height (same regardless of leadLag toggle)
    this.canvas.selectAll("rect.bar")
      .call(this.getAttr, this, ["height", "y"])

    this.canvas.selectAll("rect.leadLag")
      .call(this.getAttr, this, ["y", "height"])
      .attr("width", function() {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        return this.width * widthFactor;
      })
      .attr("x", function(d) {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        return widthScale(d.value) * (1 - widthFactor);
      });

    this.canvas.selectAll("g.x.axis")
      .call(this.getXAxis, this)

    this.canvas.selectAll("g.y.axis")
      .call(this.getYAxis, this)

    this.svg
      .call(this.getSvgSize, this)
  };
};
  
  
  
export function setAlpha(c, v) {
  c = d3.rgb(c);
  c.opacity = v;

  return c;
}
  
  
  
export function attrTween(path, duration, attr, endRes) {
  var dummy = {}  as unknown as d3.BaseType;
  // var colour = this.getColour();
  d3.select(dummy)
  .transition()
  .duration(duration)
  .tween(attr, function() {
    if (path.empty()) return
    var lerp = d3.interpolate(path.attr(attr), endRes);
    return function(t) {
      path.attr(attr, lerp(t));
    };
  })
}
  
  
  
function resetTween(path, duration, attr, endRes, peakRes) {
  var dummy = {}  as unknown as d3.BaseType;
  // var colour = this.getColour();

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
  
  
  
function checkOffScreen(barplot: Barplot) {
  assertType(barplot, Barplot);
  // @ts-ignore
  var tooltipHtml = barplot.tooltip._groups[0][0]
  // @ts-ignore
  var svgHtml = d3.select(barplot.canvas)._groups[0][0]._groups[0][0];
  var absBottom = $(svgHtml).offset().top + parseInt(barplot.svg.style("height"));
  var absToolBottom = $(tooltipHtml).offset().top + parseInt(barplot.tooltip.style("height"));

  //check if tooltip offscreen
  try {
    // @ts-ignore
    var offScreenDiff = $(window).height() - event.clientY - parseInt(barplot.tooltip.style("height"))
    if (offScreenDiff < 0) {
      barplot.tooltip
        .style("top", parseInt(barplot.tooltip.style("top")) + offScreenDiff + "px");
      return;
    }
  } catch(error) {
    console.log(error);
  }

  //check if tooltip outside barplot svg offscreen
  if (absToolBottom > absBottom) {
    barplot.tooltip
      .style("top", absBottom - parseInt(barplot.tooltip.style("height")) + "px");
    return
  };
};