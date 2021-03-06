import { BelongsTo } from '../belongsto';
import { BelongsToMany } from '../belongstomany';
import { HasMany } from '../hasmany';
import { HasOne } from '../hasone';
import { IEntity, IField, IModel, IPackage, IRelation } from '../interfaces';
import { RestartType } from './contexts';

export interface IModelContext {
  model: IModel;
  restart(level: RestartType);
}

export interface IPackageContext {
  model: IModel;
  package: IPackage;
  restart(level: RestartType);
}

export interface IEntityContext {
  model: IModel;
  package: IPackage;
  entity: IEntity;
  restart(level: RestartType);
}

export interface IFieldContext {
  model: IModel;
  package: IPackage;
  entity: IEntity;
  field: IField;
  restart(level: RestartType);
}

export type Relation =
  HasMany
  | HasOne
  | BelongsToMany
  | BelongsTo;

export interface IRelationContext {
  model: IModel;
  package: IPackage;
  entity: IEntity;
  field: IField;
  relation: IRelation;
  restart(level: RestartType);
}

export type ValidationContext =
  IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;
