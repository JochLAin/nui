import { HTMLNuiElement, attribute, element } from "@nui-tools";
import { HTMLNuiCaretElement } from "@nui/caret";
import styles from "./index.scss";

@element('nui-collapse', {
  parts: ['details wrapper', 'summary toggle label', 'container', 'content'],
  template: `
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
`,
  styles
})
export class HTMLNuiCollapseElement extends HTMLNuiElement {
  readonly shadowRoot!: ShadowRoot;
  #container!: HTMLDivElement;
  #details!: HTMLDetailsElement;
  #summary!: HTMLElement;

  @attribute()
  set open(value: boolean|null) {
    this.#details.open = !!value || false;

    const caret = this.shadowSlotQuerySelector<HTMLNuiCaretElement>('slot[name="toggle"]', 'nui-caret', { flatten: true });
    if (caret) caret.open = this.#details.open;
  }

  initializedCallback() {
    this.#details = this.shadowRoot.querySelector('details')!;
    this.#summary = this.shadowRoot.querySelector('summary')!;
    this.#container = this.shadowRoot.querySelector('.container')!;

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
