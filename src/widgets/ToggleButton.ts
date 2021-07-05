/** Button that acts as a switch with on/off properties */
export class ToggleButton {
  private htmlId: string;
  private parentId: string;
  private text: string;
  private onClick: Function;
  private view: HTMLButtonElement;

  constructor(
    htmlId: string,
    onClick: Function,
    { parentId = undefined, text = "Click Me!" } = {}
  ) {
    this.htmlId = htmlId;
    this.onClick = onClick;
    this.parentId = parentId;
    this.text = text;
    this.view = this.initView();
  }

  private initView(): HTMLButtonElement {
    let elem = document.createElement("button");
    elem.innerHTML = this.text;
    this.setOnClick(elem);
    this.appendToParent(elem);
    return elem;
  }

  private setOnClick(elem: HTMLButtonElement): void {
    elem.onclick = () => {
      this.toggleCss(elem);
      this.onClick();
    };
  }

  private toggleCss(elem: HTMLButtonElement): void {
    elem.classList.contains("primary")
      ? elem.classList.remove("primary")
      : elem.classList.add("primary");
  }

  private appendToParent(elem: HTMLButtonElement): void {
    typeof this.parentId === "undefined"
      ? document.body.appendChild(elem)
      : document.getElementById(this.parentId).appendChild(elem);
  }
}
