import { HTMLNuiElement } from "./element";
import { ElementClass, ElementInstance, StaticElementClass } from "./element";

export type HTMLFieldElement = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement;
export type HTMLNuiFormState = string|File|FormData;

export type InputPartialInstance<T extends HTMLElement> = ElementInstance<T> & {
  disabled: boolean|null;
  field: HTMLFieldElement;
  floating: boolean|null;
  label: string|null;
  required: boolean|null;
  validity: ValidityState;
  validationMessage: string;
  value: string|null;

  formDisabledCallback?: (disabled: boolean) => void;
  formResetCallback?: () => void;
  formStateRestoreCallback?: (state: HTMLNuiFormState|null, mode: 'autocomplete'|'restore') => void;
};

export type InputPartialClass<T extends HTMLElement> = ElementClass<T> & {
  new (): InputPartialInstance<T>;
  prototype: InputPartialInstance<T>;
};

export type InputInstance<T extends HTMLElement = HTMLElement> = ElementInstance<T> & InputPartialInstance<T> & {
  checkValidity: () => boolean;
  reportValidity: () => void;
  setFormValue: (value: string|null|File|FormData, state?: string|null|File|FormData) => void;
  setValidity: () => void;
  willValidate: () => boolean;
};

export type StaticInputClass = StaticElementClass & {
  formAssociated: boolean;
};

export type InputClass<T extends HTMLElement = HTMLElement> = StaticInputClass & {
  new (): InputInstance<T>;
  prototype: InputInstance<T>;
};

export abstract class HTMLNuiFieldElement extends HTMLNuiElement implements InputInstance {
  abstract readonly field: HTMLFieldElement;
  public readonly shadowRoot!: ShadowRoot;
  public disabled!: boolean|null;
  public floating!: boolean|null;
  public label!: string|null;
  public name!: string|null;
  public required!: boolean|null;
  public validity!: ValidityState;
  public value!: string|null;
  public validationMessage!: string;

  public checkValidity!: () => boolean;
  public reportValidity!: () => void;
  public willValidate!: () => boolean;
  public setFormValue!: (value: string|null|File|FormData, state?: string|null|File|FormData) => void;
  public setValidity!: () => void;
}
