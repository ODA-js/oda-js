import { IBelongsToMany, IBelongsToManyInit } from './IBelongsToMany';
import { IBelongsTo, IBelongsToInit } from './IBelongsTo';
import { IEntity } from './IEntity';
import { IEntityContext } from './IEntityContext';
import { IField } from './IField';
import { IFieldContext } from './IFieldContext';
import { IHasMany, IHasManyInit } from './IHasMany';
import { IHasOne, IHasOneInit } from './IHasOne';
import { IModel } from './IModel';
import { IModelContext } from './IModelContext';
import { IPackage } from './IPackage';
import { IPackageContext } from './IPackageContext';
import { IRelationContext } from './IRelationContext';
import { IMutation } from './IMutation';
import { Relation } from '../model/Relation';

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'enum'
  | 'field'
  | 'ref'
  | 'relation'
  ;

export type ValdatedTypes = MetaModelType | RelationType;

export type ValidationContext =
  IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation' | 'mutation' | 'enum';
