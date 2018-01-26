import { IBelongsToManyRelation, IBelongsToManyRelationProps } from './IBelongsToManyRelation';
import { IBelongsToRelation, IBelongsToRelationProps } from './IBelongsToRelation';
import { IEntity } from './IEntity';
import { IEntityContext } from './IEntityContext';
import { IField } from './IField';
import { IFieldContext } from './IFieldContext';
import { IHasManyRelation, IHasManyRelationProps } from './IHasManyRelation';
import { IHasOneRelation, IHasOneRelationProps } from './IHasOneRelation';
import { IModel } from './IModel';
import { IModelContext } from './IModelContext';
import { IPackage } from './IPackage';
import { IPackageContext } from './IPackageContext';
import { IRelationContext } from './IRelationContext';
import { IMutation } from './IMutation';

export type ModelItem = IModel | IPackage | IEntity | IField | RelationUnion | IMutation;

export type RelationUnion = IHasManyRelation | IHasOneRelation | IBelongsToRelation | IBelongsToManyRelation;

export type RelationPropsUnion = IHasManyRelationProps | IHasOneRelationProps | IBelongsToRelationProps | IBelongsToManyRelationProps;

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'field'
  | 'ref'
  | 'relation'
  ;

export type ValidationContext =
    IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation' | 'mutation';
