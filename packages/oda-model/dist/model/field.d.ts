import { EntityReference } from './entityreference';
import { FieldBase } from './fieldbase';
import { FieldInput, FieldStorage, IField, FieldType } from './interfaces';
import { ModelPackage } from './modelpackage';
import { RelationBase } from './relationbase';
export declare class Field extends FieldBase implements IField {
    protected $obj: FieldStorage;
    constructor(obj: FieldInput);
    readonly derived: any;
    readonly persistent: any;
    readonly defaultValue: any;
    readonly list: boolean;
    readonly map: boolean;
    readonly identity: boolean | string | string[];
    makeIdentity(): void;
    readonly required: boolean;
    readonly indexed: boolean | string | string[];
    readonly idKey: EntityReference;
    readonly order: string;
    relation: RelationBase;
    getRefType(pkg: ModelPackage): FieldType | void;
    clone(): Field;
    updateWith(obj: FieldInput): void;
    toObject(modelPackage?: ModelPackage): any;
    toJSON(modelPackage?: ModelPackage): FieldInput;
}
//# sourceMappingURL=field.d.ts.map