import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import { HasManyStorage, HasManyInput, IValidationResult, ValidationResultType } from './interfaces';
import clean from '../lib/json/clean';
import { ModelPackage } from './modelpackage';

export class HasMany extends RelationBase {

  protected $obj: HasManyStorage;

  get hasMany(): EntityReference {
    return this.$obj.hasMany;
  }

  get ref(): EntityReference {
    return this.$obj.hasMany;
  }

  public validate(pkg?: ModelPackage): IValidationResult[] {
    const result: IValidationResult[] = super.validate(pkg);
    if (pkg) {
      //ref Entity
      const refEntity = pkg.entities.get(this.ref.entity);
      if (refEntity) {
        let refField = refEntity.fields.get(this.ref.field);
        if (refField) {
          if (!refField.indexed) {
            result.push({
              message: 'referenced field for HasOne relation must be indexed',
              result: ValidationResultType.error,
            });
          }
        }
      }
      // entity
      const entity = pkg.entities.get(this.entity);
      if (entity) {
        const field = entity.fields.get(this.field);
        if (field) {
          if (this.ref.backField) {
            const bf = entity.fields.get(this.ref.backField);
            if (!bf.identity) {
              result.push({
                message: 'back field for HasOne relation must be identity',
                result: ValidationResultType.error,
              });
            }
          }
          if (this.opposite) {
            const opposite = refEntity.fields.get(this.opposite);
            if (opposite) {
              if (opposite.relation.verb !== 'BelongsTo') {
                result.push({
                  message: 'opposite for relation HasOne other than HasOne -> BelongstTo is not supported',
                  result: ValidationResultType.error,
                });
              }
            }
          }
        }
      }
    }
    return result;
  }

  constructor(obj: HasManyInput) {
    super(obj);
  }

  public updateWith(obj: HasManyInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      this.setMetadata('storage.single', false);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasMany');

      let $hasMany = obj.hasMany;

      let hasMany;
      if ($hasMany) {
        hasMany = new EntityReference($hasMany);
        if (!hasMany.backField) {
          hasMany.backField = 'id';
        }
      }

      result.hasMany_ = $hasMany;
      result.hasMany = hasMany;

      this.$obj = result;
      this.initNames();
    }
  }
  // it get fixed object
  public toObject(): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      hasMany: props.hasMany ? props.hasMany.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasMany: props.hasMany_,
    });
  }
}
