// @ts-expect-error
import d3 = require("d3");

export class NewBarplot {
  parentId: string;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

  constructor(parentId) {
    this.parentId = parentId;
    this.svg = d3
      .select(this.parentId)
      .append("svg")
      .call(this.getSvgSize, this);
  }

  getSvgSize(path, obj) {
    path
      .attr("width", obj.width)
      .attr("height", obj.height);

    $(".barplot.svg").css({ left: $(window).width() });
  }
}
