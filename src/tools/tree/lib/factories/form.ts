import { createTreeFromArray } from "./tree";

export type FormInputType = HTMLFormElement|HTMLSelectElement|HTMLTextAreaElement|HTMLInputElement;
export type FormOutputType = { parent?: string, type: string, name: string, input: FormInputType };

const isFormInputType = (input: any): input is FormInputType => {
    return input instanceof HTMLFormElement ||
        input instanceof HTMLSelectElement ||
        input instanceof HTMLTextAreaElement ||
        input instanceof HTMLInputElement;
};

export default (element: HTMLElement) => {
    const elements = Array.from(element.querySelectorAll('form, input, select, textarea'));
    if (element.matches('form, input, select, textarea')) elements.push(element);

    const nodes = elements.map((input: Element): FormOutputType => {
        if (!isFormInputType(input)) throw new Error(`Invalid <form|input|select|textarea> got ${input.tagName.toLowerCase()}`);
        let { type, name } = input;

        if (input instanceof HTMLFormElement) type = 'form';
        if (input instanceof HTMLSelectElement) type = 'select';
        if (input instanceof HTMLTextAreaElement) type = 'textarea';

        const parent = name.replace(/\[[\w\d.:_-]*]$/, '');
        return parent.length ? { type, name, input, parent } : { type, name, input };
    });

    return createTreeFromArray<FormOutputType>(nodes, {
        keyParent: 'parent',
        keyUid: 'name',
    });
};
