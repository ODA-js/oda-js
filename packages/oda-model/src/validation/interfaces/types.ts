import { IBelongsToManyRelation } from './IBelongsToManyRelation';
import { IBelongsToRelation } from './IBelongsToRelation';
import { IEntity } from './IEntity';
import { IEntityContext } from './IEntityContext';
import { IField } from './IField';
import { IFieldContext } from './IFieldContext';
import { IHasManyRelation } from './IHasManyRelation';
import { IHasOneRelation } from './IHasOneRelation';
import { IModel } from './IModel';
import { IModelContext } from './IModelContext';
import { IPackage } from './IPackage';
import { IPackageContext } from './IPackageContext';
import { IRelationContext } from './IRelationContext';
import { IMutation } from './IMutation';

export type ModelItem = IModel | IPackage | IEntity | IField | Relation | IMutation;

export type Relation = IHasManyRelation | IHasOneRelation | IBelongsToRelation | IBelongsToManyRelation;

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'field'
  | 'ref'
  | 'relation'
  | RelationType
  ;

export type ValidationContext =
    IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation' | 'mutation';
