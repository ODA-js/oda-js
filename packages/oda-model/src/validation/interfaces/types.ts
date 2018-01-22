import { IBelongsToManyRelation, IBelongsToManyRelationProps } from './IBelongsToManyRelation';
import { IHasOneRelation, IHasOneRelationProps } from './IHasOneRelation';
import { IHasManyRelation, IHasManyRelationProps } from './IHasManyRelation';
import { IModel } from './IModel';
import { IPackage } from './IPackage';
import { IEntity } from './IEntity';
import { IField } from './IField';
import { IRelation } from './IRelation';
import { IBelongsToRelation, IBelongsToRelationProps } from './IBelongsToRelation';
import { IModelContext } from './IModelContext';
import { IPackageContext } from './IPackageContext';
import { IEntityContext } from './IEntityContext';
import { IFieldContext } from './IFieldContext';
import { IRelationContext } from './IRelationContext';

export type ModelItem = IModel | IPackage | IEntity | IField | Relation;

export type Relation = IHasManyRelation | IHasOneRelation | IBelongsToRelation | IBelongsToManyRelation;

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'field'
  | 'ref'
  | RelationType
  ;

export type ValidationContext =
    IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation';
