import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "package/schema.puml.njs";
export declare function generate(te: Factory, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface RelationsList {
    src: string;
    field: string;
    dest: string;
    single: boolean;
    verb: string;
    opposite: string;
    using?: string;
}
export interface MapperOutput {
    name: string;
    relations: RelationsList[];
    entities: {
        name: string;
        queries: {
            name: string;
            type: string;
            args: string;
            single: boolean;
        }[];
        fields: {
            name: string;
            type: string;
        }[];
    }[];
}
export declare function mapper(pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=schema.puml.d.ts.map