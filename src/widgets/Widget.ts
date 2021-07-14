export abstract class Widget {
  protected parentId: string;

  constructor(parentId: string) {
    this.parentId = parentId;
  }

  protected appendToParent(elem: HTMLElement): void {
    typeof this.parentId === "undefined"
      ? document.body.appendChild(elem)
      : document.getElementById(this.parentId).appendChild(elem);
  }

  protected abstract initView(): HTMLElement | HTMLElement[]
}
