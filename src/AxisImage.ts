import { Barplot } from "./barplot";
import { imageDirectory } from "./data";

export class AxisImage {
  /** Adds a new image to the x-axis
   * Note: On resize, currently computationally epxensive to
   * delete and append images so rapidly
   */
  static update(barplot: Barplot) {
    this.clear(barplot);
    const imageSize = this.getSize(barplot);
    this.add(barplot, imageSize);
  }

  private static clear(barplot: Barplot) {
    barplot.canvas.select(".y.axis").selectAll("text").remove();
    barplot.canvas.select(".y.axis").selectAll(".image").remove();
  }

  private static getSize(barplot: Barplot) {
    const barWidth = barplot.getHeightScale().bandwidth();
    return Math.min(barplot.margin.left, barWidth);
  }

  private static add(barplot: Barplot, size: number) {
    barplot.canvas
      .select(".y.axis")
      .selectAll(".tick")
      .append("svg:image")
      .attr("class", "y axis image")
      .attr("xlink:href", function (d) {
        return imageDirectory[d];
      })
      .attr("width", size - 8)
      .attr("height", size - 8)
      .attr("x", -(size))
      .attr("y", -((size - 8) / 2));
  }
}
