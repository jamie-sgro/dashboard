// @ts-expect-error
import d3 = require("d3");

class Point {
  x: number;
  y: number;
}

export class Tooltip {
  d3Element: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  private transitionDuration = 200;

  constructor() {
    this.d3Element = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  get top(): number {
    return this.getStyle("top");
  }

  private getStyle(styleName: string): number {
    return parseInt(this.d3Element.style(styleName));
  }

  get left(): number {
    return this.getStyle("left");
  }

  get bottom(): number {
    return this.top + this.height;
  }

  get height(): number {
    return this.getStyle("height");
  }

  get width(): number {
    return this.getStyle("width");
  }

  get padding(): number {
    return this.getStyle("padding");
  }

  set text(aString: string) {
    this.d3Element.html(aString);
  }

  set x(x: number) {
    this.d3Element.style("left", x + "px");
  }

  set y(y: number) {
    this.d3Element.style("top", y + "px");
  }

  setTextAfterDelay(aString: string) {
    this.d3Element
      .transition()
      .delay(2000)
      .on("end", function () {
        d3.select(this).html(aString);
      });
  }

  fadeIn(): void {
    this.d3Element
      .transition()
      .duration(this.transitionDuration)
      .style("opacity", 1);
  }

  fadeOut(): void {
    this.d3Element
      .transition()
      .duration(this.transitionDuration)
      .style("opacity", 0);
  }

  setPosition(aPoint: Point) {
    this.x = aPoint.x;
    this.y = aPoint.y;
  }
}
