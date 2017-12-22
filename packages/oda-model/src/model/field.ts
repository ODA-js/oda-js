import clean from '../lib/json/clean';
import { BelongsTo } from './belongsto';
import { BelongsToMany } from './belongstomany';
import { EntityReference } from './entityreference';
import { FieldBase } from './fieldbase';
import { HasMany } from './hasmany';
import { HasOne } from './hasone';
import { FieldInput, FieldStorage, IField } from './interfaces';
import { ModelPackage } from './modelpackage';
import { RelationBase } from './relationbase';

function discoverFieldType(obj) {
  // сделать проверку по полю...
  if (obj.hasOne) {
    return 'HasOne';
  } else if (obj.hasMany) {
    return 'HasMany';
  } else if (obj.belongsTo) {
    return 'BelongsTo';
  } else if (obj.belongsToMany) {
    return 'BelongsToMany';
  } else {
    console.warn(`undefined relation type of ${JSON.stringify(obj)}`);
    return 'undefined';
  }
}

export class Field extends FieldBase implements IField {
  protected $obj: FieldStorage;
  constructor(obj: FieldInput) {
    super(obj);
  }
  get type(): string {
    return this.$obj.type;
  }

  get identity(): boolean | string | string[] {
    return this.getMetadata('storage.identity');
  }

  // this is to make sure that if we internally set
  public makeIdentity() {
    this.$obj.idKey = new EntityReference(this.$obj.entity, this.$obj.name, 'id');
    this.setMetadata('storage.identity', true);
    this.setMetadata('storage.indexed', true);
    this.setMetadata('storage.required', true);
  }

  get required(): boolean {
    return this.getMetadata('storage.required');
  }

  get indexed(): boolean | string | string[] {
    return this.getMetadata('storage.indexed');
  }

  get idKey(): EntityReference {
    return this.$obj.idKey;
  }

  get order(): string {
    return this.getMetadata('order');
  }

  get relation(): RelationBase {
    return this.$obj.relation;
  }

  set relation(value: RelationBase) {
    this.$obj.relation = value;
  }

  public getRefType(pkg: ModelPackage): string | void {
    if (this.relation) {
      let ref = this.relation.ref;
      let link = ref.toString();
      if (pkg.identityFields.has(link)) {
        let entity = pkg.identityFields.get(link);
        if (entity.fields.has(ref.field)) {
          return entity.fields.get(ref.field).type;
        }
      }
    }
  }

  public clone() {
    return new (<typeof Field>this.constructor)(this.toObject());
  }

  public updateWith(obj: FieldInput) {
    if (obj) {
      super.updateWith(obj);
      const result = { ...this.$obj };

      let $type = obj.type;
      let type = $type || 'String';

      this.setMetadata('storage.identity', obj.identity);

      this.setMetadata('storage.required', obj.required || obj.identity);

      this.setMetadata('storage.indexed', obj.indexed || obj.identity);

      result.type_ = $type;
      result.type = type;

      if (this.getMetadata('storage.identity', false)) {
        // это то как выглядит ключ для внешних ссылок
        result.idKey = new EntityReference(result.entity, result.name, 'id');
      }

      // identity can't have relation definition
      // why? because! we need to support existing code.
      const isIdentity = this.getMetadata('storage.identity', false);
      if (obj.relation && !(isIdentity)) {
        let $relation = obj.relation;
        let relation: RelationBase;

        switch (discoverFieldType($relation)) {
          case 'HasOne':
            relation = new HasOne({ ...$relation as { hasOne: string }, entity: obj.entity, field: obj.name });
            break;
          case 'HasMany':
            relation = new HasMany({ ...$relation as { hasMany: string }, entity: obj.entity, field: obj.name });
            break;
          case 'BelongsToMany':
            relation = new BelongsToMany({ ...$relation as { belongsToMany: string; using: string }, entity: obj.entity, field: obj.name });
            break;
          case 'BelongsTo':
            relation = new BelongsTo({ ...$relation as { belongsTo: string }, entity: obj.entity, field: obj.name });
            break;
          default:
            throw new Error('undefined type');
        }

        result.relation = relation;
        delete result.type_;
        delete result.type;
      }

      this.$obj = result;
    }
  }

  // it get fixed object
  public toObject(modelPackage?: ModelPackage): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      entity: props.entity,
      type: props.type || props.type_,
      idKey: props.idKey ? props.idKey.toString() : undefined,
      relation: props.relation ? props.relation.toObject() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(modelPackage?: ModelPackage): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      type: props.type_,
      relation: props.relation ? props.relation.toJSON() : undefined,
    });
  }
}
