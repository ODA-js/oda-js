import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "mutation/entry.graphql.njs";
export interface MutationInput {
    name: string;
}
export declare function generate(te: Factory, mutation: MutationInput, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
}
export declare function mapper(mutation: MutationInput, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=entry.graphql.d.ts.map