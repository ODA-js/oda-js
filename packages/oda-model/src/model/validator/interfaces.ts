import { BelongsTo } from '../belongsto';
import { BelongsToMany } from '../belongstomany';
import { HasMany } from '../hasmany';
import { HasOne } from '../hasone';
import { IEntity, IField, IModel, IPackage, IRelation } from '../interfaces';

export interface IModelContext {
  model: IModel;
}

export interface IPackageContext {
  model: IModel;
  package: IPackage;
}

export interface IEntityContext {
  model: IModel;
  package: IPackage;
  entity: IEntity;
}

export interface IFieldContext {
  model: IModel;
  package: IPackage;
  entity: IEntity;
  field: IField;
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
}

export type ValidationContext =
  IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;
