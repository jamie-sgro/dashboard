export class City {
  name: string;
  id: number;
  onClick: Function;
  view: HTMLButtonElement;

  constructor(id: number, name: string, onClick: Function) {
    this.id = id;
    this.name = name;
    this.onClick = onClick;
    this.view = this.initView();
  }

  private initView(): HTMLButtonElement {
    let elem = document.createElement("button");
    elem.innerHTML = this.name;
    document.body.appendChild(elem);
    elem.onclick = () => {
      this.onClick(this.id);
    };
    return elem;
  }
}
