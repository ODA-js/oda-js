import {
  isEntity,
  IsBelongsToProps,
  IsBelongsToManyProps,
  IsHasOneProps,
  IsHasManyProps,
  isModel,
  isPackage,
  isMutation,
  isField,
  isEnum,
  isRelation,
  IsHasMany,
  IsHasOne,
  IsBelongsTo,
  IsBelongsToMany,
} from '../helpers';

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
