import { Field } from './field';
import { EntityInput, MetaModelType, EntityBaseStorage, EntityBaseInput, IEntityBase, EntityBaseJSON } from './interfaces';
import { ModelBase } from './modelbase';
import { ModelPackage } from './modelpackage';
import { Operation } from './operation';
export declare class EntityBase extends ModelBase implements IEntityBase {
    modelType: MetaModelType;
    protected $obj: EntityBaseStorage;
    constructor(obj: EntityBaseInput);
    ensureIds(modelPackage: ModelPackage): void;
    ensureFKs(modelPackage: ModelPackage): void;
    removeIds(modelPackage: ModelPackage): void;
    readonly plural: string;
    readonly titlePlural: string;
    readonly relations: Set<string>;
    readonly required: Set<string>;
    readonly identity: Set<string>;
    readonly fields: Map<string, Field>;
    readonly operations: Map<string, Operation>;
    readonly indexed: Set<string>;
    protected updateIndex(f: Field): void;
    protected updateUniqueIndex(f: Field): void;
    protected mergeIndex(indexes: any, index: string, entry: any): void;
    updateWith(obj: EntityInput): void;
    ensureIndexes(): void;
    toObject(modelPackage?: ModelPackage): any;
    toJSON(modelPackage?: ModelPackage): EntityBaseJSON;
}
//# sourceMappingURL=entitybase.d.ts.map