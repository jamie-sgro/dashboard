// @ts-expect-error
import d3 = require("d3");

export class Tooltip {
  d3Element: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor() {
    this.d3Element = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }
}