export class DataList {
  htmlId: string;
  listAttr: string;
  data: string[];
  view: HTMLInputElement;

  constructor(htmlId: string, data: string[]) {
    this.htmlId = htmlId;
    this.listAttr = this.uuidv4();
    this.data = data;
    this.view = this.initView();
  }

  private initView(): HTMLInputElement {
    let elem = document.createElement("input");
    elem.id = this.htmlId;
    elem.setAttribute("list", this.listAttr);
    elem.oninput = (e) => {
      // @ts-expect-error
      console.log(e.target.value);
    };
    document.body.appendChild(elem);

    this.fillDataList()

    return elem;
  }

  private fillDataList() {
    let datalist = this.getDataList();
    this.data.forEach((d) => this.addSingleOption(datalist, d));
  }

  private getDataList(): HTMLDataListElement {
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

  private uuidv4(): string {
    // @ts-expect-error
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}