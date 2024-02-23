import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import { HTMLNuiBranchElement } from "./branch";
import { HTMLNuiLeafElement } from "./leaf";
import styles from "./tree.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<nui-leaf exportparts="content:label, content:leaf">
    <slot></slot>
</nui-leaf>
<nui-branch exportparts="toggle:label, toggle:toggle, toggle:branch, content:children">
  <slot name="toggle" slot="toggle">
    <slot></slot>
  </slot>
  <slot name="branch" slot="content"></slot>
</nui-branch>
`);

@element('nui-tree', styles)
export class HTMLNuiTreeElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  readonly #branch!: HTMLNuiBranchElement;
  readonly #leaf!: HTMLNuiLeafElement;

  #children: HTMLNuiTreeElement[] = [];
  #parent: HTMLNuiTreeElement|null = null;
  #root!: HTMLNuiTreeElement;

  @property()
  shallow!: boolean|null;

  @property()
  type!: string|null;

  @property()
  set open(value: boolean|null) {
    this.#branch.open = value;
    this.dispatchEvent(new Event('nui-tree::toggle'));
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(TEMPLATE.content.cloneNode(true));
    this.#leaf = this.shadowRoot.querySelector('nui-leaf')!;
    customElements.upgrade(this.#leaf);
    this.#branch = this.shadowRoot.querySelector('nui-branch')!;
    customElements.upgrade(this.#branch);
  }

  initializedCallback() {
    this.#branch.open = this.open;
    this.#branch.addEventListener('nui-branch::toggle', () => {
      this.open = this.#branch.open || null;
      this.dispatchEvent(new Event('nui-tree::toggle'));
    });

    if (null === this.getAttribute('slot')) {
      this.setAttribute('slot', 'branch');
    }

    (new MutationObserver(() => {
      this.#onChangeChildren();
    })).observe(this, {
      childList: true,
    });
  }

  connectedCallback() {
    this.#onChangeParent();
    this.#onChangeChildren();
  }

  adoptedCallback() {
    this.#onChangeParent();
  }

  disconnectedCallback() {
    this.#onChangeParent();
    this.#onChangeChildren();
  }

  getAncestors(): HTMLNuiTreeElement[] {
    const parent = this.getParent();
    if (!parent) return [];
    return [parent, ...parent.getAncestors()];
  }

  getChildren(): HTMLNuiTreeElement[] {
    return this.#children;
  }

  getForks(): HTMLNuiTreeElement[] {
    return this.getSuccessors().filter((child) => {
      return !child.shadowRoot?.querySelector('::part(leaf)');
    });
  }

  getLeaves(): HTMLNuiTreeElement[] {
    return this.getSuccessors().filter((child) => {
      return child.shadowRoot?.querySelector('::part(leaf)');
    });
  }

  getNeighbours(): HTMLNuiTreeElement[] {
    const neighbours = Array.from(this.#children);
    if (this.#parent) neighbours.unshift(this.#parent);
    return neighbours;
  }

  getParent(): HTMLNuiTreeElement|null {
    return this.#parent;
  }

  getRoot(): HTMLNuiTreeElement {
    return this.#root;
  }

  getSiblings(): HTMLNuiTreeElement[] {
    if (!this.#parent) return [];
    return this.#parent.getChildren();
  }

  getSubtree(): HTMLNuiTreeElement[] {
    return [this, ...this.#children];
  }

  getSuccessors(): HTMLNuiTreeElement[] {
    const successors: HTMLNuiTreeElement[] = [];
    for (let idx = 0; idx < this.#children.length; idx++) {
      const child = this.#children[idx];
      successors.push(child, ...child.getSuccessors());
    }
    return successors;
  }

  getTree(): HTMLNuiTreeElement[] {
    return [this, ...this.getSuccessors()];
  }

  #onChangeChildren = () => {
    this.#children = this.#retrieveChildren();
    if (this.#children.length) {
      this.shadowRoot.insertBefore(this.#branch, this.#leaf);
    } else if (!this.#children.length) {
      this.shadowRoot.insertBefore(this.#leaf, this.#branch);
    }
  };

  #onChangeParent = () => {
    this.#parent = this.#retrieveParent();
    this.#root = this.#retrieveRoot();
    this.#branch.exportPartList.toggle('toggle', 'root', !this.#parent);
    this.#leaf.exportPartList.toggle('toggle', 'root', !this.#parent);
  };

  #retrieveChildren(): HTMLNuiTreeElement[] {
    return Array.from(this.children).filter((child) => {
      return child.matches('nui-tree');
    }).map((child) => {
      customElements.upgrade(child);
      return child;
    }) as HTMLNuiTreeElement[];
  }

  #retrieveParent(): HTMLNuiTreeElement|null {
    const parent = this.parentElement?.closest('nui-tree') || null;
    if (parent) customElements.upgrade(parent);
    return parent;
  }

  #retrieveRoot(): HTMLNuiTreeElement {
    let root: HTMLNuiTreeElement = this;
    while(true) {
      const parent = root.getParent();
      if (!parent) break;
      else root = parent;
    }
    return root;
  }
}
