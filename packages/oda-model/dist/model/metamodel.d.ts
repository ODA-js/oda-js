import { Entity } from './entity';
import { EntityInput, FieldInput, IModel, IValidationResult, IValidator, MetaModelStore, MetaModelType, ModelHook, ModelPackageStore, MutationInput, QueryInput } from './interfaces';
import { ModelPackage } from './modelpackage';
import { Mutation } from './mutation';
import { Query } from './query';
export declare class MetaModel extends ModelPackage implements IModel {
    modelType: MetaModelType;
    packages: Map<string, ModelPackage>;
    store: string;
    defaultPackage: ModelPackage;
    validate(validator: IValidator): IValidationResult[];
    constructor(name?: string);
    loadModel(fileName?: string): void;
    protected dedupeFields(src: FieldInput[]): {};
    protected applyEntityHook(entity: Entity, hook: EntityInput): Entity;
    protected applyMutationHook(mutation: Mutation, hook: MutationInput): Mutation;
    protected applyQueryHook(mutation: Query, hook: QueryInput): Query;
    applyHooks(hooks?: ModelHook[]): void;
    addPackage(pckg: ModelPackageStore): void;
    loadPackage(store: MetaModelStore, hooks?: any[]): void;
    saveModel(fileName?: string): void;
    reset(): void;
    createPackage(name: string): ModelPackage;
    assignEntityToPackage(input: {
        entity: string;
        package: string;
    }): {
        package: ModelPackage;
        entity: Entity;
    };
    private ensureDefaultPackage;
}
//# sourceMappingURL=metamodel.d.ts.map