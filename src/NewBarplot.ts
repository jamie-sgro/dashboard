// @ts-expect-error
import d3 = require("d3");
import { uuidv4 } from "./utils";

export class NewBarplot {
  private parentId: string;
  private htmlId: string;
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  constructor(parentId) {
    this.parentId = parentId;
    this.htmlId = uuidv4();
    this.svg = d3
      .select(this.parentId)
      .append("svg")
      .attr("id", this.htmlId)
      .call(this.getSvgSize, this);
  }

  getSvgSize(path, obj) {
    // @ts-expect-error
    let clientRect: ClientRect = d3.select(`#${obj.parentId}`).node().getBoundingClientRect()
    let width = clientRect.width
    let height = clientRect.height

    path.attr("width", width).attr("height", height);

    // $(`#${obj.htmlId}`).css({ left: $(window).width() });
  }
}
