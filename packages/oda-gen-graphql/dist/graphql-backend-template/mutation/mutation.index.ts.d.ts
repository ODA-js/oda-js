import { Mutation, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
import * as schema from './index';
export declare const template = "mutation/mutation.index.ts.njs";
export declare function generate(te: Factory, mutation: Mutation, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    partials: {
        entry: schema.entry.MapperOutput;
        types: schema.types.MapperOutput;
    };
}
export declare function mapper(mutation: Mutation, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=mutation.index.ts.d.ts.map