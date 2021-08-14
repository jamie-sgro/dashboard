// @ts-expect-error
import d3 = require("d3");

import { Barplot, colourBottom } from "../barplot.js";
import { assert, uuidv4 } from "../utils.js";

export class VerticalLine {
  parent: Barplot;
  xPosition: number;
  private htmlId: string;
  g: d3.Selection<any, unknown, HTMLElement, any>;
  line: d3.Selection<any, unknown, HTMLElement, any>;
  text?: string;
  colour?: string;
  textElem: d3.Selection<any, unknown, HTMLElement, any>;

  constructor(
    parent: Barplot,
    xPosition: number,
    { text = undefined, colour = undefined } = {}
  ) {
    this.parent = parent;
    this.xPosition = xPosition;
    this.htmlId = uuidv4();
    this.text = text;
    this.colour = colour ?? "black";
    this.line = this.drawVerticalLineAtPostion();
  }

  private drawVerticalLineAtPostion(): d3.Selection<
    any,
    unknown,
    HTMLElement,
    any
  > {
    this.g = this.parent.canvas.append("g");
    this.line = this.g
      .append("line")
      .attr("class", "verticalLine")
      .attr("id", this.htmlId)
      .attr("stroke-width", 2)
      .attr("stroke", this.colour);

    if (this.text != undefined) {
      this.textElem = this.g
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", 10)
        .style("font", "sans-serif")
        .text(this.text);
    }

    this.update();
    return this.line;
  }

  update() {
    let xAxis = d3.select("g.x.axis");
    let xAxisTransform = this.parseTransform(xAxis.attr("transform"));
    let yPositionOfXAxis = xAxisTransform[1];

    let widthScale = this.parent.getWidthScale();
    let x = widthScale(this.xPosition);
    this.line
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", yPositionOfXAxis + 6);

    if (this.text != undefined) {
      this.textElem.attr("x", x).attr("y", yPositionOfXAxis + 18);
    }
  }

  /**
   * Parse the string from *.attr("transform") into a 2-length array
   * @param aTransform A string with the general format: "translate(12.34,56.78)"
   * @returns Array of length==2.
   * Zeroth index indicates translation along the x-axis
   * First index indicates translation along the y-axis
   */
  private parseTransform(aTransform: string): number[] {
    let stringTranslate = aTransform
      .substring(aTransform.indexOf("(") + 1, aTransform.indexOf(")"))
      .split(",");
    assert(stringTranslate.length == 2);
    let numberTranslate = stringTranslate.map((x) => parseFloat(x));
    return numberTranslate;
  }
}
