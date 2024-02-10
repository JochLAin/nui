# nui-tree (HTMLNuiTreeElement)

<nui-row style="height: 500px;">
    <div style="padding:0 20px">
        <nui-tree open>Branche 1
            <nui-tree offset="0">Branche 1-1
                <nui-tree>Branche 1-1-1
                </nui-tree>
                <nui-tree>Branche 1-1-2
                </nui-tree>
            </nui-tree>
            <nui-tree>Branche 1-2
            </nui-tree>
        </nui-tree>
    </div>
    <div class="tree-file" style="padding:0 20px">
        <nui-tree-file open>Branche 1
            <nui-tree-file open>Branche 1-1
                <nui-tree-file>Branche 1-1-1</nui-tree-file>
                <nui-tree-file>Branche 1-1-2</nui-tree-file>
            </nui-tree-file>
            <nui-tree-file>Branche 1-2</nui-tree-file>
        </nui-tree-file>
    </div>
</nui-row>

## Attributes

- [x] flatten
- [x] leaf
- [x] offset
- [x] open
- [x] root

## Methods

- [x] getAncestors
- [x] getBranches
- [x] getChildren
- [x] getParent
- [x] getRoot
- [x] getSuccessors

## Styling

### Properties

- [x] --nui-tree-offset : The left padding on tree branches, default: 1.15rem

### Parts

- [x] content
- [x] toggle
- [x] trunk
- [x] branch
- [x] leaf
