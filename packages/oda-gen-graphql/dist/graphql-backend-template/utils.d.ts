import { ModelPackage } from 'oda-model';
export declare function decapitalize(name: string): string;
export declare function capitalize(name: string): string;
export declare function printRequired(field: {
    required?: boolean;
}): string;
export declare type possibleTypes = 'int' | 'integer' | 'number' | 'float' | 'double' | 'string' | '*' | 'uuid' | 'id' | 'identity' | 'richtext' | 'date' | 'time' | 'datetime' | 'fixeddatetime' | 'fixeddate' | 'fixedtime' | 'bool' | 'boolean' | 'text' | 'email' | 'url' | 'imageupload' | 'fileupload' | 'image' | 'file' | 'object' | 'json' | 'identity_pk' | 'uuid_pk' | 'id_pk' | 'many()' | 'single()' | 'enum()' | 'entity()';
export declare const defaultTypeMapper: {
    [key: string]: {
        [type: string]: possibleTypes[];
    };
};
export declare function prepareMapper(mapper: {
    [key: string]: string[];
}, systemPackage: ModelPackage): (type: any) => any;
export declare function printArguments(field: {
    args: any;
}, typeMapper: (i: string) => string): string;
//# sourceMappingURL=utils.d.ts.map