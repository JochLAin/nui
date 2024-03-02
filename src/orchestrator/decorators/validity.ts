import type { ClassDecorator, HTMLElementClass, MethodDecorator, PropertyDescriptor } from "../utils";
import { setupMetadata } from "../utils";

export type Validation<E extends HTMLElement = HTMLElement, F extends HTMLElementValidator = HTMLElementValidator> = (this: E, field?: F) => [ValidityState, string] | string | undefined | void;
export type ValidityValue = [ValidityState|ValidityStateFlags, string|undefined, HTMLElement|undefined];

export interface HTMLElementValidator extends HTMLElement {
  checkValidity(): boolean;
  reportValidity(): void;
  validity: ValidityState;
  validationMessage: string;
  willValidate: boolean;
}

const metadata = setupMetadata<Validation>(Symbol('validation'), { collection: true });

export function apply<E extends HTMLElementValidator>(validations: Validation<E>[], target: E, anchor?: HTMLElement, field?: HTMLElementValidator): ValidityValue|void {
  for (let idx = 0; idx < validations.length; idx++) {
    const result = validations[idx].call(target, field);
    if (typeof result === 'string') {
      return [{ customError: true }, result, anchor || target];
    } else if (result) {
      const [flags, message] = result;
      return [flags, message, field || target];
    }
  }
}

export function execute<E extends HTMLElementValidator>(target: E, field: HTMLElementValidator, flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): ValidityValue;
export function execute<E extends HTMLElementValidator>(target: E, flags: ValidityStateFlags, message?: string, anchor?: HTMLElement): ValidityValue;
export function execute<E extends HTMLElementValidator>(target: E, message: string, anchor?: HTMLElement): ValidityValue;
export function execute<E extends HTMLElementValidator>(target: E, arg1: string|HTMLElementValidator|ValidityStateFlags, arg2?: string|HTMLElement|ValidityStateFlags, arg3?: string|HTMLElement, arg4?: HTMLElement): ValidityValue {
  if (typeof arg1 === 'string') {
    if (arg2 !== undefined && !(arg2 instanceof HTMLElement)) throw new Error('Anchor must be an HTMLElement');
    return [{ customError: true }, arg1, arg2 || target];
  }

  function call(validation: ValidityValue, anchor?: HTMLElement, field?: HTMLElementValidator): ValidityValue {
    return apply(metadata.recover(target), target, anchor, field) || validation;
  }

  if (arg1 instanceof HTMLElement) {
    if (arg2 !== undefined && typeof arg2 !== 'object') throw new Error('Validity flags must be an object');
    if (arg2 instanceof HTMLElement) throw new Error('Validity flags cannot be an HTMLElement');
    if (arg3 !== undefined && typeof arg3 !== 'string') throw new Error('Validation message must be a string');
    const validation = [arg2 || arg1.validity, arg3 || arg1.validationMessage, arg4 || arg1] as ValidityValue;
    return call(validation, arg4 || arg1, arg1);
  }

  if (arg2 !== undefined && typeof arg2 !== 'object') throw new Error('Validity flags must be an object');
  if (arg2 instanceof HTMLElement) throw new Error('Validity flags cannot be an HTMLElement');
  if (arg3 !== undefined && typeof arg3 !== 'string') throw new Error('Validation message must be a string');

  const validation = [arg2 || target.validity, arg3 || target.validationMessage, arg4 || target] as ValidityValue;
  return call(validation, arg4);
}

export function decorate<C extends HTMLElementClass>(validation: Validation<InstanceType<C>>): ClassDecorator<C>;
export function decorate<E extends HTMLElement, F extends HTMLElementValidator>(target: E, validation: Validation<E, F>): void;
export function decorate<E extends HTMLElement, F extends HTMLElementValidator>(): MethodDecorator<E, Validation<E, F>>;
export function decorate<E extends HTMLElement, C extends HTMLElementClass, F extends HTMLElementValidator>(arg1?: E|Validation<InstanceType<C>>, arg2?: Validation<E>): void|ClassDecorator<C>|MethodDecorator<E, Validation<E, F>> {
  if (arg1 !== undefined && arg1 instanceof HTMLElement) {
    if (typeof arg2 !== 'function') {
      throw new Error('[Call @validity] Validation must be provided.');
    }
    return metadata.store(arg1, arg2.bind(arg1) as Validation);
  }

  return function plug<EE extends E, CC extends C>(target: CC|EE, property?: string|symbol, descriptor?: PropertyDescriptor<EE, Validation<EE, F>>) {
    if (typeof target === 'function') {
      if (!arg1) throw new Error('[Class @validity] Validation must be provided.');
      if (property) throw new Error('[Method @validity] Try to use method decorator on class.');
      return metadata.store(target, arg1 as Validation);
    }

    if (arg1) throw new Error('[Method @validity] Validation must not be provided.');
    if (!property) throw new Error('[Class @validity] Try to use class decorator on method.');
    if (!descriptor) throw new Error('[Property @validity] Property decorator is not supported.');
    if (typeof descriptor.value !== 'function' || !descriptor) throw new Error('[Method @validity] Target must be a method.');
    if (descriptor.get && descriptor.set) throw new Error(`[Method @validity] Property cannot have a getter and a setter.`);
    metadata.store(target.constructor as HTMLElementClass, (descriptor.value || descriptor.get || descriptor.set).bind(target) as Validation);
  }
}
