import { DataListModel } from "./DataListModel";
import { Widget } from "./Widget";

export class RadioButton extends Widget {
  private htmlId: string;
  private data: DataListModel[];
  private onClick: Function;
  private view: HTMLButtonElement[];

  constructor(
    htmlId: string,
    data: DataListModel[],
    onClick: Function,
    { parentId = undefined } = {}
  ) {
    super(parentId);
    this.data = data;
    this.onClick = onClick;
    this.htmlId = htmlId;
    this.view = this.initView();
  }

  protected initView(): HTMLInputElement[] {
    return this.data.map((d, i) => {
      let elem = this.addElem(i);
      let label = this.addLabel(d, i);
      this.addBrTag(label);
      return elem;
    });
  }

  private addElem(i: number) {
    let elem = document.createElement("input");
    elem.setAttribute("type", "radio");
    elem.setAttribute("name", this.htmlId);
    elem.setAttribute("id", this.htmlId + i);
    elem.onclick = () => {
      this.onClick(i);
    };
    document.getElementById(this.parentId).appendChild(elem);
    return elem;
  }

  private addLabel(d: DataListModel, i: number): HTMLLabelElement {
    let label = document.createElement("label");
    label.setAttribute("for", this.htmlId + i);
    label.innerHTML = d.value;
    return label;
  }

  private addBrTag(label: HTMLLabelElement): void {
    document.getElementById(this.parentId).appendChild(label);
    let brTag = document.createElement("br");
    document.getElementById(this.parentId).appendChild(brTag);
  }
}
