import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "enums/UI/components.js.njs";
export interface MetadataInput {
    metadata?: {
        [key: string]: any;
    };
}
export interface ModelBaseInput extends MetadataInput {
    name: string;
    title?: string;
    description?: string;
}
export interface EnumItemInput extends ModelBaseInput {
    value?: string;
}
export interface EnumInput extends ModelBaseInput {
    items: (EnumItemInput | string)[];
}
export declare function generate(te: Factory, mutation: EnumInput, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
}
export declare function mapper(mutation: EnumInput, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=components.js.d.ts.map