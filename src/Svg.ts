// @ts-expect-error
import d3 = require("d3");
import { assert, uuidv4 } from "./utils";

export class Svg {
  private bottomPadding = 10;
  private parentId: string;
  private htmlId: string;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  constructor(parentId: string) {
    assert(parentId.charAt(0) === "#");
    this.parentId = parentId;
    this.htmlId = uuidv4();

    this.svg = d3
      .select(this.parentId)
      .append("svg")
      .attr("id", this.htmlId)
      .attr("width", this.clientRect.width)
      .attr("height", this.clientRect.height);
  }

  get width() {
    return this.clientRect.width;
  }

  get height() {
    return this.clientRect.height;
  }

  private get clientRect(): ClientRect {
    return (
      d3
        .select(this.parentId)
        .node()
        // @ts-expect-error
        .getBoundingClientRect()
    );
  }

  resize() {
    this.svg
      .attr("width", this.clientRect.width)
      .attr("height", this.clientRect.height - this.bottomPadding);
  }
}
