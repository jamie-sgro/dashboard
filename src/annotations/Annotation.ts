import { VerticalLine } from "./VerticalLine.js";

export class Annotation {
  verticalLines: VerticalLine[];

  constructor() {
    this.verticalLines = [];
  }

  update() {
    this.verticalLines.forEach(line => line.update());
  }
}
