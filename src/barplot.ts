// @ts-expect-error
import d3 = require("d3");

import { DataPoint } from "./Data.js";
import { Margin } from "./Margin.js";
import { Svg } from "./Svg.js";
import { Tooltip } from "./Tooltip.js";
import { assert, assertType } from "./utils.js";

const scl = 15;
const colourBottom = "rgb(56, 94, 231)";
const colourTop = "rgb(34, 236, 87)";

export class Barplot {
  parentId: string;
  canvas: any;
  id: number;
  max: number;
  margin: Margin;
  width: number;
  height: number;
  svg: Svg;
  tooltip: Tooltip;
  dataArray: DataPoint[];

  constructor(
    parentId,
    width,
    height,
    { margin = new Margin(10, 10, 10, 10) } = {}
  ) {
    this.parentId = parentId;
    this.margin = margin;
    this.width = width;
    this.height = height - this.margin.top - this.margin.bottom;

    this.svg = new Svg(this.parentId);

    this.canvas = this.svg.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the div for the tooltip
    this.tooltip = new Tooltip();
  }

  static selectAttrAsNumber(obj: any, attr: string): number {
    return Number(d3.select(obj).attr(attr));
  }

  getColour() {
    let max = Number(
      d3.max(this.dataArray, (d: DataPoint) => {
        return d.value;
      })
    );
    return (
      d3
        .scaleLinear()
        .domain([0, max])
        // @ts-ignore
        .range([colourBottom, colourTop])
    );
  }

  getWidthScale() {
    return d3
      .scaleLinear()
      .domain([0, this.max]) // TODO: This .max should be inferred
      .range([0, this.width - this.margin.left - this.margin.right]);
  }

  getHeightScale() {
    return d3
      .scaleBand()
      .range([this.height, 0])
      .padding(0.1)
      .domain(
        this.dataArray.map(function (d) {
          return d.name;
        })
      );
  }

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
          path.attr("width", function (d) {
            return widthScale(d.value);
          });
          break;
        case "height":
          path.attr("height", heightScale.bandwidth());
          break;
        case "fill":
          path.attr("fill", function (d) {
            return colour(d.value);
          });
          break;
        case "fillTransparent":
          path.attr("fill", function (d) {
            const rtn = colour(d.value);
            return setAlpha(rtn, 0);
          });
          break;
        case "y":
          path.attr("y", function (d) {
            return heightScale(d.name);
          });
          break;
        case "cx":
          path.attr("cx", function (d) {
            return widthScale(d.value);
          });
          break;
        case "cy":
          path.attr("cy", function (d) {
            return heightScale(d.name);
          });
          break;
        case "r":
          path.attr("r", heightScale.bandwidth() / 2);
          break;
      }
    }
  }

  getXAxis(path, obj) {
    path
      .attr("transform", "translate(0," + obj.height + ")")
      .call(d3.axisBottom(obj.getWidthScale()));
  }

  getYAxis(path, obj: Barplot): void {
    path.call(d3.axisLeft(obj.getHeightScale()));
    obj.updateAxisImage(obj);
  }

  /** Adds a new image to the x-axis
   * Note: On resize, currently computationally epxensive to
   * delete and append images so rapidly
   */
  updateAxisImage(obj: Barplot): void {
    obj.canvas.select(".y.axis").selectAll("text").remove();
    obj.canvas.select(".y.axis").selectAll(".image").remove();
    const barWidth = obj.getHeightScale().bandwidth();
    let imageSize = Math.min(obj.margin.left, barWidth);

    obj.canvas
      .select(".y.axis")
      .selectAll(".tick")
      .append("svg:image")
      .attr("class", "y axis image")
      .attr("xlink:href", function (d) {
        return "public/images/axis-icons/sdg-11.1.1.png";
      })
      .attr("width", imageSize)
      .attr("height", imageSize)
      .attr("x", -imageSize)
      .attr("y", -(imageSize/2));
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
      this.canvas.selectAll("rect.leadLag").each(function (d, i) {
        d3.select(this).call(attrTween, 800, "fill", colour(d.value));
        d3.select(this).call(attrTween, 800, "stroke", "white");
      });

      this.canvas
        .selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", function () {
          let rtn = this.selectAttrAsString(this, "min");
          rtn = widthScale(rtn);
          return "translate(" + rtn + ", 0)";
        })
        .attr("width", function () {
          let rtn = this.selectAttrAsString(this, "max");
          rtn -= Number(d3.select(this).attr("min"));
          return widthScale(rtn);
        })
        .attr("fill", function () {
          let rtn = this.selectAttrAsString(this, "min");
          rtn += Number(d3.select(this).attr("max"));
          rtn /= 2;
          rtn = colour(rtn);
          rtn = setAlpha(rtn, 0.5);
          return rtn;
        })
        .attr("stroke", "black");
    } else {
      // turn leadLag marker invisible
      this.canvas.selectAll("rect.leadLag").each(function () {
        var myCol = d3.select(this).attr("fill");
        d3.select(this).call(attrTween, 800, "fill", setAlpha(myCol, 0));
        d3.select(this).call(attrTween, 800, "stroke", "rgba(0,0,0,0)");
      });

      this.canvas
        .selectAll("rect.bar")
        .transition()
        .duration(800)
        .attr("transform", "translate(0, 0)")
        .attr("stroke", "rgba(0,0,0,0)");

      // updateGraph(null, this)
    }
  }

  /** Ran once on screen load, instantiates every d3 elem in second panel
   */
  plot(dataArray: DataPoint[], min: number[], max: number[]): void {
    this.dataArray = dataArray;
    var widthScale = this.getWidthScale();

    this.canvas
      .selectAll("rect.bar")
      .data(this.dataArray)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("name", function (d) {
        d.name = d.name.split("|")[0];
        d.name = d.name;
        return d.name;
      })
      .attr("min", function (d, i) {
        return min[i];
      })
      .attr("max", function (d, i) {
        return max[i];
      })
      .attr("width", function (d) {
        return widthScale(0);
      })
      .call(this.getAttr, this, ["height", "fill", "y"])
      .attr("stroke", "rgba(0,0,0,0)")
      .style("cursor", "pointer")
      // .on("click", this.onClick)
      .on("mouseover", (d, i) => {
        this.onMouseover(d, i);
      })
      .on("mouseout", () => {
        this.onMouseOut();
      })
      .on("mousemove", () => {
        this.onMouseMove();
      });

    let width = this.width;
    // add markers for leadLag plot
    this.canvas
      .selectAll("rect.leadLag")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("class", "leadLag")
      .attr("widthFactor", 0.05)
      //invisible until first marker is selected
      .call(this.getAttr, this, ["x", "y", "height", "fillTransparent"])
      .attr("width", function () {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        return width * widthFactor;
      })
      .attr("stroke", "rgba(0,0,0,0)")
      .attr("pointer-events", "none");

    // add the x Axis
    this.canvas.append("g").attr("class", "x axis").call(this.getXAxis, this);

    // add the y Axis
    this.canvas.append("g").attr("class", "y axis").call(this.getYAxis, this);
  }

  /** Excplicitely cast `this` into a d3.BaseType
   * because d3 often co-opts the `this` keyword */
  get baseType() {
    return this as unknown as d3.BaseType;
  }

  onClick(data) {
    // change marker size based on data value
    var radiusScale = d3
      .scaleLinear()
      .domain([
        0,
        Number(
          d3.max(this.dataArray, function (d: DataPoint) {
            return d.value;
          })
        ),
      ])
      .range([scl / 2, scl * 2]);

    // @ts-ignore
    if (!document.getElementById("leadLag").checked) {
      var myCol = d3.select(this.baseType).attr("fill");

      d3.select(this.baseType).call(
        resetTween,
        100,
        "fill",
        setAlpha(myCol, 1),
        setAlpha(myCol, 0.4)
      );
    }
  }

  onMouseover(data: DataPoint, index: number) {
    assertType(this, Barplot);
    const initialText = data.name.split("|")[1];
    this.tooltip.text = initialText;
    this.tooltip.fadeIn();

    const newText = `${initialText} ${data.value}`;
    this.tooltip.setTextAfterDelay(newText);

    this.tooltip.repositionTooltipIfOffscreen(this.svg.bottom);

    this.flashRect(index);
  }

  /**
   * Highlight barplot rectangle if NOT in leadLag mode
   * @param index The index value of the barplot rectangle being modified
   */
  flashRect(index: number): void {
    // @ts-ignore
    if (document.getElementById("leadLag").checked) return;

    let currectRect = this.getRectByIndex(index);
    let myCol = currectRect.attr("fill");

    currectRect.call(
      resetTween,
      100,
      "fill",
      setAlpha(myCol, 1),
      setAlpha(myCol, 0.7)
    );
  }

  getRectByIndex(index: number): d3.Selection<any, any, any, any> {
    return d3.select(this.canvas.selectAll("rect.bar")._groups[0][index]);
  }

  onMouseMove() {
    assertType(this, Barplot);
    // @ts-ignore
    const x = d3.event.pageX + 10;
    // @ts-ignore
    const y = d3.event.pageY;
    this.tooltip.setPosition({ x: x, y: y });

    this.tooltip.repositionTooltipIfOffscreen(this.svg.bottom);
  }

  onMouseOut() {
    assertType(this, Barplot);
    this.tooltip.fadeOut();
  }

  /* @updatePlot(svg, data)
  - run on marker click, resizes rectangle/circle attributes according to data
*/
  updatePlot(dataArray) {
    this.dataArray = dataArray;
    var widthScale = this.getWidthScale();
    var colour = this.getColour();

    // @ts-ignore
    if (!document.getElementById("leadLag").checked) {
      this.canvas
        .selectAll("rect.bar")
        .data(this.dataArray)
        .each(function (d, i) {
          d3.select(this).call(attrTween, 800, "width", widthScale(d.value));
          d3.select(this).call(attrTween, 800, "fill", colour(d.value));
        });
    }

    this.canvas
      .selectAll("rect.leadLag")
      .data(this.dataArray)
      .each(function (d, i) {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        var xPos = widthScale(d.value) * (1 - widthFactor);
        d3.select(this).call(attrTween, 800, "x", xPos);
        // @ts-ignore
        if (document.getElementById("leadLag").checked) {
          d3.select(this).call(attrTween, 800, "fill", colour(d.value));
        }
      });
  }

  resize() {
    this.width = Number(
      d3.select(this.parentId).style("width").replace("px", "")
    );
    // this.width = ($(window).width()*panelWidth);
    this.height =
      $(window).height() - 50 - this.margin.top - this.margin.bottom;

    var widthScale = this.getWidthScale();

    // update .rect width based on if leadLag mode is toggled
    // @ts-ignore
    if (document.getElementById("leadLag").checked) {
      this.canvas.selectAll("rect.bar").attr("width", function () {
        var rtn = Number(d3.select(this).attr("max"));
        rtn -= Number(d3.select(this).attr("min"));
        return widthScale(rtn);
      });
    } else {
      this.canvas.selectAll("rect.bar").call(this.getAttr, this, ["width"]);
    }

    // update .rect height (same regardless of leadLag toggle)
    this.canvas.selectAll("rect.bar").call(this.getAttr, this, ["height", "y"]);

    this.canvas
      .selectAll("rect.leadLag")
      .call(this.getAttr, this, ["y", "height"])
      .attr("width", function () {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        return this.width * widthFactor;
      })
      .attr("x", function (d) {
        var widthFactor = Number(d3.select(this).attr("widthFactor"));
        return widthScale(d.value) * (1 - widthFactor);
      });

    this.canvas.selectAll("g.x.axis").call(this.getXAxis, this);

    this.canvas.selectAll("g.y.axis").call(this.getYAxis, this);

    this.svg.resize();

    this.tooltip.repositionTooltipIfOffscreen(this.svg.bottom);
  }
}

export function setAlpha(c, v) {
  c = d3.rgb(c);
  c.opacity = v;

  return c;
}

export function attrTween(path, duration, attr, endRes) {
  var dummy = {} as unknown as d3.BaseType;
  // var colour = this.getColour();
  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function () {
      if (path.empty()) return;
      var lerp = d3.interpolate(path.attr(attr), endRes);
      return function (t) {
        path.attr(attr, lerp(t));
      };
    });
}

function resetTween(path, duration, attr, endRes, peakRes) {
  var dummy = {} as unknown as d3.BaseType;
  // var colour = this.getColour();

  d3.select(dummy)
    .transition()
    .duration(duration)
    .tween(attr, function () {
      var lerp = d3.interpolate(path.attr(attr), peakRes);
      return function (t) {
        path.attr(attr, lerp(t));
      };
    })
    .transition()
    .duration(duration * 3)
    .tween(attr, function () {
      var lerp = d3.interpolate(peakRes, endRes);
      return function (t) {
        path.attr(attr, lerp(t));
      };
    });
}
