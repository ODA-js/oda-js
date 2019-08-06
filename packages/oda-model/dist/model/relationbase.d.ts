import { EntityReference } from './entityreference';
import { Field } from './index';
import { IRelation, IValidationResult, IValidator, MetaModelType, RelationBaseInput, RelationBaseJSON, RelationBaseStorage, RelationType } from './interfaces';
import { Metadata } from './metadata';
export declare class RelationBase extends Metadata implements IRelation {
    readonly modelType: MetaModelType;
    protected $obj: RelationBaseStorage;
    validate(validator: IValidator): IValidationResult[];
    constructor(obj: RelationBaseInput);
    readonly name: string;
    readonly field: string;
    readonly entity: string;
    readonly fields: Map<string, Field> | undefined;
    readonly ref: EntityReference;
    readonly verb: RelationType;
    readonly single: any;
    readonly stored: any;
    readonly embedded: any;
    opposite: string;
    protected initNames(): void;
    readonly fullName: any;
    readonly normalName: any;
    readonly shortName: any;
    toString(): string;
    toObject(): RelationBaseInput;
    toJSON(): RelationBaseJSON;
    updateWith(obj: RelationBaseInput): void;
}
//# sourceMappingURL=relationbase.d.ts.map