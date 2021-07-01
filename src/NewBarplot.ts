// @ts-expect-error
import d3 = require("d3");
import { Svg } from "./Svg";
import { assert } from "./utils";
import { Margin } from "./Margin.js";

export class NewBarplot {
  private parentId: string;
  private margin: Margin;
  private svg: Svg;
  private rect: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  constructor(parentId: string, { margin = new Margin(10, 10, 10, 10) } = {}) {
    assert(parentId.charAt(0) === "#");
    this.parentId = parentId;
    this.margin = margin;
    this.svg = new Svg(this.parentId);

    this.rect = this.svg.svg
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", this.width)
      .attr("height", this.height);
  }

  get height(): number {
    return this.svg.clientRect.height - (this.margin.top + this.margin.bottom);
  }
  
  get width(): number {
    return this.svg.clientRect.width - (this.margin.left + this.margin.right);
  }

  resize() {
    console.log(this.svg.clientRect);
    this.rect
      .attr("width", this.svg.clientRect.width - 20)
      .attr("height", this.svg.clientRect.height - 20);

    this.svg.resize();
  }
}
