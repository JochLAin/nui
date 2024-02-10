import { HTMLNuiCollapseElement } from "@nui/collapse";
import { element, property } from "@nui-tools/element";
import { TEMPLATE_BRANCH, TEMPLATE_LEAF } from "./lib/templates";

@element('nui-tree')
export class HTMLNuiTreeElement extends HTMLElement {
  readonly shadowRoot!: ShadowRoot;
  #children: HTMLNuiTreeElement[] = [];
  #collapse?: HTMLNuiCollapseElement;
  #parent: HTMLNuiTreeElement|null = null;
  #root: HTMLNuiTreeElement;
  @property()
  shallow!: boolean|null;
  @property()
  open!: boolean|null;
  @property()
  type!: string|null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.#root = this;
    this.#onChangeChild();
  }

  connectedCallback() {
    this.addEventListener('§§nui-tree::appended-child', this.#onChangeChild.bind(this));
    this.#onChangeParent();
    this.#parent?.dispatchEvent(new Event('§§nui-tree::appended-child'));
  }

  disconnectedCallback() {
    this.removeEventListener('§§nui-tree::appended-child', this.#onChangeChild.bind(this));
    this.#createLeaf();
  }

  adoptedCallback() {
    if ('nui-tree__branch' === this.getAttribute('slot')) {
      this.removeAttribute('slot');
    }
    this.#onChangeParent();
    this.#parent?.dispatchEvent(new Event('§§nui-tree::appended-child'));
  }

  getAncestors(): HTMLNuiTreeElement[] {
    const parent = this.getParent();
    if (!parent) return [];
    return [parent, ...parent.getAncestors()];
  }

  getBranches(): HTMLNuiTreeElement[] {
    return this.getSuccessors().filter((child) => {
      return !child.shadowRoot?.querySelector('::part(leaf)');
    });
  }

  getChildren(): HTMLNuiTreeElement[] {
    return this.#children;
  }

  getLeaves(): HTMLNuiTreeElement[] {
    return this.getSuccessors().filter((child) => {
      return child.shadowRoot?.querySelector('::part(leaf)');
    });
  }

  getParent(): HTMLNuiTreeElement|null {
    return this.#parent;
  }

  getRoot(): HTMLNuiTreeElement {
    return this.#root;
  }

  isRoot(): boolean {
    return this === this.#root;
  }

  getSuccessors(): HTMLNuiTreeElement[] {
    const successors: HTMLNuiTreeElement[] = [];
    for (let idx = 0; idx < this.#children.length; idx++) {
      const child = this.#children[idx];
      successors.push(child, ...child.getSuccessors());
    }
    return successors;
  }

  #createBranch() {
    if (!this.#collapse) {
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(TEMPLATE_BRANCH.content.cloneNode(true));

      this.#collapse = this.shadowRoot.querySelector<HTMLNuiCollapseElement>('nui-collapse')!;
      customElements.upgrade(this.#collapse);
      this.#collapse.shadowRoot!.querySelector<HTMLElement>('summary')!.part.add('nui-tree__content', 'nui-tree__toggle');
      this.#collapse.open = !!this.open;

      const offset = this.offset;
      if (null !== offset && undefined !== offset) {
        this.#collapse.style.setProperty('--nui-tree-offset', `${offset}px`);
      }

      this.#collapse.addEventListener('nui-collapse::toggle', () => {
        this.open = this.#collapse!.open || null;
        this.dispatchEvent(new Event('nui-tree::toggle'));
      });
    }

    if (parent) {
      this.#collapse.classList.remove('nui-tree__root');
      this.#container.classList.remove('nui-tree__root');
    } else {
      this.#collapse.classList.add('nui-tree__root');
      this.#container.classList.add('nui-tree__root');
    }

    if (!this.shallow) {
      this.#children.forEach((branch) => {
        if (!branch.hasAttribute('slot')) {
          branch.setAttribute('slot', 'nui-tree__branch');
        }
      });
    }
  }

  #createLeaf() {
    this.shadowRoot.innerHTML = '';
    this.#collapse = undefined;

    this.shadowRoot.appendChild(TEMPLATE_LEAF.content.cloneNode(true));
    if (this.#parent) {
      this.#container.classList.remove('nui-tree__root');
    } else {
      this.#container.classList.add('nui-tree__root');
    }

    if (!this.shallow) {
      this.getChildren().forEach((branch) => {
        if ('nui-tree__branch' === branch.getAttribute('slot')) {
          branch.removeAttribute('slot');
        }
      });
    }
  }

  #onChangeChild() {
    const children = Array.from(this.children).filter((child) => {
      return child.matches('nui-tree');
    }).map((child) => {
      customElements.upgrade(child);
      return child;
    }) as HTMLNuiTreeElement[];

    this.#children = children;
    if (children.length) {
      this.#createBranch();
    } else {
      this.#createLeaf();
    }
  }

  #onChangeParent() {
    const parent = this.parentElement?.closest('nui-tree') || null;
    if (parent) customElements.upgrade(parent);
    this.#parent = parent;

    let root: HTMLNuiTreeElement = this;
    while(true) {
      const parent = root.getParent();
      if (!parent) break;
      else root = parent;
    }
    this.#root = root;
  }

  @property()
  set offset(value: number|null) {
    if (null !== value) {
      this.#collapse?.style.setProperty('--nui-tree-offset', `${value}px`);
    }
  }

  get #container() {
    return this.shadowRoot.querySelector<HTMLElement>('::part(nui-tree__content)')!;
  }
}
