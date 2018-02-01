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
  const contexts: {
    relation: IRelation,
    field: IField,
    model: IModel,
    entity: IEntity,
    packages: IPackage,
  } = {} as any;

  beforeAll(() => {
    contexts.relation = new HasMany({
      hasMany: 'i@m#id',
    });
    contexts.field = new Field({
      name: 'item',
    });
    contexts.entity = new Entity({
      name: 'ToDo',
      fields: [contexts.field],
    });
    contexts.packages = new Package({
      name: 'system',
      acl: 10000,
      items: [],
    });
    contexts.model = new Model({
      name: 'TodoItems',
      packages: [contexts.packages],
    });
  });

  it('Init Context', () => {
    const model = new ModelContext(contexts.model);
    expect(isIModelContext(model)).toBeTruthy();
    const pkg = new PackageContext(model, contexts.packages);
    expect(isIPackageContext(pkg)).toBeTruthy();
    const entity = new EntityContext(pkg, contexts.entity);
    expect(isIEntityContext(entity)).toBeTruthy();
    const field = new FieldContext(entity, contexts.field);
    expect(isIFieldContext(field)).toBeTruthy();
  });
});
