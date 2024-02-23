import { decorateClass } from "../utils";
import { ElementInstance } from "../classes/element";
import { HTMLFieldElement, HTMLNuiFormState, InputPartialClass, InputClass, InputInstance } from "../classes/input";
import { ElementOpts, element } from "./element";

export function input<T extends HTMLElement>(tag: string, opts?: ElementOpts<T>) {
  return function <E extends T>(targetClass: InputPartialClass<E>): InputClass<E> {
    return element<InputInstance<E>>(tag, {
      ...opts,
      properties: {
        floating: null,
        name: null,
        disabled: {
          set(element, value: boolean|null) {
            const field = element.shadowRoot.querySelector<HTMLFieldElement>('input, select, textarea')!;
            field.toggleAttribute('disabled', value || false);
          }
        },
        label: {
          set(element, value: string|null) {
            console.log(element, value);
            if (!value) {
              element.shadowRoot.querySelector('label')?.remove();
            } else {
              let label = element.shadowRoot.querySelector<HTMLLabelElement>('label');
              if (!label) {
                label = document.createElement('label');
                label.setAttribute('part', 'label');
                element.field.after(label);
              }
              label.textContent = value;
            }
          }
        },
        required: {
          set(element, value: boolean|null) {
            element.field.toggleAttribute('required', value || false);
          }
        },
        value: {
          set(element, value: string|null) {
            element.field.value = value || '';
            element.setValidity();
            element.setFormValue(value);
          }
        },
        ...opts?.properties,
      },
    })(decorateClass<InputClass<E>>(
      'DecoratedField',
      targetClass.name,
      // @ts-ignore mixin classes constructor arguments
      class extends targetClass implements ElementInstance<E>, InputInstance<E> {
        public static formAssociated = true;

        public readonly formInternals: ElementInternals;
        public readonly field!: HTMLFieldElement;
        public defaultValue: string = '';
        public disabled!: boolean|null;
        public value!: string|null;

        constructor() {
          super();
          this.formInternals = this.attachInternals();
          Object.defineProperty(this, 'validationMessage', { get: () => this.formInternals.validationMessage });
          Object.defineProperty(this, 'validity', { get: () => this.formInternals.validity });
        }

        public initializedCallback = () => {
          targetClass.prototype.initializedCallback?.call(this);
          this.setValidity();
        }

        public connectedCallback = () => {
          targetClass.prototype.connectedCallback?.call(this);
          this.defaultValue = this.field.value;
          this.setFormValue(this.field.value);
        }

        public attributeChangedCallback = (name: string, oldValue: string, newValue: string) => {
          targetClass.prototype.attributeChangedCallback?.call(this, name, oldValue, newValue);
          this.setValidity();
        }

        public checkValidity(): boolean {
          return this.formInternals.checkValidity();
        }

        public formDisabledCallback(disabled: boolean) {
          targetClass.prototype.formDisabledCallback?.call(this, disabled);
          this.disabled = disabled;
        }

        public formResetCallback() {
          targetClass.prototype.formResetCallback?.call(this);
          this.value = this.defaultValue;
        }

        public formStateRestoreCallback(state: HTMLNuiFormState|null, mode: 'autocomplete'|'restore') {
          targetClass.prototype.formStateRestoreCallback?.call(this, state, mode);
          if (state === null || typeof state === 'string') this.value = state;
        }

        public reportValidity(): void {
          this.formInternals.reportValidity();
        }

        public setFormValue(value: HTMLNuiFormState|null, state?: HTMLNuiFormState|null): void {
          this.formInternals.setFormValue(value, state);
        }

        public setValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void {
          this.formInternals.setValidity(flags || this.field.validity, message || this.field.validationMessage, anchor || this.field);
        }

        public willValidate(): boolean {
          return this.formInternals.willValidate;
        }
      }
    ));
  }
}
