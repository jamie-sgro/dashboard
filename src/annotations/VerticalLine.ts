// @ts-expect-error
import d3 = require("d3");

import { Barplot, colourBottom } from "../barplot";
import { assert } from "../utils";

export class VerticalLine {
  drawVerticalLineAtPostion(barplot: Barplot, xPosition: number) {
    d3.select("#verticalLine").remove();
    let xAxis = d3.select("g.x.axis");
    let xAxisTransform = this.parseTransform(xAxis.attr("transform"));
    let yPositionOfXAxis = xAxisTransform[1];

    let widthScale = barplot.getWidthScale();
    let x = widthScale(xPosition);
    barplot.canvas
      .append("line")
      .attr("id", "verticalLine")
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", yPositionOfXAxis)
      .attr("stroke-width", 2)
      .attr("stroke", colourBottom);
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
