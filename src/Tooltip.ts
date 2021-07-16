// @ts-expect-error
import d3 = require("d3");
import { assert } from "./utils";

class Point {
  x: number;
  y: number;
}

export class Tooltip {
  private d3Element: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  private transitionDuration = 200;

  constructor() {
    this.d3Element = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  private getStyle(styleName: string): number {
    return parseInt(this.d3Element.style(styleName));
  }

  private setStyle(styleName: string, aNumber: number) {
    this.d3Element.style(styleName, aNumber + "px");
  }

  get top(): number {
    return this.getStyle("top");
  }

  set top(y: number) {
    this.setStyle("top", y);
  }

  get left(): number {
    return this.getStyle("left");
  }

  set left(x: number) {
    this.setStyle("left", x);
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

  setTextAfterDelay(aString: string, delayInMilliseconds: number) {
    this.d3Element
      .transition()
      .delay(delayInMilliseconds)
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
    this.left = aPoint.x;
    this.top = aPoint.y;
  }

  repositionTooltipIfOffscreen(svgBottom: number) {
    this.resizeHeightIfOffscreen();
    this.resizeHeightIfSpilledOverSvg(svgBottom);
    this.resizeWidthIfOffScreen();
  }

  private resizeHeightIfOffscreen() {
    const pixelsToBottomOfWindowPosition =
      $(window).height() + $(window).scrollTop();
    const offScreenDiff = pixelsToBottomOfWindowPosition - this.bottom;

    assert(!isNaN(offScreenDiff), "Variable is NaN");
    if (offScreenDiff < 0) {
      this.top += offScreenDiff;
    }
  }

  private resizeHeightIfSpilledOverSvg(svgBottom: number) {
    if (this.bottom > svgBottom) {
      this.top = svgBottom - this.height;
    }
  }

  private resizeWidthIfOffScreen() {
    const horizontalPadding = 2 * this.padding;
    const offScreenDiff =
      $(window).width() - this.left - this.width - horizontalPadding;

    assert(!isNaN(offScreenDiff), "Variable is NaN");
    if (offScreenDiff < 0) {
      this.left += offScreenDiff;
    }
  }
}
