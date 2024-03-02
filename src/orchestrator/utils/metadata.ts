type MetadataTarget = typeof HTMLElement|HTMLElement;
type MetadataItem = any;
type MetadataValue = any|any[]|null;

type MetadataType<I extends MetadataItem, V extends MetadataValue, T extends MetadataTarget = MetadataTarget> = {
  recover: (target: T) => V;
  store: (target: T, item: I) => void
};

type MetadataDictionary<I extends MetadataItem, V extends MetadataValue> = MetadataType<I, V, typeof HTMLElement>;
type MetadataProperty<I extends MetadataItem, V extends MetadataValue> = MetadataType<I, V, HTMLElement>;
type MetadataCollection<V extends MetadataItem, T extends MetadataTarget = MetadataTarget> = MetadataType<V, V[], T>;
type MetadataRecord<V extends MetadataItem, T extends MetadataTarget = MetadataTarget> = MetadataType<V, V | null, T>;
type MetadataPartial<V extends MetadataItem, T extends MetadataTarget = MetadataTarget> = MetadataType<Partial<V>, Partial<V>, T>;

type MetadataMap<V extends MetadataValue> = Map<typeof HTMLElement, V>;
type MetadataTransformer<I extends MetadataItem, V extends MetadataValue> = (item: I, value: V | undefined) => V;
type MetadataParser<V extends MetadataValue> = (value: V | undefined) => V;
type MetadataMerger<V extends MetadataValue> = (...value: (V | undefined)[]) => V;

type MetadataOptionType<C extends boolean | undefined, P extends boolean | undefined = undefined> =
  (C extends undefined ? { collection?: boolean } : { collection: C }) &
  (P extends undefined ? { partial?: boolean } : { partial: P });

type MetadataCollectionOptions = MetadataOptionType<true>;
type MetadataPartialOptions = MetadataOptionType<undefined, true>;
type MetadataRecordOptions = MetadataOptionType<undefined, false>;
type MetadataOptions = MetadataOptionType<boolean | undefined, boolean | undefined>;

type MetadataKind<V extends MetadataItem, C extends boolean | undefined, P extends boolean | undefined> =
  C extends true ? MetadataCollection<V> :
    P extends true ? MetadataPartial<V> :
      MetadataRecord<V>
;

type MetadataOptionKind<V extends MetadataItem, O extends MetadataOptions | undefined> =
  O extends MetadataOptions
    ? MetadataKind<V, O['collection'], O['partial']>
    : MetadataRecord<V>;

function createMetadataProperty<I extends MetadataItem, V extends MetadataValue>(property: string | symbol, transform: MetadataTransformer<I, V>, parse: MetadataParser<V>): MetadataProperty<I, V> {
  function recover(target: HTMLElement): V {
    const value = Reflect.get(target, property) as V | undefined;
    return parse(value);
  }

  function store(target: HTMLElement, item: I): void {
    const value = transform(item, recover(target));
    if (value === null) Reflect.deleteProperty(target, property);
    else Object.assign(target, { [property]: value });
  }

  return { recover, store };
}

function createMetadataDictionary<I extends MetadataItem, V extends MetadataValue>(transform: MetadataTransformer<I, V>, parse: MetadataParser<V>): MetadataDictionary<I, V> {
  const dict: MetadataMap<V> = new Map();

  function recover(target: typeof HTMLElement): ReturnType<typeof parse> {
    return parse(dict.get(target));
  }

  function store(target: typeof HTMLElement, item: I): void {
    const value = transform(item, recover(target));
    if (value === null) dict.delete(target);
    else dict.set(target, value);
  }

  return { recover, store };
}

function createElementMetadata<I extends MetadataItem, V extends MetadataValue>(name: string | symbol, transform: MetadataTransformer<I, V>, parse: MetadataParser<V>, merge: MetadataMerger<V>): MetadataType<I, V> {
  const property = createMetadataProperty<I, V>(name, transform, parse);
  const dictionary = createMetadataDictionary<I, V>(transform, parse);

  function recover(target: MetadataTarget): ReturnType<typeof parse> {
    if (typeof target === 'function') {
      const values: V[] = [];
      let proto = target.constructor as typeof HTMLElement;
      while (proto && proto !== HTMLElement) {
        values.push(dictionary.recover(proto));
        proto = Object.getPrototypeOf(proto);
      }
      return merge(...values.reverse());
    }

    return merge(
      recover(target.constructor as typeof HTMLElement),
      property.recover(target)
    );
  }

  function store(target: MetadataTarget, item: I): void {
    if (typeof target === 'function') return dictionary.store(target, item);
    return property.store(target, item);
  }

  return { recover, store };
}

function createMetadataCollection<V extends MetadataItem>(name: string | symbol): MetadataCollection<V> {
  const transform: MetadataTransformer<V, V[]> = (item, value) => [...(value || []), item];
  const parse: MetadataParser<V[]> = (value) => value || [];
  const merge: MetadataMerger<V[]> = (...values) => values.reduce((accu: V[], value) => accu.concat(value || []), []);

  return createElementMetadata<V, V[]>(name, transform, parse, merge);
}

function createMetadataRecord<V extends MetadataItem>(name: string | symbol): MetadataRecord<V> {
  const transform: MetadataTransformer<V, V | null> = (item, value) => item || value || null;
  const parse: MetadataParser<V | null> = (value) => value || null;
  const merge: MetadataMerger<V | null> = (...values) => values.reduce((accu: V | null, value) => value || accu, null);

  return createElementMetadata<V, V | null>(name, transform, parse, merge);
}

function createMetadataPartial<V extends MetadataItem>(name: string | symbol): MetadataPartial<V> {
  const transform: MetadataTransformer<Partial<V>, Partial<V>> = (item, value) => ({ ...value, ...item });
  const parse: MetadataParser<Partial<V>> = (value) => value || {};
  const merge: MetadataMerger<Partial<V>> = (...values) => values.reduce((accu: Partial<V>, value) => ({ ...accu, ...value }), {});

  return createElementMetadata<Partial<V>, Partial<V>>(name, transform, parse, merge);
}

export function setupMetadata<V extends MetadataItem>(name: string | symbol, opts: MetadataCollectionOptions): MetadataCollection<V>;
export function setupMetadata<V extends MetadataItem>(name: string | symbol, opts: MetadataPartialOptions): MetadataPartial<V>;
export function setupMetadata<V extends MetadataItem>(name: string | symbol, opts: MetadataRecordOptions): MetadataRecord<V>;
export function setupMetadata<V extends MetadataItem>(name: string | symbol): MetadataRecord<V>;
export function setupMetadata<V extends MetadataItem>(name: string | symbol, opts?: MetadataOptions): MetadataOptionKind<V, typeof opts> {
  if (opts?.collection) return createMetadataCollection<V>(name);
  if (opts?.partial) return createMetadataPartial<V>(name);
  return createMetadataRecord<V>(name);
}
