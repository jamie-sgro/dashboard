export interface DataListModel {
  id: number;
  value: string;
}

export class DataList {
  htmlId: string;
  listAttr: string;
  data: DataListModel[];
  onClick: Function;
  view: HTMLInputElement;

  constructor(htmlId: string, data: DataListModel[], onClick: Function) {
    this.htmlId = htmlId;
    this.listAttr = this.uuidv4();
    this.data = data;
    this.onClick = onClick;
    this.view = this.initView();
  }

  private uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
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
    document.body.appendChild(elem);
    return elem;
  }
  
  convertInputToIndexAndProcessClick(userInput: string) {
    let values = this.data.map((d) => d.value);
    let id = values.indexOf(userInput);
    if (id === -1) return;
    this.onClick(id);
    this.setUserInput("")
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
