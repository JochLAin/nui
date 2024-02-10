import create from "../../factories/tree";

test('Test simple number array create', () => {
    const nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tree = create(nodes);

    for (let idx = 0; idx < nodes.length; idx++) {
        expect(tree.nodes.get(idx)).toBe(nodes[idx]);
    }
});

test('Test simple object array create', () => {
    const nodes = [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }, { value: 9 }];
    const tree = create(nodes);

    for (let idx = 0; idx < nodes.length; idx++) {
        expect(tree.nodes.get(idx)).toBe(nodes[idx]);
        expect(tree.nodes.get(idx).value).toBe(idx);
    }
});

test('Test parent relation create', () => {
    const nodes = [
        { key: 0 },
        { key: 1, parent: 0 },
        { key: 2 },
        { key: 3, parent: 1 },
        { key: 4, parent: 0 },
        { key: 5, parent: 2 },
    ];

    const tree = create(nodes, { keyUid: 'key', keyParent: 'parent' });
    expect(JSON.stringify(tree.relations.relations)).toBe('[[0,1],[1,3],[0,4],[2,5]]');
});
