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
    packages: IPackage,
  } = {} as any;

  const contexts: {
    relation: IRelationContext,
    field: IFieldContext,
    model: IModelContext,
    entity: IEntityContext,
    packages: IPackageContext,
  } = {} as any;

  beforeAll(() => {
    models.relation = new HasMany({
      hasMany: 'i@m#id',
    });

    models.field = new Field({
      name: 'item',
    });

    models.entity = new Entity({
      name: 'ToDo',
      fields: [{
        name: 'item',
      }],
    });

    models.packages = new Package({
      name: 'system',
      acl: 10000,
    });

    models.model = new Model({
      name: 'TodoItems',
      packages: [{
        name: 'system',
        acl: 10000,
        items: [],
      }],
    });

    contexts.model = new ModelContext(models.model);
    contexts.packages = new PackageContext(contexts.model, models.packages);
    contexts.entity = new EntityContext(contexts.packages, models.entity);
    contexts.field = new FieldContext(contexts.entity, models.field);
  });

  it('Init Context', () => {
    expect(isIModelContext(contexts.model)).toBeTruthy();
    expect(isIPackageContext(contexts.packages)).toBeTruthy();
    expect(isIEntityContext(contexts.entity)).toBeTruthy();
    expect(isIFieldContext(contexts.field)).toBeTruthy();
  });
});
