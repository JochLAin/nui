import { createTreeFromArray } from "./tree";

export type JSONInputType = { [key: string]: any };
export type JSONOutputType = { uid: string, parent?: string, key: string, value: any };

export default (json: JSONInputType) => {
    const nodes = (function closure(tree: JSONInputType, parent?: string): JSONOutputType[] {
        return Object.entries(tree).reduce((accu: JSONOutputType[], [key, value]) => {
            const node = parent ? { uid: `${parent}.${key}`, parent, key, value } : { uid: key, key, value };
            if (typeof value === 'object') return accu.concat([node], closure(value, node.uid));
            return accu.concat([node]);
        }, []);
    })(json);

    return createTreeFromArray<JSONOutputType>(nodes, {
        keyParent: 'parent',
        keyUid: 'uid',
    });
};
