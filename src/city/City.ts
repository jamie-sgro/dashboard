import {markRad} from "../main"

export class City {
  view: HTMLButtonElement;

  constructor(name: string) {
    this.view = this.initView(name)
  }

  private initView(name: string): HTMLButtonElement {
    console.log(markRad)
    let elem = document.createElement("button");
    elem.innerHTML = name;
    document.body.appendChild(elem);
    elem.onclick = function () {
      console.log(name);
    };
    return elem;
  }
}
