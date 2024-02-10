import { createTreeFromArray } from "./tree";

export type FileContentType = string|((path: string, filename: string) => string);
export type FileInputType = { [key:string]: FileContentType|FileInputType };
export type FileOutputType = { path: string, directory?: string, filename: string, content: FileContentType|FileInputType };

export default (files: FileInputType) => {
    const nodes = (function closure(tree: FileInputType, directory?: string): FileOutputType[] {
        return Object.entries(tree).reduce((accu: FileOutputType[], [filename, content]: [string, FileContentType|FileInputType]) => {
            const path = directory ? `${directory}/${filename}` : filename;
            const node = directory ? { directory, path, filename, content } : { path, filename, content };
            return accu.concat([node], typeof content === 'object' ? closure(content, node.path) : []);
        }, []);
    })(files);

    return createTreeFromArray<FileOutputType>(nodes, {
        keyParent: 'directory',
        keyUid: 'path',
        sort: ([,file1], [,file2]) => {
            return (typeof file1.content === 'object' ? 0 : 1) - (typeof file2.content === 'object' ? 0 : 1);
        },
    });
};
