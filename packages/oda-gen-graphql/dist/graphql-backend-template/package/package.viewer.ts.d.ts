import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "package/package.viewer.ts.njs";
export declare function generate(te: Factory, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    entities: {
        name: string;
    }[];
}
export declare function mapper(pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=package.viewer.ts.d.ts.map