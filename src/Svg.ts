// @ts-expect-error
import d3 = require("d3");
import { DataPoint } from "./data";
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
  
    get x() {
      return d3.scale.ordinal().rangeRoundBands([0, 200], .05);
    } 
  
    get y() {
      return d3.scale.linear().range([200, 0]);
    }

  plot() {
    let data: DataPoint[]
    data = [
      {name: "a", value: "1"},
      {name: "b", value: "2"},
    ]
    this.svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .attr("x", (d) => { return this.x(d.name); })
      .attr("y", (d) => { return this.y(d.value); })
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => { return this.height - this.y(d.value); })
  }

  resize() {
    this.svg
      .attr("width", this.clientRect.width)
      .attr("height", this.clientRect.height - this.bottomPadding)
  }
}
