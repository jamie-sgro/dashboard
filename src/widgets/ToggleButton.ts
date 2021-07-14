import { Widget } from "./Widget";

/** Button that acts as a switch with on/off properties */
export class ToggleButton extends Widget {
  private htmlId: string;
  private text: string;
  private onClick: Function;
  private view: HTMLButtonElement;

  constructor(
    htmlId: string,
    onClick: Function,
    { parentId = undefined, text = "Click Me!" } = {}
  ) {
    super(parentId);
    this.htmlId = htmlId;
    this.onClick = onClick;
    this.text = text;
    this.view = this.initView();
  }

  protected initView(): HTMLButtonElement {
    let elem = document.createElement("button");
    elem.style.margin = "10px 0px";
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
}
