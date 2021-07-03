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

  get bottom(): number {
    const top =  parseInt(this.d3Element.style("top"));
    const height =  parseInt(this.d3Element.style("height"));
    return top + height
  }

  set text(aString: string) {
    this.d3Element.html(aString);
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
    this.d3Element
      // @ts-ignore
      .style("left", aPoint.x + "px")
      // @ts-ignore
      .style("top", aPoint.y + "px");
  }
}
