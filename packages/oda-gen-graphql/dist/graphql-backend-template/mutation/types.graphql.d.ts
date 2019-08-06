import { Factory } from 'fte.js';
import { ModelPackage, FieldArgs, FieldType } from 'oda-model';
export declare const template = "mutation/types.graphql.njs";
export declare function generate(te: Factory, mutation: MutationInput, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MutationInput {
    name: string;
    description: string;
    args: FieldArgs[];
    payload: FieldArgs[];
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
//# sourceMappingURL=types.graphql.d.ts.map