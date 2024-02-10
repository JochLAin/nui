import { ASTInputType, ASTOutputType } from "./factories/ast";
import { FileContentType, FileInputType, FileOutputType } from "./factories/file";
import { FormInputType, FormOutputType } from "./factories/form";
import { JSONInputType, JSONOutputType } from "./factories/json";
import { ArrayNodesType, ObjectNodesType, MapNodesType, NodesType, FactoryOptionsType } from "./factories/tree";
import { RelationType } from "./models/relation";
import { BranchInterface, BranchType, TreeType, TreeInterface } from "./models/tree";

import Relation from "./models/relation";
import Tree, { Branch } from "./models/tree";
import createTree, { createTree as createTreeFromEntries, createTreeFromArray, createTreeFromObject, createTreeFromMap } from "./factories/tree";
import createTreeAST from "./factories/ast";
import createTreeFile from "./factories/file";
import createTreeForm from "./factories/form";
import createTreeJSON from "./factories/json";

export type {
    RelationType,
    TreeInterface,
    TreeType,
    BranchInterface,
    BranchType,
    ASTInputType,
    ASTOutputType,
    FileContentType,
    FileInputType,
    FileOutputType,
    FormInputType,
    FormOutputType,
    JSONInputType,
    JSONOutputType,
    ArrayNodesType,
    ObjectNodesType,
    MapNodesType,
    NodesType,
    FactoryOptionsType,
};

export default createTree;

export {
    Relation,
    Tree,
    Branch,
    createTreeFromArray,
    createTreeFromEntries,
    createTreeFromObject,
    createTreeFromMap,
    createTreeAST,
    createTreeFile,
    createTreeForm,
    createTreeJSON,
    createTree,
};
