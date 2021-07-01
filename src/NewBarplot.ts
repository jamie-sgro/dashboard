// @ts-expect-error
import d3 = require("d3");
import { uuidv4, assert } from "./utils";

export class NewBarplot {
  private parentId: string;
  private htmlId: string;
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private rect: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  width: number;
  height: number;

  constructor(parentId: string) {
    assert(parentId.charAt(0) === "#");
    this.parentId = parentId;
    this.htmlId = uuidv4();
    this.svg = d3
      .select(this.parentId)
      .append("svg")
      .attr("id", this.htmlId)
      .call(this.getSvgSize, this);

    this.rect = this.svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", this.width)
      .attr("height", this.height);
  }

  private getSvgSize(path, obj) {
    let clientRect: ClientRect = d3
      .select(obj.parentId)
      .node()
      .getBoundingClientRect();
    obj.width = clientRect.width;
    obj.height = clientRect.height;

    // path.attr("width", obj.width).attr("height", obj.height);

    // $(`#${obj.htmlId}`).css({ left: $(window).width() });
  }

  resize() {
    this.svg.call(this.getSvgSize, this);
    console.log(d3
      .select(this.parentId)
      .node()
      .getBoundingClientRect())

    // this.rect.attr("width", this.width).attr("height", this.height);
  }
}
