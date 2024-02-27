import type { AttributeType, ClassDecorator, FieldType, Validation } from "@nui-tools";
import { callParentLifeCycle, getStaticValuesThroughPrototypes, getValidationList, renameClass } from "@nui-tools";
import { attribute, debug } from "@nui-tools/decorator";

// export type FieldMinimal = FieldInterface & {
//   value: AttributeType|null;
// }
//
// export type FieldType = HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|FieldMinimal;
// export type FormState = AttributeType|File|FormData;
//
// export type FieldConstructor<I extends HTMLElement = HTMLElement> = {
//   new(...args: any[]): FieldInterface & I,
//   formAssociated: boolean,
//   prototype: FieldInterface & I,
//   validationList: Validation[],
// }
//
// export interface FieldInterface extends HTMLElement {
//   disabled: boolean|null;
//   required: boolean|null;
//   name: string|null;
//   validationMessage: string;
//   validity: ValidityState;
//
//   checkValidity(): boolean;
//   reportValidity(): void;
//   // setFormValue(value: FormState, state?: FormState): void;
//   setValidity(field: FieldType, flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
//   setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
//   setValidity(message?: string, anchor?: HTMLElement): void;
//   willValidate(): boolean;
// }

function buildValidationList<T extends typeof HTMLElement>(target: T): Validation[] {
  const attributes = getStaticValuesThroughPrototypes<Validation[]>(target, 'validationList');
  return attributes.reduce((accu, value) => [...accu, ...value], []);
}

function forwardDisabled(value: boolean|null, field: FieldType) {
  field.toggleAttribute('disabled', value || false);
}

function forwardName(value: string|null, field: FieldType) {
  if (value) field.setAttribute('name', value);
  else field.removeAttribute('name');
}

function forwardRequired(value: boolean|null, field: FieldType) {
  field.toggleAttribute('required', value || false);
}

export function field<T extends typeof HTMLElement = typeof HTMLElement>(): ClassDecorator<T> {
  return function decorate<C extends T>(targetClass: C) {
    // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
    class MixinField extends targetClass implements FieldInterface {
      // static readonly formAssociated = true;
      static readonly validationList = buildValidationList(targetClass);

      // @attribute()
      // set disabled(value: boolean|null) {
      //   if (!this.field) return;
      //   forwardDisabled(value, this.field);
      // }
      //
      // @attribute()
      // set required(value: boolean|null) {
      //   if (!this.field) return;
      //   forwardRequired(value, this.field);
      // }
      //
      // @attribute()
      // set name(value: string|null) {
      //   if (!this.field) return;
      //   forwardName(value, this.field);
      // }
      //
      // readonly internals: ElementInternals;
      // field?: FieldType;
      //
      // constructor(...args: ConstructorParameters<typeof targetClass>) {
      //   // @ts-ignore mixin classes constructor arguments tuple not work with ConstructorParameters<Constructor>
      //   super(...args);
      //   this.internals = this.attachInternals();
      // }
      //
      // connectedCallback() {
      //   callParentLifeCycle(targetClass, this, 'connectedCallback');
      //   if (!this.field) return;
      //   this.setFormValue(this.field);
      //   this.setValidity(this.field);
      // }
      //
      // attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      //   callParentLifeCycle(targetClass, this, 'attributeChangedCallback', name, oldValue, newValue);
      //   if (!this.field) return;
      //   this.setValidity(this.field);
      // }
      //
      // checkValidity() {
      //   return this.internals.checkValidity();
      // }
      //
      // reportValidity() {
      //   this.internals.reportValidity();
      // }
      //
      // setValidity(field: FieldType, flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
      // setValidity(flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
      // setValidity(message: string, anchor?: HTMLElement): void;
      // setValidity(arg1: string|FieldType|ValidityStateFlags, arg2?: string|HTMLElement|ValidityStateFlags, arg3?: string|HTMLElement, arg4?: HTMLElement) {
      //   const callStaticValidation = (anchor?: HTMLElement, field?: FieldType): true|void => {
      //     const validationList = getValidationList(this.constructor as C);
      //     for (let idx = 0; idx < validationList.length; idx++) {
      //       const result = validationList[idx].call(this, field);
      //       if (typeof result === 'string') {
      //         this.internals.setValidity({ customError: true }, result, anchor);
      //         return true;
      //       } else if (result) {
      //         this.internals.setValidity(...result);
      //         return true;
      //       }
      //     }
      //   }
      //
      //   if (typeof arg1 === 'string') {
      //     if (arg2 !== undefined && !(arg2 instanceof HTMLElement)) throw new Error('Anchor must be an HTMLElement');
      //     this.internals.setValidity({ customError: true }, arg1, arg2);
      //     return;
      //   }
      //
      //   if (arg1 instanceof HTMLElement) {
      //     if (arg2 !== undefined && typeof arg2 !== 'object') throw new Error('Validity flags must be an object');
      //     if (arg2 instanceof HTMLElement) throw new Error('Validity flags cannot be an HTMLElement');
      //     if (arg3 !== undefined && typeof arg3 !== 'string') throw new Error('Validation message must be a string');
      //     if (callStaticValidation(arg4 || arg1, arg1)) return;
      //     this.internals.setValidity(arg2 || arg1.validity, arg3 || arg1.validationMessage, arg4 || arg1);
      //     return;
      //   }
      //
      //   if (arg2 !== undefined && typeof arg2 !== 'object') throw new Error('Validity flags must be an object');
      //   if (arg2 instanceof HTMLElement) throw new Error('Validity flags cannot be an HTMLElement');
      //   if (arg3 !== undefined && typeof arg3 !== 'string') throw new Error('Validation message must be a string');
      //   if (callStaticValidation(arg4)) return;
      //   this.internals.setValidity(arg2 || this.validity, arg3 || this.validationMessage, arg4);
      // }
      //
      // willValidate() {
      //   return this.internals.willValidate;
      // }
      //
      // attachField(field?: FieldType): void {
      //   this.field = field;
      //   if (!field) return;
      //   this.#observe();
      // }
      //
      // setFormValue(value: FieldType|FormState, state?: null|string|File|FormData) {
      //   if (value instanceof HTMLElement) {
      //     if ('value' in value) value = value.value;
      //     else value = null;
      //   }
      //
      //   if (value === undefined) value = null;
      //   if (typeof value === 'boolean') value = value ? 1 : 0;
      //   if (typeof value === 'number') value = String(value);
      //   if (state === undefined) state = value;
      //   this.internals.setFormValue(value, state);
      // }
      //
      // #observe() {
      //   if (!this.field) return;
      //   forwardDisabled(this.disabled, this.field);
      //   forwardRequired(this.required, this.field);
      //   forwardName(this.name, this.field);
      //   this.setFormValue(this.field);
      //   this.setValidity(this.field);
      // }
      //
      // get validationMessage() {
      //   return this.internals.validationMessage;
      // }
      //
      // set validationMessage(message: string) {
      //   this.internals.setValidity({ customError: true }, message);
      // }
      //
      // get validity() {
      //   return this.internals.validity;
      // }
      //
      // get form() {
      //   return this.internals.form;
      // }
      //
      // get labels() {
      //   return this.internals.labels;
      // }
    }

    renameClass<C>(MixinField, { prefix: 'Field' });
    return MixinField;
  }
}
