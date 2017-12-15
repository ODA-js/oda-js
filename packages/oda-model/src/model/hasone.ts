import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import {
  HasOneStorage, HasOneInput,
  ValidationResultType, IValidationResult,
} from './interfaces';
import clean from '../lib/json/clean';
import { ModelPackage } from './modelpackage';

export class HasOne extends RelationBase {
  protected $obj: HasOneStorage;

  get hasOne(): EntityReference {
    return this.$obj.hasOne;
  }

  get ref(): EntityReference {
    return this.$obj.hasOne;
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

  constructor(obj: HasOneInput) {
    super(obj);
  }

  public updateWith(obj: HasOneInput) {
    if (obj) {
      super.updateWith(obj);
      const result = { ...this.$obj };

      this.setMetadata('storage.single', true);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasOne');

      let $hasOne = obj.hasOne;

      let hasOne;
      if ($hasOne) {
        hasOne = new EntityReference($hasOne);
        if (!hasOne.backField) {
          hasOne.backField = 'id';
        }
      }

      result.hasOne_ = $hasOne;
      result.hasOne = hasOne;

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
      hasOne: props.hasOne ? props.hasOne.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasOne: props.hasOne_,
    });
  }
}
