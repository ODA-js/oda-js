import { MetaModel, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "model/packages.registerConnectors.ts.njs";
export declare function generate(te: Factory, pack: MetaModel, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    packageList: {
        name: string;
        entry: string;
    }[];
}
export declare function mapper(model: MetaModel, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=packages.registerConnectors.ts.d.ts.map