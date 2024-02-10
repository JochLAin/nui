import { createTreeFromArray } from "./tree";

export type ASTInputType = { type: string, value: undefined|null|boolean|number|bigint|string|ASTInputType[] };
export type ASTOutputType = ASTInputType & { uid: string, parent?: string };

export default (ast: ASTInputType|ASTInputType[]) => {
    const nodes = (function closure(tree, parent?: string): ASTOutputType[] {
        if (typeof tree !== 'object') return [];
        const transform = ({ type, value }: ASTInputType, idx = 0): ASTOutputType[] => {
            const node = parent ? { type, value, uid: `${parent}.${idx}-${type}`, parent } : { type, value, uid: `${idx}-${type}` };
            if (typeof value === 'object' && value !== null) {
                return [node].concat(closure(value, node.uid));
            }
            return [node];
        }

        if (!Array.isArray(tree)) return transform(tree);
        return tree.reduce((accu: ASTOutputType[], node, idx) => accu.concat(transform(node, idx)), []);
    })(ast);

    return createTreeFromArray<ASTOutputType>(nodes, {
        keyParent: 'parent',
        keyUid: 'uid',
    });
}
