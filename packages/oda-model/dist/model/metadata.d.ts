import { IValidate, IValidationResult, IValidator, MetadataInput, MetaModelType } from './interfaces';
export declare class Metadata implements IValidate {
    modelType: MetaModelType;
    metadata: {
        [key: string]: any;
    };
    validate(validator: IValidator): IValidationResult[];
    constructor(inp: {
        metadata?: {
            [key: string]: any;
        };
    });
    getMetadata(key?: string, def?: any): any;
    hasMetadata(key: string): boolean;
    setMetadata(key?: string | {
        [key: string]: any;
    }, data?: {
        [key: string]: any;
    } | any): any;
    updateWith(obj: MetadataInput): void;
    toObject(): {
        [key: string]: any;
    };
    toJSON(): {
        [key: string]: any;
    };
}
//# sourceMappingURL=metadata.d.ts.map