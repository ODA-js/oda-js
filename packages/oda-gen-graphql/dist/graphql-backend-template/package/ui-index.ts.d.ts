import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/UI/ui-index.ts.njs";
export declare function generate(te: Factory, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    role: string;
    entities: {
        name: string;
        entry: string;
        embedded: boolean | string[];
        abstract: boolean;
    }[];
    enums: {
        name: string;
    }[];
}
export declare function mapper(pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=ui-index.ts.d.ts.map