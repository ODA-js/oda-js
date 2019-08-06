import { ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "package/register.mongoose.connectors.ts.njs";
export declare function generate(te: Factory, pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    entities: {
        name: string;
        adapter: string;
    }[];
}
export declare function mapper(pack: ModelPackage, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=register.mongoose.connectors.ts.d.ts.map