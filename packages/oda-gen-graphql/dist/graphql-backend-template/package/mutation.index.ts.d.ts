import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "package/mutation.index.ts.njs";
export declare function generate(te: Factory, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    mutations: {
        name: string;
        entry: string;
    }[];
}
export declare function mapper(pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=mutation.index.ts.d.ts.map