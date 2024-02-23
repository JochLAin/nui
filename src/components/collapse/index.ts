import { HTMLNuiCaretElement } from "@nui/caret";
import { HTMLNuiElement, element, property } from "@nui-tools/decorators";
import { createTemplate } from "@nui-tools/helpers";
import styles from "./index.scss";

const TEMPLATE = createTemplate(`
<style>${styles}</style>
<details part="details wrapper">
  <summary part="summary toggle label">
    <slot name="toggle"></slot>
  </summary>
  <div class="container" part="container">
    <div class="content" part="content">
      <slot name="content">
        <slot></slot>
      </slot>
    </div>
  </div>
</details>
`);

@element('nui-collapse')
export class HTMLNuiCollapseElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  #container: HTMLDivElement;
  #details: HTMLDetailsElement;
  #summary: HTMLElement;

  @property()
  set open(value: boolean|null) {
    this.#details.open = !!value || false;

    const caret = this.shadowRoot.querySelector<HTMLSlotElement>('slot[name="toggle"]')!.assignedNodes({ flatten: true }).find((node) => node instanceof HTMLNuiCaretElement);
    if (caret instanceof HTMLNuiCaretElement) {
      caret.open = this.#details.open;
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this.#details = this.shadowRoot.querySelector('details')!;
    this.#summary = this.shadowRoot.querySelector('summary')!;
    this.#container = this.shadowRoot.querySelector('.container')!;
  }

  initializedCallback() {
    this.open = this.open;
    this.#details.addEventListener('toggle', this.#onToggle);
  }

  connectedCallback() {
    this.#summary.addEventListener('click', this.#onAnimateCollapse);
  }

  disconnectedCallback() {
    this.#summary.removeEventListener('click', this.#onAnimateCollapse);
  }

  #onAnimateCollapse = (evt: Event) => {
    if (this.#details.classList.contains('animated')) {
      this.#details.classList.remove('animated', 'collapsing');
      void this.#summary.offsetWidth;
      return;
    }

    requestAnimationFrame(() => this.#details.classList.add('animated'));
    this.#container.addEventListener('animationend', () => {
      this.#details.classList.remove('animated');
    }, { once: true });

    if (this.#details.open) {
      evt.preventDefault();
      this.#details.classList.add('collapsing');
      this.#container.addEventListener('animationend', () => {
        this.#details.classList.remove('collapsing');
        this.#details.open = false;
      }, { once: true });
    }
  };

  #onToggle = () => {
    this.open = this.#details.open || null;
    this.dispatchEvent(new Event('nui-collapse::toggle'));
  };
}
