import Relation from "../../models/relation";

test('Test single relation', () => {
    const relation = new Relation([[1, 2]]);

    expect(relation.contains(1, 2)).toBe(true);
    expect(relation.contains(1, 3)).toBe(false);

    expect(relation.hasParent(1)).toBe(false);
    expect(relation.countParents(1)).toBe(0);
    expect(relation.hasParent(2)).toBe(true);
    expect(relation.countParents(2)).toBe(1);
    expect(relation.getParents(2).join(',')).toBe('1');

    expect(relation.hasChild(1)).toBe(true);
    expect(relation.countChildren(1)).toBe(1);
    expect(relation.hasChild(2)).toBe(false);
    expect(relation.countChildren(2)).toBe(0);
    expect(relation.getChildren(1).join(',')).toBe('2');
});

test('Test multiple children', () => {
    const relation = new Relation([[1, 2], [1, 3]]);
    expect(relation.countChildren(1)).toBe(2);
    expect(relation.getChildren(1).join(',')).toBe('2,3');
    expect(relation.hasParent(1)).toBe(false);
    expect(relation.hasChild(2)).toBe(false);
    expect(relation.hasChild(3)).toBe(false);
});

test('Test integral', () => {
    const relation = new Relation([[1, 2], [2, 3], [1, 4], [4, 5]]);
    expect(relation.getChildren(1).join(',')).toBe('2,4');
    expect(relation.getSuccessors(1).join(',')).toBe('2,3,4,5');
    expect(relation.getAncestors(5).join(',')).toBe('4,1');
});

test('Test create helper', () => {
    const entries = [[0, { uid: 0 }], [1, { uid: 1, parent: 0 }], [2, { uid: 2, parent: 1 }]];
    const relation = Relation.create(entries, 'uid', 'parent');
    expect(JSON.stringify(relation.relations)).toBe('[[0,1],[1,2]]');
});
