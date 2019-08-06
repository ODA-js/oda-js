import { Factory } from 'fte.js';
import { ModelPackage, FieldType } from 'oda-model';
export declare const template = "mutation/resolver.ts.njs";
export declare function generate(te: Factory, mutation: MutationInput, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MutationInput {
    name: string;
    description: string;
    args: {
        name: string;
        type: string;
        required: boolean;
    }[];
    payload: {
        name: string;
        type: string;
        required: boolean;
    }[];
}
export interface MapperOutput {
    name: string;
    args: {
        name: string;
        type: string;
    }[];
    payload: {
        name: string;
        type: string;
    }[];
}
export declare function mapper(mutation: MutationInput, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=resolver.ts.d.ts.map