import { EntityContext } from './contexts/EntityContext';
import { FieldContext } from './contexts/FieldContext';
import { ModelContext } from './contexts/ModelContext';
import { PackageContext } from './contexts/PackageContext';
import {
  IsBelongsTo,
  IsBelongsToMany,
  IsBelongsToManyProps,
  IsBelongsToProps,
  isEntity,
  isEnum,
  isField,
  IsHasMany,
  IsHasManyProps,
  IsHasOne,
  IsHasOneProps,
  isIEntityContext,
  isIFieldContext,
  isIModelContext,
  isIPackageContext,
  isModel,
  isMutation,
  isPackage,
  isRelation,
  isIRelationContext,
} from './helpers';
import { IEntity } from './interfaces/IEntity';
import { IField } from './interfaces/IField';
import { IModel } from './interfaces/IModel';
import { IPackage } from './interfaces/IPackage';
import { IRelation } from './interfaces/IRelation';
import { Entity } from './model/Entity';
import { Field } from './model/Field';
import { HasMany } from './model/HasMany';
import { Model } from './model/Model';
import { Package } from './model/Package';
import { IRelationContext } from './contexts/IRelationContext';
import { IFieldContext } from './contexts/IFieldContext';
import { IModelContext } from './contexts/IModelContext';
import { IEntityContext } from './contexts/IEntityContext';
import { IPackageContext } from './contexts/IPackageContext';
import { IValidationContext } from './contexts/IValidationContext';
import { RelationContext } from './contexts/RelationContext';
import { IPackagedItem, IPackagedItemInit } from './interfaces/IPackagedItem';

describe('RelationProps helpers', () => {
  it('belongsToProps is detected', () => {
    expect(IsBelongsToProps({ belongsTo: 'name' } as any)).toBeTruthy();
  });
  it('belongsToManyProps is detected', () => {
    expect(IsBelongsToManyProps({ belongsToMany: 'name' } as any)).toBeTruthy();
  });
  it('hasOneProps is detectes', () => {
    expect(IsHasOneProps({ hasOne: 'name' } as any)).toBeTruthy();
  });
  it('hasManyProps is detectes', () => {
    expect(IsHasManyProps({ hasMany: 'name' } as any)).toBeTruthy();
  });
});

describe('ModelType helpers', () => {
  it('detects Model', () => {
    expect(isModel({ modelType: 'model' } as any)).toBeTruthy();
  });
  it('detects Package', () => {
    expect(isPackage({ modelType: 'package' } as any)).toBeTruthy();
  });
  it('detects Entity', () => {
    expect(isEntity({ modelType: 'entity' } as any)).toBeTruthy();
  });
  it('detects Mutation', () => {
    expect(isMutation({ modelType: 'mutation' } as any)).toBeTruthy();
  });
  it('detects Field', () => {
    expect(isField({ modelType: 'field' } as any)).toBeTruthy();
  });
  it('detects Enum', () => {
    expect(isEnum({ modelType: 'enum' } as any)).toBeTruthy();
  });
});

describe('Relation helpers', () => {
  it('detects Relation', () => {
    expect(isRelation({ modelType: 'relation' } as any)).toBeTruthy();
  });
  it('detects HasMany', () => {
    expect(IsHasMany({ modelType: 'relation', verb: 'HasMany' } as any)).toBeTruthy();
  });
  it('detects HasOne', () => {
    expect(IsHasOne({ modelType: 'relation', verb: 'HasOne' } as any)).toBeTruthy();
  });
  it('detects BelongstTo', () => {
    expect(IsBelongsTo({ modelType: 'relation', verb: 'BelongsTo' } as any)).toBeTruthy();
  });
  it('detects BelongsToMany', () => {
    expect(IsBelongsToMany({ modelType: 'relation', verb: 'BelongsToMany' } as any)).toBeTruthy();
  });
});

describe('Context helpers', () => {
  const models: {
    relation: IRelation,
    field: IField,
    model: IModel,
    entity: IEntity,
    package: IPackage,
  } = {} as any;

  const contexts: {
    relation: IRelationContext & IValidationContext,
    field: IFieldContext & IValidationContext,
    model: IModelContext & IValidationContext,
    entity: IEntityContext & IValidationContext,
    package: IPackageContext & IValidationContext,
  } = {} as any;

  beforeAll(() => {
    expect(() =>
    models.model = new Model({
      name: 'TodoItems',
      packages: [{
        name: 'system',
        acl: 10000,
        items: [{
          name: 'ToDo',
          fields: [{
            name: 'item',
            relation: {
              hasMany: 'i@m#id',
            },
          }],
        } as IPackagedItemInit],
      }],
    })).not.toThrow();

    models.package = models.model.packages.get('system');
    models.entity = models.package.items.get('ToDo') as IEntity;
    models.field = models.entity.fields.get('item');
    models.relation = models.field.relation;

    contexts.model = new ModelContext(models.model);
    contexts.package = new PackageContext(contexts.model, models.package);
    contexts.entity = new EntityContext(contexts.package, models.entity);
    contexts.field = new FieldContext(contexts.entity, models.field);
    contexts.relation = new RelationContext(contexts.field, models.relation);
  });

  it('Init Context', () => {
    expect(isIModelContext(contexts.model)).toBeTruthy();
    expect(isIPackageContext(contexts.package)).toBeTruthy();
    expect(isIEntityContext(contexts.entity)).toBeTruthy();
    expect(isIFieldContext(contexts.field)).toBeTruthy();
    expect(isIRelationContext(contexts.relation)).toBeTruthy();
  });
});
