import {DecoratorClass, DecoratorProperty, DecoratorMethod, DecoratorScope, VerifierDefinition} from "../utils";
import { verify, verifyArguments, verifyOptions } from "../utils";

type ThisType<T extends HTMLElement | typeof HTMLElement> = T extends typeof HTMLElement ? InstanceType<T> : T;
export type AttributeListen<T extends HTMLElement, V extends AttributeValue = AttributeValue> = (this: T, value: V) => void;
export type AttributeTransform<T extends HTMLElement, V extends AttributeValue = AttributeValue> = (this: T, value: AttributeValue) => V;
export type AttributeType = null|boolean|number|string;
export type AttributeValue = AttributeType & Exclude<any, undefined|((...args: any[]) => any)>;

export type AttributeDictionary<T extends HTMLElement, V extends AttributeValue = AttributeValue> = Record<string|symbol, AttributeDefinitionOmit<T, V, 'propertyName'>>;
export type AttributeDefinition<T extends HTMLElement, V extends AttributeValue = AttributeValue> = {
  propertyName: string|symbol,
  attributeName?: string,
  transform?: AttributeTransform<T, V>,
  listen?: AttributeListen<T, V>,
  forward?: boolean,
  reflect?: boolean,
  defaultValue?: V,
};

type AttributeDefinitionKeys = (keyof AttributeDefinition<HTMLElement>)[];
type AttributeDefinitionOmit<T extends HTMLElement|typeof HTMLElement, V extends AttributeValue, K extends keyof AttributeDefinition<HTMLElement, V>> = Omit<AttributeDefinition<ThisType<T>, V>, K>;

type ReturnTypeChainTransform<
  E extends HTMLElement,
  CurrentTransform extends AttributeTransform<E, any>|undefined,
  PreviousTransform extends AttributeTransform<E, any>|undefined,
> =
  CurrentTransform extends AttributeTransform<E, infer R1> ? R1 :
    PreviousTransform extends AttributeTransform<E, infer R2> ? R2 :
      AttributeType;

type CheckDefinitionOptions = {
  scope: DecoratorScope,
  forbidden?: AttributeDefinitionKeys,
  mandatory?: AttributeDefinitionKeys,
};

// type CheckDefinitionReturnType<
//   D extends Partial<AttributeDefinition<HTMLElement>>,
//   P extends CheckDefinitionOptions,
// > = AttributeDefinitionOmit<E, R, typeof keys[number]>;

function buildDefinition<E extends HTMLElement, R extends AttributeValue = AttributeType>(def: Partial<AttributeDefinition<E, R>>|null, propertyName?: string|symbol, attributeName?: string, transform?: Function|null, listen?: Function|null, reflect?: boolean, forward?: boolean, defaultValue?: R): AttributeDefinition<E, R> {
  propertyName ||= def?.propertyName;
  if (!propertyName) {
    throw new Error(`[@attribute] Invalid usage : propertyName is required.`);
  }

  return {
    propertyName: propertyName,
    attributeName: attributeName || def?.attributeName,
    transform: transform ? (transform as AttributeTransform<E, R>) : def?.transform,
    listen: listen ? (listen as AttributeListen<E, R>) : def?.listen,
    forward: forward !== undefined ? forward : def?.forward,
    reflect: reflect !== undefined ? reflect : def?.reflect,
    defaultValue: defaultValue !== undefined ? defaultValue : def?.defaultValue,
  };
}

function buildGet<E extends HTMLElement, R extends AttributeValue = AttributeValue>(target: E, name: string, transform: AttributeTransform<E, R>) {
  return function get() {
    return transform.call(target, target.getAttribute(name));
  }
}

function buildSet<E extends HTMLElement, R extends AttributeValue = AttributeValue>(target: E, name: string, transform: AttributeTransform<E, R>, listen?: AttributeListen<E, R>) {
  return function set(value: R) {
    const previous = buildGet(target, name, transform)();

    if (value !== previous) {
      if (value === null) {
        target.removeAttribute(name);
      } else if (typeof value === 'boolean') {
        if (value) target.toggleAttribute(name, value);
        else target.setAttribute(name, 'false');
      } else {
        target.setAttribute(name, String(value));
      }
    }

    listen?.call(target, value);
  }
}

function buildTransformer<E extends HTMLElement, R extends AttributeValue>(target: E, name: string, transform?: AttributeTransform<E, R>): AttributeTransform<E, R> {
  function basicTransform(value: AttributeType): AttributeType {
    if (null === value) return null;
    if ('' === value) return true;
    if ('false' === value) return false;
    if ('true' === value) return true;
    if ('boolean' === typeof value) return value;
    if ('number' === typeof value) return value;
    if (!Number.isNaN(Number(value))) return Number(value);
    if (name === value) return true;
    return value;
  }

  return chainTransforms(transform, basicTransform.bind(target));
}

function chainDefinitions<E extends HTMLElement, R extends AttributeValue = AttributeValue>(currentDefinition: AttributeDefinition<E, R>, previousDefinition?: AttributeDefinition<E, R>): AttributeDefinition<E, R> {
  if (!previousDefinition) return currentDefinition;
  if (previousDefinition.propertyName !== currentDefinition.propertyName) {
    throw new Error(`The attribute propertyName does not match, ${previousDefinition.propertyName.toString()} ≠ ${currentDefinition.propertyName.toString()}.`);
  }

  function toggle<K extends keyof AttributeDefinition<E, R>>(key: K, strict?: boolean): AttributeDefinition<E, R>[K]|undefined {
    if (strict) return currentDefinition[key] !== undefined ? currentDefinition[key] : previousDefinition?.[key];
    return currentDefinition[key] || previousDefinition?.[key];
  }

  return {
    propertyName: currentDefinition.propertyName,
    attributeName: toggle('attributeName'),
    transform: chainTransforms(currentDefinition.transform, previousDefinition.transform),
    listen: chainListeners(currentDefinition.listen, previousDefinition.listen),
    forward: toggle('forward', true),
    reflect: toggle('reflect', true),
    defaultValue: toggle('defaultValue', true),
  };
}

function chainListeners<
  I extends HTMLElement = HTMLElement,
  F extends any = AttributeType,
>(
  listen?: AttributeListen<I, F>|null,
  _listen?: AttributeListen<I, F>|null,
): AttributeListen<I, F>|undefined {
  if (!listen && !_listen) return undefined;
  return function(this: I, value: F) {
    _listen?.call(this, value);
    listen?.call(this, value);
  }
}

function chainTransforms<
  E extends HTMLElement,
  T1 extends AttributeTransform<E>,
  T2 extends T1|AttributeTransform<E>,
>(
  currentTransform?: T1,
  previousTransform?: T2
): T1|AttributeTransform<E, ReturnTypeChainTransform<E, T1, T2>> {
  if (currentTransform !== undefined && previousTransform !== undefined) {
    if (currentTransform === previousTransform) {
      return currentTransform;
    }
  }

  return function (value: AttributeType): ReturnTypeChainTransform<E, T1, T2> {
    const previousTransformedValue = previousTransform?.call(this, value);
    if (undefined !== previousTransformedValue) value = previousTransformedValue;

    const transformedValue = currentTransform?.call(this, value) || value;
    if (undefined === transformedValue) value = transformedValue;

    return value as ReturnTypeChainTransform<E, T1, T2>;
  }
}

function defineAttribute<E extends HTMLElement, R extends AttributeValue = AttributeValue>(target: E, opts: AttributeDefinition<E, R>): E {
  if (!opts.reflect && !opts.forward) {
    throw new Error('The attribute definition must either reflect and / or forward.');
  }

  const propertyName = opts.propertyName as string & keyof typeof target;
  const attributeName = opts.attributeName || propertyName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  const transform = buildTransformer(target, propertyName, opts.transform);
  const get = buildGet(target, attributeName, transform)
  const set = buildSet(target, attributeName, transform, opts.listen);
  delete target[propertyName];

  if (opts.reflect && !opts.forward) {
    return defineProperty(target, propertyName, { get });
  }

  if (!opts.reflect && opts.forward) {
    defineProperty(target, propertyName, { set });
  } else {
    defineProperty(target, propertyName, { get, set });
  }

  const currentValue = get();
  if (currentValue !== undefined && currentValue !== null) {
    opts.listen?.call(target, currentValue);
  } else if (undefined !== opts.defaultValue) {
    set(opts.defaultValue);
  }

  return target;
}

function defineProperty<E extends HTMLElement, R extends AttributeValue = AttributeValue>(target: E, name: string, opts: { get?: () => R, set?: (value: R) => void }) {
  return Object.defineProperty(target, name, {
    configurable: false,
    enumerable: true,
    get: opts?.get,
    set: opts?.set,
  });
}

function getObservedAttributes<E extends typeof HTMLElement>(target: E, filteredAttribute?: string|symbol): (string|symbol)[] {
  if ('observedAttributes' in target) {
    if (filteredAttribute) {
      const attributes = target.observedAttributes as (string|symbol)[];
      return attributes.toSpliced(attributes.indexOf(filteredAttribute), 1);
    }
    return target.observedAttributes as (string|symbol)[];
  }
  return [];
}

/******************************************************************************/
/*                              Class Decorator                               */
/******************************************************************************/
export function decorate<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  transform?: AttributeTransform<InstanceType<C>, R>,
  listen?: AttributeListen<InstanceType<C>, R>,
  attributeName?: string,
  forward?: boolean,
  reflect?: boolean,
  defaultValue?: R,
): DecoratorClass<C>;

export function decorate<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  transform?: AttributeTransform<InstanceType<C>, R>,
  listen?: AttributeListen<InstanceType<C>, R>,
  definition?: AttributeDefinitionOmit<C, R, 'propertyName' | 'transform' | 'listen'>,
): DecoratorClass<C>;

export function decorate<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  transform?: AttributeTransform<InstanceType<C>, R>,
  definition?: AttributeDefinitionOmit<C, R, 'propertyName' | 'transform'>,
): DecoratorClass<C>;

export function decorate<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  propertyName: string,
  definition?: AttributeDefinitionOmit<C, R, 'propertyName'>,
): DecoratorClass<C>;

export function decorate<
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: AttributeDefinition<InstanceType<C>, R>,
): DecoratorClass<C>;

/******************************************************************************/
/*                              Called Decorator                              */
/******************************************************************************/
export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  propertyName: string,
  transform?: AttributeTransform<E, R>,
  listen?: AttributeListen<E, R>,
  attributeName?: string,
  forward?: boolean,
  reflect?: boolean,
  defaultValue?: R,
): void;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  propertyName: string,
  transform?: AttributeTransform<E, R>,
  listen?: AttributeListen<E, R>,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName' | 'transform' | 'listen'>,
): void;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  propertyName: string,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName'>,
): void;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  target: E,
  definition: AttributeDefinition<E, R>,
): void;

/******************************************************************************/
/*                             Property Decorator                             */
/******************************************************************************/
export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R> | null,
  listen?: AttributeListen<E, R>,
  attributeName?: string,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName' | 'defaultValue' | 'transform' | 'listen' | 'attributeName'>,
): DecoratorProperty<E>;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R> | null,
  listen?: AttributeListen<E, R>,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName' | 'defaultValue' | 'transform' | 'listen'>,
): DecoratorProperty<E>;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: AttributeDefinitionOmit<E, R, 'propertyName' | 'defaultValue'>,
): DecoratorProperty<E>;

/******************************************************************************/
/*                              Method Decorator                              */
/******************************************************************************/
export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R>,
  attributeName?: string,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName' | 'listen' | 'transform' | 'attributeName'>,
): DecoratorMethod<E, R>;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  transform?: AttributeTransform<E, R>,
  definition?: AttributeDefinitionOmit<E, R, 'propertyName' | 'listen' | 'transform'>,
): DecoratorProperty<E>;

export function decorate<
  E extends HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  definition: AttributeDefinitionOmit<E, R, 'propertyName' | 'listen'>,
): DecoratorProperty<E>;

/******************************************************************************/
/*                               Implementation                               */
/******************************************************************************/
export function decorate<
  E extends HTMLElement,
  C extends typeof HTMLElement,
  R extends AttributeValue = AttributeType,
>(
  arg1?: string | E | AttributeTransform<E, R> | AttributeDefinition<E, R>,
  arg2?: string | AttributeTransform<E, R> | AttributeListen<E, R> | AttributeDefinitionOmit<E, R, 'propertyName'>,
  arg3?: string | AttributeTransform<E, R> | AttributeListen<E, R> | AttributeDefinitionOmit<E, R, 'propertyName' | 'transform'>,
  arg4?: string  | AttributeListen<E, R> | AttributeDefinitionOmit<E, R, 'propertyName' | 'transform' | 'listen'>,
  arg5?: boolean | string | AttributeDefinitionOmit<E, R, 'propertyName' | 'transform' | 'listen'>,
  arg6?: boolean,
  arg7?: boolean | R,
  arg8?: R,
): void | DecoratorClass<C> | DecoratorMethod<E, R> | DecoratorProperty<E> {
  if (typeof arg1 === 'string') {
    if (typeof arg2 === 'object') {
      if ('propertyName' in arg2) {
        throw new Error(`[Class @attribute] Invalid usage : definition must have propertyName.`);
      }
      if (undefined !== arg3) {
        throw new Error(`[Class @attribute] Invalid usage : too many arguments`);
      }

      return  (target: C) => decorateClass(target, buildDefinition(arg2, arg1));
    }

    if (arg2 !== undefined && typeof arg2 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : transform must be a function, got ${typeof arg2}.`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'function') {
      throw new Error(`[Class @attribute] Invalid usage : listen must be a function, got ${typeof arg3}.`);
    }
    if (arg4 !== undefined && typeof arg4 === 'function') {
      throw new Error(`[Class @attribute] Invalid usage : defaultValue cannot be a function, got ${typeof arg4}.`);
    }
    if (arg5 !== undefined && typeof arg5 !== 'string') {
      throw new Error(`[Class @attribute] Invalid usage : attributeName must be a string, got ${typeof arg5}.`);
    }
    if (arg6 !== undefined) {
      throw new Error(`[Property @attribute] Invalid usage : too many arguments`);
    }

    return (target: C) => decorateClass(target, buildDefinition({}, arg1, arg2, arg3, arg4, arg5 as string|undefined));
  }

  if (arg1 instanceof HTMLElement) {
    if (typeof arg2 === 'string') {
      if (typeof arg3 === 'object') {
        return decorateInstance(arg1, arg2, arg3);
      }

      if (arg3 !== undefined && typeof arg3 !== 'function') {
        throw new Error(`[Call @attribute] Invalid usage : transform must be a function, got ${typeof arg3}.`);
      }
      if (arg4 !== undefined && typeof arg4 !== 'function') {
        throw new Error(`[Call @attribute] Invalid usage : listen must be a function, got ${typeof arg4}.`);
      }
      if (arg5 !== undefined && typeof arg5 === 'function') {
        throw new Error(`[Call @attribute] Invalid usage : defaultValue must be a function, got ${typeof arg5}.`);
      }

      return decorateInstance(arg1, arg2, null, null, arg3 as AttributeTransform<E, R>, arg4 as AttributeListen<E, R>, arg5 as R|undefined, arg6);
    }

    if (typeof arg2 !== 'object') {
      throw new Error(`[Call @attribute] Invalid usage : definition must be an object.`);
    }

    if (!('propertyName' in arg2)) {
      throw new Error(`[Call @attribute] Invalid usage : definition must have propertyName.`);
    }

    return decorateInstance(arg1, arg2.propertyName, arg2);
  }

  if (arg1 !== null && typeof arg1 === 'object') {
    return function (target: C|E, propertyName?: string|symbol, descriptor?: PropertyDescriptor<E, R>) {
      if ('propertyName' in arg1) {
        if (typeof target !== 'function') {
          throw new Error(`[${descriptor ? 'Property' : 'Method'} @attribute] Invalid usage : propertyName is not supported.`);
        }
        return decorateClass(target, arg1);
      }

      if (typeof target === 'function') {
        throw new Error(`[Class @attribute] Invalid usage : propertyName is required.`);
      }
      if (propertyName === undefined) {
        throw new Error(`[${descriptor ? 'Property' : 'Method'} @attribute] Invalid usage : can't retrieve propertyName.`);
      }

      if (!descriptor?.set) {
        if ('defaultValue' in arg1) {
          throw new Error(`[Property @attribute] Invalid usage : defaultValue is not supported`);
        }
      } else {
        if ('listen' in arg1) {
          throw new Error(`[Method @attribute] Invalid usage : listen is not supported`);
        }
      }

      return decorateInstance(target, propertyName, arg1, descriptor);
    }
  }

  if (arg1 !== undefined && arg1 !== null && typeof arg1 !== 'function') {
    throw new Error(`[Property @attribute] Invalid usage : transform must be a function, got ${typeof arg1}.`);
  }

  return function (target: E, propertyName: string|symbol, descriptor?: PropertyDescriptor<E, R>) {
    if (descriptor?.get) {
      throw new Error(`[Property @attribute] Invalid usage : getter is not supported`);
    }

    if (descriptor?.set) {
      if (arg2 !== undefined && typeof arg2 === 'function') {
        throw new Error(`[Method @attribute] Invalid usage : listen is not supported`);
      }

      if (arg2 !== undefined && typeof arg2 !== 'string') {
        throw new Error(`[Method @attribute] Invalid usage : attributeName must be a string, got ${typeof arg2}`);
      }
      if (arg3 !== undefined) {
        throw new Error(`[Method @attribute] Invalid usage : too many arguments`);
      }

      return decorateInstance(target, propertyName, null, descriptor, arg1, null, undefined, arg2);
    }

    if (arg2 !== undefined && typeof arg2 !== 'function') {
      throw new Error(`[Property @attribute] Invalid usage : listen must be a function, got ${typeof arg2}`);
    }
    if (arg3 !== undefined && typeof arg3 !== 'string') {
      throw new Error(`[Property @attribute] Invalid usage : attributeName must be a string, got ${typeof arg3}`);
    }
    if (arg4 !== undefined) {
      throw new Error(`[Property @attribute] Invalid usage : too many arguments`);
    }

    return decorateInstance(target, propertyName, null, null, arg1, arg2, undefined, arg3);
  }
}
