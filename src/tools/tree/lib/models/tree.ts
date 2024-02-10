import Relation from "./relation";

export type TreeType<K, V> = {
    nodes: Map<K, V>,
    relations: Relation<K>,
}

export type BranchType<K, V> = {
    key: K,
    props: V|undefined,
    tree: TreeType<K, V>,
    children: BranchType<K, V>[],
    parents: BranchType<K, V>[],
    ancestors: BranchType<K, V>[],
    successors: BranchType<K, V>[],
}

export interface TreeInterface<K, V> extends TreeType<K, V> {
    addBranch: (key: K, value: V) => this,
    removeBranch: (key: K) => this,
    getBranch: (key: K) => BranchInterface<K, V>,
}

export interface BranchInterface<K, V> extends BranchType<K, V> {
    addChild: (key: K) => this;
    removeChild: (key: K) => this;
    addParent: (key: K) => this;
    removeParent: (key: K) => this;
}

export default class Tree<K, V> implements TreeInterface<K, V> {
    static create = <K, V>(entries: [K, V][], relations: Relation<K>) => new Tree<K, V>(new Map<K, V>(entries), relations);

    nodes: Map<K, V>;
    relations: Relation<K>;

    constructor(nodes: Map<K, V>, relations: Relation<K>) {
        this.nodes = nodes;
        this.relations = relations;
    }

    addBranch = (key: K, value: V): this => {
        if (!this.nodes.has(key)) {
            this.setBranch(key, value);
        }
        return this;
    };

    removeBranch = (key: K): this => {
        if (this.nodes.has(key)) {
            this.nodes.delete(key);
        }
        return this;
    };

    setBranch = (key: K, value: V): Branch<K, V> => {
        this.nodes.set(key, value);
        return new Branch<K, V>(key, this);
    }

    getBranch = (key: K): Branch<K, V> => {
        return new Branch<K, V>(key, this);
    };
}

export class Branch<K, V> implements BranchInterface<K, V> {
    #props!: V;
    key: K;
    tree: TreeInterface<K, V>;

    constructor(key: K, tree: TreeInterface<K, V>) {
        this.key = key;
        this.tree = tree;
    }

    addChild = (child: K): this => {
        this.tree.relations.add(this.key, child);
        return this;
    };

    removeChild = (child: K): this => {
        this.tree.relations.remove(this.key, child);
        return this;
    };

    addParent = (parent: K): this => {
        this.tree.relations.add(parent, this.key);
        return this;
    };

    removeParent = (parent: K): this => {
        this.tree.relations.remove(parent, this.key);
        return this;
    };

    get props() {
        if (undefined === this.#props) {
            const value = this.tree.nodes.get(this.key);
            if (!value) throw new Error(`Try to retrieve props from tree but not found, key is ${this.key}`);
            this.#props = value;
        }
        return this.#props;
    }

    get ancestors() {
        return this.tree.relations.getAncestors(this.key).map((key) => this.tree.getBranch(key));
    }

    get children() {
        return this.tree.relations.getChildren(this.key).map((key) => this.tree.getBranch(key));
    }

    get parents() {
        return this.tree.relations.getParents(this.key).map((key) => this.tree.getBranch(key));
    }

    get successors() {
        return this.tree.relations.getSuccessors(this.key).map((key) => this.tree.getBranch(key));
    }
}
