import { EntityReference } from './entityreference';
import { Field } from './field';
import { RelationBase } from './relationbase';

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  'model'
  |'package'
  | 'entity'
  | 'field'
  | 'relation'
  | 'ref'
  | RelationType
  ;

export interface IModelType extends IValidate {
  modelType: MetaModelType;
}

export interface IModel extends IModelType {
  name: string;
  packages: Map<string, IPackage>;
}

export interface IPackage extends IModelType {
  name: string;
  metaModel: IModel;
  entities: Map<string, IEntity>;
}

export interface IEntity extends IModelType {
  name: string;
  plural: string;
  fields: Map<string, Field>;
}

export interface IField extends IModelType {
  name: string;
  type: string;
  relation: IRelation;
}

export interface IRelation extends IModelType {
  verb: RelationType;
  ref: IEntityRef;
}

export interface IBelongsToManyRelation extends IRelation {

  belongsToMany: IEntityRef;
}

export interface IBelongsToRelation extends IRelation {
  belongsTo: IEntityRef;
}

export interface IHasOneRelation extends IRelation {
  hasOne: IEntityRef;
}

export interface IHasManyRelation extends IRelation {
  hasMany: IEntityRef;
}

export interface IEntityRef {
  backField: string;
  entity: string;
  field: string;
}

export type ModelItem = IModel | IPackage | IEntity | IField | IRelation;

export type Relation = IHasManyRelation | IHasOneRelation | IBelongsToRelation | IBelongsToRelation;

export function isModel(item: ModelItem ): item is IModel {
  return item.modelType === 'model';
}

export function isPackage(item: ModelItem ): item is IPackage {
  return item.modelType === 'package';
}

export function isEntity(item: ModelItem): item is IEntity {
  return item.modelType === 'entity';
}

export function isField(item: ModelItem): item is IField {
  return item.modelType === 'field';
}

export function isRelation(item: ModelItem): item is IRelation {
  return (
    item.modelType === 'BelongsTo'
    || item.modelType === 'BelongsToMany'
    || item.modelType === 'HasOne'
    || item.modelType === 'HasMany'
  );
}

export function IsBelongsTo(item: Relation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'BelongsTo';
}

export function IsBelongsToMany(item: Relation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'BelongsToMany';
}

export function IsHasOne(item: Relation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'HasOne';
}

export function IsHasMany(item: Relation): item is IBelongsToRelation {
  return isRelation(item) && item.modelType === 'HasMany';
}

export enum ValidationResultType { error = 'error', warning = 'warning', critics = 'critics', fixable = 'fixable' }

export interface IValidationResult {
  model?: string;
  package?: string;
  entity?: string;
  field?: string;
  result: ValidationResultType;
  message?: string;
}

export interface IValidator {
  check(item: IValidate): IValidationResult[];
}

export interface IValidate {
  validate(validator: IValidator): IValidationResult[];
}

export interface FieldInput extends FieldBaseInput {
  type?: string;
  identity?: boolean | string | string[];
  indexed?: boolean | string | string[];
  required?: boolean;
  arguments?: [FieldArgs];
  relation?: ({ hasMany: string }
    | { hasOne: string }
    | { belongsTo: string }
    | { belongsToMany: string, using: string }) & {
    entity: string;
    field: string;
  };
}

export interface FieldStorage extends FieldBaseStorage {
  type: string;
  arguments?: [FieldArgs];
  type_: string;
  idKey: EntityReference;
  relation: RelationBase;
}

export interface BelongsToInput extends RelationBaseInput {
  belongsTo?: string;
}

export interface BelongsToStorage extends RelationBaseStorage {
  belongsTo: EntityReference;
  belongsTo_: string;
}

export interface BelongsToManyInput extends RelationBaseInput {
  belongsToMany: string;
  using: string;
}

export interface BelongsToManyStorage extends RelationBaseStorage {
  belongsToMany: EntityReference;
  belongsToMany_?: string;
  using: EntityReference;
  using_?: string;
}

export interface EntityInput extends ModelBaseInput {
  plural?: string;
  fields?: FieldInput[] | {
    [fName: string]: FieldInput;
  };
}

export interface EntityJSON extends ModelBaseInput {
  fields?: FieldInput[];
}

export interface EntityStorage extends ModelBaseStorage {
  fields: Map<string, Field>;
  relations: Set<string>;
  identity: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
}

export interface EntityReferenceInput {
  backField: string;
  field: string;
  entity: string;
}

export interface FieldArgs {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string;
}

export interface FieldBaseInput extends ModelBaseInput {
  args?: [FieldArgs];
  derived?: boolean;
  persistent?: boolean;
  entity?: string;
}

export interface FieldBaseStorage extends ModelBaseStorage {
  args?: [FieldArgs];
  args_?: [FieldArgs];
  entity: string;
  entity_: string;
}

export interface HasManyInput extends RelationBaseInput {
  hasMany: string;
}

export interface HasManyStorage extends RelationBaseStorage {
  hasMany: EntityReference;
  hasMany_: string;
}

export interface HasOneInput extends RelationBaseInput {
  hasOne: string;
}

export interface HasOneStorage extends RelationBaseStorage {
  hasOne: EntityReference;
  hasOne_: string;
}

export interface MetadataInput {
  metadata?: { [key: string]: any };
}

export interface ModelBaseInput extends MetadataInput {
  name: string;
  title?: string;
  description?: string;
}

export interface ModelBaseStorage {
  name: string;
  title: string;
  description: string;
  name_: string;
  title_: string;
  description_: string;
}

export interface ModelPackageInput extends ModelBaseInput {
  name: string;
  title?: string;
  description?: string;
  abstract?: boolean;
  entities: string[];
  mutations: any[];
}

export interface ModelPackageStore {
  name: string;
  title?: string;
  description?: string;
  entities: string[];
  mutations: any[];
}

export interface MetaModelStore {
  entities: EntityInput[];
  packages: ModelPackageStore[];
  mutations: MutationInput[];
  name: string;
  title?: string;
  description?: string;
}


export interface RelationBaseInput {
  /**
   * нужно в случае когда мы будем показывать атрибут связи, и ассоциацию отедельно???
   * больше не зачем
   */
  metadata?: { [key: string]: any };
  name?: string;
  entity: string;
  field: string;
  fields?: FieldInput[] | {
    [field: string]: FieldInput,
  };
  opposite?: string;
}

export interface RelationBaseJSON {
  /**
   * нужно в случае когда мы будем показывать атрибут связи, и ассоциацию отедельно???
   * больше не зачем
   */
  metadata?: { [key: string]: any };
  name?: string;
  fields?: FieldInput[];
  opposite?: string;
}

export interface RelationFields {
  description: string;
  name: string;
  type: string;
  required: boolean;
  indexed: boolean | string | string[];
  identity?: boolean | string | string[];
  derived: boolean;
  persistent: boolean;
  args: FieldArgs[];
}

export interface RelationBaseStorage {
  name?: string;
  name_?: string;
  entity: string;
  entity_: string;
  field: string;
  field_: string;
  fields: Map<string, Field>;
  opposite: string;
}

export interface MutationInput extends ModelBaseInput {
  args: FieldArgs[];
  payload: FieldArgs[];
}

export interface MutationStorage extends ModelBaseStorage {
  args: FieldArgs[];
  args_: FieldArgs[];
  payload: FieldArgs[];
  payload_: FieldArgs[];
}

export interface ModelHook {
  name: string;
  entities?: {
    [eName: string]: EntityInput,
  };
  mutations?: {
    [mName: string]: MutationInput;
  };
}
