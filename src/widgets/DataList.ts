import { uuidv4 } from "../utils";

export interface DataListModel {
  id: number;
  value: string;
}

export class DataList {
  private htmlId: string;
  private parentId: string;
  private listAttr: string;
  private data: DataListModel[];
  private onClick: Function;
  private view: HTMLInputElement;

  constructor(
    htmlId: string,
    data: DataListModel[],
    onClick: Function,
    { parentId = undefined } = {}
  ) {
    this.htmlId = htmlId;
    this.parentId = parentId;
    this.listAttr = uuidv4();
    this.data = data;
    this.onClick = onClick;
    this.view = this.initView();
  }

  private initView(): HTMLInputElement {
    let elem = this.createInput();
    this.fillDataList();
    return elem;
  }

  private createInput() {
    let elem = document.createElement("input");
    elem.id = this.htmlId;
    elem.setAttribute("list", this.listAttr);
    elem.oninput = (e) => {
      // @ts-expect-error
      let userInput = e.target.value;
      this.convertInputToIndexAndProcessClick(userInput);
    };
    this.appendToParent(elem);
    return elem;
  }

  convertInputToIndexAndProcessClick(userInput: string) {
    let values = this.data.map((d) => d.value);
    let id = values.indexOf(userInput);
    if (id === -1) return;
    this.onClick(id);
    this.setUserInput("");
  }

  private appendToParent(elem: HTMLInputElement) {
    typeof this.parentId === "undefined"
      ? document.body.appendChild(elem)
      : document.getElementById(this.parentId).appendChild(elem);
  }

  private setUserInput(aString: string) {
    // @ts-expect-error
    document.getElementById(this.htmlId).value = "";
  }

  private fillDataList() {
    let datalist = this.createDataList();
    this.data.forEach((d) => this.addSingleOption(datalist, d.value));
  }

  private createDataList(): HTMLDataListElement {
    let elem = document.getElementById(this.htmlId);
    let datalist = document.createElement("datalist");
    datalist.id = this.listAttr;
    elem.appendChild(datalist);
    return datalist;
  }

  private addSingleOption(datalist: HTMLDataListElement, aString: string) {
    let option = document.createElement("option");
    option.value = aString;
    datalist.appendChild(option);
  }
}
