import Relation from "../models/relation";
import Tree from "../models/tree";

export type ArrayNodesType<V> = V[];
export type ObjectNodesType<V> = { [key: string]: V };
export type MapNodesType<K, V> = Map<K, V>;
export type NodesType<K, V> = ArrayNodesType<V>|ObjectNodesType<V>|MapNodesType<K, V>;

export type FactoryOptionsType<K, V> = {
    keyActive?: any,
    keyChildren?: any,
    keyParent?: any,
    keyUid?: any,
    sort?: (entry1: [K, V], entry2: [K, V]) => number,
};

export const createTree = <K, V>(entries: [K, V][] = [], opts: FactoryOptionsType<K, V> = {}): Tree<K, V> => {
    if (opts.sort) entries.sort(opts.sort);

    const { keyChildren, keyParent, keyUid } = opts;
    const relations = Relation.create<K, V>(entries, keyUid, keyParent, keyChildren);

    return Tree.create<K, V>(entries, relations);
}

export const createTreeFromArray =
    <V>(nodes: ArrayNodesType<V>, opts: FactoryOptionsType<number, V> = {}) =>
        createTree<number, V>(nodes.map((node, idx) => [idx, node]), opts);

export const createTreeFromObject =
    <V>(nodes: ObjectNodesType<V>, opts: FactoryOptionsType<string, V> = {}) =>
        createTree<string, V>(Object.entries(nodes), opts);

export const createTreeFromMap =
    <K, V>(nodes: MapNodesType<K, V>, opts: FactoryOptionsType<K, V>) =>
        createTree<K, V>(Array.from(nodes.entries()), opts);

export default <K, V>(nodes: NodesType<K, V>, opts: FactoryOptionsType<any, V> = {}) => {
    if (Array.isArray(nodes)) {
        return createTreeFromArray<V>(nodes, opts);
    } else if (!(nodes instanceof Map)) {
        return createTreeFromObject<V>(nodes, opts);
    }
    return createTreeFromMap<K, V>(nodes, opts);
}
