export type Verifier<R> = boolean | string | ((...args: [R, string]) => void | string);
export type VerifierDefinition<R> = [string, R, Verifier<R>];

export function verifyProperty<R>(verifier: VerifierDefinition<R>) {
  const [property, value, test] = verifier;

  if (test === true && value === undefined) {
    throw new Error(`Missing argument: ${property}`);
  }

  if (test === false && value !== undefined) {
    throw new Error(`Forbidden argument: ${property}`);
  }

  if (typeof test === 'string' && typeof value !== test) {
    throw new Error(`Invalid argument: ${property}, expected ${test}, got ${typeof value}`);
  }

  if (typeof test === 'function') {
    const message = test(value, property);
    if (message) {
      throw new Error(message);
    }
  }
}

export function verifyArguments<A extends VerifierDefinition<any>[]>(args: A): void {
  for (let idx = 0; idx < args.length; idx++) {
    verifyProperty(args[idx]);
  }
}

export function verifyOptions<O extends Record<string, any>>(value: O, opts: { [K in keyof O]?: Verifier<any> }): void {
  const entries = Object.entries(opts);

  for (let idx = 0; idx < entries.length; idx++) {
    const [key, test] = entries[idx];
    if (undefined !== test) {
      verifyProperty([key, value[key], test]);
    }
  }
}

export function verify(chain: [args: VerifierDefinition<any>[], () => any][]) {
  const callback = (() => {
    for (let idx = 0; idx < chain.length; idx++) {
      try {
        const [args, callback] = chain[idx];
        verifyArguments(args);
        return callback;
      } catch (error) {
      }
    }
    return;
  })();

  if (callback) return callback();
  throw new Error(`No valid configuration found.`);
}
