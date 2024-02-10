export type RelationType<K> = [K, K];

const uniq = <K>(values: K[]) => Array.from(new Set<K>(values));

const closureAncestor =
    <K>(key: K, relation: Relation<K>): K[] =>
        relation.getParents(key).reduce((accu: K[], key) => accu.concat([key], closureAncestor(key, relation)), []);

const closureSuccessor =
    <K>(key: K, relation: Relation<K>): K[] =>
        relation.getChildren(key).reduce((accu: K[], key) => accu.concat([key], closureSuccessor(key, relation)), []);

const getEntryKeyFromField =
    <K, V>(entries: [K, V][], key: any, value: any) =>
        // @ts-ignore
        (entries.find(([, v]) => Object.is(v[key], value)) || [])[0];

const retrieveParents = <K, V>(entries: [K, V][], key: K, value: V, key_uid: any, key_parent: any): [K, K][] => {
    // @ts-ignore
    if (!key_uid || !key_parent || !(key_parent in value)) return [];
    // @ts-ignore
    return (Array.isArray(value[key_parent]) ? value[key_parent] : [value[key_parent]])
        .map((parent: any) => getEntryKeyFromField<K, V>(entries, key_uid, parent))
        .map((parent_key: K) => [parent_key, key])
    ;
};

const retrieveChildren = <K, V>(entries: [K, V][], key: K, value: V, key_uid: any, key_child: any): [K, K][] => {
    // @ts-ignore
    if (!key_uid || !key_child || !(key_child in value)) return [];
    // @ts-ignore
    return (Array.isArray(value[key_child]) ? value[key_child] : [value[key_child]])
        .map((child: any) => getEntryKeyFromField<K, V>(entries, key_uid, child))
        .map((child_key: K) => [key, child_key])
    ;
};

export default class Relation<K> {
    static create = <K, V>(entries: [K, V][], key_uid?: any, key_parent?: any, key_child?: any): Relation<K> => {
        if (!key_uid) return new Relation<K>();

        return new Relation<K>(entries.reduce((accu: [K, K][], [key, value]) => {
            return accu.concat(
                retrieveParents<K, V>(entries, key, value, key_uid, key_parent),
                retrieveChildren<K, V>(entries, key, value, key_uid, key_child),
            );
        }, []));
    }

    relations: RelationType<K>[];

    constructor(relations: RelationType<K>[] = []) {
        this.relations = relations.filter(([parent, child], idx, relations) => {
            return idx === relations.findIndex(([p, c]) => parent === p && child === c);
        });
    }

    add(parent: K, child: K): Relation<K> {
        if (!this.contains(parent, child)) this.relations = [...this.relations, [parent, child]];
        return this;
    }

    contains(parent: K, child: K): boolean {
        return this.relations.some(([p, c]) => {
            return parent === p && child === c;
        });
    }

    remove(parent: K, child: K): Relation<K> {
        this.relations = this.relations.filter(([p, c]) => parent !== p && child !== c);
        return this;
    }

    removeChildren(parent: K): Relation<K> {
        this.relations = this.relations.filter((relation) => parent !== relation[0]);
        return this;
    }

    removeParents(child: K): Relation<K> {
        this.relations = this.relations.filter(([, c]) => child !== c);
        return this;
    }

    getChildren = (parent: K): K[] => uniq(this.relations.filter((relation) => parent === relation[0]).map(([, c]) => c));
    countChildren = (parent: K): number => this.getChildren(parent).length;
    hasChild = (parent: K): boolean => this.relations.some((relation) => parent === relation[0]);

    getParents = (child: K): K[] => uniq(this.relations.filter(([, c]) => child === c).map((relation) => relation[0]));
    countParents = (child: K): number => this.getParents(child).length;
    hasParent = (child: K): boolean => this.relations.some(([, c]) => child === c);

    getAncestors = (child: K): K[] => uniq(closureAncestor(child, this));
    countAncestors = (child: K): number => this.getAncestors(child).length;
    hasAncestor = (child: K): boolean => this.hasParent(child);

    getSuccessors = (parent: K): K[] => uniq(closureSuccessor(parent, this));
    countSuccessors = (parent: K): number => this.getSuccessors(parent).length;
    hasSuccessor = (parent: K): boolean => this.hasChild(parent);
}
