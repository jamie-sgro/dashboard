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
      .attr("width", this.width)
      .attr("height", this.height);
  }

  get width(): number {
    return this.clientRect.width;
  }

  get height(): number {
    return this.clientRect.height;
  }

  get top(): number {
    return $(this.parentId).offset().top + this.bottomPadding
  }

  get bottom(): number {
    return this.top + this.height;
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
      .attr("width", this.width)
      .attr("height", this.height - this.bottomPadding);
  }
}
