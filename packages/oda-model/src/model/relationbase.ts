import * as inflected from 'inflected';
import {
  RelationBaseStorage, RelationBaseInput, RelationFields,
  RelationBaseJSON, IValidationResult, ValidationResultType,
} from './interfaces';
import { EntityReference } from './entityreference';
import { Metadata } from './metadata';
import fold from './../lib/json/fold';
import clean from '../lib/json/clean';
import { Field } from './index';
import { ModelPackage } from './modelpackage';
import { BelongsToMany } from './belongstomany';

export class RelationBase extends Metadata {
  /**
   * represents internal object storage
   */
  protected $obj: RelationBaseStorage;
  public validate(pkg?: ModelPackage): IValidationResult[] {
    const result: IValidationResult[] = super.validate(pkg);
    if (pkg) {
      //ref Entity
      const refEntity = pkg.entities.get(this.ref.entity);
      if (!refEntity) {
        result.push({
          message: 'no referenced entity found',
          result: ValidationResultType.error,
        });
      } else {
        let refField = refEntity.fields.get(this.ref.field);
        if (!refField) {
          result.push({
            message: 'referenced field not found',
            result: ValidationResultType.error,
          });
        }
      }
      // entity
      const entity = pkg.entities.get(this.entity);
      if (!entity) {
        result.push({
          message: 'owner entity not found',
          result: ValidationResultType.error,
        });
      } else {
        const field = entity.fields.get(this.field);
        if (!field) {
          result.push({
            message: 'owner field not found if the entity',
            result: ValidationResultType.error,
          });
        } else {
          if (this.ref.backField) {
            const bf = entity.fields.get(this.ref.backField);
            if (!bf) {
              result.push({
                message: 'back field not exists',
                result: ValidationResultType.error,
              });
            } else if (!bf.indexed) {
              result.push({
                message: 'back field is not indexed',
                result: ValidationResultType.error,
              });
            }
          }
          if (this.opposite) {
            const opposite = refEntity.fields.get(this.opposite);
            if (!opposite) {
              result.push({
                message: 'opposite field not found',
                result: ValidationResultType.error,
              });
            }
          } else {
            let opposites = Array.from(refEntity.fields.values())
              .filter(f => f.relation && (
                (f.relation.ref.entity === entity.name && f.relation.ref.field === field.name) ||
                ((f.relation as BelongsToMany).using && (this as any).using
                  && (f.relation as BelongsToMany).using.entity === (this as any).using.entity)),
              );
            if (opposites.length > 2) {
              result.push({
                message: 'more than one possible opposite',
                result: ValidationResultType.error,
              });
            }
            if (opposites.length === 0) {
              result.push({
                message: 'no possible opposite',
                result: ValidationResultType.critics,
              });
            }
          }
        }
      }
    }
    return result;
  }
  /**
   * construct object
   */
  constructor(obj: RelationBaseInput) {
    super(obj);
    if (obj) {
      this.updateWith(fold(obj) as RelationBaseInput);
    }
  }

  get name(): string {
    return this.$obj.name;
  }

  get field(): string {
    return this.$obj.field;
  }

  get entity(): string {
    return this.$obj.entity;
  }

  get fields(): Map<string, Field> | undefined {
    return this.$obj.fields;
  }

  get ref(): EntityReference {
    return new EntityReference({ entity: '', field: '', backField: '' });
  }

  get verb(): string {
    return this.getMetadata('verb');
  }

  // one item per relation
  get single() {
    return this.getMetadata('storage.single');
  }

  // key is storage is located in owner side of entity
  get stored() {
    return this.getMetadata('storage.stored');
  }

  // stored as members of class
  get emdebbed() {
    return this.getMetadata('storage.embedded');
  }

  // opposite entity field with relation def
  get opposite() {
    return this.$obj.opposite;
  }

  set opposite(val) {
    this.$obj.opposite = val;
  }

  protected initNames() {
    let ref = this.single ? inflected.singularize(this.$obj.field) : inflected.pluralize(this.$obj.field);
    this.getMetadata('name.full', this.name || `${this.$obj.entity}${this.verb}${inflected.camelize(ref, true)}`);

    let ref1 = this.single ? inflected.singularize(this.$obj.field) : inflected.pluralize(this.$obj.field);
    this.setMetadata('name.normal', `${this.$obj.entity}${inflected.camelize(ref1, true)}`);

    let ref2 = this.single ? inflected.singularize(this.$obj.field) : inflected.pluralize(this.$obj.field);
    this.getMetadata('name.short', `${inflected.camelize(ref2, true)}`);
  }

  get fullName() {
    let result = this.getMetadata('name.full');
    if (!result) {
      this.initNames();
      result = this.getMetadata('name.full');
    }
    return result;
  }

  get normalName() {
    let result = this.getMetadata('name.normal');
    if (!result) {
      this.initNames();
      result = this.getMetadata('name.normal');
    }
    return result;
  }

  get shortName() {
    let result = this.getMetadata('name.short');
    if (!result) {
      this.initNames();
      result = this.getMetadata('name.short');
    }
    return result;
  }

  public toString() {
    return JSON.stringify(this.toObject());
  }

  public toObject(): RelationBaseInput {
    let props = this.$obj;
    return clean({
      ...super.toObject(),
      name: props.name || props.name_,
      entity: props.entity,
      field: props.field,
      fields: props.fields && Array.from(props.fields.values()),
      opposite: props.opposite,
    });
  }

  public toJSON(): RelationBaseJSON {
    let props = this.$obj;
    return clean({
      ...super.toJSON(),
      name: props.name_,
      fields: props.fields && Array.from(props.fields.values()),
      opposite: props.opposite,
    });
  }

  public updateWith(obj: RelationBaseInput): void {
    if (obj) {

      const result: RelationBaseStorage = { ...this.$obj };

      let $name = obj.name;
      let opposite = obj.opposite;

      let name = $name ? inflected.camelize($name.trim()) : $name;

      result.name_ = $name;
      result.name = name;

      result.opposite = opposite;
      if (obj.fields) {
        result.fields = new Map<string, Field>();
        if (Array.isArray(obj.fields)) {
          obj.fields.forEach(
            f => {
              result.fields.set(f.name, new Field(f));
            },
          );
        } else {
          Object.keys(obj.fields).forEach(f => {
            result.fields.set(f, new Field({
              name: f,
              ...obj.fields[f],
            }));
          });
        }
      }

      let $entity = obj.entity;
      let entity = $entity;

      let $field = obj.field;
      let field = $field;

      result.entity = entity;
      result.entity_ = $entity;

      result.field = field;
      result.field_ = $field;

      this.$obj = result;
    }
  }

  // public clone(): RelationBase {
  //   return new (<typeof RelationBase>this.constructor)(this.toJSON());
  // }
}
